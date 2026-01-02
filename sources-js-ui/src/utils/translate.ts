export type Language = 'en' | 'uk';

export interface Translations {
  [key: string]: {
    en: string;
    uk: string;
  };
}

export const translations: Translations = {
  'nixie-clock': {
    en: 'Nixie Clock',
    uk: 'Nixie Clock'
  },
  clock: {
    en: 'Clock',
    uk: 'Годинник'
  },
  wifi: {
    en: 'Wi-Fi',
    uk: 'Wi-Fi'
  },
  'clock-settings': {
    en: 'Nixie Clock Settings',
    uk: 'Налаштування Nixie Годинника'
  },
  'wifi-settings': {
    en: 'Wi-Fi Settings',
    uk: 'Налаштування Wi-Fi'
  },
  'advanced-mode': {
    en: 'Advanced Mode',
    uk: 'Розширений режим'
  },
  'advanced-mode-desc': {
    en: 'Enable advanced features and settings for power users',
    uk: 'Увімкнути розширені функції та налаштування для досвідчених користувачів'
  },
  'gps-enabled': {
    en: 'GPS Enabled',
    uk: 'GPS увімкнено'
  },
  'gps-enabled-desc': {
    en: 'Use GPS for accurate location and time synchronization',
    uk: 'Використовувати GPS для точного визначення місцезнаходження та синхронізації часу'
  },
  'limit-file-upload': {
    en: 'Limit File Upload on Pre-Connect Screen',
    uk: 'Обмежити завантаження файлів на екрані попереднього підключення'
  },
  'limit-file-upload-desc': {
    en: 'Restrict file uploads until device is properly connected',
    uk: 'Обмежити завантаження файлів до правильного підключення пристрою'
  },
  'night-mode': {
    en: 'Night Mode',
    uk: 'Нічний режим'
  },
  'night-mode-desc': {
    en: 'Automatically reduce brightness during night hours',
    uk: 'Автоматично зменшувати яскравість у нічні години'
  },
  'start-time': {
    en: 'Start Time',
    uk: 'Час початку'
  },
  'end-time': {
    en: 'End Time',
    uk: 'Час завершення'
  },
  'night-brightness': {
    en: 'Night Brightness',
    uk: 'Яскравість вночі'
  },
  'disable-backlight': {
    en: 'Disable Backlight',
    uk: 'Вимкнути підсвітку'
  },
  'disable-backlight-desc': {
    en: 'Turn off backlight during night mode',
    uk: 'Вимкнути підсвітку під час нічного режиму'
  },
  'time-mode': {
    en: 'Time Mode',
    uk: 'Формат часу'
  },
  'time-mode-desc': {
    en: 'Choose between 24-hour or 12-hour time format',
    uk: 'Виберіть між 24-годинним або 12-годинним форматом часу'
  },
  timezone: {
    en: 'Timezone',
    uk: 'Часовий пояс'
  },
  'timezone-desc': {
    en: 'Select your local timezone for accurate time display',
    uk: 'Виберіть свій місцевий часовий пояс для точного відображення часу'
  },
  brightness: {
    en: 'Brightness',
    uk: 'Яскравість'
  },
  'brightness-desc': {
    en: 'Adjust the display brightness level',
    uk: 'Налаштуйте рівень яскравості дисплея'
  },
  'upload-file': {
    en: 'Upload File',
    uk: 'Завантажити файл'
  },
  'upload-file-desc': {
    en: 'Upload configuration or firmware files',
    uk: 'Завантажити файли конфігурації або прошивки'
  },
  automatic: {
    en: 'Automatic',
    uk: 'Автоматично'
  },
  manual: {
    en: 'Manual',
    uk: 'Вручну'
  },
  'timezone-auto-info': {
    en: 'Timezone will be detected automatically based on your IP address or browser settings.',
    uk: 'Часовий пояс буде визначено автоматично на основі вашої IP-адреси або налаштувань браузера.'
  },
  'current-timezone': {
    en: 'Current timezone',
    uk: 'Поточний часовий пояс'
  },
  'select-timezone': {
    en: 'Select Timezone',
    uk: 'Виберіть часовий пояс'
  },
  'select-timezone-placeholder': {
    en: 'Select timezone...',
    uk: 'Виберіть часовий пояс...'
  },
  'search-timezone': {
    en: 'Search timezone...',
    uk: 'Шукати часовий пояс...'
  },
  'no-timezones-found': {
    en: 'No timezones found',
    uk: 'Часові пояси не знайдено'
  },
  loading: {
    en: 'Loading...',
    uk: 'Завантаження...'
  },
  'watch-brightness': {
    en: 'Watch Brightness',
    uk: 'Яскравість годинника'
  },
  'file-upload': {
    en: 'File Upload',
    uk: 'Завантаження файлу'
  },
  'file-upload-desc': {
    en: 'Upload configuration files or firmware updates for your Nixie clock',
    uk: 'Завантажте файли конфігурації або оновлення прошивки для вашого Nixie годинника'
  },
  'drag-drop-file': {
    en: 'Drag and drop file here or click to select',
    uk: 'Перетягніть файл сюди або клацніть для вибору'
  },
  'supported-formats': {
    en: 'Supported formats',
    uk: 'Підтримувані формати'
  },
  'max-file-size': {
    en: 'Max file size',
    uk: 'Максимальний розмір'
  },
  'upload-file-button': {
    en: 'Upload File',
    uk: 'Завантажити файл'
  },
  uploading: {
    en: 'Uploading...',
    uk: 'Завантаження...'
  },
  'error-unsupported-format': {
    en: 'Unsupported file format. Please select a file with .bin, .hex or .json extension',
    uk: 'Непідтримуваний формат файлу. Будь ласка, виберіть файл з розширенням .bin, .zip'
  },
  'error-file-too-large': {
    en: 'File is too large. Maximum allowed size is',
    uk: 'Файл занадто великий. Максимально допустимий розмір'
  },
  'file-uploaded-success': {
    en: 'File uploaded successfully!',
    uk: 'Файл успішно завантажено!'
  },
  'upload-error': {
    en: 'Upload error. Please try again.',
    uk: 'Помилка завантаження. Будь ласка, спробуйте ще раз.'
  },
  'error-title': {
    en: 'Error',
    uk: 'Помилка'
  },
  'success-title': {
    en: 'Success',
    uk: 'Успіх'
  },
  'warning-title': {
    en: 'Warning',
    uk: 'Попередження'
  },
  'wifi-network': {
    en: 'Wi-Fi Network',
    uk: 'Wi-Fi мережа'
  },
  'wifi-network-desc': {
    en: 'Select a Wi-Fi network or enter manually',
    uk: 'Виберіть Wi-Fi мережу або введіть вручну'
  },
  'wifi-password': {
    en: 'Wi-Fi Password',
    uk: 'Пароль Wi-Fi'
  },
  'wifi-password-desc': {
    en: 'Enter the password for the selected network',
    uk: 'Введіть пароль для обраної мережі'
  },
  'select-network': {
    en: 'Select Network',
    uk: 'Виберіть мережу'
  },
  'select-network-placeholder': {
    en: 'Select a network...',
    uk: 'Виберіть мережу...'
  },
  'manual-entry': {
    en: 'Manual Entry',
    uk: 'Ручне введення'
  },
  'network-name': {
    en: 'Network Name (SSID)',
    uk: 'Назва мережі (SSID)'
  },
  'network-name-placeholder': {
    en: 'Enter network name...',
    uk: 'Введіть назву мережі...'
  },
  password: {
    en: 'Password',
    uk: 'Пароль'
  },
  'password-placeholder': {
    en: 'Enter password...',
    uk: 'Введіть пароль...'
  },
  'show-password': {
    en: 'Show password',
    uk: 'Показати пароль'
  },
  'hide-password': {
    en: 'Hide password',
    uk: 'Приховати пароль'
  },
  connect: {
    en: 'Connect',
    uk: 'Підключитися'
  },
  connecting: {
    en: 'Connecting...',
    uk: 'Підключення...'
  },
  connected: {
    en: 'Connected',
    uk: 'Підключено'
  },
  save: {
    en: 'Save',
    uk: 'Зберегти'
  },
  saving: {
    en: 'Saving...',
    uk: 'Збереження...'
  },
  saved: {
    en: 'Saved',
    uk: 'Збережено'
  },
  'wifi-saved-success': {
    en: 'WiFi settings saved successfully',
    uk: 'Налаштування WiFi успішно збережено'
  },
  'connection-info': {
    en: 'Connection Info',
    uk: 'Інформація про підключення'
  },
  network: {
    en: 'Network',
    uk: 'Мережа'
  },
  'no-network-selected': {
    en: 'No network selected',
    uk: 'Мережу не вибрано'
  },
  'password-required': {
    en: 'Password is required',
    uk: "Пароль обов'язковий"
  },
  'password-min-length': {
    en: 'Password must be at least 8 characters',
    uk: 'Пароль повинен містити принаймні 8 символів'
  },
  'network-required': {
    en: 'Network name is required',
    uk: "Назва мережі обов'язкова"
  },
  'wifi-connected-success': {
    en: 'Successfully connected to Wi-Fi',
    uk: 'Успішно підключено до Wi-Fi'
  },
  'wifi-connection-error': {
    en: 'Failed to connect to Wi-Fi',
    uk: 'Не вдалося підключитися до Wi-Fi'
  },
  'scanning-networks': {
    en: 'Scanning for networks...',
    uk: 'Пошук мереж...'
  },
  'no-networks-found': {
    en: 'No networks found',
    uk: 'Мережі не знайдено'
  },
  'refresh-networks': {
    en: 'Refresh Networks',
    uk: 'Оновити мережі'
  }
};
