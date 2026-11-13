import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border border-dental-error/30 bg-dental-error-bg px-3.5 py-2.5 text-sm text-dental-error transition-all duration-200 ${className}`}
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
      <span className="leading-snug">{message}</span>
    </div>
  );
};

