import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 rounded-xl';
  
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:ring-teal-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-gray-500',
    outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed focus:ring-teal-500',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        minHeight: 'var(--btn-height, 48px)',
        padding: 'var(--btn-padding, 12px 24px)',
        borderRadius: 'var(--btn-radius, 12px)',
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

