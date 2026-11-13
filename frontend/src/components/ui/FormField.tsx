import React, { forwardRef } from 'react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, leftIcon, rightIcon, id, className = '', required, ...props }, ref) => {
    const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-dental-text/80"
        >
          {label} {required && <span className="text-dental-error">*</span>}
        </label>

        <div className="relative rounded-xl shadow-soft-input">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-dental-muted">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-dental-text placeholder:text-dental-muted/50 transition-all duration-150 ease-out focus:border-dental-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-dental-accent/20 disabled:cursor-not-allowed disabled:bg-dental-bg disabled:text-dental-muted ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-dental-error focus:border-dental-error focus:ring-dental-error/20'
                : 'border-dental-border hover:border-dental-muted/50'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-dental-error flex items-center gap-1 mt-1 animate-fadeIn">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-dental-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

