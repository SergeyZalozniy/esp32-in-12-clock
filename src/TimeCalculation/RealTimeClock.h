#include <Arduino.h>
#include "ezTime.h"

void setupRTC();
boolean IRAM_ATTR hasValidDateAndTime();
bool isDateValidForTimezone(Timezone* tz);
void syncRTCWithInternalTime();
void setRTCDateTime(byte h, byte m, byte s, byte d, byte mon, byte y, byte w);
void getRTCTime(byte &seconds, byte &minutes, byte &hours, byte &dayOfWeek, byte &day, byte &month, byte &year);
