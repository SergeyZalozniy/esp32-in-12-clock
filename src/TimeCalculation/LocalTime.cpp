#include <Arduino.h>
#include "ezTime.h"

#include "../Helpers/Constants.h"
#include "../Helpers/EEPROMHelper.h"

Timezone localTimeZone;

int *updatedTime;
unsigned long lastTimeStringWasUpdated = UINT_MAX;

int *updatedDate;
unsigned long lastDateStringWasUpdated = UINT_MAX;

time_t getLocalTime();

void setupLocalTime() {
    if (localTimeZone.setCache(PREFERENCE_NAME_SPACE, F("timezone"))) {
        // Serial.println(F("Has timezone cache"));
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

int* getTime() {
  static int time[lampsCount];
  int hours = localTimeZone.hour();
  int minutes = localTimeZone.minute();
  time[0] = hours / 10;
  time[1] = hours % 10;
  time[2] = minutes / 10;
  time[3] = minutes % 10;
  return time;
}

int* getDate() {
  static int date[lampsCount];
  int day = localTimeZone.day();
  int month = localTimeZone.month();
  date[0] = day / 10;
  date[1] = day % 10;
  date[2] = month / 10;
  date[3] = month % 10;
  return date;
}

int* getCachedTime() {
  if (millis() - lastTimeStringWasUpdated > 1000) {
    updatedTime = getTime();
    lastTimeStringWasUpdated = millis();
  }
  return updatedTime;
}

int* getCachedDate() {
  if (millis() - lastDateStringWasUpdated > 15000) {
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