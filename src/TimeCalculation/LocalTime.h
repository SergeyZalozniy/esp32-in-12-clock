#include <Arduino.h>

void setupLocalTime();
boolean setTimeZone(String tz, String posix);
boolean setTimeZone(String tz);
String getTimezoneName();
String getPosix();
int* getTime(boolean force24HourFormat = false);
int* getDate();
int* IRAM_ATTR getCachedTime();
int* IRAM_ATTR getCachedDate();
void updateTimeCache();