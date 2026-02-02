#include <WiFi.h>
#include <ESPmDNS.h>
#include <DNSServer.h>
#include <FS.h>
#include <SPIFFS.h>
#include <WiFiUdp.h>
#include <Update.h>
#include <WebServer.h>

#include "LampIndication/Indication.h"
#include "Helpers/EEPROMHelper.h"

WiFiUDP Udp;
WiFiUDP ntpUDP;
File fsUploadFile;
WebServer server(80);
DNSServer dnsServer;
IPAddress apIP(192, 168, 4, 1);

void HTTP_init();
bool handleFileRead(String path);

void setupWebServer() {
    server.enableDelay(false);

    // Initialize SPIFFS with format on fail option
    if (!SPIFFS.begin(true)) {
        // Try to format and mount again
        !SPIFFS.begin(false);
    }

    if (MDNS.begin("justtime")) {
        // Serial.println(F("MDNS responder started"));
        MDNS.addService("_http", "_tcp", 80);
        MDNS.addService("_ws", "_tcp", 81);
    }

    dnsServer.setTTL(300);
    dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
    dnsServer.start(53, "*", apIP);

    HTTP_init();
}

void handleClient() {
    server.handleClient();

    if (WiFi.status() != WL_CONNECTED) {
        if (!dnsServer.isUp()) {
            dnsServer.start(53, "*", apIP);
        }
        dnsServer.processNextRequest();
    } else {
        if (dnsServer.isUp()) {
            dnsServer.stop();
        }
    }
}

class CaptiveRequestHandler : public RequestHandler {
public:
  CaptiveRequestHandler() {}
  virtual ~CaptiveRequestHandler() {}

  bool canHandle(HTTPMethod method, String uri) {
    // Extract base URI without parameters
    String baseUri = uri;
    int queryIndex = uri.indexOf('?');
    if (queryIndex != -1) {
        baseUri = uri.substring(0, queryIndex);
    }

    // Don't handle actual resources
    if (baseUri.startsWith("/assets/") ||
        baseUri.startsWith("/js/") ||
        baseUri.startsWith("/css/") ||
        baseUri.endsWith(".js") ||
        baseUri.endsWith(".css") ||
        baseUri.endsWith(".svg") ||
        baseUri.endsWith(".ico") ||
        baseUri.endsWith(".png") ||
        baseUri.endsWith(".jpg")) {
        return false;
    }

    // Don't handle API endpoints
    if (baseUri == "/update" ||
        baseUri == "/list" ||
        baseUri == "/all") {
        return false;
    }

    // Handle everything else (captive portal detection URLs and unknown paths)
    return WiFi.status() != WL_CONNECTED;
  }

  bool handle(WebServer& server, HTTPMethod requestMethod, String requestUri) {
    // Redirect to justtime.local with parameters
    server.sendHeader("Location", "http://justtime.local/?page=wifi", true);
    server.send(302, "text/plain", "");
    return true;
  }
};

String getContentType(String filename) {
    if (server.hasArg("download"))
        return "application/octet-stream";
    else if (filename.endsWith(".htm"))
        return "text/html";
    else if (filename.endsWith(".html"))
        return "text/html";
    else if (filename.endsWith(".css"))
        return "text/css";
    else if (filename.endsWith(".svg"))
        return "image/svg+xml";
    else if (filename.endsWith(".woff"))
        return "application/font-woff";
    else if (filename.endsWith(".woff2"))
        return "application/font-woff2";
    else if (filename.endsWith(".ttf"))
        return "application/x-font-truetype";
    else if (filename.endsWith(".eot"))
        return "application/vnd.ms-fontobject";
    else if (filename.endsWith(".otf"))
        return "application/x-font-opentype";
    else if (filename.endsWith(".js"))
        return "application/javascript";
    else if (filename.endsWith(".png"))
        return "image/png";
    else if (filename.endsWith(".gif"))
        return "image/gif";
    else if (filename.endsWith(".jpg"))
        return "image/jpeg";
    else if (filename.endsWith(".ico"))
        return "image/x-icon";
    else if (filename.endsWith(".xml"))
        return "text/xml";
    else if (filename.endsWith(".pdf"))
        return "application/x-pdf";
    else if (filename.endsWith(".zip"))
        return "application/x-zip";
    else if (filename.endsWith(".json"))
        return "text/html";
    else if (filename.endsWith(".gz"))
        return "application/x-gzip";
    return "text/plain";
}

bool handleFileRead(String path) {
    turnOffIndication();
    if (path.endsWith("/"))
        path += "index.html";
    String contentType = getContentType(path);
    String pathWithGz = path + ".gz";
    if (SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)) {
        if (SPIFFS.exists(pathWithGz))
            path += ".gz";
        File file = SPIFFS.open(path, "r");
        server.streamFile(file, contentType);
        file.close();
        return true;
    }
    return false;
}

