#include <WebSocketsServer.h>

#include "../Helpers/Constants.h"
#include "../Helpers/EEPROMHelper.h"

WebSocketsServer webSocket = WebSocketsServer(webSocketPort);

enum SocketCommands {
  wifiPassword = 1,
  wifiSSID,
  autoTimeZone
};

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);

void setupWebSocket() {
  webSocket.begin();
	webSocket.onEvent(webSocketEvent);
}

void handleWebSocketClients() {
    webSocket.loop();   
}

void webSocketSendCurrentMode() {
    webSocket.broadcastTXT(String((char) SocketCommands::wifiPassword) + readWifiPassword());
    webSocket.broadcastTXT(String((char) SocketCommands::wifiSSID) + readWifiSSID());
    // webSocket.broadcastTXT(String("volume") + modes[currentMode].brightness);
    // webSocket.broadcastTXT(String("speed") + modes[currentMode].speed);
    // webSocket.broadcastTXT(String("scale") + modes[currentMode].scale);
    // if (turnOffTime > 0) {
    //   webSocket.broadcastTXT(String("timer") + (turnOffTime - millis()) / 1000);          
    // }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      break;
    case WStype_CONNECTED:
      webSocketSendCurrentMode();
        // webSocket.sendTXT(num,  String("effect") + currentMode);
        // webSocket.sendTXT(num,  String("volume") + modes[currentMode].brightness);
        // webSocket.sendTXT(num,  String("speed") + modes[currentMode].speed);
        // webSocket.sendTXT(num,  String("scale") + modes[currentMode].scale);
        // webSocket.sendTXT(num,  String("timer") + (turnOffTime - millis()) / 1000);          
      break;
    case WStype_TEXT: {
      char buf[length + 1] = {};
      memcpy(buf, payload, length);
      String value = String(buf + 1);
      byte command = buf[0];

      Serial.println(command);
      Serial.println(value);
    //   webSocket.broadcastTXT(payload, length);
      break;
    }
    case WStype_BIN:
    //   webSocket.sendBIN(num, payload, length);
      break;
    default:
      break;
  }
}
