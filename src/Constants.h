#define WS_PIN 18  // пин DI
#define NUM_LEDS 4  // число диодов

#define I2C_SDA 21
#define I2C_SCL 22
#define DS1307_ADDRESS 0x68
#define zero 0x00

const int lampsCount = 4; // Количество ламп

// esp32 PINs
const int voltPin = 34; // Напряжение Анода
const int lighSensor1Pin = 36; // Датчик света 1
const int lighSensor2Pin = 39; // Датчик света 2

// setting PWM properties
const int freq = 32000;
const int PWMChannel = 0;
const int resolution = 8;
const int defaultDuty = 100;

// Voltage regulation range
const int maxVoltage = 2050;
const int minVoltage = 1550;
