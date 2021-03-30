const int stripLedCount = 4;  // число диодов

const int lampsCount = 4; // Количество ламп

// esp32 PINs
const int voltPin = 34; // Напряжение Анода
const int lighSensor1Pin = 36; // Датчик света 1
const int lighSensor2Pin = 39; // Датчик света 2

const int i2csDataPin = 21;
const int i2csClockPin = 22;

const int ledStripPin = 23; 

// the number of the PWM pin
const int pwmPin = 13;

// Пины выводов управления дешифратором
const int decoder1Pin = 15;
const int decoder2Pin = 5;
const int decoder3Pin = 18;
const int decoder4Pin = 19;

const int anod1 = 26; //Анод 1
const int anod2 = 25; //Анод 2
const int anod3 = 33; //Анод 3
const int anod4 = 32; //Анод 4
const int toch = 14; //Точки между сигментами


// setting PWM properties
const int freq = 32000;
const int pwmChannel = 0;
const int resolution = 8;
const int defaultDuty = 100;

// Voltage regulation range
const int maxVoltage = 2050;
const int minVoltage = 1600;
