import clockIcon from '@assets/clock-icon.svg';
import infoIcon from '@assets/info-icon.svg';
import chevronDownIcon from '@assets/chevron-down-icon.svg';
import { TIMEZONES } from '@utils/timezones';
import { translations } from '@utils/translate';
import { data } from '@utils/data';
import { getLanguage } from '@utils/getLanguage.ts';
import '@styles/dropdown-list.scss';
import { websocketService } from '@services/websocket';
import { WebSocketCommand } from '@services/websocketCommands';

const updateCurrentTimezone = (container: HTMLElement): void => {
  const currentTimezoneSpan = container.querySelector('#currentTimezone') as HTMLElement;
  if (!currentTimezoneSpan) return;

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date().getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMinutes = Math.abs(offset % 60);
    const offsetSign = offset <= 0 ? '+' : '-';
    const offsetString = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

    currentTimezoneSpan.textContent = `${timezone} (${offsetString})`;
  } catch (e) {
    console.error('Error getting timezone:', e);
    const lang = getLanguage();
    currentTimezoneSpan.textContent = lang === 'uk' ? 'Не вдалося визначити' : 'Unable to detect';
  }
};

const filterDropdownOptions = (container: HTMLElement, searchTerm: string): void => {
  const options = container.querySelectorAll('.dropdown-list__item');
  const lowerSearch = searchTerm.toLowerCase();
  let visibleCount = 0;

  options.forEach((option) => {
    const text = option.textContent?.toLowerCase() || '';

    if (text.includes(lowerSearch)) {
      option.classList.remove('dropdown-list__item--hidden');
      visibleCount++;
    } else {
      option.classList.add('dropdown-list__item--hidden');
    }
  });

  const optionsContainer = container.querySelector('#timezoneOptions');
  const existingNoResults = optionsContainer?.querySelector('.dropdown-list__no-results');

  if (visibleCount === 0 && !existingNoResults && optionsContainer) {
    const lang = getLanguage();
    const noResults = document.createElement('div');
    noResults.className = 'dropdown-list__no-results';
    noResults.textContent = translations['no-timezones-found']?.[lang] || 'No timezones found';
    optionsContainer.appendChild(noResults);
  } else if (visibleCount > 0 && existingNoResults) {
    existingNoResults.remove();
  }
};

const closeDropdown = (container: HTMLElement): void => {
  const dropdown = container.querySelector('#timezoneDropdown') as HTMLElement;
  const trigger = container.querySelector('#selectTrigger') as HTMLElement;
  const arrow = trigger?.querySelector('.timezone-selector__select-arrow');
  const searchInput = container.querySelector('#timezoneSearch') as HTMLInputElement;

  if (dropdown && trigger && arrow) {
    dropdown.classList.remove('dropdown-list--open');
    dropdown.classList.remove('dropdown-list--upward');
    trigger.classList.remove('timezone-selector__select-trigger--active');
    arrow.classList.remove('timezone-selector__select-arrow--rotated');

    if (searchInput) {
      searchInput.value = '';
      filterDropdownOptions(container, '');
    }
  }
};

const selectTimezone = (
  container: HTMLElement,
  value: string,
  label: string,
  saveCallback: (value: string) => void
): void => {
  const selectText = container.querySelector('#selectText') as HTMLElement;
  const options = container.querySelectorAll('.dropdown-list__item');

  if (selectText) {
    selectText.textContent = label;
  }

  options.forEach((option) => {
    if (option.getAttribute('data-value') === value) {
      option.classList.add('dropdown-list__item--selected');
    } else {
      option.classList.remove('dropdown-list__item--selected');
    }
  });

  saveCallback(value);
  closeDropdown(container);
};

const adjustDropdownPosition = (dropdown: HTMLElement, trigger: HTMLElement): void => {
  const triggerRect = trigger.getBoundingClientRect();
  const dropdownHeight = 300;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  dropdown.classList.remove('dropdown-list--upward');

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdown.classList.add('dropdown-list--upward');
  }
};

const openDropdown = (container: HTMLElement): void => {
  const dropdown = container.querySelector('#timezoneDropdown') as HTMLElement;
  const trigger = container.querySelector('#selectTrigger') as HTMLElement;
  const arrow = trigger?.querySelector('.timezone-selector__select-arrow');
  const searchInput = container.querySelector('#timezoneSearch') as HTMLInputElement;

  if (dropdown && trigger && arrow) {
    dropdown.classList.add('dropdown-list--open');
    trigger.classList.add('timezone-selector__select-trigger--active');
    arrow.classList.add('timezone-selector__select-arrow--rotated');

    adjustDropdownPosition(dropdown, trigger);

    setTimeout(() => {
      searchInput?.focus();
    }, 100);
  }
};

