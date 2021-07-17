#include <Adafruit_NeoPixel.h>
#include <WiFiManager.h>

#include "Constants.h"
#include "RealTimeClock.h"
#include "Brightness.h"
#include "GPSTime.h"
#include "Indication.h"
#include "LocalTime.h"

enum ClockState { 
  time,
  transition,
  date
};

Adafruit_NeoPixel strip = Adafruit_NeoPixel(stripLedCount, ledStripPin, NEO_RGB + NEO_KHZ800);
String getStringToDisplay(bool &lowDot, bool &upDot);
String getTransitionStep(String from, String to, byte iteration);

ClockState state = time;

WiFiManager wifiManager;

void setup(){
  setupBrightness();
  setupRTC();
  setupGPS();
  setupIndication();

  Serial.begin(115200);

  strip.begin();
  strip.setBrightness(255);    // яркость, от 0 до 255
  for (int i = 0; i < stripLedCount; i++ ) {   // от 0 до первой трети
    strip.setPixelColor(i, 0);     // залить
  }
  strip.show();                         // отправить на ленту
  delay(10);                          // очистить
  Serial.println("ESP32 clock started");
  wifiManager.autoConnect("Clock", "nixie");
}

void loop() {
  syncRTCWithInternalTime();
  bool lowDot = false;
  bool upDot = false;
  String stringToDisplay = getStringToDisplay(lowDot, upDot);

  doIndication(stringToDisplay, lowDot, upDot);

  adjustBrightness();
  syncGPSTimeWithRTC();
}

String getStringToDisplay(bool &lowDot, bool &upDot) {
  static String currentStringToDisplay = "";
  static ClockState transitionToState;
  static unsigned long lastTimeStateChanged = 0;

  switch (state) {
  case time:
    if (millis() - lastTimeStateChanged > 10000)  {
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
    lowDot = false;
    upDot = true;
    if (millis() - lastTimeTransitionIteration < 90)  {
      return currentStringToDisplay;
    }

    String toValue = "";
    switch (transitionToState) {
    case time:
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
      transitionToState = time;
      lastTimeStateChanged = millis();
    }
    currentStringToDisplay = getCachedDateString();
    lowDot = false;
    upDot = true;
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