import { initToggleSwitch } from "@components/toggle-switch";
import { initFileUpload } from "@components/file-upload";
import { initTimezoneSelector } from "@components/timezone-selector";
import { initTimeModeSwitcher } from "@components/time-mode-switcher";
import { initBrightnessSlider } from "@components/brightness-slider";
import { initNightMode } from "@components/night-mode";
import { initCustomColor } from "@components/custom-color";
import infoIcon from "@assets/info-icon.svg";
import wifiIcon from "@assets/wifi-icon.svg";
import { WebSocketCommand } from "@services/websocketCommands";
import { translations } from "@utils/translate";
import { getLanguage } from "@utils/getLanguage.ts";
import { websocketService } from "@services/websocket";
import "./custom-time.scss";

const initCustomTime = (containerElement: HTMLElement) => {
  const lang = getLanguage();
  const title = translations["custom-time"]?.[lang] || "Custom Time";
  const description =
    translations["custom-time-desc"]?.[lang] ||
    "Set custom date and time for the clock";

  // Get current date and time
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentHours = String(now.getHours()).padStart(2, "0");
  const currentMinutes = String(now.getMinutes()).padStart(2, "0");
  const currentSeconds = String(now.getSeconds()).padStart(2, "0");

  containerElement.innerHTML = `
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="custom-time">
        <img src="${infoIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
        ${title}
      </h3>
      <p class="settings-section__description" data-i18n="custom-time-desc">
        ${description}
      </p>

      <div class="custom-time">
        <div class="custom-time__toggle flex gap-8">
          <button class="custom-time__toggle-btn custom-time__toggle-btn--active flex-1" data-mode="auto" data-i18n="automatic">
            ${translations["automatic"]?.[lang] || "Automatic"}
          </button>
          <button class="custom-time__toggle-btn flex-1" data-mode="manual" data-i18n="manual">
            ${translations["manual"]?.[lang] || "Manual"}
          </button>
        </div>
        <div class="custom-time__content">
          <div class="custom-time__date-group">
            <label class="custom-time__label" data-i18n="date">Date</label>
            <input
              type="date"
              class="custom-time__date-input"
              id="custom-date-input"
              value="${currentDate}"
            >
          </div>

          <div class="custom-time__time-group">
            <div class="custom-time__time-field">
              <label class="custom-time__label" data-i18n="hour">Hour</label>
              <input
                type="number"
                class="custom-time__time-input"
                id="custom-hour-input"
                min="0"
                max="23"
                value="${currentHours}"
                placeholder="00"
              >
            </div>
            <span class="custom-time__time-separator">:</span>
            <div class="custom-time__time-field">
              <label class="custom-time__label" data-i18n="minute">Minute</label>
              <input
                type="number"
                class="custom-time__time-input"
                id="custom-minute-input"
                min="0"
                max="59"
                value="${currentMinutes}"
                placeholder="00"
              >
            </div>
            <span class="custom-time__time-separator">:</span>
            <div class="custom-time__time-field">
              <label class="custom-time__label" data-i18n="second">Second</label>
              <input
                type="number"
                class="custom-time__time-input"
                id="custom-second-input"
                min="0"
                max="59"
                value="${currentSeconds}"
                placeholder="00"
              >
            </div>
          </div>

          <button class="custom-time__button" id="custom-time-submit" data-i18n="set-time">
            Set Time
          </button>
        </div>
      </div>
    </div>
  `;

  const dateInput = containerElement.querySelector(
    "#custom-date-input"
  ) as HTMLInputElement;
  const hourInput = containerElement.querySelector(
    "#custom-hour-input"
  ) as HTMLInputElement;
  const minuteInput = containerElement.querySelector(
    "#custom-minute-input"
  ) as HTMLInputElement;
  const secondInput = containerElement.querySelector(
    "#custom-second-input"
  ) as HTMLInputElement;
  const submitButton = containerElement.querySelector(
    "#custom-time-submit"
  ) as HTMLButtonElement;

  // Mode management
  let timeMode: "auto" | "manual" = "auto";
  let syncInterval: number | null = null;
  let isInputActive = false;

  const switchTimeMode = (mode: "auto" | "manual") => {
    timeMode = mode;

    // Update button states
    const toggleButtons = containerElement.querySelectorAll(
      ".custom-time__toggle-btn"
    );
    toggleButtons.forEach((button) => {
      const btnMode = button.getAttribute("data-mode");
      if (btnMode === mode) {
        button.classList.add("custom-time__toggle-btn--active");
      } else {
        button.classList.remove("custom-time__toggle-btn--active");
      }
    });

    // Update input states
    const inputs = [dateInput, hourInput, minuteInput, secondInput];
    inputs.forEach((input) => {
      if (input) {
        if (mode === "auto") {
          input.disabled = true;
          input.style.cursor = "not-allowed";
          input.style.opacity = "0.6";
        } else {
          input.disabled = false;
          input.style.cursor = "text";
          input.style.opacity = "1";
        }
      }
    });

    // Start or stop synchronization
    if (mode === "auto") {
      startAutoSync();
    } else {
      stopAutoSync();
    }
  };

  const updateTimeFromDevice = () => {
    if (timeMode !== "auto" || isInputActive) return;

    // For now, use browser's local time
    // In the future, this could be replaced with time from device via WebSocket
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentHours = String(now.getHours()).padStart(2, "0");
    const currentMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentSeconds = String(now.getSeconds()).padStart(2, "0");

    // Add animation class for visual feedback
    if (dateInput) {
      dateInput.classList.add("custom-time__date-input--syncing");
      setTimeout(() => {
        dateInput.classList.remove("custom-time__date-input--syncing");
      }, 1000);
    }

    const timeInputs = [hourInput, minuteInput, secondInput];
    timeInputs.forEach((input) => {
      if (input) {
        input.classList.add("custom-time__time-input--syncing");
        setTimeout(() => {
          input.classList.remove("custom-time__time-input--syncing");
        }, 1000);
      }
    });

    if (dateInput) dateInput.value = currentDate;
    if (hourInput) hourInput.value = currentHours;
    if (minuteInput) minuteInput.value = currentMinutes;
    if (secondInput) secondInput.value = currentSeconds;
  };

  const startAutoSync = () => {
    stopAutoSync(); // Clear any existing interval
    updateTimeFromDevice(); // Update immediately
    syncInterval = window.setInterval(() => {
      updateTimeFromDevice();
    }, 1000); // Update every second
  };

  const stopAutoSync = () => {
    if (syncInterval !== null) {
      clearInterval(syncInterval);
      syncInterval = null;
    }
  };

  // Initialize mode toggle buttons
  const toggleButtons = containerElement.querySelectorAll(
    ".custom-time__toggle-btn"
  );
  toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const mode = target.getAttribute("data-mode") as "auto" | "manual";
      switchTimeMode(mode);
    });
  });

  // Track input focus/blur for manual mode
  [dateInput, hourInput, minuteInput, secondInput].forEach((input) => {
    if (input) {
      input.addEventListener("focus", () => {
        if (timeMode === "manual") {
          isInputActive = true;
          stopAutoSync();
        }
      });

      input.addEventListener("blur", () => {
        if (timeMode === "manual") {
          isInputActive = false;
          // Don't restart auto sync in manual mode
        }
      });
    }
  });

  // Initialize with auto mode
  switchTimeMode("auto");

  const sendCustomTime = () => {
    if (!dateInput || !hourInput || !minuteInput || !secondInput) return;

    const date = dateInput.value;
    const hour = parseInt(hourInput.value, 10);
    const minute = parseInt(minuteInput.value, 10);
    const second = parseInt(secondInput.value, 10);

    // Validate inputs
    if (!date || isNaN(hour) || isNaN(minute) || isNaN(second)) {
      console.warn("Invalid date/time values");
      return;
    }

    if (
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59 ||
      second < 0 ||
      second > 59
    ) {
      console.warn("Time values out of range");
      return;
    }

    // Create Date object from inputs
    const dateTime = new Date(
      `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`
    );

    // Get Unix timestamp (seconds)
    const timestamp = Math.floor(dateTime.getTime() / 1000);

    console.log(
      `Setting custom time: ${dateTime.toISOString()} (timestamp: ${timestamp})`
    );
    websocketService.send(WebSocketCommand.CUSTOM_TIME, String(timestamp));
  };

  if (submitButton) {
    submitButton.addEventListener("click", sendCustomTime);
  }

  // Allow Enter key to submit
  [dateInput, hourInput, minuteInput, secondInput].forEach((input) => {
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          sendCustomTime();
        }
      });
    }
  });

  // Update translations when language changes
  window.addEventListener("languageChanged", () => {
    const newLang = getLanguage();
    const newTitle = translations["custom-time"]?.[newLang] || "Custom Time";
    const newDescription =
      translations["custom-time-desc"]?.[newLang] ||
      "Set custom date and time for the clock";
    const autoText = translations["automatic"]?.[newLang] || "Automatic";
    const manualText = translations["manual"]?.[newLang] || "Manual";

    const titleElement = containerElement.querySelector(
      ".settings-section__title"
    );
    const descElement = containerElement.querySelector(
      ".settings-section__description"
    );
    const toggleButtons = containerElement.querySelectorAll(
      ".custom-time__toggle-btn"
    );

    if (titleElement) {
      const icon = titleElement.querySelector("img");
      const iconHTML = icon ? icon.outerHTML : "";
      titleElement.innerHTML = `${iconHTML}${newTitle}`;
    }

    if (descElement) {
      descElement.textContent = newDescription;
    }

    // Update toggle button texts
    toggleButtons.forEach((button) => {
      const mode = button.getAttribute("data-mode");
      if (mode === "auto") {
        button.textContent = autoText;
      } else if (mode === "manual") {
        button.textContent = manualText;
      }
    });
  });
};

