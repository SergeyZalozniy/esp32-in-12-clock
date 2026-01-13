#include <Arduino.h>

#include "../Helpers/Constants.h"
#include "../Helpers/EEPROMHelper.h"

int dutyCycle = 192;
int aimVoltage = (maxVoltage + minVoltage) / 2;
unsigned long lastTimeCheckLightSensor = 0;
unsigned long lastTimeUpdateVoltage = 0;

void setBrightnessPercent(int percent);

void setupBrightness() {
  // ESP32 Arduino Core 3.x API
  setBrightnessPercent(readBrightness());

  ledcAttach(pwmPin, freq, resolution);
  ledcWrite(pwmPin, defaultDuty);

  pinMode(voltPin, INPUT);
  pinMode(lighSensor1Pin, INPUT);
  pinMode(lighSensor2Pin, INPUT);
}

void setAimVoltage(int voltage) {
  aimVoltage = voltage;
}

void setBrightnessPercent(int percent) {
  percent = constrain(percent, 0, 100);
  int voltage = map(percent, 0, 100, minVoltage, maxVoltage);
  setAimVoltage(voltage);
}

void forceCorrectVoltage() {
  int volt = analogRead(voltPin);
  if (volt - aimVoltage > 5)
    dutyCycle += 1;
  else if (volt - aimVoltage < 5)
    dutyCycle -= 1;

  dutyCycle = max(dutyCycle, 55);
  dutyCycle = min(dutyCycle, 240);
  ledcWrite(pwmPin, dutyCycle);
}

void turnOffPWM() {
  ledcWrite(pwmPin, 255);
}

void turnOnPWM() {
  ledcWrite(pwmPin, dutyCycle);
}

void correctVoltage() {
  if (millis() - lastTimeUpdateVoltage < 50) {
    return ;
  }

  lastTimeUpdateVoltage = millis();
  forceCorrectVoltage();
}