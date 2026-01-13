#ifndef NIGHT_MODE_SETTINGS_H
#define NIGHT_MODE_SETTINGS_H

#include <Arduino.h>

struct NightModeSettings {
// true | 22:00 | 07:00 | false | 30
  bool enabled;
  String startTime;
  String endTime;
  bool backLightDisable;
  int brightnessPercent;
};

// Helper function to check if current time is within night mode range
bool shouldChangeToNightMode(const NightModeSettings& settings, int currentHour, int currentMinute);

// Overloaded version that accepts time array from getTime()
// timeArray format: [hours_tens, hours_ones, minutes_tens, minutes_ones]
bool shouldChangeToNightMode(int* timeArray);

#endif
