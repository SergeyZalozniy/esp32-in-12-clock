#include <Arduino.h>
#include <TinyGPS++.h>

#include "BuildTime.h"
#include "GPSTime.h"
#include "RealTimeClock.h"

#define gpsSerial Serial2
TinyGPSPlus gps;

void setupGPS() {
    gpsSerial.begin(9600);
}

void syncGPSTimeWithRTC() {
    byte hours, minutes, seconds, day, month, year, dayOfWeek = 0;
    if (getDataGps(hours, minutes, seconds, day, month, year)) {
        setRTCDateTime(hours, minutes, seconds, day, month, year, dayOfWeek);
    }
}

bool getDataGps(byte &hour, byte &minute, byte &second, byte &day, byte &month, byte &year) {
    static unsigned long lastTimeGPSSync = 0;

    while (gpsSerial.available() > 0){
        char c = gpsSerial.read();
        
        if (!gps.encode(c)) {
            return false;
        }

        if ((millis() - lastTimeGPSSync) < 60000) {
            return false;
        }

        TinyGPSDate date = gps.date;
        TinyGPSTime time = gps.time;

        if (!time.isValid() || !date.isValid()) {
            return false;
        }

        // fix issue with 2000 year
        if (date.year() < BUILD_YEAR) {
            return false;
        }

        hour = time.hour();
        minute = time.minute();
        second = time.second();

        day = date.day();
        month = date.month();
        year = (byte)(date.year() % 100);

        Serial.print("GPSTime Sync - ");
        Serial.print(hour);
        Serial.print(":");
        Serial.print(minute);
        Serial.print(":");
        Serial.print(second);

        Serial.print(" ### ");

        Serial.print(day);
        Serial.print("/");
        Serial.print(month);
        Serial.print("/");
        Serial.println(year);

        lastTimeGPSSync = millis();
        
        return true;
    }
    return false;
}