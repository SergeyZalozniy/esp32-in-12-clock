#include <Arduino.h>
#include <WiFiClient.h>
#include <WiFi.h>

#include "LampIndication/Indication.h"
#include "LampIndication/Brightness.h"
#include "LedIndication/LedStrip.h"
#include "Helpers/EEPROMHelper.h"
#include "Helpers/Constants.h"

boolean initialWifiStateChecked = false;
boolean wifiConnectedOnStart = false;
boolean apModeStarted = false;
unsigned long lastTimeWifiUpdated = 0;
unsigned long disconnectTime = 0;
unsigned long reconnectTime = 0;

bool startAPMode();
bool hasSavedWifiCredentials();
void tryConnectToWifi();

void handleWifiLoop() {
  if (millis() - lastTimeWifiUpdated < 1000) {
	return ;
  }

  if (millis() >= 10000 && !initialWifiStateChecked) {
	initialWifiStateChecked = true;
	wifiConnectedOnStart = WiFi.status() == WL_CONNECTED;
	if (!wifiConnectedOnStart && !apModeStarted) {
		startAPMode();
	} else {
		WiFi.setAutoReconnect(true);
	}
  }

  if (!initialWifiStateChecked) {
	return ;
  }

  boolean currentlyConnected = WiFi.status() == WL_CONNECTED;

  if (!currentlyConnected) {
	unsigned long lastReconnectAttempt = millis() - reconnectTime;
	if (lastReconnectAttempt > 15 * 60 * 1000 && hasSavedWifiCredentials()) { // every 15 minutes
		tryConnectToWifi();
		reconnectTime = millis();
	} else if (lastReconnectAttempt > 15 * 1000 && !apModeStarted) { // wait 15 sec before starting AP mode
		startAPMode();
	}
  }

  lastTimeWifiUpdated = millis();
}

bool startAPMode() {
	if (apModeStarted) {
		return true;
	}
	Serial.println(F("Starting AP mode"));

	WiFi.disconnect();
	WiFi.mode(WIFI_AP);
	IPAddress apIP(192, 168, 4, 1);

	WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
	WiFi.softAP(wifiName.c_str());
	apModeStarted = true;
	return true;
}

bool hasSavedWifiCredentials() {
	String ssid = readWifiSSID();
	return ssid != "";
}

void tryConnectToWifi() {
	apModeStarted = false;
	WiFi.mode(WIFI_STA);
	WiFi.setSleep(false);

	if (hasSavedWifiCredentials()) {
		String ssid = readWifiSSID();
		String password = readWifiPassword();
		WiFi.begin(ssid.c_str(), password.c_str());
	} else {
		startAPMode();
	}
}