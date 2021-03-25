#include <Arduino.h>
#include <Wire.h>

#include "Constants.h"

byte decToBcd(byte val);
byte bcdToDec(byte val);

void setupRTC() {
  Wire.begin(I2C_SDA, I2C_SCL);
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

void getRTCTime(int &seconds, int &minutes, int &hours, int &dayOfWeek, int &day, int &month, int &year) {
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
