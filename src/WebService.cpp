#include <ESPmDNS.h>
#include <FS.h>
#include <SPIFFS.h>
#include <WiFiUdp.h>
#include <Update.h>
#include <WebServer.h>

#include "TimeLib.h"
#include "Indication.h"
#include "EEPROMHelper.h"

WiFiUDP Udp;
WiFiUDP ntpUDP;
File fsUploadFile;
WebServer server(80);

void HTTP_init();

void setupWebServer() {
    SPIFFS.begin();

    if (MDNS.begin("nixie")) {
        Serial.println("MDNS responder started");
        MDNS.addService("http", "tcp", 80);
        MDNS.addService("ws", "tcp", 81);
    } else {
        Serial.println("MDNS.begin failed");
    }

    HTTP_init();
}

void handleClient() {
    server.handleClient();
}

String formatBytes(size_t bytes) {
    if (bytes < 1024) {
        return String(bytes) + "B";
    } else if (bytes < (1024 * 1024)) {
        return String(bytes / 1024.0) + "KB";
    } else if (bytes < (1024 * 1024 * 1024)) {
        return String(bytes / 1024.0 / 1024.0) + "MB";
    } else {
        return String(bytes / 1024.0 / 1024.0 / 1024.0) + "GB";
    }
}

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
    if (path.endsWith("/"))
        path += "index.htm";
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

void handleFileUpload() {
    if (server.uri() != "/edit")
        return;
    HTTPUpload &upload = server.upload();
    if (upload.status == UPLOAD_FILE_START) {
        String filename = upload.filename;
        if (!filename.startsWith("/"))
            filename = "/" + filename;
        Serial.print("handleFileUpload Name: ");
        Serial.println(filename);
        fsUploadFile = SPIFFS.open(filename, "w");
        filename = String();
    } else if (upload.status == UPLOAD_FILE_WRITE) {
        if (fsUploadFile)
            fsUploadFile.write(upload.buf, upload.currentSize);
    } else if (upload.status == UPLOAD_FILE_END) {
        if (fsUploadFile)
            fsUploadFile.close();
        Serial.print("handleFileUpload Size: ");
        Serial.println(upload.totalSize);
    }
}

void handleFileDelete() {
    if (server.args() == 0)
        return server.send(500, "text/plain", "BAD ARGS");
    String path = server.arg(0);
    Serial.println("handleFileDelete: " + path);
    if (path == "/")
        return server.send(500, "text/plain", "BAD PATH");
    if (!SPIFFS.exists(path))
        return server.send(404, "text/plain", "FileNotFound");
    SPIFFS.remove(path);
    server.send(200, "text/plain", "");
    path = String();
}

void handleFileCreate() {
    if (server.args() == 0)
        return server.send(500, "text/plain", "BAD ARGS");
    String path = server.arg(0);
    Serial.println("handleFileCreate: " + path);
    if (path == "/")
        return server.send(500, "text/plain", "BAD PATH");
    if (SPIFFS.exists(path))
        return server.send(500, "text/plain", "FILE EXISTS");
    File file = SPIFFS.open(path, "w");
    if (file)
        file.close();
    else
        return server.send(500, "text/plain", "CREATE FAILED");
    server.send(200, "text/plain", "");
    path = String();
}

void handleFileList() {
    if (!server.hasArg("dir")) {
        server.send(500, "text/plain", "BAD ARGS");
        return;
    }

    String path = server.arg("dir");
    Serial.println("handleFileList: " + path);
    File dir = SPIFFS.open(path);
    path = String();

    File entry = dir.openNextFile();
    String output = "[";
    while (entry) {
        if (output != "[")
            output += ',';
        bool isDir = false;
        output += "{\"type\":\"";
        output += (isDir) ? "dir" : "file";
        output += "\",\"name\":\"";
        output += String(entry.name()).substring(1);
        output += "\"}";
        entry.close();

        entry = dir.openNextFile();
    }

    output += "]";
    server.send(200, "text/json", output);
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
    server.on("/config.json", HTTP_GET, []()
              { 
                struct tm timeinfo;
                if (getLocalTime(&timeinfo, 1000)) {
                    String res = String(timeinfo.tm_hour) + ":" + String(timeinfo.tm_min) + ":" + String(timeinfo.tm_sec) + " - " + String(timeinfo.tm_mday) + " \\ " + String(timeinfo.tm_mon) + " \\ " + String(timeinfo.tm_year) + " || " + String(timeinfo.tm_wday);
                    server.send(200, "text/plain", res);
                } else {
                    server.send(200, "text/plain", "Fail");
                }
               });

    server.on("/", HTTP_GET, []()
              {
                  if (!handleFileRead("/index.htm"))
                      server.send(404, "text/plain", "FileNotFound");
              }); //list directory

    server.on("/index.htm", HTTP_GET, []()
              {
                  if (!handleFileRead("/index.htm"))
                      server.send(404, "text/plain", "FileNotFound");
              }); //list directory

    server.on("/settings.htm", HTTP_GET, []()
              {
                  if (!handleFileRead("/settings.htm"))
                      server.send(404, "text/plain", "FileNotFound");
              });

    server.on("/settings", HTTP_GET, []()
              {
                  if (!handleFileRead("/settings.htm"))
                      server.send(404, "text/plain", "FileNotFound");
              });

    server.on("/list", HTTP_GET, handleFileList);

    server.onNotFound([]()
                      {
                          if (!handleFileRead("/settings.htm"))
                              server.send(404, "text/plain", "FileNotFound");
                      });

    server.on("/ssid", HTTP_GET, []()
              {
                  saveWifiPassword(server.arg("password"));
                  saveWifiSSID(server.arg("ssid"));
                  server.send(200, "text/plain", "OK");
                  ESP.restart();  
              });

    server.on("/update", HTTP_POST, []()
        {
            server.sendHeader("Connection", "close");
            server.send(200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
            ESP.restart();
        },
        []() {
            HTTPUpload &upload = server.upload();
            if (upload.status == UPLOAD_FILE_START) {
                Serial.printf("Update: %s\n", upload.filename.c_str());
                int type = server.arg("type").toInt();
                turnOffIndication();
                if (!Update.begin(UPDATE_SIZE_UNKNOWN, type)) {
                    Update.printError(Serial);
                }
            } else if (upload.status == UPLOAD_FILE_WRITE) {
                if (Update.write(upload.buf, upload.currentSize) != upload.currentSize){
                    Update.printError(Serial);
                }
            } else if (upload.status == UPLOAD_FILE_END) {
                if (Update.end(true)) {
                    Serial.printf("Update Success: %u\nRebooting...\n", upload.totalSize);
                } else {
                    Update.printError(Serial);
                }
            }
        });

    server.on("/edit", HTTP_PUT, handleFileCreate);

    server.on("/edit", HTTP_DELETE, handleFileDelete);
    server.on("/edit", HTTP_POST, []() { 
        server.send(200, "text/plain", ""); 
        }, handleFileUpload);

    server.onNotFound(handleNotFound);
    server.serveStatic("/font", SPIFFS, "/font", "max-age=86400");
    server.serveStatic("/js", SPIFFS, "/js", "max-age=86400");
    server.serveStatic("/css", SPIFFS, "/css", "max-age=86400");

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
    Serial.println("HTTP server started");
}