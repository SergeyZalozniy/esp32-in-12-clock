#include <Arduino.h>

#include "Constants.h"

int dutyCycle = 100;
int volt;
int aimVoltage = (maxVoltage + minVoltage) / 2;

unsigned long lastTimeRTCSync2 = 0;

void IRAM_ATTR TimerHandler0(void) {
  volt = analogRead(voltPin);
  if (volt - aimVoltage > 5)
    dutyCycle  += 1;
  else if (volt - aimVoltage < 5)
    dutyCycle -= 1;

  dutyCycle = max(dutyCycle, 15);
  dutyCycle = min(dutyCycle, 240);
  ledcWrite(PWMChannel, dutyCycle);
}

void adjustBrightness() {
  if (millis() - lastTimeRTCSync2 < 250 && lastTimeRTCSync2 != 0) {
    return ;
  }
  lastTimeRTCSync2 = millis();

  int light = (analogRead(lighSensor1Pin) + analogRead(lighSensor2Pin)) / 2;
  int desireVolt = map(light, 500, 2400, minVoltage, maxVoltage);
  desireVolt = max(desireVolt, minVoltage);
  desireVolt = min(desireVolt, maxVoltage);

  aimVoltage = desireVolt;
}
