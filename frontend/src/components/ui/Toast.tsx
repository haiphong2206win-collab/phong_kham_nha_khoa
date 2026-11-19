import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  type?: ToastType;
  message: string;
  onClose?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'border-dental-success/30 bg-dental-success-bg text-dental-success',
    error: 'border-dental-error/30 bg-dental-error-bg text-dental-error',
    warning: 'border-amber-400/30 bg-amber-50 text-amber-800',
    info: 'border-dental-mint bg-dental-mint/30 text-dental-text',
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 shrink-0 text-dental-success" />,
    error: <XCircle className="h-5 w-5 shrink-0 text-dental-error" />,
    warning: <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />,
    info: <CheckCircle2 className="h-5 w-5 shrink-0 text-dental-accent" />,
  };

  return (
    <div
      role="status"
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-soft-card backdrop-blur-sm transition-all duration-300 max-w-sm ${styles[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium leading-snug flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-1 opacity-70 hover:opacity-100 hover:bg-black/5 transition-opacity"
          aria-label="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

