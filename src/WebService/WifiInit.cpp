#include <Arduino.h>
#include <WiFiClient.h>
#include <WiFi.h>

#include "LampIndication/Indication.h"
#include "LampIndication/Brightness.h"

#include "Helpers/EEPROMHelper.h"
#include "Helpers/Constants.h"

bool StartAPMode() {
	IPAddress apIP(192, 168, 4, 1);
	WiFi.disconnect();
	WiFi.mode(WIFI_AP);

	WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
	WiFi.softAP(wifiName.c_str());
	return true;
}

void setupWifi() {
	WiFi.mode(WIFI_STA);
	WiFi.setSleep(false);
	String ssid = readWifiSSID();
	String password = readWifiPassword();
	boolean hasPassword = (ssid != "" && password != "");
	if (!hasPassword) {
		WiFi.begin();
	} else {
		WiFi.begin(ssid.c_str(), password.c_str());
	}

	Serial.println(F("Wifi:"));
	Serial.print(F("Network - "));
	Serial.println(ssid);
	Serial.print(F("Password - "));
	Serial.println(password);

	long startTime = millis();
	long millisElapse = 0;
	while (WiFi.status() != WL_CONNECTED && millisElapse < 10000) {
		millisElapse = millis() - startTime;
		doEnumerationAndCorrectVoltage(1);
	}
	turnOffIndication();

	if (WiFi.status() != WL_CONNECTED) {
		Serial.println(F("WiFi up AP"));
		StartAPMode();
		IPAddress myIP = WiFi.softAPIP();
		Serial.print(F("AP IP address: "));
		Serial.println(myIP);
	} else {
		Serial.println(F("WiFi connected"));
		Serial.println(F("IP address: "));
		Serial.println(WiFi.localIP());
	}
}