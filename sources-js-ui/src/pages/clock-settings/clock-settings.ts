import { initToggleSwitch } from "@components/toggle-switch";
import { initFileUpload } from "@components/file-upload";
import { initTimezoneSelector } from "@components/timezone-selector";
import { initTimeModeSwitcher } from "@components/time-mode-switcher";
import { initBrightnessSlider } from "@components/brightness-slider";
import { initNightMode } from "@components/night-mode";
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

          <div class="custom-time__timestamp" id="custom-time-timestamp" style="display: none;">
            <span class="custom-time__timestamp-label" data-i18n="timestamp">Timestamp:</span>
            <span class="custom-time__timestamp-value" id="custom-time-timestamp-value"></span>
          </div>
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

    // Display timestamp
    const timestampContainer = containerElement.querySelector(
      "#custom-time-timestamp"
    ) as HTMLElement;
    const timestampValue = containerElement.querySelector(
      "#custom-time-timestamp-value"
    ) as HTMLElement;

    if (timestampContainer && timestampValue) {
      timestampValue.textContent = String(timestamp);
      timestampContainer.style.display = "block";
    }
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

    const titleElement = containerElement.querySelector(
      ".settings-section__title"
    );
    const descElement = containerElement.querySelector(
      ".settings-section__description"
    );

    if (titleElement) {
      const icon = titleElement.querySelector("img");
      const iconHTML = icon ? icon.outerHTML : "";
      titleElement.innerHTML = `${iconHTML}${newTitle}`;
    }

    if (descElement) {
      descElement.textContent = newDescription;
    }
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
  const advancedModeContainer = document.createElement("div");

  container.appendChild(timeModeContainer);
  container.appendChild(timezoneContainer);
  container.appendChild(brightnessContainer);
  container.appendChild(nightModeContainer);
  container.appendChild(customTimeContainer);
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
};

initClockSettings();
