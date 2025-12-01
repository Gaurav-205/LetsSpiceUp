'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import Toast from '@/components/ui/Toast';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

let toastId = 0;

// Global toast function
let globalShowToast: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (globalShowToast) {
    globalShowToast(message, type);
  } else {
    // Fallback to console if toast provider not ready
    // Toast logging removed for production
  }
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = toastId++;
    setToasts((prev) => [...prev, { message, type, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Set global function on mount
  useEffect(() => {
    globalShowToast = addToast;
    return () => {
      globalShowToast = null;
    };
  }, [addToast]);

  return (
    <>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

