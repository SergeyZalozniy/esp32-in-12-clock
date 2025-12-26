#include <Arduino.h>

#include "ezTime.h"

#include "../Helpers/Constants.h"
#include "../TimeCalculation/LocalTime.h"
#include "Brightness.h"
#include "Indication.h"

const int anodesSequence[lampsCount] = {anod4, anod3, anod2, anod1};
unsigned long lastTimeInterval1Started = 0;
byte anodesGroup = 0;
volatile ClockState state = transition;
static int seconds[lampsCount];
int* digitsToDisplay = seconds;

 void setNumber(int digit);
 int* getTransitionStep(int *from, int *to, byte iteration);

 void setupIndication() {
    pinMode(decoder1Pin, OUTPUT);
    pinMode(decoder2Pin, OUTPUT);
    pinMode(decoder3Pin, OUTPUT);
    pinMode(decoder4Pin, OUTPUT);

    pinMode(anod1, OUTPUT);
    pinMode(anod2, OUTPUT);
    pinMode(anod3, OUTPUT);
    pinMode(anod4, OUTPUT);
    pinMode(toch, OUTPUT);

    #if VERSION >= 2
    pinMode(decimalPoint, OUTPUT);
    pinMode(toch2, OUTPUT);
    #endif
 }

ClockState getState() {
  return state;
}

int* getSeconds(bool &lowDot, bool &upDot) {
  static int seconds[lampsCount];
  lowDot = second() % 2;
  upDot = second() % 2;

  int number = second() % 10;
  for (int i = 0; i < lampsCount; i++) {
    seconds[i] = number;
  }
  return seconds;
}

int* getDigitsToDisplay(bool &lowDot, bool &upDot) {
  static ClockState transitionToState;
  static unsigned long lastTimeStateChanged = 0;

  switch (state) {
  case timeState:
    if (millis() - lastTimeStateChanged > 65000)  {
      state = transition;
      transitionToState = date;
      lastTimeStateChanged = millis();
    }
    digitsToDisplay = getCachedTime();
    lowDot = second() % 2;
    upDot = second() % 2;
    break;
  case transition: {
    static byte iteration = 0;
    static unsigned long lastTimeTransitionIteration = UINT_MAX;
    upDot = false;
    lowDot = true;

    if (millis() - lastTimeTransitionIteration < 90)  {
      return digitsToDisplay;
    }
    lastTimeTransitionIteration = millis();

    int* toValue;
    switch (transitionToState) {
    case timeState:
      toValue = getCachedTime();
      break;
    case date:
      toValue = getCachedDate();
      break;
    default:
      break;
    }
    digitsToDisplay = getTransitionStep(digitsToDisplay, toValue, iteration);
    iteration++;

    bool reachToValue = true;
    for (int i = 0; i < lampsCount; i++) {
      bool isEqual = digitsToDisplay[i] == toValue[i];
      reachToValue = reachToValue && isEqual;
    }
    
    if (reachToValue) {
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
    digitsToDisplay = getCachedDate();
    lowDot = true;
    upDot = false;
    break;
  }

  return digitsToDisplay;
} 

int* getTransitionStep(int *from, int *to, byte iteration) {
  static int result[lampsCount];
  for (int i = 0; i < lampsCount; i++) {
    int curFrom = from[i];
    int curTo = to[i];
    if (curFrom == curTo && iteration > 10) {
      result[i] = curFrom;
    } else {
      result[i] = (curFrom + 1) % 10;
    }
  }
  return result;
}

 void doIndication(int *digits, bool lowDot, bool upDot) {
  if ((micros() - lastTimeInterval1Started) < 3173)
    return ;
  lastTimeInterval1Started = micros();

  int anode = anodesSequence[anodesGroup];
  digitalWrite(anode, LOW);

  #if VERSION >= 2
  // digitalWrite(decimalPoint, LOW);
  digitalWrite(toch2, upDot);
  #endif

  digitalWrite(toch, lowDot);
  
  delayMicroseconds(500);
  anodesGroup = (anodesGroup + 1) % lampsCount;

  anode = anodesSequence[anodesGroup];
  setNumber(digits[anodesGroup]);

  digitalWrite(anode, HIGH);
}

void turnOffIndication() {
  for (int i = 0; i < lampsCount; i++) {
    int anode = anodesSequence[anodesGroup];
    digitalWrite(anode, LOW);
  }

  digitalWrite(toch, false);
  setNumber(-1);
  #if VERSION == 2
  digitalWrite(toch2, false);
  #endif
}

void doLoadingIndication() {
  static boolean directionUp = true;

  if (!hasDotDelimeter) {
    return ;
  }
  if ((micros() - lastTimeInterval1Started) < 128000)
    return ;

  // digitalWrite(decimalPoint, HIGH);
  int anode = anodesSequence[anodesGroup];
  
  digitalWrite(anode, LOW);
  if (directionUp) {
    anodesGroup = anodesGroup + 1;
    directionUp = (anodesGroup < (lampsCount - 1));
  } else {
    anodesGroup = anodesGroup - 1;
    directionUp = (anodesGroup <= 0);
  }
  
  anode = anodesSequence[anodesGroup];
  digitalWrite(anode, HIGH);

  lastTimeInterval1Started = micros();
}

void doEnumerationAndCorrectVoltage(int seconds) {
  unsigned long startTime = millis();
	unsigned long millisElapse = 0;
  int digits[lampsCount];
	setAimVoltage(minVoltage + (maxVoltage - minVoltage) * 0.85);
	while (millisElapse < seconds * 1000) {
		millisElapse = millis() - startTime;
		int number = (millisElapse / 100) % 10;
		for (int i = 0; i < lampsCount; i++) {
			digits[i] = number;
		}
		forceCorrectVoltage();
		doIndication(digits, true, true);
	}
	setAimVoltage((maxVoltage + minVoltage) / 2);
}

void setNumber(int digit) {
  #if VERSION == 1
  switch (digit) {
    case -1:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, HIGH);
    break;
    case 0:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, HIGH);
      break;
    case 9:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 8:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 7:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, HIGH);
      break;
    case 6:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 5:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 4:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 3:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 2:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 1:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
  }
  #endif

  #if VERSION == 2
  switch (digit)
  {
    case -1:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, HIGH);
    break;
    case 0:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, HIGH);
      break;
    case 9:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 8:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 7:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 6:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 5:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 4:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 3:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, HIGH);
      break;
    case 2:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      break;
    case 1:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      break;
  }
  #endif

  #if VERSION == 3
  switch (digit % 10)
  {
    case -1:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, HIGH);
      digitalWrite (decimalPoint, LOW);
      break;
    case 0:
      digitalWrite (decimalPoint, HIGH);
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, HIGH);
      break;
    case 9:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
    case 8:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
    case 7:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
    case 6:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
    case 5:
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
    case 4:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
    case 3:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, HIGH);
      digitalWrite (decimalPoint, LOW);
      break;
    case 2:
      digitalWrite (decoder1Pin, HIGH);
      digitalWrite (decoder2Pin, HIGH);
      digitalWrite (decoder3Pin, HIGH);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
    case 1: // 
      digitalWrite (decoder1Pin, LOW);
      digitalWrite (decoder2Pin, LOW);
      digitalWrite (decoder3Pin, LOW);
      digitalWrite (decoder4Pin, LOW);
      digitalWrite (decimalPoint, LOW);
      break;
  }
  #endif
}