const initCustomDropdown = (
  container: HTMLElement,
  saveCallback: (value: string) => void
): void => {
  const trigger = container.querySelector('#selectTrigger') as HTMLElement;
  const dropdown = container.querySelector('#timezoneDropdown') as HTMLElement;
  const searchInput = container.querySelector('#timezoneSearch') as HTMLInputElement;
  const selectText = container.querySelector('#selectText') as HTMLElement;

  if (!trigger || !dropdown || !searchInput || !selectText) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = dropdown.classList.contains('dropdown-list--open');

    if (isActive) {
      closeDropdown(container);
    } else {
      openDropdown(container);
    }
  });

  searchInput.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    filterDropdownOptions(container, target.value);
  });

  searchInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const options = dropdown.querySelectorAll('.dropdown-list__item');
  options.forEach((option) => {
    option.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const value = target.getAttribute('data-value');
      const label = target.textContent?.trim();

      if (value && label) {
        selectTimezone(container, value, label, saveCallback);
      }
    });
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (!trigger.contains(target) && !dropdown.contains(target)) {
      closeDropdown(container);
    }
  });
};

const switchTimezoneMode = (
  container: HTMLElement,
  mode: 'auto' | 'manual',
  saveCallback: (mode: 'auto' | 'manual') => void
): void => {
  const toggleButtons = container.querySelectorAll('.timezone-selector__toggle-btn');
  toggleButtons.forEach((button) => {
    const btnMode = button.getAttribute('data-mode');

    if (btnMode === mode) {
      button.classList.add('timezone-selector__toggle-btn--active');
    } else {
      button.classList.remove('timezone-selector__toggle-btn--active');
    }
  });

  const autoDiv = container.querySelector('.timezone-selector__auto');
  const manualDiv = container.querySelector('.timezone-selector__manual');

  if (autoDiv && manualDiv) {
    if (mode === 'auto') {
      autoDiv.classList.add('timezone-selector__auto--active');
      manualDiv.classList.remove('timezone-selector__manual--active');
    } else {
      autoDiv.classList.remove('timezone-selector__auto--active');
      manualDiv.classList.add('timezone-selector__manual--active');
    }
  }

  saveCallback(mode);
};

