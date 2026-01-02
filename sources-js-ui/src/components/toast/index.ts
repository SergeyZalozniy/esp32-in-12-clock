import './toast.scss';
import type { ToastOptions } from '@app-types/toastOptionsTypes.ts';

const createToast = (options: ToastOptions): void => {
  const { type, title, message, duration = 5000 } = options;

  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.classList.add('toast--hiding');
    setTimeout(() => {
      existingToast.remove();
      showNewToast();
    }, 300);
  } else {
    showNewToast();
  }

  function showNewToast() {
    const toast = document.createElement('div');
    toast.className = `toast flex items-start gap-12 toast--${type}`;

    const iconMap = {
      error: '✕',
      success: '✓',
      warning: '⚠'
    };

    toast.innerHTML = `
      <div class="toast__icon flex-shrink-0 flex items-center justify-center">${iconMap[type]}</div>
      <div class="toast__content flex-1">
        <h4 class="toast__title">${title}</h4>
        <p class="toast__message">${message}</p>
      </div>
      <button class="toast__close flex-shrink-0 flex items-center justify-center" type="button">×</button>
    `;

    document.body.appendChild(toast);

    const closeButton = toast.querySelector('.toast__close');
    const closeToast = () => {
      toast.classList.add('toast--hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    };

    if (closeButton) {
      closeButton.addEventListener('click', closeToast);
    }

    if (duration > 0) {
      setTimeout(closeToast, duration);
    }
  }
};

export const showErrorToast = (title: string, message: string): void => {
  createToast({ type: 'error', title, message });
};

export const showSuccessToast = (title: string, message: string): void => {
  createToast({ type: 'success', title, message });
};

export const showWarningToast = (title: string, message: string): void => {
  createToast({ type: 'warning', title, message });
};
