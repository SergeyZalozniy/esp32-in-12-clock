import './header.scss';
import { initLanguageSwitcher } from '@components/language-switcher';

let navTabs: NodeListOf<HTMLElement>;
let pages: NodeListOf<HTMLElement>;

const switchToPage = (targetPage: string) => {
  navTabs.forEach((tab) => {
    tab.classList.remove('nav-tab--active');
  });

  pages.forEach((page) => {
    page.classList.remove('page--active');
  });

  const targetTab = document.querySelector(`.nav-tab[data-page="${targetPage}"]`);

  if (targetTab) {
    targetTab.classList.add('nav-tab--active');
  }

  const targetPageElement = document.querySelector(`.page[data-page="${targetPage}"]`);

  if (targetPageElement) {
    targetPageElement.classList.add('page--active');
  }
};

const handleTabClick = (clickedTab: HTMLElement) => {
  const targetPage = clickedTab.dataset.page;

  if (!targetPage) return;

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('page', targetPage);
  window.history.pushState({}, '', `?${urlParams.toString()}`);

  switchToPage(targetPage);
};

const initFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 'clock';
  switchToPage(page);
};

const initNavigation = () => {
  navTabs = document.querySelectorAll('.nav-tab');
  pages = document.querySelectorAll('.page');

  initFromURL();

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => handleTabClick(tab));
  });

  window.addEventListener('popstate', () => {
    initFromURL();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initLanguageSwitcher();
});
