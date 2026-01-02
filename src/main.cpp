#include <Arduino.h>

#include "ezTime.h"

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

hw_timer_t * indicationTimer = NULL;
volatile bool initialVoltageCorrection = false;

void IRAM_ATTR onLampIndication() { 
  bool lowDot = false, upDot = false;
  int *digits;
  if (hasValidDateAndTime()) {
    digits = getDigitsToDisplay(lowDot, upDot);
  } else {
    digits = getSeconds(lowDot, upDot);
  }
  doIndication(digits, lowDot, upDot);
}

void setup(){
  Serial.begin(115200);
  setupEEPROM();
  setupIndication();
  setupBrightness();
  setupLedStrip();
  setupWifi();
  // turnOffLeds();

  turnOffPWM();
  
  setupLocalTime();
  setupRTC();
  setupGPS();
  setupNTP();
  setupWebServer();
  setupWebSocket();

  turnOnPWM();
  turnOffLeds();

  // Initialize cache before starting ISR
  updateTimeCache();
  updateSecondsCache();

  // ESP32 Arduino Core 3.x Timer API
  // Frequency = 80MHz / 40 / 100 = 20kHz → period = 50μs
  // We want 10kHz (100μs period) so: 80MHz / 800 = 100kHz, then divide by 10 for 10kHz
  indicationTimer = timerBegin(10000); // 10kHz frequency
  timerAttachInterrupt(indicationTimer, &onLampIndication);
  timerAlarm(indicationTimer, 1, true, 0); // Trigger every 1 tick (100μs at 10kHz) 
}

void loop() {
  handleClient();
  handleWebSocketClients();

  updateDesireVoltageWithLightSensor();
  updateTimeCache();
  updateSecondsCache();

  syncRTCWithInternalTime();
  syncGPSTimeWithRTC();
  syncNTPTimeWithRTC();
  
  // if (isLedStripActive()) || !initialVoltageCorrection) {
  //   initialVoltageCorrection = true;
  //   doEnumerationAndCorrectVoltage(4);
  //   turnOffLeds();
  // }

    //   } else {
    //   updateLedColor();
    //   if (hasDotDelimeter) {
    //     doLoadingIndication();
    //     forceCorrectVoltage();
    //   } else {
    //     turnOffPWM();
    //   }
    //   if (!isLedStripActive()) { 
    //     turnOffIndication();
    //   }
    // }
  if (getState() == transition) {
    correctVoltage();
    turnOffLeds();
  }
}