const render = (containerElement: HTMLElement): void => {
  const lang = getLanguage();
  const title = translations['timezone']?.[lang] || 'Timezone';
  const description =
    translations['timezone-desc']?.[lang] || 'Select your local timezone for accurate time display';
  const autoText = translations['automatic']?.[lang] || 'Automatic';
  const manualText = translations['manual']?.[lang] || 'Manual';
  const autoInfo =
    translations['timezone-auto-info']?.[lang] ||
    'Timezone will be detected automatically based on your IP address or browser settings.';
  const currentTz = translations['current-timezone']?.[lang] || 'Current timezone';
  const selectLabel = translations['select-timezone']?.[lang] || 'Select Timezone';
  const selectPlaceholder =
    translations['select-timezone-placeholder']?.[lang] || 'Select timezone...';
  const searchPlaceholder = translations['search-timezone']?.[lang] || 'Search timezone...';
  const loading = translations['loading']?.[lang] || 'Loading...';

  containerElement.innerHTML = `
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="timezone">
        <img src="${clockIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
        ${title}
      </h3>
      <p class="settings-section__description" data-i18n="timezone-desc">
        ${description}
      </p>

      <div class="timezone-selector">
        <div class="timezone-selector__toggle flex gap-8">
          <button class="timezone-selector__toggle-btn timezone-selector__toggle-btn--active flex-1" data-mode="auto" data-i18n="automatic">
            ${autoText}
          </button>
          <button class="timezone-selector__toggle-btn flex-1" data-mode="manual" data-i18n="manual">
            ${manualText}
          </button>
        </div>

        <div class="timezone-selector__auto timezone-selector__auto--active">
          <div class="timezone-selector__auto-info flex items-start gap-12">
            <img src="${infoIcon}" alt="Info" class="timezone-selector__auto-icon flex-shrink-0" width="20" height="20">
            <div class="timezone-selector__auto-text flex-1">
              <p data-i18n="timezone-auto-info">${autoInfo}</p>
              <p><span data-i18n="current-timezone">${currentTz}</span>: <strong id="currentTimezone">${loading}</strong></p>
            </div>
          </div>
        </div>

        <div class="timezone-selector__manual">
          <label class="timezone-selector__label" data-i18n="select-timezone">
            ${selectLabel}
          </label>
          <div class="timezone-selector__custom-select">
            <div class="timezone-selector__select-trigger flex items-center gap-12 justify-between" id="selectTrigger">
              <span class="timezone-selector__select-text flex-1" id="selectText">${selectPlaceholder}</span>
              <img
                src="${chevronDownIcon}"
                alt="Expand"
                class="timezone-selector__select-arrow flex-shrink-0"
                width="16"
                height="16"
                >
            </div>
            <div class="dropdown-list" id="timezoneDropdown">
              <input
                type="text"
                class="dropdown-list__search"
                id="timezoneSearch"
                placeholder="${searchPlaceholder}"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
              >
              <div id="timezoneOptions">
                ${TIMEZONES.map(
                  (tz) => `
                  <div class="dropdown-list__item" data-value="${tz.value}">
                    ${tz.label}
                  </div>
                `
                ).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const initTimezoneSelector = (containerElement: HTMLElement): void => {
  let timezoneMode: 'auto' | 'manual' = data.timezoneMode;
  let selectedTimezone: string = data.selectedTimezone;

  render(containerElement);

  const saveTimezoneMode = (mode: 'auto' | 'manual'): void => {
    timezoneMode = mode;
    console.log('Timezone mode saved:', mode);
    websocketService.send(WebSocketCommand.TIMEZONE_AUTO, mode);
  };

  const saveTimezone = (value: string): void => {
    selectedTimezone = value;

    const tzObj = TIMEZONES.find((tz) => tz.value === value);
    if (!tzObj) return;

    updateCurrentTimezone(containerElement);

    websocketService.send(WebSocketCommand.TIMEZONE_SELECTED, `${tzObj.value} | ${tzObj.offset}`);
  };

  const restoreState = () => {
    if (selectedTimezone && selectedTimezone !== data.selectedTimezone) {
      const matchingOption = TIMEZONES.find((tz) => tz.value === selectedTimezone);
      if (matchingOption) {
        const selectText = containerElement.querySelector('#selectText') as HTMLElement;

        if (selectText) selectText.textContent = matchingOption.label;

        const options = containerElement.querySelectorAll('.dropdown-list__item');
        options.forEach((option) => {
          if (option.getAttribute('data-value') === selectedTimezone) {
            option.classList.add('dropdown-list__item--selected');
          }
        });
      }
    }
  };

  const initializeComponent = () => {
    const toggleButtons = containerElement.querySelectorAll('.timezone-selector__toggle-btn');
    toggleButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const mode = target.getAttribute('data-mode') as 'auto' | 'manual';
        switchTimezoneMode(containerElement, mode, saveTimezoneMode);
      });
    });

    initCustomDropdown(containerElement, saveTimezone);

    if (timezoneMode === 'manual') {
      switchTimezoneMode(containerElement, 'manual', saveTimezoneMode);
    } else {
      switchTimezoneMode(containerElement, 'auto', saveTimezoneMode);
      updateCurrentTimezone(containerElement);
    }

    restoreState();
  };

  initializeComponent();

  window.addEventListener('languageChanged', () => {
    render(containerElement);
    initializeComponent();
  });

  websocketService.onMessage(WebSocketCommand.TIMEZONE_AUTO, (data: string) => {
    if (data === 'auto' || data === 'manual') {
      timezoneMode = data;
      switchTimezoneMode(containerElement, timezoneMode, () => {});
    }
  });

  websocketService.onMessage(WebSocketCommand.TIMEZONE_SELECTED, (data: string) => {
    const [value] = data.split('|');
    selectedTimezone = value;

    const matchingOption = TIMEZONES.find((tz) => tz.value === value);
    if (matchingOption) {
      const selectText = containerElement.querySelector('#selectText') as HTMLElement;
      if (selectText) selectText.textContent = matchingOption.label;

      const options = containerElement.querySelectorAll('.dropdown-list__item');
      options.forEach((option) => {
        if (option.getAttribute('data-value') === value) {
          option.classList.add('dropdown-list__item--selected');
        } else {
          option.classList.remove('dropdown-list__item--selected');
        }
      });
    }
  });
};
