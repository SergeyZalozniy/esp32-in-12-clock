#include <TinyGPS.h>
#include <ArduinoOTA.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <Timezone.h>
#include <TimeLib.h>
#include <Adafruit_NeoPixel.h>
#include <ESP32TimerInterrupt.h>

#define WS_PIN 18       // пин DI
#define NUM_LEDS 4  // число диодов
long counter = 0;

int RTC_hours, RTC_minutes, RTC_seconds, RTC_day, RTC_month, RTC_year, RTC_day_of_week;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, WS_PIN, NEO_GRB + NEO_KHZ800);
  
// the number of the PWM pin
const int PWMPin = 13;  // GPIO23
int volt;
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
// Напряжение Анода
int Uolt = 34;
// Датчик света 1
int PH_1 = 36;
// Датчик света 2
int PH_2 = 39;
// Строка для отображения
String stringToDisplay = "123456";
// Количество ламп
#define lampsCount 4
// аноды по порядку hh:mm:ss
int anodesSequence[4] = {Anod_1, Anod_2, Anod_3, Anod_4};

#define gpsSerial Serial2
TinyGPS gps;

#define I2C_SDA 21
#define I2C_SCL 22
#define DS1307_ADDRESS 0x68
#define zero 0x00

char inputString[2];

// setting PWM properties
const int freq = 32000;
const int PWMChannel = 0;
const int resolution = 8;
int dutyCycle = 100;
int i = 0;


int maxVoltage = 1920;
int minVoltage = 1550;
int aimVoltage = (maxVoltage + minVoltage) / 2;

void IRAM_ATTR TimerHandler0(void)
{
  volt = analogRead(Uolt);
  if ((volt - aimVoltage) > 10) dutyCycle += 5;
  if ((volt - aimVoltage) < 10) dutyCycle -= 5;
  if ((volt - aimVoltage) > 5) dutyCycle  += 1;
  if ((volt - aimVoltage) < 5)  dutyCycle -= 1;
  if (dutyCycle < 15 )  dutyCycle = 15;  // верхний предел напряжения Анода
  if (dutyCycle > 250 ) dutyCycle = 250; // нижний предел напряжения Анода
  ledcWrite(PWMChannel, dutyCycle);
}
ESP32Timer ITimer0(0);
#define TIMER0_INTERVAL_MS  4000

void setup(){
  // configure PWM functionalitites
  ledcSetup(PWMChannel, freq, resolution);
  // attach the channel to the GPIO to be controlled
  ledcAttachPin(PWMPin, PWMChannel);
  ledcWrite(PWMChannel, dutyCycle);

  Wire.begin(I2C_SDA, I2C_SCL);

  //устанавливаем режим Input Output
  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(C, OUTPUT);
  pinMode(D, OUTPUT);
  pinMode(Uolt, INPUT);
  pinMode(PH_1, INPUT);
  pinMode(PH_2, INPUT);
  
  pinMode(Anod_1, OUTPUT);
  pinMode(Anod_2, OUTPUT);
  pinMode(Anod_3, OUTPUT);
  pinMode(Anod_4, OUTPUT);
  pinMode(Toch, OUTPUT);
  
  gpsSerial.begin(9600);

  Serial.begin(115200);

    // Interval in microsecs
  if (ITimer0.attachInterruptInterval(TIMER0_INTERVAL_MS , TimerHandler0))
    Serial.println("Starting  ITimer0 OK, millis() = " + String(millis()));
  else
    Serial.println("Can't set ITimer0. Select another freq. or timer");

  //WS2812
//  strip.begin();
//  strip.setBrightness(50);    // яркость, от 0 до 255
//  for (int i = 0; i < NUM_LEDS; i++ ) {   // от 0 до первой трети
//    strip.setPixelColor(i, 0);     // залить 
//    strip.show();                         // отправить на ленту
//    delay(10);                          // очистить
//  } 
  Serial.println("ESP32 clock started");  
}

void loop() {
  static unsigned long lastTimeRTCSync = 0;
  if (millis() - lastTimeRTCSync > 10000 || lastTimeRTCSync == 0) {
    getRTCTime();
    setTime(RTC_hours, RTC_minutes, RTC_seconds, RTC_day, RTC_month, RTC_year);
    lastTimeRTCSync = millis();
  }
  
  static unsigned long lastTimeRTCSync2 = 0;
  if (millis() - lastTimeRTCSync2 > 5000 || lastTimeRTCSync2 == 0) {
    Serial.print("Voltage - ");
    Serial.println(volt);
//    Serial.print("PH_1 - ");
//    Serial.println(analogRead(PH_1));
//    Serial.print("PH_2 - ");
//    Serial.println(analogRead(PH_2));
//    Serial.println(dutyCycle);
    int light = (analogRead(PH_2) + analogRead(PH_1)) / 2;
    int desireVolt = map(light, 500, 2400, minVoltage, maxVoltage);
    desireVolt = max(desireVolt, minVoltage);
    desireVolt = min(desireVolt, maxVoltage);
    Serial.println(light);
    Serial.println(desireVolt);
    aimVoltage = desireVolt;
    lastTimeRTCSync2 = millis();
  }
  
//  stringToDisplay = String(volt);
  stringToDisplay = updateDisplayString();
  doIndication();  
  
  getDataGps();
//  // WS2812   
//  // заливаем трёмя цветами плавно
//
//    for (int i = 0; i < NUM_LEDS; i++ ) {   // от 0 до первой трети
//    strip.setPixelColor(i, counter );     // залить 
//    strip.show();                         // отправить на ленту
//    delay(10);
//
//  }
//  counter=counter+1000; 
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
 static unsigned long lastTimeGPSSync=0;
 while (gpsSerial.available() > 0){
    if (gps.encode(gpsSerial.read())) {
      if (((millis())-lastTimeGPSSync) < 60000) {
        return ;
      }
      Serial.println("GPSTime Sync");
      lastTimeGPSSync=millis();
      byte month, day, hour, minute, second, hundredths;
      int year;
      unsigned long age;
      gps.crack_datetime(&year, &month, &day, &hour, &minute, &second, &hundredths, &age);
      setRTCDateTime(hour, minute, second, second, month, year, 0);
    }
  }
}


void setRTCDateTime(byte h, byte m, byte s, byte d, byte mon, byte y, byte w)
{
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero); //stop Oscillator

  Wire.write(decToBcd(s));
  Wire.write(decToBcd(m));
  Wire.write(decToBcd(h));
  Wire.write(decToBcd(w));
  Wire.write(decToBcd(d));
  Wire.write(decToBcd(mon));
  Wire.write(decToBcd(y));

  Wire.write(zero); //start

  Wire.endTransmission();

}

byte decToBcd(byte val) {
  return ( (val / 10 * 16) + (val % 10) );
}

byte bcdToDec(byte val)  {
  return ( (val / 16 * 10) + (val % 16) );
}

void getRTCTime()
{
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero);
  Wire.endTransmission();

  Wire.requestFrom(DS1307_ADDRESS, 7);

  RTC_seconds = bcdToDec(Wire.read());
  RTC_minutes = bcdToDec(Wire.read());
  RTC_hours = bcdToDec(Wire.read() & 0b111111); //24 hour time
  RTC_day_of_week = bcdToDec(Wire.read()); //0-6 -> sunday - Saturday
  RTC_day = bcdToDec(Wire.read());
  RTC_month = bcdToDec(Wire.read());
  RTC_year = bcdToDec(Wire.read());
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
    time_t tmpTime = uaUkraine.toLocal(utc, &tcr);
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
 
