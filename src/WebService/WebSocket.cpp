#include <WebSocketsServer.h>
#include <WiFi.h>

#include "../Helpers/Constants.h"
#include "../Helpers/EEPROMHelper.h"
#include "../TimeCalculation/LocalTime.h"
#include "../TimeCalculation/NTPTime.h"
#include "../TimeCalculation/GPSTime.h"

WebSocketsServer webSocket = WebSocketsServer(webSocketPort);

enum SocketCommands {
  wifiPassword = 1,
  wifiSSID = 2,
  autoTimeZone = 3,
  timezoneName = 4,
  enableGPS = 5,
  nightMode = 6,
  brightness = 7,
  timeMode = 8,
  fileUpload = 9,
  advancedMode = 10,
  language = 11,
  wifiList = 12,
  requestWifiList = 13
};


void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);
void procceedSocketEvent(SocketCommands command, String value);
void sendWifiList();

void setupWebSocket() {
  webSocket.begin();
	webSocket.onEvent(webSocketEvent);
}

void handleWebSocketClients() {
  webSocket.loop();   
}

void webSocketSendCurrentState() {
    webSocket.broadcastTXT(String((char) SocketCommands::wifiPassword) + readWifiPassword());
    webSocket.broadcastTXT(String((char) SocketCommands::wifiSSID) + readWifiSSID());
    if (readAutoTimezone()) {
      webSocket.broadcastTXT(String((char) SocketCommands::autoTimeZone) + "true");
    } else {
      webSocket.broadcastTXT(String((char) SocketCommands::autoTimeZone) + "false");
    }
    if (readGPSEnable()) {
      webSocket.broadcastTXT(String((char) SocketCommands::enableGPS) + "true");
    } else {
      webSocket.broadcastTXT(String((char) SocketCommands::enableGPS) + "false");
    }
    webSocket.broadcastTXT(String((char) SocketCommands::timezoneName) + getTimezoneName());
}

void sendSocketTXT(String str) {
  webSocket.broadcastTXT(str);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      break;
    case WStype_CONNECTED:
      webSocketSendCurrentState();        
      break;
    case WStype_TEXT: {
      char buf[length + 1] = {};
      memcpy(buf, payload, length);
      String value = String(buf + 1);
      byte command = buf[0];

      // Serial.println(command);
      // Serial.println(value);
      procceedSocketEvent((SocketCommands) command, value);
      break;
    }
    case WStype_BIN:
    //   webSocket.sendBIN(num, payload, length);
      break;
    default:
      break;
  }
}

void procceedSocketEvent(SocketCommands command, String value) {
  switch (command) {
  case SocketCommands::wifiPassword:
    saveWifiPassword(value);
    delay(200);
    ESP.restart();  
    break;
  case SocketCommands::wifiSSID:
    saveWifiSSID(value);
    break;
  case SocketCommands::autoTimeZone: {
      boolean autoTimeZone = value.equalsIgnoreCase("true");
      saveAutoTimezone(autoTimeZone);
      if (autoTimeZone) {
        detectTimezone();
        webSocketSendCurrentState();
      }
      break;
    }
  case SocketCommands::timezoneName:
    if (readAutoTimezone()) {
      saveAutoTimezone(false);
    }
    setTimeZone(value);
    break;
  case SocketCommands::enableGPS: {
      boolean enableGPS = value.equalsIgnoreCase("true");
      saveGPSEnable(enableGPS);
      userDidUpdateGPSEnable(enableGPS);
      break;
    }
  case SocketCommands::requestWifiList:
    sendWifiList();
    break;
  default:
    break;
  }
}

void sendWifiList() {
  // Scan for WiFi networks
  // Parameters: async=false, show_hidden=false, passive=false, max_ms_per_chan=300, channel=0
  // - async=false: synchronous scan (blocking)
  // - show_hidden=false: don't include hidden SSIDs
  // - passive=false: use active scanning (faster)
  // - max_ms_per_chan=300: spend 300ms per channel (default)
  int n = WiFi.scanNetworks(false, false, false, 300);

  String wifiList = "";

  if (n == 0) {
    wifiList = "No networks found";
  } else {
    // Build pipe-separated list of SSIDs (sorted by signal strength, strongest first)
    for (int i = 0; i < n; i++) {
      if (i > 0) {
        wifiList += "|";
      }
      wifiList += WiFi.SSID(i);
    }
  }

  // Send WiFi list via WebSocket
  webSocket.broadcastTXT(String((char) SocketCommands::wifiList) + wifiList);

  // Clean up scan results to free memory
  WiFi.scanDelete();
}