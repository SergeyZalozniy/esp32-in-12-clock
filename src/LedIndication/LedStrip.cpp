#include <Adafruit_NeoPixel.h>

#include "Helpers/Constants.h"

Adafruit_NeoPixel strip;
bool stripIsActive = false;
unsigned long lastRainbowChange = 0;
uint16_t j;

uint32_t wheel(byte WheelPos);

void setupLedStrip() {
    pinMode(ledStripPin, OUTPUT);
    strip = Adafruit_NeoPixel(stripLedCount, ledStripPin, NEO_RGB + NEO_KHZ800);
    strip.begin();
    strip.setBrightness(0);    // яркость, от 0 до 255
    for (int i = 0; i < stripLedCount; i++ ) {   // от 0 до первой трети
        strip.setPixelColor(i, 0);     // залить  0xffffff
    }
    strip.show();                         // отправить на ленту
    delay(10);                          // очистить
}

void turnOffLeds() {
    for (int i = 0; i < stripLedCount; i++ ) {   // от 0 до первой трети
        strip.setPixelColor(i, 0);     // залить  0xffffff
    }
    strip.setBrightness(0);
    strip.show();
    stripIsActive = false;
}

void updateLedColor(){
    if  (millis() - lastRainbowChange < 5) {
        return ;
    }

    if (!stripIsActive) {
        strip.setBrightness(255);
        stripIsActive = true;
    }

    for (int i = 0; i < strip.numPixels(); i++) {
        strip.setPixelColor(i, wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();

    j = (j + 1) % (256 * 5);
    lastRainbowChange = millis();
}

bool isLedStripActive() {
    return stripIsActive;
}

uint32_t wheel(byte pos) {
  if(pos < 85) {
   return strip.Color(pos * 3, 255 - pos * 3, 0);
  } else if(pos < 170) {
   pos -= 85;
   return strip.Color(255 - pos * 3, 0, pos * 3);
  } else {
   pos -= 170;
   return strip.Color(0, pos * 3, 255 - pos * 3);
  }
}