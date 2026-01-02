import './toggle-switch.scss';
import { translations } from '@utils/translate';
import { getLanguage } from '@utils/getLanguage.ts';
import { websocketService } from '@services/websocket';

const render = (
  containerElement: HTMLElement,
  icon: string,
  titleKey: string,
  descKey: string
): void => {
  const lang = getLanguage();
  const title = translations[titleKey]?.[lang] || titleKey;
  const description = translations[descKey]?.[lang] || descKey;

  containerElement.innerHTML = `
    <div class="settings-section">
      <div class="settings-section__header flex items-start justify-between gap-16">
        <div class="flex-1 min-w-0">
          <h3 class="settings-section__title flex items-center gap-8" data-i18n="${titleKey}">
            <img src="${icon}" alt="${title}" class="settings-section__icon" width="20" height="20">
            ${title}
          </h3>
          <p class="settings-section__description" data-i18n="${descKey}">
            ${description}
          </p>
        </div>
        <label class="toggle-switch flex-shrink-0">
          <input type="checkbox" class="toggle-switch__checkbox">
          <span class="toggle-switch__toggle"></span>
        </label>
      </div>
    </div>
  `;
};

export const initToggleSwitch = (
  containerElement: HTMLElement,
  icon: string,
  title: string,
  description: string,
  defaultValue = false,
  onChangeCallback?: (enabled: boolean) => void,
  websocketCommand?: number
): void => {
  let isEnabled = defaultValue;

  render(containerElement, icon, title, description);

  const toggle = containerElement.querySelector('.toggle-switch__toggle') as HTMLElement;
  const checkbox = containerElement.querySelector('.toggle-switch__checkbox') as HTMLInputElement;

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

  const handleToggle = (): void => {
    isEnabled = !isEnabled;
    updateToggleState();

    if (websocketCommand !== undefined) {
      websocketService.send(websocketCommand, isEnabled ? 'true' : 'false');
    }

    if (onChangeCallback) {
      onChangeCallback(isEnabled);
    }
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

  updateToggleState();

  if (websocketCommand !== undefined) {
    websocketService.onMessage(websocketCommand, (data: string) => {
      const newState = data === 'true';
      if (newState !== isEnabled) {
        isEnabled = newState;
        updateToggleState();

        if (onChangeCallback) {
          onChangeCallback(isEnabled);
        }
      }
    });
  }
};
