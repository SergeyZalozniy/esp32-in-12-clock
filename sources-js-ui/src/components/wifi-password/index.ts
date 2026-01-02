import './wifi-password.scss';
import { translations } from '@utils/translate';
import wifiIcon from '@assets/wifi-icon.svg';
import eyeIcon from '@assets/eye-icon.svg';
import eyeOffIcon from '@assets/eye-off-icon.svg';
import { validatePassword } from '@utils/validatePassword.ts';
import { getLanguage } from '@utils/getLanguage.ts';
import type { ValidationResult } from '@app-types/validationResultTypes.ts';
import { websocketService } from '@services/websocket';
import { WebSocketCommand } from '@services/websocketCommands';

export const initWiFiPassword = (
  containerElement: HTMLElement,
  onPasswordChange?: (password: string, isValid: boolean) => void
): void => {
  let isPasswordVisible = false;
  let password = '';
  let validationResult: ValidationResult = { isValid: false };
  let isTouched = false;

  const render = () => {
    const lang = getLanguage();
    const title = translations['wifi-password']?.[lang] || 'Wi-Fi Password';
    const description =
      translations['wifi-password-desc']?.[lang] || 'Enter the password for the selected network';
    const placeholder = translations['password-placeholder']?.[lang] || 'Enter password...';
    const showPasswordText = translations['show-password']?.[lang] || 'Show password';
    const hidePasswordText = translations['hide-password']?.[lang] || 'Hide password';

    const inputType = isPasswordVisible ? 'text' : 'password';
    const toggleIconSrc = isPasswordVisible ? eyeIcon : eyeOffIcon;
    const toggleTitle = isPasswordVisible ? hidePasswordText : showPasswordText;

    let inputClass = 'wifi-password__input';
    if (isTouched) {
      if (validationResult.isValid) {
        inputClass += ' wifi-password__input--success';
      } else if (validationResult.error) {
        inputClass += ' wifi-password__input--error';
      }
    }

    let validationMessage = '';
    if (isTouched && validationResult.error) {
      validationMessage = `
        <div class="wifi-password__error">
          <span class="wifi-password__error-icon">⚠️</span>
          <span>${validationResult.error}</span>
        </div>
      `;
    }

    containerElement.innerHTML = `
      <div class="settings-section">
        <div class="settings-section__header">
          <h3 class="settings-section__title flex items-center gap-8" data-i18n="wifi-password">
            <img src="${wifiIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
            ${title}
          </h3>
          <p class="settings-section__description" data-i18n="wifi-password-desc">
            ${description}
          </p>
        </div>
        <div class="wifi-password__input-wrapper">
          <input
            type="${inputType}"
            class="${inputClass}"
            placeholder="${placeholder}"
            data-i18n-placeholder="password-placeholder"
            value="${password}"
            data-password-input
            autocomplete="off"
          />
          <button
            class="wifi-password__toggle"
            type="button"
            title="${toggleTitle}"
            data-toggle-password
          >
            <img src="${toggleIconSrc}" alt="${toggleTitle}" width="20" height="20">
          </button>
        </div>
        ${validationMessage}
      </div>
    `;

    attachEventListeners();
  };

  const handlePasswordChange = (value: string) => {
    password = value;
    validationResult = validatePassword(password);

    if (onPasswordChange) {
      onPasswordChange(password, validationResult.isValid);
    }
    
    if (validationResult.isValid) {
      websocketService.send(WebSocketCommand.WIFI_PASSWORD, password);
    }
  };

  const updateValidationDisplay = () => {
    const existingError = containerElement.querySelector('.wifi-password__error');
    const existingSuccess = containerElement.querySelector('.wifi-password__success');
    const input = containerElement.querySelector('[data-password-input]') as HTMLInputElement;

    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();

    if (input) {
      input.classList.remove('wifi-password__input--error', 'wifi-password__input--success');

      if (isTouched) {
        if (validationResult.isValid) {
          input.classList.add('wifi-password__input--success');
        } else if (validationResult.error) {
          input.classList.add('wifi-password__input--error');
        }
      }
    }

    if (isTouched && validationResult.error) {
      const section = containerElement.querySelector('.settings-section');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'wifi-password__error';
      errorDiv.innerHTML = `
        <span class="wifi-password__error-icon">⚠️</span>
        <span>${validationResult.error}</span>
      `;
      section?.appendChild(errorDiv);
    }
  };

  const togglePasswordVisibility = () => {
    isPasswordVisible = !isPasswordVisible;
    const input = containerElement.querySelector('[data-password-input]') as HTMLInputElement;
    const toggleButton = containerElement.querySelector(
      '[data-toggle-password]'
    ) as HTMLButtonElement;

    if (input) {
      input.type = isPasswordVisible ? 'text' : 'password';
    }

    if (toggleButton) {
      const lang = getLanguage();
      const toggleIconSrc = isPasswordVisible ? eyeIcon : eyeOffIcon;
      const toggleTitle = isPasswordVisible
        ? translations['hide-password']?.[lang] || 'Hide password'
        : translations['show-password']?.[lang] || 'Show password';

      toggleButton.innerHTML = `<img src="${toggleIconSrc}" alt="${toggleTitle}" width="20" height="20">`;
      toggleButton.title = toggleTitle;
    }
  };

  const attachEventListeners = () => {
    const input = containerElement.querySelector('[data-password-input]') as HTMLInputElement;
    const toggleButton = containerElement.querySelector(
      '[data-toggle-password]'
    ) as HTMLButtonElement;

    if (input) {
      input.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        handlePasswordChange(value);
      });

      input.addEventListener('blur', () => {
        isTouched = true;
        updateValidationDisplay();
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        togglePasswordVisibility();
      });
    }
  };

  window.addEventListener('languageChanged', () => {
    render();
  });

  render();

  websocketService.onMessage(WebSocketCommand.WIFI_PASSWORD, (data: string) => {
    password = data;
    validationResult = validatePassword(password);
    const input = containerElement.querySelector('[data-password-input]') as HTMLInputElement;
    if (input) {
      input.value = data;
    }
    if (onPasswordChange) {
      onPasswordChange(password, validationResult.isValid);
    }
  });
};
