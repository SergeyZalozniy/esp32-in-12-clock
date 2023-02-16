const int lampsCount = 4; // Количество ламп

const String wifiName = "Nixie Clock";
const int webSocketPort = 81;

#define VERSION 1
/* #### esp32 PINs  #### */
#if VERSION == 1
    const int stripLedCount = 4;  // число диодов
    const boolean hasDotDelimeter = false; // IN-12A - нет, IN-12B - да 
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

    const int decimalPoint = 2;
    const int anod1 = 26; //Анод 1
    const int anod2 = 25; //Анод 2
    const int anod3 = 33; //Анод 3
    const int anod4 = 32; //Анод 4
    const int toch = 14; //Точки между сигментами
    const bool hasLightSensor = true; 

    const int minVoltage = 1700;
    const int maxVoltage = 2050;
#endif

#if VERSION == 2
    #define VERSION_2
    const int stripLedCount = 4;  // число диодов
    const boolean hasDotDelimeter = false; // IN-12A - нет, IN-12B - да 
    const int voltPin = 34; // Напряжение Анода

    const int lighSensor1Pin = 36; // Датчик света 1
    const int lighSensor2Pin = 39; // Датчик света 2

    const int i2csDataPin = 21;
    const int i2csClockPin = 22;

    const int ledStripPin = 23; 

     // the number of the PWM pin
    const int pwmPin = 15;

    // Пины выводов управления дешифратором
    const int decoder1Pin = 19;
    const int decoder2Pin = 4;
    const int decoder3Pin = 5;
    const int decoder4Pin = 18;

    const int decimalPoint = 2;
    const int anod4 = 13; //Анод 4
    const int anod3 = 12; //Анод 3
    const int anod2 = 33; //Анод 2
    const int anod1 = 32; //Анод 1

    const int toch = 27; //Точки между сигментами низ
    const int toch2 = 26; //Точки между сигментами верх
    const bool hasLightSensor = false; 

    const int minVoltage = 1900;
    const int maxVoltage = 1900;
#endif

#if VERSION == 3
    const int stripLedCount = 8;  // число диодов
    const boolean hasDotDelimeter = false; // IN-4
    const int voltPin = 34; // Напряжение Анода

    const int lighSensor1Pin = 36; // Датчик света 1
    const int lighSensor2Pin = 39; // Датчик света 2

    const int i2csDataPin = 21;
    const int i2csClockPin = 22;

    const int ledStripPin = 23; 

     // the number of the PWM pin
    const int pwmPin = 15;

    // Пины выводов управления дешифратором
    const int decoder1Pin = 19;
    const int decoder2Pin = 4;
    const int decoder3Pin = 5;
    const int decoder4Pin = 18;

    const int decimalPoint = 2;
    const int anod4 = 13; //Анод 4
    const int anod3 = 12; //Анод 3
    const int anod2 = 33; //Анод 2
    const int anod1 = 32; //Анод 1

    const int toch = 27; //Точки между сигментами низ
    const int toch2 = 26; //Точки между сигментами верх
    const bool hasLightSensor = false; 

    const int usbDataPlus = 17;
    const int usbDataMinus = 16;

    const int minVoltage = 1800;
    const int maxVoltage = 2000;
#endif

/* #### esp32 PINs end  #### */


// setting PWM properties
const int freq = 32000;
const int pwmChannel = 0;
const int resolution = 8;
const int defaultDuty = 255;

// Voltage regulation range


