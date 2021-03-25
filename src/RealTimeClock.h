#include <Arduino.h>

void setupRTC();
void setRTCDateTime(byte h, byte m, byte s, byte d, byte mon, byte y, byte w);
void getRTCTime(int &seconds, int &minutes, int &hours, int &dayOfWeek, int &day, int &month, int &year);
