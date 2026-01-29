import { initToggleSwitch } from "@components/toggle-switch";
import { initFileUpload } from "@components/file-upload";
import { initTimezoneSelector } from "@components/timezone-selector";
import { initTimeModeSwitcher } from "@components/time-mode-switcher";
import { initBrightnessSlider } from "@components/brightness-slider";
import { initNightMode } from "@components/night-mode";
// import { initCustomColor } from "@components/custom-color";
import { initCustomTime } from "@components/custom-time";
import infoIcon from "@assets/info-icon.svg";
import wifiIcon from "@assets/wifi-icon.svg";
import { WebSocketCommand } from "@services/websocketCommands";

const initPageLoader = () => {
  // Create loader element
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = `
    <div class="page-loader__spinner"></div>
  `;
  document.body.appendChild(loader);

  // Show loader immediately
  loader.classList.add("page-loader--active");

  return {
    hide: () => {
      loader.classList.remove("page-loader--active");
      // Remove from DOM after animation
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 300);
    },
  };
};

const initClockSettings = () => {
  // Show page loader
  const loader = initPageLoader();

  const container = document.querySelector(
    '[data-page="clock"] .settings-content'
  );

  if (!container) {
    loader.hide();
    return;
  }

  const timeModeContainer = document.createElement("div");
  const timezoneContainer = document.createElement("div");
  const brightnessContainer = document.createElement("div");
  const nightModeContainer = document.createElement("div");
  const customTimeContainer = document.createElement("div");
  // BACKLIGHT COLOR COMMENTED OUT BECAUSE IT'S NOT USED
  // const customColorContainer = document.createElement("div");
  const advancedModeContainer = document.createElement("div");

  container.appendChild(timeModeContainer);
  container.appendChild(timezoneContainer);
  container.appendChild(brightnessContainer);
  container.appendChild(nightModeContainer);
  container.appendChild(customTimeContainer);
  // container.appendChild(customColorContainer);
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
  
  // Initialize all components
  initTimeModeSwitcher(timeModeContainer);
  initTimezoneSelector(timezoneContainer);
  initBrightnessSlider(brightnessContainer);
  initNightMode(nightModeContainer);
  initCustomTime(customTimeContainer);
  // initCustomColor(customColorContainer);

  // Hide loader after components are initialized
  // Add small delay to ensure DOM updates are complete
  requestAnimationFrame(() => {
    setTimeout(() => {
      loader.hide();
    }, 100);
  });
};

initClockSettings();
