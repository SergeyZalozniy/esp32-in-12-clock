#include <WebSocketsServer.h>

#include "../Helpers/Constants.h"
#include "../Helpers/EEPROMHelper.h"
#include "../TimeCalculation/LocalTime.h"
#include "../TimeCalculation/NTPTime.h"
#include "../TimeCalculation/GPSTime.h"

WebSocketsServer webSocket = WebSocketsServer(webSocketPort);

enum SocketCommands {
  wifiPassword = 1,
  wifiSSID,
  autoTimeZone,
  timezoneName,
  enableGPS
};

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);
void procceedSocketEvent(SocketCommands command, String value);

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

      Serial.println(command);
      Serial.println(value);
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
  default:
    break;
  }
}