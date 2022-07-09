import type { ToastPlacement, ToastProps } from './index';
import React from 'react';

export const ToastContext = React.createContext<
  | {
      toasts: ToastProps[];
      autoDismiss?: boolean;
      autoDismissTimeout?: number;
      setToasts: React.Dispatch<React.SetStateAction<ToastProps[]>>;
      defaultPlacement?: ToastPlacement;
    }
  | Record<string, never>
>({});

export type ToastProviderProps = {
  children: React.ReactNode;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  placement?: ToastPlacement;
};

export const ToastProvider = (props: ToastProviderProps) => {
  const { children, placement, autoDismiss, autoDismissTimeout } = props;
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  return (
    <ToastContext.Provider
      value={{ toasts, setToasts, defaultPlacement: placement, autoDismiss, autoDismissTimeout }}
    >
      {children}
    </ToastContext.Provider>
  );
};
