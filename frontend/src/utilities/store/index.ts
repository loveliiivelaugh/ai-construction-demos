import { create } from 'zustand';
import { useExampleFeatureStore } from './exampleFeatureStore';

interface AlertType {
  severity: 'success' | 'error' | 'warning' | 'info';
  message: string;
  open: boolean;
}

interface ConfirmType {
  open: boolean;
  title?: string;
  message?: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  continueText?: string;
  cancelText?: string;
  onConfirm?: (answer: boolean, resolve?: (value: boolean | PromiseLike<boolean>) => void) => void | Promise<void>;
  onCancel?: (answer: boolean) => void;
}

interface UtilityStoreType {
  alert: AlertType;
  confirm: ConfirmType;
  colorMode: 'light' | 'dark';
  setConfirm: (confirm: UtilityStoreType['confirm']) => void;
  clearConfirm: () => void;
  setColorMode: (colorMode: UtilityStoreType['colorMode']) => void;
  setAlert: (alert: UtilityStoreType['alert']) => void;
  createAlert: (severity: AlertType['severity'], message: string) => void;
}

const COLOR_MODE_STORAGE_KEY = 'starter.colorMode';

function getInitialColorMode(): UtilityStoreType['colorMode'] {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'light';
}

const useUtilityStore = create<UtilityStoreType>((set) => ({
  colorMode: getInitialColorMode(),
  alert: {
    severity: 'success',
    message: '',
    open: false,
  },
  confirm: {
    open: false,
    title: '',
    message: '',
  },
  setConfirm: (confirm) => set(() => ({ confirm })),
  clearConfirm: () => set(() => ({ confirm: { open: false, title: '', message: '' } })),
  setColorMode: (colorMode) =>
    set(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
      }
      return { colorMode };
    }),
  setAlert: (alert) => set((old) => ({ ...old, alert })),
  createAlert: (severity, message) => set(() => ({ alert: { severity, message, open: true } })),
}));

export { useUtilityStore, useExampleFeatureStore };
export type { AlertType, ConfirmType, UtilityStoreType };
