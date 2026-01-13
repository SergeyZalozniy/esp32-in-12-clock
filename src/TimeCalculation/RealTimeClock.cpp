#include <Arduino.h>
#include <Wire.h>

#include "ezTime.h"

#include "../Helpers/Constants.h"
#include "BuildTime.h"
#include "RealTimeClock.h"

#define DS1307_ADDRESS 0x68
#define zero 0x00

bool dateTimeIsValid = false;
unsigned long lastTimeRTCSync = UINT32_MAX;
byte decToBcd(byte val);
byte bcdToDec(byte val);

// Validate if timezone date is same or after build date
bool isDateValidForTimezone(Timezone* tz) {
  int currentYear = tz->year();
  int currentMonth = tz->month();
  int currentDay = tz->day();

  // Check if year is after build year
  bool yearValid = (currentYear > BUILD_YEAR);

  // If year matches build year, also check month and day
  if (currentYear == BUILD_YEAR) {
    if (currentMonth > BUILD_MONTH) {
      yearValid = true;
    } else if (currentMonth == BUILD_MONTH && currentDay >= BUILD_DAY) {
      yearValid = true;
    } else {
      yearValid = false;
    }
  }

  return yearValid;
}

void setupRTC() {
  Wire.begin(i2csDataPin, i2csClockPin);
}

boolean hasValidDateAndTime() {
  return dateTimeIsValid;
}

void syncRTCWithInternalTime() {
  if (millis() - lastTimeRTCSync < 10000) {
    return ;
  }
  lastTimeRTCSync = millis();

  byte hours, minutes, seconds, day, month, year, dayOfWeek;
  getRTCTime(seconds, minutes, hours, dayOfWeek, day, month, year);
  setTime((int)hours, (int)minutes, (int)seconds, (int)day, (int)month, (int)year);

  // Validate date and time using the helper method
  dateTimeIsValid = isDateValidForTimezone(defaultTZ);
}

void setRTCDateTime(byte h, byte m, byte s, byte d, byte mon, byte y, byte w) {
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero); //stop Oscillator

  Wire.write(decToBcd(s));
  Wire.write(decToBcd(m));
  Wire.write(decToBcd(h));
  Wire.write(decToBcd(w));
  Wire.write(decToBcd(d));
  Wire.write(decToBcd(mon));
  Wire.write(decToBcd(y));

  Wire.write(zero); //start

  Wire.endTransmission();
}

void getRTCTime(byte &seconds, byte &minutes, byte &hours, byte &dayOfWeek, byte &day, byte &month, byte &year) {
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero);
  Wire.endTransmission();

  Wire.requestFrom(DS1307_ADDRESS, 7);

  seconds = bcdToDec(Wire.read());
  minutes = bcdToDec(Wire.read());
  hours = bcdToDec(Wire.read() & 0b111111); //24 hour time
  dayOfWeek = bcdToDec(Wire.read()); //0-6 -> sunday - Saturday
  day = bcdToDec(Wire.read());
  month = bcdToDec(Wire.read());
  year = bcdToDec(Wire.read());
}

byte decToBcd(byte val) {
  return ( (val / 10 * 16) + (val % 10) );
}

byte bcdToDec(byte val)  {
  return ( (val / 16 * 10) + (val % 16) );
}
