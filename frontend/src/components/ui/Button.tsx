import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dental-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  // Variants using SOFT DENTAL PREMIUM palette
  const variantStyles = {
    primary: 'bg-dental-accent text-white hover:bg-dental-accent-hover active:bg-[#4E8E82] shadow-sm hover:shadow-soft-float',
    secondary: 'bg-dental-mint text-dental-text hover:bg-[#CFE8E3] active:bg-[#BFE0D9]',
    outline: 'border border-dental-border bg-white text-dental-text hover:bg-dental-bg hover:border-dental-accent active:bg-dental-mint',
    ghost: 'text-dental-text hover:bg-dental-mint/50 active:bg-dental-mint',
  };

  // Sizes with minimum touch target >= 44px for accessibility
  const sizeStyles = {
    sm: 'text-xs px-3 py-2 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3 min-h-[50px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Đang xử lý...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

