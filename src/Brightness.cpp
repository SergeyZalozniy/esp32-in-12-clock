#include <Arduino.h>

#include "Constants.h"

int dutyCycle = 100;
int aimVoltage = (maxVoltage + minVoltage) / 2;

void setupBrightness() {
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(pwmPin, pwmChannel);
  ledcWrite(pwmChannel, defaultDuty);

  pinMode(voltPin, INPUT);
  pinMode(lighSensor1Pin, INPUT);
  pinMode(lighSensor2Pin, INPUT);
}

void correctVoltage() {
  int volt = analogRead(voltPin);
  if (volt - aimVoltage > 5)
    dutyCycle  += 1;
  else if (volt - aimVoltage < 5)
    dutyCycle -= 1;

  dutyCycle = max(dutyCycle, 15);
  dutyCycle = min(dutyCycle, 240);
  ledcWrite(pwmChannel, dutyCycle);
}

void adjustBrightness() {
  unsigned long lastTimeRTCSync2 = 0;
  correctVoltage();

  if (millis() - lastTimeRTCSync2 < 100 && lastTimeRTCSync2 != 0) {
    return ;
  }
  lastTimeRTCSync2 = millis();

  int light = (analogRead(lighSensor1Pin) + analogRead(lighSensor2Pin)) / 2;
  int desireVolt = map(light, 500, 2400, minVoltage, maxVoltage);
  desireVolt = max(desireVolt, minVoltage);
  desireVolt = min(desireVolt, maxVoltage);
  // desireVolt = maxVoltage;

  aimVoltage = desireVolt;
}
