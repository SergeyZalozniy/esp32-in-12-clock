#include <Arduino.h>

void setupIndication();
void doIndication(String valueToDisplay, bool lowDot, bool upDot);
void turnOffIndication();
void doLoadingIndication();
void doEnumerationAndCorrectVoltage(int);