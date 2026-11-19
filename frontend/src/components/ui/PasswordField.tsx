import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormField, FormFieldProps } from './FormField';

export interface PasswordFieldProps extends Omit<FormFieldProps, 'type' | 'rightIcon'> {
  showToggle?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    const toggleButton = showToggle ? (
      <button
        type="button"
        onClick={toggleVisibility}
        className="rounded-lg p-1 text-dental-muted hover:text-dental-text hover:bg-dental-mint/30 focus:outline-none focus:ring-2 focus:ring-dental-accent transition-colors"
        aria-label={isVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        tabIndex={-1}
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    ) : undefined;

    return (
      <FormField
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        rightIcon={toggleButton}
        {...props}
      />
    );
  }
);

PasswordField.displayName = 'PasswordField';
