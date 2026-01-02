import { Language } from '@utils/translate.ts';

export const getLanguage = (): Language => {
  return (localStorage.getItem('language') as Language) || 'en';
};
