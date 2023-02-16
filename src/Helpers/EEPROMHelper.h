#include <Arduino.h>

void setupEEPROM();
int16_t timeZoneCacheAddress();

String readWifiSSID();
void saveWifiSSID(String value);

String readWifiPassword();
void saveWifiPassword(String value);

boolean readAutoTimezone();
void saveAutoTimezone(boolean value);

boolean readGPSEnable();
void saveGPSEnable(boolean value);