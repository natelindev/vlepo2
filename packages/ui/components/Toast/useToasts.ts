import { Optional } from 'helpers';
import { useContext } from 'react';
import { v4 } from 'uuid';

import { ToastContext } from './ToastProvider';

import type { ToastProps } from './index';

export const useToasts = () => {
  const {
    toasts,
    setToasts,
    autoDismiss = true,
    autoDismissTimeout = 5000,
  } = useContext(ToastContext);

  const addToast = (toast: Optional<ToastProps, 'id'>) => {
    const { id = v4(), duration = autoDismissTimeout } = toast;
    setToasts([...toasts, { ...toast, id }]);
    if (autoDismiss) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  };
};
