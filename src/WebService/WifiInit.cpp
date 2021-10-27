#include <Arduino.h>
#include <WiFiClient.h>
#include <WiFi.h>

#include "LampIndication/Indication.h"
#include "LampIndication/Brightness.h"

#include "Helpers/EEPROMHelper.h"
#include "Helpers/Constants.h"

void tryConnectToWifi();

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

	Serial.println("Wifi:");
	Serial.print("Network - ");
	Serial.println(ssid);
	Serial.print("Password - ");
	Serial.println(password);

	if (hasPassword) {
		tryConnectToWifi();
	}

	if (WiFi.status() != WL_CONNECTED) {
		// Если не удалось подключиться запускаем в режиме AP
		Serial.println("");
		Serial.println("WiFi up AP");
		StartAPMode();
		// connect = 0;
		IPAddress myIP = WiFi.softAPIP();
		Serial.print("AP IP address: ");
		Serial.println(myIP);
	} else {
		// Иначе удалось подключиться отправляем сообщение
		// о подключении и выводим адрес IP
		Serial.println("");
		Serial.println("WiFi connected");
		Serial.println("IP address: ");
		Serial.println(WiFi.localIP());
	}
}

void tryConnectToWifi() {
	long startTime = millis();
	long millisElapse = 0;
	setAimVoltage(minVoltage + (maxVoltage - minVoltage) * 0.85);
	while (WiFi.status() != WL_CONNECTED && millisElapse < 10000) {
		millisElapse = millis() - startTime;
		int number = (millisElapse / 100) % 10;
		String stringToDisplay = "";
		for (int i = 0; i < lampsCount; i++) {
			stringToDisplay += String(number);
		}
		forceCorrectVoltage();
		doIndication(stringToDisplay, true, true);
	}
	setAimVoltage((maxVoltage + minVoltage) / 2);
	turnOffIndication();
}