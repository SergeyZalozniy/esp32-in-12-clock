#include <Arduino.h>
#include "NightModeSettings.h"

void setupEEPROM();

String readWifiSSID();
void saveWifiSSID(String value);

String readWifiPassword();
void saveWifiPassword(String value);

boolean readAutoTimezone();
void saveAutoTimezone(boolean value);

String readManualTimeZoneName();
void saveManualTimeZoneName(String value);

String readManualTimeZoneOlson();
void saveManualTimeZoneOlson(String value);

boolean readGPSEnable();
void saveGPSEnable(boolean value);

boolean read24HourFormat();
void save24HourFormat(boolean value);

int readBrightness();
void saveBrightness(int value);

NightModeSettings getNightModeSettings();
void saveNightModeSettings(NightModeSettings value);