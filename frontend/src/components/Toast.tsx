'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        );
      })}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-600 text-white shadow-emerald-500/20';
      case 'error':
        return 'bg-rose-600 text-white shadow-rose-500/20';
      default:
        return 'bg-blue-600 text-white shadow-blue-500/20';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 shrink-0" />;
      default:
        return <Info className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 text-xs font-semibold ${getStyle()} animate-in slide-in-from-bottom-2`}
    >
      <div className="flex items-center gap-2">
        {getIcon()}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-white/80 hover:text-white rounded-lg transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
