import { translations } from '@utils/translate';
import type { ValidationResult } from '@app-types/validationResultTypes.ts';
import { getLanguage } from '@utils/getLanguage.ts';

export const validatePassword = (password: string): ValidationResult => {
  const lang = getLanguage();

  if (!password) {
    return {
      isValid: false,
      error: translations['password-required']?.[lang] || 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: translations['password-min-length']?.[lang] || 'Password must be at least 8 characters'
    };
  }

  return { isValid: true };
};
