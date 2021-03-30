#include <Arduino.h>
#include <Wire.h>

#include "Constants.h"
#include "RealTimeClock.h"

#define DS1307_ADDRESS 0x68
#define zero 0x00

byte decToBcd(byte val);
byte bcdToDec(byte val);

void setupRTC() {
  Wire.begin(i2csDataPin, i2csClockPin);
}

void syncRTCWithInternalTime() {
  static unsigned long lastTimeRTCSync = 0;
  if (millis() - lastTimeRTCSync < 10000 && lastTimeRTCSync != 0) {
    return ;
  }

  byte hours, minutes, seconds, day, month, year, dayOfWeek;
  getRTCTime(seconds, minutes, hours, dayOfWeek, day, month, year);    
  setTime((int)hours, (int)minutes, (int)seconds, (int)day, (int)month, (int)year);

  lastTimeRTCSync = millis();
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
