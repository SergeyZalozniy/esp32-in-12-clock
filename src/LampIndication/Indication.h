#include <Arduino.h>

enum ClockState { 
  timeState,
  transition,
  date
};

void setupIndication();
ClockState getState();
int* getSeconds(bool &lowDot, bool &upDot);
int* getDigitsToDisplay(bool &lowDot, bool &upDot);
void doIndication(int *digits, bool lowDot, bool upDot);
void turnOffIndication();
void doLoadingIndication();
void doEnumerationAndCorrectVoltage(int);
