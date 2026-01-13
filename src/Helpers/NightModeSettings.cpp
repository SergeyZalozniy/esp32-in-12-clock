#include "NightModeSettings.h"
#include "EEPROMHelper.h"

// Helper function to parse time string (HH:mm format) into hours and minutes
void parseTime(const String& timeStr, int& hours, int& minutes) {
    int colonIndex = timeStr.indexOf(':');
    if (colonIndex > 0) {
        hours = timeStr.substring(0, colonIndex).toInt();
        minutes = timeStr.substring(colonIndex + 1).toInt();
    } else {
        hours = 0;
        minutes = 0;
    }
}

// Helper function to convert time to minutes since midnight
int timeToMinutes(int hours, int minutes) {
    return hours * 60 + minutes;
}

// Check if current time is within night mode range
// Handles both same-day ranges (e.g., 10:00-18:00) and overnight ranges (e.g., 22:00-07:00)
bool shouldChangeToNightMode(const NightModeSettings& settings, int currentHour, int currentMinute) {
    // If night mode is not enabled, return false
    if (!settings.enabled) {
        return false;
    }

    // Parse start and end times
    int startHour, startMin, endHour, endMin;
    parseTime(settings.startTime, startHour, startMin);
    parseTime(settings.endTime, endHour, endMin);

    // Convert all times to minutes since midnight for easier comparison
    int currentMinutes = timeToMinutes(currentHour, currentMinute);
    int startMinutes = timeToMinutes(startHour, startMin);
    int endMinutes = timeToMinutes(endHour, endMin);

    // Check if the time range spans midnight (e.g., 22:00 to 07:00)
    if (startMinutes > endMinutes) {
        // Overnight range: active if current time is after start OR before end
        return (currentMinutes >= startMinutes) || (currentMinutes < endMinutes);
    } else {
        // Same-day range: active if current time is between start and end
        return (currentMinutes >= startMinutes) && (currentMinutes < endMinutes);
    }
}

// Overloaded version that accepts time array from getTime()
// timeArray format: [hours_tens, hours_ones, minutes_tens, minutes_ones]
bool shouldChangeToNightMode(int* timeArray) {
    NightModeSettings settings = getNightModeSettings();
    // Convert time array to hours and minutes
    int currentHour = timeArray[0] * 10 + timeArray[1];
    int currentMinute = timeArray[2] * 10 + timeArray[3];

    // Call the main implementation
    return shouldChangeToNightMode(settings, currentHour, currentMinute);
}