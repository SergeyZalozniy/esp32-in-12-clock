#include <Arduino.h>
#include <WiFiClient.h>
#include <WiFi.h>

#include "EEPROMHelper.h"
#include "Constants.h"

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
	byte tries = 11;

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

	while (hasPassword && --tries && WiFi.status() != WL_CONNECTED) {
		Serial.print(".");
		delay(1000);
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
		// connect = 1;
	}
}
