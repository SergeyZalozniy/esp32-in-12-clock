#include <Arduino.h>
#include <Preferences.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

#define passwordKey "password"
#define ssidKey "ssid"
#define autotimezoneKey "autotimezone"

Preferences prefs;

void setupEEPROM() {
    prefs.begin("credentials", false);
}

int16_t timeZoneCacheAddress() {
    return 0;
}

String readWifiSSID() {
    return prefs.getString(ssidKey);
}

void saveWifiSSID(String value) {
    prefs.putString(ssidKey, value);
}

String readWifiPassword() {
    return prefs.getString(passwordKey);
}

void saveWifiPassword(String value) {
    prefs.putString(passwordKey, value);
}

boolean readAutoTimezone() {
    return prefs.getBool(autotimezoneKey, true);
}

void saveAutoTimezone(boolean value) {
    prefs.putBool(autotimezoneKey, value);
}