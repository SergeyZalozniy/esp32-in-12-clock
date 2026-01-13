#include <Arduino.h>
#include <Preferences.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

#include "Constants.h"
#include "NightModeSettings.h"

#define passwordKey "password"
#define ssidKey "ssid"
#define autotimezoneKey "autotimezone"
#define manualTimeZoneNameKey "manual-tz-name"
#define manualTimeZoneOlsonKey "manual-tz-olson"
#define gpsEnableKey "gps-enable"
#define hourFormat24Key "hour-format-24"
#define brightnessKey "brightness"
#define nightModeKey "night-mode"

Preferences prefs;
NightModeSettings currentNightModeSetting;

NightModeSettings readNightModeSettings();

void setupEEPROM() {
    prefs.begin(PREFERENCE_NAME_SPACE, false);
    currentNightModeSetting = readNightModeSettings();
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

String readManualTimeZoneName() {
    return prefs.getString(manualTimeZoneNameKey, "");
}

void saveManualTimeZoneName(String value) {
    prefs.putString(manualTimeZoneNameKey, value);
}

String readManualTimeZoneOlson() {
    return prefs.getString(manualTimeZoneOlsonKey, "");
}

void saveManualTimeZoneOlson(String value) {
    prefs.putString(manualTimeZoneOlsonKey, value);
}

boolean readGPSEnable() {
    return prefs.getBool(gpsEnableKey, true);
}

void saveGPSEnable(boolean value) {
    prefs.putBool(gpsEnableKey, value);
}

boolean read24HourFormat() {
    return prefs.getBool(hourFormat24Key, true);
}

void save24HourFormat(boolean value) {
    prefs.putBool(hourFormat24Key, value);
}

int readBrightness() {
    return prefs.getInt(brightnessKey, 50);
}

void saveBrightness(int value) {
    prefs.putInt(brightnessKey, value);
}

NightModeSettings getDefaultNightModeSettings() {
    NightModeSettings settings;
    settings.enabled = false;

    settings.startTime = "22:00";
    settings.endTime = "07:00";
    settings.backLightDisable = false;
    settings.brightnessPercent = 30;
    return settings;
}

NightModeSettings getNightModeSettings() {
    return currentNightModeSetting;
}

NightModeSettings readNightModeSettings() {
    // Try to read JSON string from preferences
    // Use getString with empty default to avoid error messages if key doesn't exist
    String jsonStr = prefs.getString(nightModeKey, "");

    if (jsonStr.length() == 0) {
        // Return default values if string is empty or doesn't exist
        return getDefaultNightModeSettings();
    }

    // Parse JSON (ArduinoJson v5)
    DynamicJsonBuffer jsonBuffer(256);
    JsonObject& doc = jsonBuffer.parseObject(jsonStr);

    if (!doc.success()) {
        // If parsing fails, return default values
        Serial.println("Failed to parse night mode settings");
        return getDefaultNightModeSettings();
    }

    // Successfully parsed, populate settings
    NightModeSettings settings;
    settings.enabled = doc.get<bool>("enabled");
    settings.startTime = doc.get<String>("startTime");
    settings.endTime = doc.get<String>("endTime");
    settings.backLightDisable = doc.get<bool>("backLightDisable");
    settings.brightnessPercent = doc.get<int>("brightnessPercent");

    return settings;
}

void saveNightModeSettings(NightModeSettings value) {
    currentNightModeSetting = value;
    // Create JSON document (ArduinoJson v5)
    DynamicJsonBuffer jsonBuffer(256);
    JsonObject& doc = jsonBuffer.createObject();

    doc["enabled"] = value.enabled;
    doc["startTime"] = value.startTime;
    doc["endTime"] = value.endTime;
    doc["backLightDisable"] = value.backLightDisable;
    doc["brightnessPercent"] = value.brightnessPercent;

    // Serialize to string
    String jsonStr;
    doc.printTo(jsonStr);

    // Save to preferences
    prefs.putString(nightModeKey, jsonStr);
}