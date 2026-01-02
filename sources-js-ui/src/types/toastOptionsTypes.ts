type ToastType = 'error' | 'success' | 'warning';

export interface ToastOptions {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}