void handleFileList() {
    // Get path prefix filter (default to root)
    String pathFilter = "";
    if (server.hasArg("dir")) {
        pathFilter = server.arg("dir");
        // Remove leading slash for filtering
        if (pathFilter.startsWith("/")) {
            pathFilter = pathFilter.substring(1);
        }
        if (pathFilter.length() > 0 && !pathFilter.endsWith("/")) {
            pathFilter += "/";
        }
    }

    String output = "[";

    // Iterate through all files in SPIFFS
    File root = SPIFFS.open("/", "r");
    if (!root || !root.isDirectory()) {
        server.send(500, "text/plain", "Failed to open filesystem");
        return;
    }

    File file = root.openNextFile();
    while (file) {
        String filename = String(file.name());

        // Remove leading slash from filename for comparison
        if (filename.startsWith("/")) {
            filename = filename.substring(1);
        }

        // Filter files by path prefix
        if (pathFilter.length() == 0 || filename.startsWith(pathFilter)) {
            if (output != "[") {
                output += ',';
            }

            output += "{\"type\":\"file\",\"name\":\"";
            output += filename;
            output += "\",\"size\":";
            output += String(file.size());
            output += "}";
        }

        file.close();
        file = root.openNextFile();
    }
    root.close();

    output += "]";
    server.send(200, "application/json", output);
}

void handleNotFound() {
    String message = "File Not Found\n\n";
    message += "URI: ";
    message += server.uri();
    message += "\nMethod: ";
    message += (server.method() == HTTP_GET) ? "GET" : "POST";
    message += "\nArguments: ";
    message += server.args();
    message += "\n";
    for (uint8_t i = 0; i < server.args(); i++) {
        message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
    }
    server.send(404, "text/plain", message);
}

void HTTP_init() {
    // Register static assets FIRST before any handlers
    server.serveStatic("/assets", SPIFFS, "/assets", "max-age=86400");
    server.serveStatic("/clock.svg", SPIFFS, "/clock.svg", "max-age=86400");

    // Captive portal detection endpoints
    // Android captive portal detection
    server.on("/generate_204", HTTP_GET, []() {
        Serial.println("Android captive portal check");
        server.sendHeader("Location", "http://justtime.local/?page=wifi", true);
        server.send(302, "text/html", "");
    });

    // iOS/macOS captive portal detection
    server.on("/hotspot-detect.html", HTTP_GET, []() {
        Serial.println("iOS/macOS captive portal check");
        server.sendHeader("Location", "http://justtime.local/?page=wifi", true);
        server.send(302, "text/html", "");
    });

    // Apple connectivity check
    server.on("/library/test/success.html", HTTP_GET, []() {
        Serial.println("Apple connectivity check");
        server.sendHeader("Location", "http://justtime.local/?page=wifi", true);
        server.send(302, "text/html", "");
    });

    // Microsoft captive portal detection
    server.on("/connecttest.txt", HTTP_GET, []() {
        Serial.println("Microsoft captive portal check");
        server.sendHeader("Connection", "close");
        server.send(200, "text/plain", "Microsoft Connect Test");
    });

    // Firefox captive portal detection
    server.on("/success.txt", HTTP_GET, []() {
        Serial.println("Firefox captive portal check");
        server.send(200, "text/plain", "success");
    });

    // Windows 10 captive portal detection
    server.on("/ncsi.txt", HTTP_GET, []() {
        Serial.println("Windows captive portal check");
        server.send(200, "text/plain", "Microsoft NCSI");
    });

    // Add the captive request handler to redirect all other unknown requests
    server.addHandler(new CaptiveRequestHandler());

    server.on("/", HTTP_GET, []()
              {
                  if (!handleFileRead("/index.html"))
                      server.send(404, "text/plain", "FileNotFound");
              }); //list directory

    server.on("/index.html", HTTP_GET, []()
              {
                  if (!handleFileRead("/index.html"))
                      server.send(404, "text/plain", "FileNotFound");
              }); //list directory

    server.on("/list", HTTP_GET, handleFileList);

    server.on("/update", HTTP_POST, []()
        {
            server.sendHeader("Connection", "close");
            server.send(200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
            ESP.restart();
        },
        []() {
            HTTPUpload &upload = server.upload();
            if (upload.status == UPLOAD_FILE_START) {
                String filename = upload.filename;
                int type = U_FLASH;
                
                filename.toLowerCase();
                if (filename.indexOf("spiffs") >= 0) {
                    type = U_SPIFFS;
                }
                
                if (!Update.begin(UPDATE_SIZE_UNKNOWN, type)) {
                    Update.printError(Serial);
                    return;
                }
            } else if (upload.status == UPLOAD_FILE_WRITE) {
                if (Update.write(upload.buf, upload.currentSize) != upload.currentSize){
                    Update.printError(Serial);
                }
            } else if (upload.status == UPLOAD_FILE_END) {
                if (Update.end(true)) {
                } else {
                    Update.printError(Serial);
                }
            }
        });

    // Captive portal: serve index.html for unknown requests in AP mode
    server.onNotFound([]() {
        if (WiFi.status() != WL_CONNECTED) {
            // In AP mode, serve index.html for captive portal
            if (!handleFileRead("/index.html")) {
                server.send(404, "text/plain", "FileNotFound");
            }
        } else {
            // In station mode, show proper 404 error
            handleNotFound();
        }
    });

    server.on("/all", HTTP_GET, []() {
                  String json = "{";
                  json += "\"heap\":" + String(ESP.getFreeHeap());
                  json += ", \"analog\":" + String(analogRead(A0));
                  json += ", \"gpio\":" + String("good");
                  json += "}";
                  server.send(200, "text/json", json);
                  json = String();
              });
    server.begin();
}