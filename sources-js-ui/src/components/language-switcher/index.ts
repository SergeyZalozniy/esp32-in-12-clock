import './language-switcher.scss';
import '@components/dropdown';
import { Language, translations } from '@utils/translate.ts';
import { getLanguage } from '@utils/getLanguage.ts';
import { websocketService } from '@services/websocket';
import { WebSocketCommand } from '@services/websocketCommands';

let currentLanguage: Language = getLanguage();
let isOpen = false;

let button: HTMLElement | null = null;
let menu: HTMLElement | null = null;

const toggleMenu = () => {
  isOpen = !isOpen;
  if (isOpen) {
    openMenu();
  } else {
    closeMenu();
  }
};

const openMenu = () => {
  isOpen = true;
  button?.classList.add('dropdown__button--active');
  menu?.classList.add('dropdown__menu--open');
};

const closeMenu = () => {
  isOpen = false;
  button?.classList.remove('dropdown__button--active');
  menu?.classList.remove('dropdown__menu--open');
};

const updateButtonText = () => {
  if (!button) return;

  const textShort = button.querySelector('.dropdown__text-short');
  const textFull = button.querySelector('.dropdown__text-full');

  if (textShort) {
    textShort.textContent = currentLanguage === 'en' ? '🇬🇧' : '🇺🇦';
  }

  if (textFull) {
    textFull.textContent = currentLanguage === 'en' ? 'English' : 'Українська';
  }
};

const updateActiveStates = () => {
  const items = document.querySelectorAll('.language-switcher__item');
  items.forEach((item) => {
    const language = (item as HTMLElement).dataset.language;

    if (language === currentLanguage) {
      item.classList.add('dropdown__item--active');
    } else {
      item.classList.remove('dropdown__item--active');
    }
  });
};

const translatePage = () => {
  const headerTitle = document.querySelector('.header__title');

  if (headerTitle) {
    headerTitle.textContent = translations['nixie-clock'][currentLanguage];
  }

  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    const page = (tab as HTMLElement).dataset.page;
    const textElement = tab.querySelector('.nav-tab__text');

    if (page && textElement && translations[page]) {
      textElement.textContent = translations[page][currentLanguage];
    }
  });

  const pageTitles = document.querySelectorAll('.page__title');
  pageTitles.forEach((title) => {
    const page = title.closest('.page');

    if (page) {
      const pageType = (page as HTMLElement).dataset.page;
      const translationKey = `${pageType}-settings`;

      if (pageType && translations[translationKey]) {
        title.textContent = translations[translationKey][currentLanguage];
      }
    }
  });

  const i18nElements = document.querySelectorAll('[data-i18n]');
  i18nElements.forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key && translations[key]) {
      const translation = translations[key][currentLanguage];

      if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
        (element as HTMLInputElement).placeholder = translation;
      } else if (element.classList.contains('settings-section__title')) {
        const icon = element.querySelector('img');
        const iconHTML = icon ? icon.outerHTML : '';
        element.innerHTML = `${iconHTML}${translation}`;
      } else {
        element.textContent = translation;
      }
    }
  });

  const i18nPlaceholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  i18nPlaceholderElements.forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (key && translations[key]) {
      const translation = translations[key][currentLanguage];
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        (element as HTMLInputElement | HTMLTextAreaElement).placeholder = translation;
      }
    }
  });
};

const applyLanguage = (language: Language, sendWebSocket = true) => {
  currentLanguage = language;
  document.documentElement.setAttribute('lang', language);
  localStorage.setItem('language', language);
  updateButtonText();
  updateActiveStates();

  if (sendWebSocket) {
    websocketService.send(WebSocketCommand.LANGUAGE, language);
  }

  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));

  setTimeout(() => {
    translatePage();
  }, 0);
};

export const initLanguageSwitcher = () => {
  button = document.querySelector('.language-switcher__button');
  menu = document.querySelector('.language-switcher__menu');

  applyLanguage(currentLanguage, false);

  if (button) {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  const items = document.querySelectorAll('.language-switcher__item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const language = (item as HTMLElement).dataset.language as Language;

      if (language) {
        applyLanguage(language);
        closeMenu();
      }
    });
  });

  document.addEventListener('click', () => {
    closeMenu();
  });

  websocketService.onMessage(WebSocketCommand.LANGUAGE, (data: string) => {
    if (data === 'en' || data === 'uk') {
      applyLanguage(data as Language, false);
    }
  });
};
