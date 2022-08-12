#include <Arduino.h>

#include "../Helpers/Constants.h"
#include "Brightness.h"

int anodesSequence[] = {anod1, anod2, anod3, anod4};
unsigned long lastTimeInterval1Started = 0;
byte anodesGroup = 0;

 void setNumber(int digit);

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

    #ifdef VERSION_2
    pinMode(decimalPoint, OUTPUT);
    pinMode(toch2, OUTPUT);
    #endif
 }
 
 void doIndication(String valueToDisplay, bool lowDot, bool upDot) {
  if ((micros() - lastTimeInterval1Started) < 2673)
    return ;

  #ifdef VERSION_2
  digitalWrite(decimalPoint, LOW);
  digitalWrite(toch2, upDot);
  #endif

  digitalWrite(toch, lowDot);

  int anode = anodesSequence[anodesGroup];
  digitalWrite(anode, LOW);
  delayMicroseconds(650);
  anodesGroup = (anodesGroup + 1) % lampsCount;

  anode = anodesSequence[anodesGroup];
  int digit = valueToDisplay.substring(anodesGroup, anodesGroup + 1).toInt();
  setNumber(digit);
  digitalWrite(anode, HIGH);

  lastTimeInterval1Started = micros();
}

void turnOffIndication() {
  for (int i = 0; i < lampsCount; i++) {
    int anode = anodesSequence[anodesGroup];
    digitalWrite(anode, LOW);
  }

  digitalWrite(toch, false);
  setNumber(-1);
  #ifdef VERSION_2
  digitalWrite(toch2, false);
  #endif
}

void doLoadingIndication() {
  if (!hasDotDelimeter) {
    return ;
  }
  static boolean directionUp = true;
  if ((micros() - lastTimeInterval1Started) < 128000)
    return ;

  digitalWrite(decimalPoint, HIGH);
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
	setAimVoltage(minVoltage + (maxVoltage - minVoltage) * 0.85);
	while (millisElapse < seconds * 1000) {
		millisElapse = millis() - startTime;
		int number = (millisElapse / 100) % 10;
		String stringToDisplay = "";
		for (int i = 0; i < lampsCount; i++) {
			stringToDisplay += String(number);
		}
		forceCorrectVoltage();
		doIndication(stringToDisplay, true, true);
	}
	setAimVoltage((maxVoltage + minVoltage) / 2);
}

void setNumber(int digit) {
  #ifdef VERSION_FIRST
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

  #if VERSION >= 2
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
}