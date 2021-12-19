#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

#include "ezTime.h"

#include "../Helpers/EEPROMHelper.h"
#include "RealTimeClock.h"
#include "LocalTime.h"

unsigned long lastTimeNPTSync = 0;

String getRequestLocation();
boolean detectTimezone();

void setupNTP() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }
    setInterval(60 * 60);
    if (!readAutoTimezone()) {
        return ;
    }
    detectTimezone();
}

void syncNTPTimeWithRTC() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }

    #if NTP_RETRY <= 3000
    #error("Bad Idea, set NTP_RETRY to 60 minues") 
    #endif

    events();

    bool needUpdate = (millis() - lastTimeNPTSync > 20 * 60 * 1000 || lastTimeNPTSync == 0);

    if (!needUpdate) {
        return ;
    }
   
    bool hasValidTime = (timeStatus() == timeSet);

    if (!hasValidTime) {
        return ;
    }

    setRTCDateTime((byte)UTC.hour(), (byte)UTC.minute(), (byte)UTC.second(), (byte)UTC.day(), (byte)UTC.month(), (byte)(UTC.year() % 100), (byte)UTC.weekday());
    syncRTCWithInternalTime();

    lastTimeNPTSync = millis();
}

boolean detectTimezone() {
    String timeZone = getRequestLocation();
    if (timeZone.isEmpty()) {
        return false;
    }
    
    return setTimeZone(timeZone);
}

String getRequestLocation() {
    HTTPClient http;
    String result = "";
    String serverPath = "http://ip-api.com/json/?fields=status,timezone";

    http.begin(serverPath.c_str());

    if (http.GET() > 0) {
        String payload = http.getString();
        JSONVar myObject = JSON.parse(payload);

        if (JSON.typeof(myObject) == "undefined") {
            Serial.println(F("Parsing input failed!"));
        } else {
            result = myObject["timezone"];
        }
    }
    http.end();

    return result;
}