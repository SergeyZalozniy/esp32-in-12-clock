import './brightness-slider.scss';
import infoIcon from '@assets/info-icon.svg';
import { translations } from '@utils/translate';
import { data } from '@utils/data';
import { getLanguage } from '@utils/getLanguage.ts';
import { websocketService } from '@services/websocket';
import { WebSocketCommand } from '@services/websocketCommands';

const render = (containerElement: HTMLElement, brightness: number) => {
  const lang = getLanguage();
  const title = translations['watch-brightness']?.[lang] || 'Watch Brightness';
  const description =
    translations['brightness-desc']?.[lang] || 'Adjust the display brightness level';
  const label = translations['brightness']?.[lang] || 'Brightness';

  containerElement.innerHTML = `
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="watch-brightness">
        <img src="${infoIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
        ${title}
      </h3>
      <p class="settings-section__description" data-i18n="brightness-desc">
        ${description}
      </p>

      <div class="brightness-slider">
        <div class="brightness-slider__header flex items-center justify-between">
          <span class="brightness-slider__label" data-i18n="brightness">${label}</span>
          <span class="brightness-slider__value">${brightness}%</span>
        </div>
        <div class="brightness-slider__container flex items-center">
          <div class="brightness-slider__track">
            <div class="brightness-slider__fill" style="width: ${brightness}%"></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value="${brightness}"
            class="brightness-slider__input"
          >
        </div>
      </div>
    </div>
  `;
};

export const initBrightnessSlider = (containerElement: HTMLElement) => {
  let brightness = data.brightness;
  let debounceTimer: number | undefined;

  render(containerElement, brightness);

  const saveBrightness = () => {
    console.log('Brightness saved:', brightness);
    websocketService.send(WebSocketCommand.BRIGHTNESS, String(brightness));
  };

  const debouncedSave = () => {
    if (debounceTimer !== undefined) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
      saveBrightness();
    }, 300);
  };

  const updateBrightnessDisplay = () => {
    const valueDisplay = containerElement.querySelector('.brightness-slider__value') as HTMLElement;
    const slider = containerElement.querySelector('.brightness-slider__input') as HTMLInputElement;
    const fill = containerElement.querySelector('.brightness-slider__fill') as HTMLElement;

    if (valueDisplay) {
      valueDisplay.textContent = `${brightness}%`;
    }

    if (slider) {
      slider.value = String(brightness);
    }

    if (fill) {
      fill.style.width = `${brightness}%`;
    }
  };

  const handleBrightnessChange = (value: number) => {
    brightness = value;
    updateBrightnessDisplay();
    debouncedSave();
  };

  const slider = containerElement.querySelector('.brightness-slider__input') as HTMLInputElement;

  if (slider) {
    slider.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      handleBrightnessChange(Number(target.value));
    });
  }

  websocketService.onMessage(WebSocketCommand.BRIGHTNESS, (data: string) => {
    const newBrightness = parseInt(data, 10);
    if (!isNaN(newBrightness) && newBrightness >= 0 && newBrightness <= 100) {
      brightness = newBrightness;
      updateBrightnessDisplay();
    }
  });
};
