#include <Arduino.h>
#include <EEPROM.h>

const int16_t timeZoneAddress = 50; // needs 50 bytes
const int ssidAddress = 100;
const int passwordAddress = 130;


String read(int address);
void write(String value, int address);

int16_t timeZoneCacheAddress() {
    return timeZoneAddress;
}

String readWifiSSID() {
    return read(ssidAddress);
}

void saveWifiSSID(String value) {
    write(value, ssidAddress);
}

String readWifiPassword() {
    return read(passwordAddress);
}

void saveWifiPassword(String value) {
    write(value, passwordAddress);
}

String read(int address) {
    EEPROM.begin(512);
    String value = EEPROM.readString(address);
    EEPROM.end();
    return value;
}

void write(String value, int address) {
    EEPROM.begin(512);
    EEPROM.writeString(address, value);
    EEPROM.commit();
    EEPROM.end();
}