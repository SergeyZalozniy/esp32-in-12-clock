#include <Arduino.h>
#include <EEPROM.h>

const int ssidAddress = 100;
const int passwordAddress = 130;

String readWifiSSID() {
    return EEPROM.readString(ssidAddress);
}

void saveWifiSSID(String value) {
    // char buff[30];
    // value.toCharArray(buff, 30);
    EEPROM.writeString(ssidAddress, value);
    EEPROM.commit();
    Serial.print("Save ssid: ");
    Serial.println(readWifiSSID());
}

String readWifiPassword() {
    return EEPROM.readString(passwordAddress);
}

void saveWifiPassword(String value) {
    // char buff[30];
    // value.toCharArray(buff, 30);
    EEPROM.writeString(passwordAddress, value);
    EEPROM.commit();
    Serial.print("Save password: ");
    Serial.println(readWifiPassword());
}