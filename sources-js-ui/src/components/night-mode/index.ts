import './night-mode.scss';
import '@components/toggle-switch/toggle-switch.scss';
import infoIcon from '@assets/info-icon.svg';
import { translations } from '@utils/translate';
import { getData, updateData } from '@utils/data';
import { getLanguage } from '@utils/getLanguage.ts';
import { websocketService } from '@services/websocket';
import { WebSocketCommand } from '@services/websocketCommands';
import { formatNightModeData, parseNightModeData } from '@utils/nightModeUtils.ts';

const render = (
  containerElement: HTMLElement,
  startTime: string,
  endTime: string,
  brightness: number,
  disableBacklight: boolean
): void => {
  const lang = getLanguage();
  const title = translations['night-mode']?.[lang] || 'Night Mode';
  const description =
    translations['night-mode-desc']?.[lang] || 'Automatically reduce brightness during night hours';
  const startLabel = translations['start-time']?.[lang] || 'Start Time';
  const endLabel = translations['end-time']?.[lang] || 'End Time';
  const brightnessLabel = translations['night-brightness']?.[lang] || 'Night Brightness';
  const backlightLabel = translations['disable-backlight']?.[lang] || 'Disable Backlight';
  const backlightDesc =
    translations['disable-backlight-desc']?.[lang] || 'Turn off backlight during night mode';

  containerElement.innerHTML = `
    <div class="settings-section">
      <div class="settings-section__header flex items-start justify-between gap-16">
        <div class="flex-1 min-w-0">
          <h3 class="settings-section__title flex items-center gap-8" data-i18n="night-mode">
            <img src="${infoIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
            ${title}
          </h3>
          <p class="settings-section__description" data-i18n="night-mode-desc">
            ${description}
          </p>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" class="toggle-switch__checkbox">
          <span class="toggle-switch__toggle"></span>
        </label>
      </div>

      <div class="night-mode__time-range flex items-end gap-16">
        <div class="night-mode__time-group flex-col gap-8 flex-1">
          <label class="night-mode__time-label" data-i18n="start-time">${startLabel}</label>
          <input
            type="time"
            class="night-mode__time-input"
            data-type="start"
            value="${startTime}"
            disabled
          >
        </div>
        <div class="night-mode__time-separator flex-shrink-0">—</div>
        <div class="night-mode__time-group flex-col gap-8 flex-1">
          <label class="night-mode__time-label" data-i18n="end-time">${endLabel}</label>
          <input
            type="time"
            class="night-mode__time-input"
            data-type="end"
            value="${endTime}"
            disabled
          >
        </div>
      </div>

      <div class="night-mode__backlight-control">
        <div class="flex items-start justify-between gap-16">
          <div class="flex-1 min-w-0">
            <h4 class="night-mode__backlight-title" data-i18n="disable-backlight">${backlightLabel}</h4>
            <p class="night-mode__backlight-desc" data-i18n="disable-backlight-desc">${backlightDesc}</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" class="toggle-switch__checkbox night-mode__backlight-checkbox" ${disableBacklight ? 'checked' : ''} disabled>
            <span class="toggle-switch__toggle ${disableBacklight ? 'toggle-switch__toggle--active' : ''}"></span>
          </label>
        </div>
      </div>

      <div class="night-mode__brightness-control">
        <div class="night-mode__brightness-header flex items-center justify-between">
          <span class="night-mode__brightness-label" data-i18n="night-brightness">${brightnessLabel}</span>
          <span class="night-mode__brightness-value">${brightness}%</span>
        </div>
        <div class="night-mode__brightness-slider flex items-center">
          <div class="night-mode__brightness-track">
            <div class="night-mode__brightness-fill" style="width: ${brightness}%"></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value="${brightness}"
            class="night-mode__brightness-input"
            disabled
          >
        </div>
      </div>
    </div>
  `;
};

