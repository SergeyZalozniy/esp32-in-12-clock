#include <Arduino.h>

enum ClockState { 
  timeState,
  transition,
  date
};

void setupIndication();
ClockState getState();
int* IRAM_ATTR getSeconds(bool &lowDot, bool &upDot);
int* IRAM_ATTR getDigitsToDisplay(bool &lowDot, bool &upDot);
void IRAM_ATTR doIndication(int *digits, bool lowDot, bool upDot);
void turnOffIndication();
void doLoadingIndication();
void doEnumerationAndCorrectVoltage(int);
void updateSecondsCache();
