#include <TinyGPS++.h>
#include <ArduinoOTA.h>
#include <WiFiUdp.h>
#include <Timezone.h>
#include <TimeLib.h>
#include <Adafruit_NeoPixel.h>
#include <ESP32TimerInterrupt.h>

#include "Constants.h"
#include "RealTimeClock.h"
#include "Brightness.h"

int RTC_hours, RTC_minutes, RTC_seconds, RTC_day, RTC_month, RTC_year, RTC_day_of_week;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, WS_PIN, NEO_GRB + NEO_KHZ800);

// the number of the PWM pin
const int PWMPin = 13;  // GPIO23

// Пины выводов управления дешифратором
int A = 15;
int B = 5;
int C = 18;
int D = 19;
//Анод 1
int Anod_1 = 26;
//Анод 2
int Anod_2 = 25;
//Анод 3
int Anod_3 = 33;
//Анод 4
int Anod_4 = 32;
//Точки между сигментами
int Toch = 14;

// Строка для отображения
String stringToDisplay = "123456";
// аноды по порядку hh:mm:ss
int anodesSequence[4] = {Anod_1, Anod_2, Anod_3, Anod_4};

#define gpsSerial Serial2
TinyGPSPlus gps;

char inputString[2];

int i = 0;

void doIndication();
void getDataGps();
String updateDisplayString();
String getTimeNow();
time_t ukraineTime();
String PreZero(int digit);
void setNumber(int num);

ESP32Timer ITimer0(0);
#define TIMER0_INTERVAL_MS  4000

void setup(){
  // configure PWM functionalitites
  ledcSetup(PWMChannel, freq, resolution);
  // attach the channel to the GPIO to be controlled
  ledcAttachPin(PWMPin, PWMChannel);
  ledcWrite(PWMChannel, defaultDuty);

  setupRTC();

  //устанавливаем режим Input Output
  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(C, OUTPUT);
  pinMode(D, OUTPUT);
  pinMode(voltPin, INPUT);
  pinMode(lighSensor1Pin, INPUT);
  pinMode(lighSensor2Pin, INPUT);

  pinMode(Anod_1, OUTPUT);
  pinMode(Anod_2, OUTPUT);
  pinMode(Anod_3, OUTPUT);
  pinMode(Anod_4, OUTPUT);
  pinMode(Toch, OUTPUT);

  gpsSerial.begin(9600);

  Serial.begin(115200);

  // if (ITimer0.attachInterruptInterval(TIMER0_INTERVAL_MS , TimerHandler0))
  //   Serial.println("Starting  ITimer0 OK, millis() = " + String(millis()));
  // else
  //   Serial.println("Can't set ITimer0. Select another freq. or timer");

  //WS2812
 strip.begin();
 strip.setBrightness(255);    // яркость, от 0 до 255
 for (int i = 0; i < NUM_LEDS; i++ ) {   // от 0 до первой трети
   strip.setPixelColor(i, 0xffffff);     // залить
   strip.show();                         // отправить на ленту
   delay(10);                          // очистить
 }
  Serial.println("ESP32 clock started");
}

void loop() {
  static unsigned long lastTimeRTCSync = 0;
    // Serial.println("ESP32 clock started");
  if (millis() - lastTimeRTCSync > 10000 || lastTimeRTCSync == 0) {
    getRTCTime(RTC_seconds, RTC_minutes, RTC_hours, RTC_day_of_week, RTC_day, RTC_month, RTC_year);
    // Serial.print(RTC_minutes);
    // Serial.print(":");
    // Serial.println(RTC_seconds);
    Serial.println(analogRead(voltPin));
    setTime(RTC_hours, RTC_minutes, RTC_seconds, RTC_day, RTC_month, RTC_year);
    lastTimeRTCSync = millis();
  }

  adjustBrightness();

 // stringToDisplay = "00" + String(analogRead(voltPin));
  stringToDisplay = updateDisplayString();

  doIndication();

  TimerHandler0();
  adjustBrightness();

  getDataGps();
 }

 void doIndication() {
  static byte anodesGroup = 0;
  static unsigned long lastTimeInterval1Started;

  digitalWrite(Toch, second() % 2 == 0);
  if ((micros() - lastTimeInterval1Started) < 3000)
    return ;
  lastTimeInterval1Started = micros();

  int anode = anodesSequence[anodesGroup];
  digitalWrite(anode, LOW);
  delayMicroseconds(600);
  anodesGroup = (anodesGroup + 1) % lampsCount;

  anode = anodesSequence[anodesGroup];
  i = stringToDisplay.substring(anodesGroup + 2, anodesGroup + 2 + 1).toInt();
  setNumber(i);

  digitalWrite(anode, HIGH);
}

