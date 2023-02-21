#include <Arduino.h>
#include "ezTime.h"

#include "../Helpers/Constants.h"
#include "../Helpers/EEPROMHelper.h"

Timezone localTimeZone;

String updatedTime = "";
unsigned long lastTimeStringWasUpdated;

String updatedDate = "";
unsigned long lastDateStringWasUpdated;

time_t getLocalTime();
String preZero(int digit);

void setupLocalTime() {
    if (localTimeZone.setCache(PREFERENCE_NAME_SPACE, F("timezone"))) {
        Serial.println(F("Has timezone cache"));
    }
}

boolean setTimeZone(String tz) {
  if (localTimeZone.setLocation(tz)) {
    return true;
  }
  // Renamed timzezone in 2022 - Europe/Kiev -> Europe/Kyiv
  if (tz == F("Europe/Kyiv")) {
    return localTimeZone.setLocation(F("Europe/Kiev"));
  }

  return false;
}

String getTimezoneName() {
  return localTimeZone.getTimezoneName();
}

String getTime() {
    return preZero(localTimeZone.hour()) + preZero(localTimeZone.minute());
}

String getDate() {
    return preZero(localTimeZone.day()) + preZero(localTimeZone.month());
}

String getCachedTimeString() {
  if (millis() - lastTimeStringWasUpdated > 1000 || lastTimeStringWasUpdated == 0) {
    updatedTime = getTime();
    lastTimeStringWasUpdated = millis();
  }
  return updatedTime;
}

String getCachedDateString() {
  if (millis() - lastDateStringWasUpdated > 5000 || lastDateStringWasUpdated == 0) {
    updatedDate = getDate();
    lastDateStringWasUpdated = millis();
  }
  return updatedDate;
}

time_t getLocalTime() {
    static int lastCorrectedHour = -1;
    static time_t deltaTime = 0;

    time_t utc = now();

    if (lastCorrectedHour != hour()) {
        deltaTime = localTimeZone.getOffset();
        lastCorrectedHour = hour();
    }

    return utc + deltaTime;
}

String preZero(int digit) {
    digit = abs(digit);
    if (digit < 10) 
        return String(F("0")) + String(digit);
    else 
        return String(digit);
}
