#include <Arduino.h>

#include "../Helpers/Constants.h"

int dutyCycle = 192;
int aimVoltage = (maxVoltage + minVoltage) / 2;
unsigned long lastTimeCheckLightSensor = 0;
unsigned long lastTimeUpdateVoltage = 0;

void setupBrightness() {
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(pwmPin, pwmChannel);
  ledcWrite(pwmChannel, defaultDuty);

  pinMode(voltPin, INPUT);
  pinMode(lighSensor1Pin, INPUT);
  pinMode(lighSensor2Pin, INPUT);
}

void setAimVoltage(int voltage) {
  aimVoltage = voltage;
}

void forceCorrectVoltage() {
  int volt = analogRead(voltPin);
  if (volt - aimVoltage > 5)
    dutyCycle  += 1;
  else if (volt - aimVoltage < 5)
    dutyCycle -= 1;

  dutyCycle = max(dutyCycle, 15);
  dutyCycle = min(dutyCycle, 240);
  ledcWrite(pwmChannel, dutyCycle);
}

void correctVoltage() {
  if (millis() - lastTimeUpdateVoltage < 50) {
    return ;
  }

  lastTimeUpdateVoltage = millis();
  forceCorrectVoltage();
}

void updateDesireVoltageWithLightSensor() {
  if (!hasLightSensor) {
    return ;
  }

  if (millis() - lastTimeCheckLightSensor < 10000 && lastTimeCheckLightSensor != 0) {
    return ;
  }

  lastTimeCheckLightSensor = millis();

  int light = max(analogRead(lighSensor1Pin), analogRead(lighSensor2Pin));
  int desireVolt = map(light, 500, 2400, minVoltage, maxVoltage);
  
  desireVolt = max(desireVolt, minVoltage);
  desireVolt = min(desireVolt, maxVoltage);

  setAimVoltage(desireVolt);
}