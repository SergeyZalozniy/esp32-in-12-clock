#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

#include "ezTime.h"

#include "RealTimeClock.h"
#include "LocalTime.h"

unsigned long lastTimeNPTSync = 0;

String getRequestLocation();

void setupNTP() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }
    setInterval(60 * 60);

    String timeZone = getRequestLocation();
    if (!timeZone.isEmpty()) {
        setTimeZone(timeZone);
    }
}

void syncNTPTimeWithRTC() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }
    
    events();

    bool needUpdate = (millis() - lastTimeNPTSync > 60 * 60 * 1000 || lastTimeNPTSync == 0);
    bool hasValidTime = (timeStatus() == timeSet);

    if (!needUpdate || !hasValidTime) {
        return ;
    }
    setRTCDateTime((byte)UTC.hour(), (byte)UTC.minute(), (byte)UTC.second(), (byte)UTC.day(), (byte)UTC.month(), (byte)(UTC.year() % 100), (byte)UTC.weekday());
    syncRTCWithInternalTime();
    lastTimeNPTSync = millis();
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