#include <Arduino.h>

void setupLocalTime();
boolean setTimeZone(String tz);
String getTimezoneName();
int* getTime();
int* getDate();
int* getCachedTime();
int* getCachedDate();