void getDataGps() {
 static unsigned long lastTimeGPSSync = 0;
 while (gpsSerial.available() > 0){
    char c = gpsSerial.read();
    
    if (gps.encode(c)) {
      if (((millis())-lastTimeGPSSync) < 60000) {
        return ;
      }

      TinyGPSDate date = gps.date;
      TinyGPSTime time = gps.time;

      if (!time.isValid() || !date.isValid()) {
        return ;
      }

      byte hour = time.hour();
      byte minute = time.minute();
      byte second = time.second();

      byte day = date.day();
      byte month = date.month();
      int year = date.year();

      setRTCDateTime(hour, minute, second, day, month, year, 0);

      Serial.print("GPSTime Sync - ");
      Serial.print(hour);
      Serial.print(":");
      Serial.print(minute);
      Serial.print(":");
      Serial.print(second);
      Serial.print(" ### ");

      Serial.print(day);
      Serial.print("/");
      Serial.print(month);
      Serial.print("/");
      Serial.println(year);
      lastTimeGPSSync = millis();
    }
  }
}

String updateDisplayString()
{
  static unsigned long lastTimeStringWasUpdated;
  if (millis() - lastTimeStringWasUpdated > 1000 || lastTimeStringWasUpdated == 0)
  {
    lastTimeStringWasUpdated = millis();
    return getTimeNow();
  }
  return stringToDisplay;
}

String getTimeNow()
{
  time_t adjustedTime = ukraineTime();
  return PreZero(hour(adjustedTime)) + PreZero(minute(adjustedTime)) + PreZero(second(adjustedTime));
}

time_t ukraineTime() {
  static TimeChangeRule uaSummer = {"EDT", Last, Sun, Mar, 3, 180};  //UTC + 3 hours
  static TimeChangeRule uaWinter = {"EST", Last, Sun, Oct, 4, 120};  //UTC + 2 hours
  static Timezone uaUkraine(uaSummer, uaWinter);
  static int lastCorrectedHour = -1;
  static time_t deltaTime = 0;

  time_t utc = now();

  if (lastCorrectedHour != hour()) {
    TimeChangeRule *tcr;
    lastCorrectedHour = hour();
    uaUkraine.toLocal(utc, &tcr);
    deltaTime = tcr -> offset * 60;
  }

  return utc + deltaTime;
}

String PreZero(int digit)
{
  digit=abs(digit);
  if (digit < 10) return String("0") + String(digit);
  else return String(digit);
}

// Функцтя передачи цифры на дешифратор
void setNumber(int num)
{
  switch (num)
  {
    case 0:
      digitalWrite (A, LOW);
      digitalWrite (B, LOW);
      digitalWrite (C, LOW);
      digitalWrite (D, HIGH);
      break;
    case 9:
      digitalWrite (A, LOW);
      digitalWrite (B, LOW);
      digitalWrite (C, LOW);
      digitalWrite (D, LOW);
      break;
    case 8:
      digitalWrite (A, HIGH);
      digitalWrite (B, HIGH);
      digitalWrite (C, HIGH);
      digitalWrite (D, LOW);
      break;
    case 7:
      digitalWrite (A, HIGH);
      digitalWrite (B, LOW);
      digitalWrite (C, LOW);
      digitalWrite (D, HIGH);
      break;
    case 6:
      digitalWrite (A, HIGH);
      digitalWrite (B, LOW);
      digitalWrite (C, HIGH);
      digitalWrite (D, LOW);
      break;
    case 5:
      digitalWrite (A, LOW);
      digitalWrite (B, HIGH);
      digitalWrite (C, HIGH);
      digitalWrite (D, LOW);
      break;
    case 4:
      digitalWrite (A, LOW);
      digitalWrite (B, LOW);
      digitalWrite (C, HIGH);
      digitalWrite (D, LOW);
      break;
    case 3:
      digitalWrite (A, LOW);
      digitalWrite (B, HIGH);
      digitalWrite (C, LOW);
      digitalWrite (D, LOW);
      break;
    case 2:
      digitalWrite (A, HIGH );
      digitalWrite (B, LOW);
      digitalWrite (C, LOW);
      digitalWrite (D, LOW);
      break;
    case 1:
      digitalWrite (A, HIGH);
      digitalWrite (B, HIGH);
      digitalWrite (C, LOW);
      digitalWrite (D, LOW);
      break;
  }
}