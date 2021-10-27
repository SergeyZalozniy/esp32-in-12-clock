#include <Arduino.h>
#include <WiFi.h>

#include "TimeLib.h"
#include "RealTimeClock.h"

// ntp servers
const char* ntpServer1 = "europe.pool.ntp.org";
const char* ntpServer2 = "north-america.pool.ntp.org";
const char* ntpServer3 = "pool.ntp.org";

static unsigned long lastTimeNPTSync = 0;

void setupNTP() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }
    configTime(0, 0, ntpServer1, ntpServer2, ntpServer3);
}

void syncNTPTimeWithRTC() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }
    
    if (millis() - lastTimeNPTSync < 60 * 60 * 1000 && lastTimeNPTSync > 0) {
        return ;
    }
    struct tm timeinfo;
    if(getLocalTime(&timeinfo, 1000)) {
        setRTCDateTime((byte)timeinfo.tm_hour, (byte)timeinfo.tm_min, (byte)timeinfo.tm_sec, (byte)timeinfo.tm_mday, (byte)(timeinfo.tm_mon + 1), (byte)(timeinfo.tm_year % 100), (byte)timeinfo.tm_wday);
        syncRTCWithInternalTime();
    }
    lastTimeNPTSync = millis();
}
