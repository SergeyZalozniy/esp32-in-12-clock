export enum TimeMode {
  TWELVE_HOUR = '12h',
  TWENTY_FOUR_HOUR = '24h'
}

export const MAX_FILE_SIZE = 2048 * 1024;

export const INFO_PAGE_DATA = {
  contacts: {
    email: 'mailto:@justtime.com.ua',
    instagram: 'https://www.instagram.com/acu.drone/',
  },
  clockNumber: '1 of 100',
  buildDate: '02/04/2026',
  softVersion: '1.00',
} as const;