export const initNightMode = (containerElement: HTMLElement): void => {
  const serverData = getData();

  let isEnabled = serverData.nightMode.enabled;
  let startTime = serverData.nightMode.startTime;
  let endTime = serverData.nightMode.endTime;
  let debounceTimer: number | null = null;
  let brightness = serverData.nightMode.brightness;
  let disableBacklight = serverData.nightMode.disableBacklight;

  render(containerElement, startTime, endTime, brightness, disableBacklight);

  const toggle = containerElement.querySelector('.toggle-switch__toggle') as HTMLElement;
  const checkbox = containerElement.querySelector('.toggle-switch__checkbox') as HTMLInputElement;
  const timeRange = containerElement.querySelector('.night-mode__time-range') as HTMLElement;
  const startInput = containerElement.querySelector(
    '.night-mode__time-input[data-type="start"]'
  ) as HTMLInputElement;
  const endInput = containerElement.querySelector(
    '.night-mode__time-input[data-type="end"]'
  ) as HTMLInputElement;
  const brightnessControl = containerElement.querySelector(
    '.night-mode__brightness-control'
  ) as HTMLElement;
  const brightnessInput = containerElement.querySelector(
    '.night-mode__brightness-input'
  ) as HTMLInputElement;
  const brightnessValue = containerElement.querySelector(
    '.night-mode__brightness-value'
  ) as HTMLElement;
  const brightnessFill = containerElement.querySelector(
    '.night-mode__brightness-fill'
  ) as HTMLElement;
  const backlightControl = containerElement.querySelector(
    '.night-mode__backlight-control'
  ) as HTMLElement;
  const backlightToggle = backlightControl?.querySelector('.toggle-switch__toggle') as HTMLElement;
  const backlightCheckbox = containerElement.querySelector(
    '.night-mode__backlight-checkbox'
  ) as HTMLInputElement;

  if (brightnessControl) {
    if (!disableBacklight) {
      brightnessControl.style.display = 'none';
    }
  }

  const saveNightMode = (immediate = false): void => {
    console.log(
      `Night Mode: enabled=${isEnabled}, startTime=${startTime}, endTime=${endTime}, brightness=${brightness}%, disableBacklight=${disableBacklight}`
    );

    updateData({
      nightMode: {
        enabled: isEnabled,
        startTime: startTime,
        endTime: endTime,
        brightness: brightness,
        disableBacklight: disableBacklight
      }
    });

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const sendWebSocket = () => {
      const nightModeData = formatNightModeData(
        isEnabled,
        startTime,
        endTime,
        disableBacklight,
        brightness
      );
      websocketService.send(WebSocketCommand.NIGHT_MODE, nightModeData);
    };

    if (immediate) {
      sendWebSocket();
    } else {
      debounceTimer = window.setTimeout(() => {
        sendWebSocket();
        debounceTimer = null;
      }, 800);
    }
  };

  const updateToggleState = (): void => {
    if (toggle && checkbox) {
      if (isEnabled) {
        toggle.classList.add('toggle-switch__toggle--active');
        checkbox.checked = true;
      } else {
        toggle.classList.remove('toggle-switch__toggle--active');
        checkbox.checked = false;
      }
    }
  };

  const updateTimeInputsState = (): void => {
    if (timeRange) {
      if (isEnabled) {
        timeRange.classList.add('night-mode__time-range--active');
      } else {
        timeRange.classList.remove('night-mode__time-range--active');
      }
    }

    if (startInput) {
      startInput.disabled = !isEnabled;
    }

    if (endInput) {
      endInput.disabled = !isEnabled;
    }

    if (brightnessControl) {
      if (disableBacklight) {
        brightnessControl.style.display = 'block';
        if (isEnabled) {
          brightnessControl.classList.add('night-mode__brightness-control--active');
        } else {
          brightnessControl.classList.remove('night-mode__brightness-control--active');
        }
      } else {
        brightnessControl.classList.remove('night-mode__brightness-control--active');
        brightnessControl.style.display = 'none';
      }
    }

    if (brightnessInput) {
      brightnessInput.disabled = !isEnabled || !disableBacklight;
    }

    if (backlightControl) {
      if (isEnabled) {
        backlightControl.classList.add('night-mode__backlight-control--active');
      } else {
        backlightControl.classList.remove('night-mode__backlight-control--active');
      }
    }

    if (backlightCheckbox) {
      backlightCheckbox.disabled = !isEnabled;
    }
  };

  const handleToggle = (): void => {
    isEnabled = !isEnabled;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    updateToggleState();
    updateTimeInputsState();
    saveNightMode(true);
  };

  const handleTimeChange = (type: 'start' | 'end', value: string): void => {
    if (type === 'start') {
      startTime = value;
    } else {
      endTime = value;
    }
    saveNightMode();
  };

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      handleToggle();
    });
  }

  if (checkbox) {
    checkbox.addEventListener('change', (e) => {
      e.stopPropagation();
      handleToggle();
    });
  }

  if (startInput) {
    startInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.value) {
        target.value = '22:00';
        handleTimeChange('start', '22:00');
      } else {
        handleTimeChange('start', target.value);
      }
    });
  }

  if (endInput) {
    endInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.value) {
        target.value = '07:00';
        handleTimeChange('end', '07:00');
      } else {
        handleTimeChange('end', target.value);
      }
    });
  }

  const handleBrightnessChange = (value: number): void => {
    brightness = value;
    if (brightnessValue) {
      brightnessValue.textContent = `${brightness}%`;
    }
    if (brightnessFill) {
      brightnessFill.style.width = `${brightness}%`;
    }

    updateData({
      nightMode: {
        enabled: isEnabled,
        startTime: startTime,
        endTime: endTime,
        brightness: brightness,
        disableBacklight: disableBacklight
      }
    });

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(() => {
      const nightModeData = formatNightModeData(
        isEnabled,
        startTime,
        endTime,
        disableBacklight,
        brightness
      );
      websocketService.send(WebSocketCommand.NIGHT_MODE, nightModeData);
      debounceTimer = null;
    }, 800);
  };

  if (brightnessInput) {
    brightnessInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      handleBrightnessChange(Number(target.value));
    });
  }

  const handleBacklightToggle = (): void => {
    disableBacklight = !disableBacklight;
    if (backlightToggle) {
      if (disableBacklight) {
        backlightToggle.classList.add('toggle-switch__toggle--active');
      } else {
        backlightToggle.classList.remove('toggle-switch__toggle--active');
      }
    }
    if (backlightCheckbox) {
      backlightCheckbox.checked = disableBacklight;
    }
    updateTimeInputsState();
    saveNightMode();
  };

  if (backlightToggle) {
    backlightToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (!backlightCheckbox?.disabled) {
        handleBacklightToggle();
      }
    });
  }

  if (backlightCheckbox) {
    backlightCheckbox.addEventListener('change', (e) => {
      e.stopPropagation();
      if (!backlightCheckbox.disabled) {
        handleBacklightToggle();
      }
    });
  }

  updateToggleState();
  updateTimeInputsState();

  websocketService.onMessage(WebSocketCommand.NIGHT_MODE, (data: string) => {
    const parsed = parseNightModeData(data);
    if (parsed) {
      isEnabled = parsed.enabled;
      startTime = parsed.startTime;
      endTime = parsed.endTime;
      brightness = parsed.brightness;

      if (startInput) startInput.value = startTime;
      if (endInput) endInput.value = endTime;
      if (brightnessInput) brightnessInput.value = String(brightness);
      if (brightnessValue) brightnessValue.textContent = `${brightness}%`;
      if (brightnessFill) brightnessFill.style.width = `${brightness}%`;

      updateToggleState();
      updateTimeInputsState();
    }
  });
};
