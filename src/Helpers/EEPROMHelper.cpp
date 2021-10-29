#include <Arduino.h>
#include <EEPROM.h>

const int16_t timeZoneAddress = 50; // needs 50 bytes
const int ssidAddress = 100;
const int passwordAddress = 130;

int16_t timeZoneCacheAddress() {
    return timeZoneAddress;
}

String readWifiSSID() {
    return EEPROM.readString(ssidAddress);
}

void saveWifiSSID(String value) {
    EEPROM.writeString(ssidAddress, value);
    EEPROM.commit();
}

String readWifiPassword() {
    return EEPROM.readString(passwordAddress);
}

void saveWifiPassword(String value) {
    EEPROM.writeString(passwordAddress, value);
    EEPROM.commit();
}