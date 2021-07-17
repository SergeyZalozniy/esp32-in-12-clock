const int stripLedCount = 4;  // число диодов
const int lampsCount = 4; // Количество ламп


/* #### esp32 PINs  #### */

#define VERSION_2

#ifdef VERSION_FIRST
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
#endif

#ifdef VERSION_2
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

    const int anod1 = 13; //Анод 1
    const int anod2 = 12; //Анод 2
    const int anod3 = 33; //Анод 3
    const int anod4 = 32; //Анод 4

    const int toch = 27; //Точки между сигментами низ
    const int toch2 = 26; //Точки между сигментами верх
#endif

/* #### esp32 PINs end  #### */


// setting PWM properties
const int freq = 32000;
const int pwmChannel = 0;
const int resolution = 8;
const int defaultDuty = 255;

// Voltage regulation range
const int maxVoltage = 2100;
const int minVoltage = 1800;
