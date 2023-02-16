#include <Arduino.h>

void setupGPS();
void syncGPSTimeWithRTC();
bool getDataGps(byte &hour, byte &minute, byte &second, byte &day, byte &month, byte &year);
void userDidUpdateGPSEnable(boolean value);