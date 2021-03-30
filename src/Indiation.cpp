 #include <Arduino.h>

 #include "Constants.h"

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
 }
 
 void doIndication(String valueToDisplay, bool dots) {
  int anodesSequence[] = {anod1, anod2, anod3, anod4};
  static byte anodesGroup = 0;
  static unsigned long lastTimeInterval1Started = 0;

  digitalWrite(toch, dots);
  if ((micros() - lastTimeInterval1Started) < 3000)
    return ;

  int anode = anodesSequence[anodesGroup];
  digitalWrite(anode, LOW);
  delayMicroseconds(600);
  anodesGroup = (anodesGroup + 1) % lampsCount;

  anode = anodesSequence[anodesGroup];
  int digit = valueToDisplay.substring(anodesGroup, anodesGroup + 1).toInt();
  setNumber(digit);
  digitalWrite(anode, HIGH);

  lastTimeInterval1Started = micros();
}

void setNumber(int digit) {
  switch (digit) {
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
}