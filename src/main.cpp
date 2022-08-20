#include <Arduino.h>

#include "ezTime.h"
#include "QC3Control.h"

#include "Helpers/Constants.h"
#include "Helpers/EEPROMHelper.h"

#include "TimeCalculation/BuildTime.h"
#include "TimeCalculation/RealTimeClock.h"
#include "TimeCalculation/NTPTime.h"
#include "TimeCalculation/GPSTime.h"
#include "TimeCalculation/LocalTime.h"

#include "LampIndication/Brightness.h"
#include "LampIndication/Indication.h"

#include "WebService/WifiInit.h"
#include "WebService/WebSocket.h"
#include "WebService/WebService.h"

#include "LedIndication/LedStrip.h"

enum ClockState { 
  timeState,
  transition,
  date
};

String getStringToDisplay(bool &lowDot, bool &upDot);
String getTransitionStep(String from, String to, byte iteration);
ClockState state = timeState;
// QC3Control quickCharge(usbDataPlus, usbDataMinus);

void setup(){
  Serial.begin(115200);

  // quickCharge.begin(true);
  // quickCharge.set12V();

  setupEEPROM();
  setupLedStrip();
  setupIndication();
  setupBrightness();
  
  setupWifi();
  setupLocalTime();
  setupRTC();
  setupGPS();
  setupNTP();
  setupWebServer();
  setupWebSocket();
}

void loop() {
  handleClient();
  handleWebSocketClients();

  updateDesireVoltageWithLightSensor(); 

  if (state == transition) {
    correctVoltage();
  }

  syncRTCWithInternalTime();
  syncGPSTimeWithRTC();
  syncNTPTimeWithRTC();
  
  if (hasValidDateAndTime()) {
    bool lowDot = false, upDot = false;
    String stringToDisplay = getStringToDisplay(lowDot, upDot);
    doIndication(stringToDisplay, lowDot, upDot);
    if (isLedStripActive()) {
      turnOffLeds();
      doEnumerationAndCorrectVoltage(4);
    }
  } else {
    updateLedColor();
    doLoadingIndication();
    forceCorrectVoltage();
    if (!isLedStripActive()) { 
      turnOffIndication();
    }
  }
}

String getStringToDisplay(bool &lowDot, bool &upDot) {
  static String currentStringToDisplay = "";
  static ClockState transitionToState;
  static unsigned long lastTimeStateChanged = 0;

  switch (state) {
  case timeState:
    if (millis() - lastTimeStateChanged > 65000)  {
      state = transition;
      transitionToState = date;
      lastTimeStateChanged = millis();
    }
    currentStringToDisplay = getCachedTimeString();
    lowDot = second() % 2;
    upDot = second() % 2;
    break;
  case transition: {
    static byte iteration = 0;
    static unsigned long lastTimeTransitionIteration = 0;
    upDot = false;
    lowDot = true;

    if (millis() - lastTimeTransitionIteration < 90)  {
      return currentStringToDisplay;
    }

    String toValue = "";
    switch (transitionToState) {
    case timeState:
      toValue = getCachedTimeString();
      break;
    case date:
      toValue = getCachedDateString();
      break;
    default:
      break;
    }
    currentStringToDisplay = getTransitionStep(currentStringToDisplay, toValue, iteration);
    iteration++;
    lastTimeTransitionIteration = millis();
    if (currentStringToDisplay == toValue) {
      state = transitionToState;
      iteration = 0;
      lastTimeStateChanged = millis();
    }

    break;
  }
  case date:
     if (millis() - lastTimeStateChanged > 5000)  {
      state = transition;
      transitionToState = timeState;
      lastTimeStateChanged = millis();
    }
    currentStringToDisplay = getCachedDateString();
    lowDot = true;
    upDot = false;
    break;
  }

  return currentStringToDisplay;
} 

String getTransitionStep(String from, String to, byte iteration) {
  if (from.length() != to.length()) {
    return from;
  }
  int count = from.length();
  String result = "";
  byte divChar = '9' + 1;
  for (int i = 0; i < count; i++) {
    byte curFrom = from[i];
    byte curTo = to[i];
    if (curFrom == curTo && iteration > 10) {
      result += char(curFrom);
    } else {
      if (curFrom == '9') {
        result += '0';
      } else {
        result += char((curFrom + 1) % divChar);
      }
    }
  }
  return result;
}