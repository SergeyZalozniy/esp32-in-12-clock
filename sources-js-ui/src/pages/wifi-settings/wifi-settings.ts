import { translations } from '@utils/translate';
import wifiIcon from '@assets/wifi-icon.svg';
import eyeIcon from '@assets/eye-icon.svg';
import eyeOffIcon from '@assets/eye-off-icon.svg';
import { validatePassword } from '@utils/validatePassword.ts';
import { getLanguage } from '@utils/getLanguage.ts';
import { WiFiState } from 'src/types/wifiTypes';
import '@styles/dropdown-list.scss';
import { websocketService } from '@services/websocket';
import { WebSocketCommand } from '@services/websocketCommands';

const initWiFiSettings = () => {
  const container = document.querySelector('[data-page="wifi"] .settings-content');

  if (!container) return;

  let mockedNetworks: string[] = [];

  const state: WiFiState = {
    selectedNetwork: null,
    isManualEntry: false,
    password: '',
    isPasswordValid: false,
    isConnecting: false,
    isConnected: false,
    error: null,
    isPasswordVisible: false,
    isPasswordTouched: false,
    validationError: null,
    isDropdownOpen: false
  };

  const wifiSettingsContainer = document.createElement('div');
  wifiSettingsContainer.className = 'wifi-settings__unified-section';
  const connectSectionContainer = document.createElement('div');
  connectSectionContainer.className = 'wifi-settings__connect-section';

  container.appendChild(wifiSettingsContainer);
  container.appendChild(connectSectionContainer);

  const renderWiFiSection = () => {
    const lang = getLanguage();
    const title = translations['wifi-network']?.[lang] || 'Wi-Fi Network';
    const description =
      translations['wifi-network-desc']?.[lang] || 'Enter your Wi-Fi network name and password';
    const networkNamePlaceholder =
      translations['network-name-placeholder']?.[lang] || 'Enter network name...';
    const passwordPlaceholder = translations['password-placeholder']?.[lang] || 'Enter password...';
    const showPasswordText = translations['show-password']?.[lang] || 'Show password';
    const hidePasswordText = translations['hide-password']?.[lang] || 'Hide password';

    const inputType = state.isPasswordVisible ? 'text' : 'password';
    const toggleIconSrc = state.isPasswordVisible ? eyeIcon : eyeOffIcon;
    const toggleTitle = state.isPasswordVisible ? hidePasswordText : showPasswordText;

    let passwordInputClass = 'wifi-password__input';
    if (state.isPasswordTouched) {
      if (state.isPasswordValid && state.password) {
        passwordInputClass += ' wifi-password__input--success';
      } else if (state.validationError) {
        passwordInputClass += ' wifi-password__input--error';
      }
    }

    let validationMessage = '';
    if (state.isPasswordTouched && state.validationError) {
      validationMessage = `
        <div class="wifi-password__error">
          <span class="wifi-password__error-icon">⚠️</span>
          <span>${state.validationError}</span>
        </div>
      `;
    }

    const networkLabel = translations['network-name']?.[lang] || 'Network Name';
    const passwordLabel = translations['password']?.[lang] || 'Password';

    wifiSettingsContainer.innerHTML = `
      <div class="settings-section">
        <div class="settings-section__header">
          <h3 class="settings-section__title flex items-center gap-8" data-i18n="wifi-network">
            <img src="${wifiIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
            ${title}
          </h3>
          <p class="settings-section__description" data-i18n="wifi-network-desc">
            ${description}
          </p>
        </div>
        <div class="wifi-settings__inputs flex flex-col gap-16">
          <div class="wifi-selector__input-group" style="position: relative;">
            <label class="wifi-settings__label" for="network-input" data-i18n="network-name">
              ${networkLabel}
            </label>
            <input
              id="network-input"
              type="text"
              class="wifi-selector__input"
              placeholder="${networkNamePlaceholder}"
              data-i18n-placeholder="network-name-placeholder"
              value="${state.selectedNetwork || ''}"
              data-network-input
              autocomplete="off"
            />
            <div class="dropdown-list ${state.isDropdownOpen ? 'dropdown-list--open' : ''}" data-networks-dropdown>
              ${mockedNetworks
                .map(
                  (network) => `
                <div class="dropdown-list__item" data-network-item="${network}">
                  <img src="${wifiIcon}" alt="WiFi" width="16" height="16">
                  <span>${network}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
          <div class="wifi-password__input-group">
            <label class="wifi-settings__label" for="password-input" data-i18n="password">
              ${passwordLabel}
            </label>
            <div class="wifi-password__input-wrapper">
              <input
                id="password-input"
                type="${inputType}"
                class="${passwordInputClass}"
                placeholder="${passwordPlaceholder}"
                data-i18n-placeholder="password-placeholder"
                value="${state.password}"
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
        </div>
      </div>
    `;

    attachWiFiSectionListeners();
  };

  const updateNetworkDropdown = () => {
    const dropdown = wifiSettingsContainer.querySelector(
      '[data-networks-dropdown]'
    ) as HTMLDivElement;

    if (!dropdown) return;

    // Get current network items
    const existingItems = Array.from(dropdown.querySelectorAll('[data-network-item]'));
    const existingNetworks = existingItems.map(item => item.getAttribute('data-network-item') || '');

    // Check if networks have changed
    const networksChanged =
      mockedNetworks.length !== existingNetworks.length ||
      mockedNetworks.some((network, index) => network !== existingNetworks[index]);

    if (!networksChanged) {
      return; // No changes, skip update
    }

    // Clear and rebuild dropdown
    dropdown.innerHTML = mockedNetworks
      .map(
        (network) => `
        <div class="dropdown-list__item" data-network-item="${network}">
          <img src="${wifiIcon}" alt="WiFi" width="16" height="16">
          <span>${network}</span>
        </div>
      `
      )
      .join('');

    // Re-attach click listeners to new network items
    const networkItems = dropdown.querySelectorAll('[data-network-item]') as NodeListOf<HTMLElement>;
    networkItems.forEach((item) => {
      item.addEventListener('click', () => {
        const value = item.dataset.networkItem || '';
        state.selectedNetwork = value;
        state.isManualEntry = false;

        const networkInput = wifiSettingsContainer.querySelector(
          '[data-network-input]'
        ) as HTMLInputElement;

        if (networkInput) {
          networkInput.value = value;
        }

        dropdown.classList.remove('dropdown-list--open');
        state.isDropdownOpen = false;

        renderConnectSection();
      });
    });
  };

  const attachWiFiSectionListeners = () => {
    const networkInput = wifiSettingsContainer.querySelector(
      '[data-network-input]'
    ) as HTMLInputElement;

    const dropdown = wifiSettingsContainer.querySelector(
      '[data-networks-dropdown]'
    ) as HTMLDivElement;

    const passwordInput = wifiSettingsContainer.querySelector(
      '[data-password-input]'
    ) as HTMLInputElement;

    const toggleButton = wifiSettingsContainer.querySelector(
      '[data-toggle-password]'
    ) as HTMLButtonElement;

    const networkItems = wifiSettingsContainer.querySelectorAll(
      '[data-network-item]'
    ) as NodeListOf<HTMLElement>;

    const updatePasswordVisibilityUI = () => {
      const lang = getLanguage();
      const showPasswordText = translations['show-password']?.[lang] || 'Show password';
      const hidePasswordText = translations['hide-password']?.[lang] || 'Hide password';

      const passwordInputEl = wifiSettingsContainer.querySelector(
        '[data-password-input]'
      ) as HTMLInputElement | null;

      const toggleImg = toggleButton?.querySelector('img') as HTMLImageElement | null;

      const inputType = state.isPasswordVisible ? 'text' : 'password';
      const toggleIconSrc = state.isPasswordVisible ? eyeIcon : eyeOffIcon;
      const toggleTitle = state.isPasswordVisible ? hidePasswordText : showPasswordText;

      if (passwordInputEl) {
        passwordInputEl.type = inputType;
      }

      if (toggleButton) {
        toggleButton.title = toggleTitle;
      }

      if (toggleImg) {
        toggleImg.src = toggleIconSrc;
        toggleImg.alt = toggleTitle;
      }
    };

    networkInput.addEventListener('input', () => {
      state.selectedNetwork = networkInput.value;
      state.isManualEntry = true;
      state.isConnected = false;
      state.error = null;

      dropdown.classList.add('dropdown-list--open');
      state.isDropdownOpen = true;
      renderConnectSection();
    });

    networkInput.addEventListener('focus', () => {
      dropdown.classList.add('dropdown-list--open');
      state.isDropdownOpen = true;
    });

    networkItems.forEach((item) => {
      item.addEventListener('click', () => {
        const value = item.dataset.networkItem || '';
        state.selectedNetwork = value;
        state.isManualEntry = false;

        networkInput.value = value;
        dropdown.classList.remove('dropdown-list--open');
        state.isDropdownOpen = false;

        renderConnectSection();
      });
    });

    passwordInput.addEventListener('input', () => {
      const sanitized = passwordInput.value.replace(/\s+/g, '');
      if (sanitized !== passwordInput.value) {
        const cursor = passwordInput.selectionStart ?? sanitized.length;
        passwordInput.value = sanitized;
        passwordInput.setSelectionRange(cursor, cursor);
      }

      state.password = passwordInput.value;
      const result = validatePassword(state.password);
      state.isPasswordValid = result.isValid;
      state.validationError = result.error || null;
      renderConnectSection();
    });

    toggleButton.addEventListener('click', () => {
      state.isPasswordVisible = !state.isPasswordVisible;
      updatePasswordVisibilityUI();
    });
  };

  const renderConnectSection = () => {
    const lang = getLanguage();
    const saveText = translations['save']?.[lang] || 'Save';
    const savingText = translations['saving']?.[lang] || 'Saving...';
    const savedText = translations['saved']?.[lang] || 'Saved';

    let buttonText = saveText;
    let buttonClass = 'wifi-settings__connect-button';
    let buttonDisabled = !state.selectedNetwork || !state.isPasswordValid;

    if (state.isConnecting) {
      buttonText = savingText;
      buttonClass += ' wifi-settings__connect-button--connecting';
      buttonDisabled = true;
    } else if (state.isConnected) {
      buttonText = savedText;
      buttonClass += ' wifi-settings__connect-button--connected';
      buttonDisabled = true;
    }

    let statusMessage = '';
    if (state.isConnected) {
      const successMsg =
        translations['wifi-saved-success']?.[lang] || 'WiFi settings saved successfully';
      statusMessage = `
        <div class="wifi-settings__status wifi-settings__status--success">
          <span class="wifi-settings__status-icon">✓</span>
          <span>${successMsg}</span>
        </div>
      `;
    } else if (state.error) {
      statusMessage = `
        <div class="wifi-settings__status wifi-settings__status--error">
          <span class="wifi-settings__status-icon">⚠️</span>
          <span>${state.error}</span>
        </div>
      `;
    }

    connectSectionContainer.innerHTML = `
      <button
        class="${buttonClass}"
        ${buttonDisabled ? 'disabled' : ''}
        data-connect-button
      >
        <span>${buttonText}</span>
      </button>
      ${statusMessage}
      <div class="wifi-settings__info">
        <div class="wifi-settings__info-title">
          <span class="wifi-settings__info-icon">ℹ️</span>
          <span data-i18n="connection-info">${translations['connection-info']?.[lang] || 'Connection Info'}</span>
        </div>
        <p class="wifi-settings__info-text">
          ${
            state.selectedNetwork
              ? `${translations['network']?.[lang] || 'Network'}: ${state.selectedNetwork}`
              : translations['no-network-selected']?.[lang] || 'No network selected'
          }
          ${state.isManualEntry ? ` (${translations['manual-entry']?.[lang] || 'Manual Entry'})` : ''}
        </p>
      </div>
    `;

    attachConnectButtonListener();
  };

  const handleSaveWiFi = () => {
    const lang = getLanguage();

    if (!state.selectedNetwork || !state.password) {
      state.error = translations['network-required']?.[lang] || 'Network and password are required';
      renderConnectSection();
      return;
    }

    state.isConnecting = true;
    state.error = null;
    renderConnectSection();

    setTimeout(() => {
      websocketService.send(WebSocketCommand.WIFI_SSID, state.selectedNetwork || '');
      websocketService.send(WebSocketCommand.WIFI_PASSWORD, state.password);

      console.log('WiFi settings saved:', {
        network: state.selectedNetwork,
        password: '***'
      });

      state.isConnecting = false;
      state.isConnected = true;

      renderConnectSection();
    }, 500);
  };

  const attachConnectButtonListener = () => {
    const button = connectSectionContainer.querySelector(
      '[data-connect-button]'
    ) as HTMLButtonElement;
    if (button && !button.dataset.listenerAttached) {
      button.dataset.listenerAttached = 'true';
      button.addEventListener('click', () => {
        if (!state.isConnecting && !state.isConnected) {
          handleSaveWiFi();
        }
      });
    }
  };

  renderWiFiSection();
  renderConnectSection();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const dropdown = wifiSettingsContainer.querySelector('[data-networks-dropdown]') as HTMLElement;
    const inputGroup = wifiSettingsContainer.querySelector('.wifi-selector__input-group');
    
    if (dropdown && inputGroup && !inputGroup.contains(target)) {
      dropdown.classList.remove('dropdown-list--open');
      state.isDropdownOpen = false;
    }
  });

  websocketService.onMessage(WebSocketCommand.WIFI_SSID, (data: string) => {
    state.selectedNetwork = data;
    renderWiFiSection();
    renderConnectSection();
  });

  websocketService.onMessage(WebSocketCommand.WIFI_PASSWORD, (data: string) => {
    const sanitized = data.replace(/\s+/g, '');
    state.password = sanitized;
    const validationResult = validatePassword(sanitized);
    state.isPasswordValid = validationResult.isValid;
    state.validationError = validationResult.error || null;
    renderWiFiSection();
    renderConnectSection();
  });

  window.addEventListener('languageChanged', () => {
    renderWiFiSection();
    renderConnectSection();
  });

  // Listen for WiFi list response from ESP32
  websocketService.onMessage(WebSocketCommand.WIFI_LIST, (data: string) => {
    if (data && data !== 'No networks found') {
      mockedNetworks = data.split('|').map((network) => network.trim());
      updateNetworkDropdown(); // Partial update - no blink
    }
  });

  // Request WiFi list every 10 seconds
  const requestWiFiList = () => {
    websocketService.send(WebSocketCommand.REQUEST_WIFI_LIST, '');
  };

  // Check if WiFi settings page is currently active
  const isWiFiPageActive = () => {
    const wifiPage = document.querySelector('[data-page="wifi"]');
    return wifiPage?.classList.contains('page--active') || false;
  };

  let wifiListInterval: ReturnType<typeof setInterval> | null = null;

  // Start/stop interval based on page visibility
  const startWiFiScanning = () => {
    if (wifiListInterval) return; // Already running
    requestWiFiList(); // Immediate request
    wifiListInterval = setInterval(() => {
      if (isWiFiPageActive()) {
        requestWiFiList();
      }
    }, 10000);
  };

  const stopWiFiScanning = () => {
    if (wifiListInterval) {
      clearInterval(wifiListInterval);
      wifiListInterval = null;
    }
  };

  // Request WiFi list when WebSocket connects
  websocketService.onConnect(() => {
    requestWiFiList();
  });

  // Listen for page changes via MutationObserver
  const wifiPage = document.querySelector('[data-page="wifi"]');
  if (wifiPage) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (isWiFiPageActive()) {
            startWiFiScanning();
          } else {
            stopWiFiScanning();
          }
        }
      });
    });

    observer.observe(wifiPage, { attributes: true });

    // Start scanning if WiFi page is already active
    if (isWiFiPageActive()) {
      startWiFiScanning();
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
      stopWiFiScanning();
    });
  }
};

initWiFiSettings();
