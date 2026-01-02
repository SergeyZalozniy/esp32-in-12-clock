import './time-mode-switcher.scss';
import clockIcon from '@assets/clock-icon.svg';
import { translations } from '@utils/translate';
import { TimeMode } from '@utils/constants';
import { data } from '@utils/data';
import { getLanguage } from '@utils/getLanguage.ts';
import { websocketService } from '@services/websocket';
import { WebSocketCommand } from '@services/websocketCommands';

const render = (containerElement: HTMLElement): void => {
  const lang = getLanguage();
  const title = translations['time-mode']?.[lang] || 'Time Mode';
  const description =
    translations['time-mode-desc']?.[lang] || 'Choose between 24-hour or 12-hour time format';

  containerElement.innerHTML = `
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="time-mode">
        <img src="${clockIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
        ${title}
      </h3>
      <p class="settings-section__description" data-i18n="time-mode-desc">
        ${description}
      </p>

      <div class="time-mode-switcher">
        <div class="time-mode-switcher__toggle inline-flex gap-4">
          <button class="time-mode-switcher__toggle-btn time-mode-switcher__toggle-btn--active" data-mode="${TimeMode.TWENTY_FOUR_HOUR}">
            ${TimeMode.TWENTY_FOUR_HOUR}
          </button>
          <button class="time-mode-switcher__toggle-btn" data-mode="${TimeMode.TWELVE_HOUR}">
            ${TimeMode.TWELVE_HOUR}
          </button>
        </div>
      </div>
    </div>
  `;
};

export const initTimeModeSwitcher = (containerElement: HTMLElement): void => {
  let timeMode: TimeMode = data.timeMode;

  render(containerElement);

  const saveTimeMode = (): void => {
    console.log('Time mode saved:', timeMode);
    websocketService.send(WebSocketCommand.TIME_MODE, timeMode);
  };

  const switchTimeMode = (mode: TimeMode): void => {
    timeMode = mode;

    const toggleButtons = containerElement.querySelectorAll('.time-mode-switcher__toggle-btn');
    toggleButtons.forEach((button) => {
      const btnMode = button.getAttribute('data-mode');

      if (btnMode === mode) {
        button.classList.add('time-mode-switcher__toggle-btn--active');
      } else {
        button.classList.remove('time-mode-switcher__toggle-btn--active');
      }
    });

    saveTimeMode();
  };

  const toggleButtons = containerElement.querySelectorAll('.time-mode-switcher__toggle-btn');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const mode = target.getAttribute('data-mode') as TimeMode;
      switchTimeMode(mode);
    });
  });

  if (timeMode === TimeMode.TWELVE_HOUR) {
    switchTimeMode(TimeMode.TWELVE_HOUR);
  }

  websocketService.onMessage(WebSocketCommand.TIME_MODE, (data: string) => {
    if (data === TimeMode.TWELVE_HOUR || data === TimeMode.TWENTY_FOUR_HOUR) {
      switchTimeMode(data as TimeMode);
    }
  });
};