const initClockSettings = () => {
  const container = document.querySelector(
    '[data-page="clock"] .settings-content'
  );

  if (!container) return;

  const timeModeContainer = document.createElement("div");
  const timezoneContainer = document.createElement("div");
  const brightnessContainer = document.createElement("div");
  const nightModeContainer = document.createElement("div");
  const customTimeContainer = document.createElement("div");
  const customColorContainer = document.createElement("div");
  const advancedModeContainer = document.createElement("div");

  container.appendChild(timeModeContainer);
  container.appendChild(timezoneContainer);
  container.appendChild(brightnessContainer);
  container.appendChild(nightModeContainer);
  container.appendChild(customTimeContainer);
  container.appendChild(customColorContainer);
  container.appendChild(advancedModeContainer);

  initToggleSwitch(
    advancedModeContainer,
    infoIcon,
    "advanced-mode",
    "advanced-mode-desc",
    true,
    (enabled: boolean) => {
      const nestedContainer =
        advancedModeContainer.querySelector(".settings-nested");
      if (nestedContainer) {
        if (enabled) {
          nestedContainer.classList.remove("settings-nested--hidden");
        } else {
          nestedContainer.classList.add("settings-nested--hidden");
        }
      }
    },
    WebSocketCommand.ADVANCED_MODE
  );

  const settingsSection =
    advancedModeContainer.querySelector(".settings-section");
  if (settingsSection) {
    const nestedContainer = document.createElement("div");
    nestedContainer.className = "settings-nested flex flex-col gap-16";

    const gpsEnabledContainer = document.createElement("div");
    const fileUploadContainer = document.createElement("div");

    nestedContainer.appendChild(gpsEnabledContainer);
    nestedContainer.appendChild(fileUploadContainer);

    settingsSection.appendChild(nestedContainer);

    initToggleSwitch(
      gpsEnabledContainer,
      wifiIcon,
      "gps-enabled",
      "gps-enabled-desc",
      true,
      undefined,
      WebSocketCommand.GPS_ENABLED
    );

    initFileUpload(fileUploadContainer);
  }
  initTimeModeSwitcher(timeModeContainer);
  initTimezoneSelector(timezoneContainer);
  initBrightnessSlider(brightnessContainer);
  initNightMode(nightModeContainer);
  initCustomTime(customTimeContainer);
  initCustomColor(customColorContainer);
};

initClockSettings();
