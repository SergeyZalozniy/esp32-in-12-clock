#include <Arduino.h>
#include <WiFi.h>

#include "TimeLib.h"
#include "RealTimeClock.h"

static unsigned long lastTimeNPTSync = 0;

void syncNTPTimeWithRTC() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }
    
    if (millis() - lastTimeNPTSync < 60 * 60 * 1000 && lastTimeNPTSync > 0) {
        return ;
    }
    struct tm timeinfo;
    if(getLocalTime(&timeinfo, 1000)) {
        setRTCDateTime((byte)timeinfo.tm_hour, (byte)timeinfo.tm_min, (byte)timeinfo.tm_sec, (byte)timeinfo.tm_mday, (byte)timeinfo.tm_mon, (byte)(timeinfo.tm_year % 100), (byte)timeinfo.tm_wday);
    }
    lastTimeNPTSync = millis();
}
