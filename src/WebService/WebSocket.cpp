#include <WebSocketsServer.h>
#include <WiFi.h>
#include <Update.h>
#include "ezTime.h"

#include "../Helpers/Constants.h"
#include "../Helpers/EEPROMHelper.h"
#include "../TimeCalculation/LocalTime.h"
#include "../TimeCalculation/NTPTime.h"
#include "../TimeCalculation/GPSTime.h"
#include "../TimeCalculation/RealTimeClock.h"
#include "../LampIndication/Brightness.h"
#include "../LampIndication/Indication.h"
#include <Adafruit_NeoPixel.h>

WebSocketsServer webSocket = WebSocketsServer(webSocketPort);

// External LED strip variables
extern Adafruit_NeoPixel strip;
extern volatile bool stripIsActive;

// Update tracking variables
static bool updateInProgress = false;
static size_t updateTotalSize = 0;
static size_t updateReceivedSize = 0;

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
  requestWifiList = 13,
  customTime = 14,
  backlightColor = 15
};


void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);
void procceedSocketEvent(SocketCommands command, String value);
void sendWifiList();
int splitAndTrim(String input, String output[], int maxParts, char separator = '|');

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
      webSocket.broadcastTXT(String((char) SocketCommands::autoTimeZone) + "auto");
    } else {
      webSocket.broadcastTXT(String((char) SocketCommands::autoTimeZone) + "manual");
    }
    webSocket.broadcastTXT(String((char) SocketCommands::timezoneName) + ::getTimezoneName() + "|" + ::getPosix());
    if (readGPSEnable()) {
      webSocket.broadcastTXT(String((char) SocketCommands::enableGPS) + "true");
    } else {
      webSocket.broadcastTXT(String((char) SocketCommands::enableGPS) + "false");
    }
    if (read24HourFormat()) {
      webSocket.broadcastTXT(String((char) SocketCommands::timeMode) + "24h");
    } else {
      webSocket.broadcastTXT(String((char) SocketCommands::timeMode) + "12h");
    }
    
    webSocket.broadcastTXT(String((char) SocketCommands::advancedMode) + "false");

    NightModeSettings nightModeSettings = getNightModeSettings();
    String nightModeStr = String(nightModeSettings.enabled ? "true" : "false") + "|" +
                          nightModeSettings.startTime + "|" +
                          nightModeSettings.endTime + "|" +
                          String(nightModeSettings.backLightDisable ? "true" : "false") + "|" +
                          String(nightModeSettings.brightnessPercent);
    webSocket.broadcastTXT(String((char) SocketCommands::nightMode) + nightModeStr);

    // Send brightness as percentage (0-100)
    webSocket.broadcastTXT(String((char) SocketCommands::brightness) + String(readBrightness()));
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

      procceedSocketEvent((SocketCommands) command, value);
      break;
    }

    case WStype_BIN:
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
      boolean autoTimeZone = value.equalsIgnoreCase("auto");
      saveAutoTimezone(autoTimeZone);
      if (autoTimeZone) {
        detectTimezone();
        webSocketSendCurrentState();
      }
      break;
    }
  case SocketCommands::timezoneName: {
      if (readAutoTimezone()) {
        saveAutoTimezone(false);
      }

      String parts[2];
      int count = splitAndTrim(value, parts, 2);
      if (count == 2) {
        setTimeZone(parts[0], parts[1]);
      }
      break;
    }
  case SocketCommands::enableGPS: {
      boolean enableGPS = value.equalsIgnoreCase("true");
      saveGPSEnable(enableGPS);
      userDidUpdateGPSEnable(enableGPS);
      break;
    }
  case SocketCommands::timeMode: {
      boolean format24 = value.equalsIgnoreCase("24h");
      save24HourFormat(format24);
      break;
    }
  case SocketCommands::brightness: {
      int brightness = value.toInt();
      setBrightnessPercent(brightness);
      saveBrightness(brightness);

      int seconds = 1;
      unsigned long startTime = millis();
	    unsigned long millisElapse = 0;
      while (millisElapse < seconds * 1000) {
        millisElapse = millis() - startTime;
        forceCorrectVoltage();
        delay(10);
		  }

      break;
    }
  case SocketCommands::nightMode: {
      // Parse night mode settings: enabled | startTime | endTime | backLightDisable | brightnessPercent
      String parts[5];
      int count = splitAndTrim(value, parts, 5);
      if (count == 5) {
        NightModeSettings settings;
        settings.enabled = parts[0].equalsIgnoreCase("true");
        settings.startTime = parts[1];
        settings.endTime = parts[2];
        settings.backLightDisable = parts[3].equalsIgnoreCase("true");
        settings.brightnessPercent = parts[4].toInt();
        saveNightModeSettings(settings);
        Serial.println(F("Night mode settings saved"));
      }
      Serial.println(value);
      break;
    }
  case SocketCommands::requestWifiList:
    sendWifiList();
    break;
  case SocketCommands::customTime: {
      // Receive Unix timestamp and set RTC time
      unsigned long timestamp = value.toInt();
      if (timestamp == 0) {
        return;
      }
      UTC.setTime(timestamp);
      setRTCDateTime((byte)UTC.hour(), (byte)UTC.minute(), (byte)UTC.second(), (byte)UTC.day(), (byte)UTC.month(), (byte)(UTC.year() % 100), (byte)UTC.weekday());
      syncRTCWithInternalTime();
      break;
    }
  case SocketCommands::backlightColor: {
      // Receive RGB color in format "R|G|B"
      String parts[3];
      int count = splitAndTrim(value, parts, 3);
      if (count == 3) {
        int r = parts[0].toInt();
        int g = parts[1].toInt();
        int b = parts[2].toInt();
        
        // Validate RGB values (0-255)
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
          // Set all LEDs to the specified color
          for (int i = 0; i < stripLedCount; i++) {
            strip.setPixelColor(i, strip.Color(r, g, b));
          }
          strip.show();
          stripIsActive = true;
          
          Serial.print(F("Backlight color set: RGB("));
          Serial.print(r);
          Serial.print(F(", "));
          Serial.print(g);
          Serial.print(F(", "));
          Serial.print(b);
          Serial.println(F(")"));
        }
      }
      break;
    }
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

int splitAndTrim(String input, String output[], int maxParts, char separator) {
  int partIndex = 0;
  int lastIndex = 0;
  
  for (int i = 0; i <= input.length() && partIndex < maxParts; i++) {
    if (i == input.length() || input.charAt(i) == separator) {
      output[partIndex] = input.substring(lastIndex, i);
      output[partIndex].trim();
      partIndex++;
      lastIndex = i + 1;
    }
  }
  
  return partIndex; // Return number of parts found
}