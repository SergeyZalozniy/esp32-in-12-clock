 #include <Arduino.h>

 #include "../Helpers/Constants.h"

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
    pinMode(toch2, OUTPUT);
    #endif
 }
 
 
 void doIndication(String valueToDisplay, bool lowDot, bool upDot) {
  #ifdef VERSION_2
  digitalWrite(toch2, upDot);
  #endif

  digitalWrite(toch, lowDot);
  if ((micros() - lastTimeInterval1Started) < 2500)
    return ;

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
  #ifdef VERSION_2
  digitalWrite(toch2, false);
  #endif
}

void setNumber(int digit) {
  #ifdef VERSION_FIRST
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
  #endif

  #ifdef VERSION_2
  switch (digit)
  {
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
      digitalWrite (decoder1Pin, HIGH );
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