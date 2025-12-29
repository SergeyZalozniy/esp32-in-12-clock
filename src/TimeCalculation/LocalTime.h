#include <Arduino.h>

void setupLocalTime();
boolean setTimeZone(String tz);
String getTimezoneName();
int* getTime();
int* getDate();
int* IRAM_ATTR getCachedTime();
int* IRAM_ATTR getCachedDate();
void updateTimeCache();