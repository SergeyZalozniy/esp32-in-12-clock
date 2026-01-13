#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

#include "ezTime.h"

#include "../Helpers/EEPROMHelper.h"
#include "RealTimeClock.h"
#include "LocalTime.h"
#include "../WebService/WebSocket.h"

unsigned long nextTimeNPTSync = 0;
unsigned char failRequestCount = 0;

String getRequestLocation();
boolean detectTimezone();

void setupNTP() {
    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }
    setInterval(0);
    if (!readAutoTimezone()) {
        return ;
    }
    detectTimezone();
}

void syncNTPTimeWithRTC() {
    bool needUpdate = millis() > nextTimeNPTSync;
    if (!needUpdate) {
        return ;
    }

    if (WiFi.status() != WL_CONNECTED) {
        return ;
    }

    updateNTP();

    if (isDateValidForTimezone(&UTC) && timeStatus() == timeSet) {
        setRTCDateTime((byte)UTC.hour(), (byte)UTC.minute(), (byte)UTC.second(), (byte)UTC.day(), (byte)UTC.month(), (byte)(UTC.year() % 100), (byte)UTC.weekday());
        syncRTCWithInternalTime();
        nextTimeNPTSync = millis() + 60 * 60 * 1000; // Sync every 60 minutes
        failRequestCount = 0;
    } else {
        failRequestCount = max(failRequestCount + 1, 12);
        nextTimeNPTSync = millis() + (unsigned long)failRequestCount * 5 * 1000;
    }
}

boolean detectTimezone() {
    String timeZone = getRequestLocation();
    if (timeZone.isEmpty()) {
        return false;
    }
    boolean result = setTimeZone(timeZone);
    return result;
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
            // Serial.println(F("Parsing input failed!"));
        } else {
            const char* result2 = myObject["timezone"];
            result = String(result2);
        }
    }
    http.end();

    return result;
}