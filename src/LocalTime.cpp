#include <Arduino.h>
#include <Timezone.h>

time_t getLocalTime();
String preZero(int digit);

String getTime() {
    time_t adjustedTime = getLocalTime();
    return preZero(hour(adjustedTime)) + preZero(minute(adjustedTime));
}

String getDate() {
    time_t adjustedTime = getLocalTime();
    return preZero(day(adjustedTime)) + preZero(month(adjustedTime));
}

String getCachedTimeString() {
  static String updatedTime = "";
  static unsigned long lastTimeStringWasUpdated;
  if (millis() - lastTimeStringWasUpdated > 1000 || lastTimeStringWasUpdated == 0) {
    updatedTime = getTime();
    lastTimeStringWasUpdated = millis();
  }
  return updatedTime;
}

String getCachedDateString() {
  static String updatedDate = "";
  static unsigned long lastDateStringWasUpdated;
  if (millis() - lastDateStringWasUpdated > 5000 || lastDateStringWasUpdated == 0) {
    updatedDate = getDate();
    lastDateStringWasUpdated = millis();
  }
  return updatedDate;
}

time_t getLocalTime() {
    static int lastCorrectedHour = -1;
    static time_t deltaTime = 0;

    TimeChangeRule uaSummer = {"EDT", Last, Sun, Mar, 3, 180};  //UTC + 3 hours
    TimeChangeRule uaWinter = {"EST", Last, Sun, Oct, 4, 120};  //UTC + 2 hours
    Timezone uaUkraine(uaSummer, uaWinter);

    time_t utc = now();

    if (lastCorrectedHour != hour()) {
        time_t localTime = uaUkraine.toLocal(utc);
        deltaTime = localTime - utc;
        lastCorrectedHour = hour();
    }

    return utc + deltaTime;
}

String preZero(int digit) {
    digit = abs(digit);
    if (digit < 10) 
        return String("0") + String(digit);
    else 
        return String(digit);
}
