import { initToggleSwitch } from '@components/toggle-switch';
import { initFileUpload } from '@components/file-upload';
import { initTimezoneSelector } from '@components/timezone-selector';
import { initTimeModeSwitcher } from '@components/time-mode-switcher';
import { initBrightnessSlider } from '@components/brightness-slider';
import { initNightMode } from '@components/night-mode';
import infoIcon from '@assets/info-icon.svg';
import wifiIcon from '@assets/wifi-icon.svg';
import { WebSocketCommand } from '@services/websocketCommands';

const initClockSettings = () => {
  const container = document.querySelector('[data-page="clock"] .settings-content');

  if (!container) return;

  const timeModeContainer = document.createElement('div');
  const timezoneContainer = document.createElement('div');
  const brightnessContainer = document.createElement('div');
  const nightModeContainer = document.createElement('div');
  const advancedModeContainer = document.createElement('div');

  container.appendChild(timeModeContainer);
  container.appendChild(timezoneContainer);
  container.appendChild(brightnessContainer);
  container.appendChild(nightModeContainer);
  container.appendChild(advancedModeContainer);

  initToggleSwitch(
    advancedModeContainer,
    infoIcon,
    'advanced-mode',
    'advanced-mode-desc',
    true,
    (enabled: boolean) => {
      const nestedContainer = advancedModeContainer.querySelector('.settings-nested');
      if (nestedContainer) {
        if (enabled) {
          nestedContainer.classList.remove('settings-nested--hidden');
        } else {
          nestedContainer.classList.add('settings-nested--hidden');
        }
      }
    },
    WebSocketCommand.ADVANCED_MODE
  );

  const settingsSection = advancedModeContainer.querySelector('.settings-section');
  if (settingsSection) {
    const nestedContainer = document.createElement('div');
    nestedContainer.className = 'settings-nested flex flex-col gap-16';

    const gpsEnabledContainer = document.createElement('div');
    const fileUploadContainer = document.createElement('div');

    nestedContainer.appendChild(gpsEnabledContainer);
    nestedContainer.appendChild(fileUploadContainer);

    settingsSection.appendChild(nestedContainer);

    initToggleSwitch(
      gpsEnabledContainer,
      wifiIcon,
      'gps-enabled',
      'gps-enabled-desc',
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
};

initClockSettings();
