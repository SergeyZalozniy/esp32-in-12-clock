import { INFO_PAGE_DATA } from '@utils/constants';

const INFO_PAGE_SELECTOR = '[data-page="info"]';

function fillInfoPage(): void {
  const page = document.querySelector(INFO_PAGE_SELECTOR);
  if (!page) return;

  const emailLink = page.querySelector<HTMLAnchorElement>('a[data-i18n="email"]');
  const instagramLink = page.querySelector<HTMLAnchorElement>('a[data-i18n="instagram"]');
  if (emailLink) emailLink.href = INFO_PAGE_DATA.contacts.email;
  if (instagramLink) instagramLink.href = INFO_PAGE_DATA.contacts.instagram;

  const valueKeys = ['clockNumber', 'buildDate', 'softVersion'] as const;
  valueKeys.forEach((key) => {
    const el = page.querySelector(`[data-info-value="${key}"]`);
    if (el) el.textContent = INFO_PAGE_DATA[key];
  });
}

function initInfoPage(): void {
  function run(): void {
    fillInfoPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      run();
      setTimeout(run, 100);
    });
  } else {
    run();
    setTimeout(run, 100);
  }

  document.addEventListener('click', (e: MouseEvent) => {
    const tab = (e.target as HTMLElement).closest('.nav-tab[data-page="info"]');
    if (tab) setTimeout(fillInfoPage, 50);
  });
}

initInfoPage();

export { fillInfoPage };
