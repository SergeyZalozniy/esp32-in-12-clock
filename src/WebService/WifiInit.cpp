#include <Arduino.h>
#include <WiFiClient.h>
#include <WiFi.h>

#include "LampIndication/Indication.h"
#include "LampIndication/Brightness.h"
#include "LedIndication/LedStrip.h"
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
	boolean hasSSID = ssid != "";
	if (!hasSSID) {
		WiFi.begin();
	} else {
		WiFi.begin(ssid.c_str(), password.c_str());
	}

	long startTime = millis();
	long millisElapse = 0;
	bool lowDot = false, upDot = false;
	while (WiFi.status() != WL_CONNECTED && millisElapse < 10000) {
		millisElapse = millis() - startTime;
		// updateLedColor();
		doEnumerationAndCorrectVoltage(1);
		// int *digits;
		// if (hasValidDateAndTime()) {
		// 	digits = getDigitsToDisplay(lowDot, upDot);
		// } else {
		// 	digits = getSeconds(lowDot, upDot);
		// }
		// doIndication(digits, lowDot, upDot);
		// correctVoltage();
	}

	if (WiFi.status() != WL_CONNECTED) {
		// Serial.println(F("WiFi up AP"));
		StartAPMode();
		IPAddress myIP = WiFi.softAPIP();
		// Serial.print(F("AP IP address: "));
		// Serial.println(myIP);
	} else {
		// Serial.println(F("WiFi connected"));
		// Serial.println(F("IP address: "));
		// Serial.println(WiFi.localIP());
	}
}