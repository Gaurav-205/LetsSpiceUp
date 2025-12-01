import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  showSuccessIcon?: boolean;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helpText,
  showSuccessIcon = false,
  icon,
  className = '',
  value,
  type,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && (typeof value === 'string' ? value.trim().length > 0 : true);
  // Show success icon when field has value and no error
  const isValid = hasValue && !error;
  const showIcon = showSuccessIcon && isValid;

  // Determine if we should auto-format phone numbers
  const shouldFormatPhone = type !== 'phone' && props.name === 'yourPhone';

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium font-body mb-1" style={{ fontSize: 'var(--font-size-label, 14px)', color: '#FFFFFF', opacity: 0.9 }}>
          {label}
          {props.required && <span className="ml-1" style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {icon}
          </div>
        )}
        <input
          className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 font-body ${icon ? 'pl-10' : ''} ${showIcon ? 'pr-12' : ''} ${className}`}
          style={{
            height: 'var(--input-height, 44px)',
            paddingLeft: icon ? '40px' : '14px',
            paddingRight: showIcon ? '40px' : '14px',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderRadius: 'var(--input-radius, 6px)',
            minHeight: '44px',
            backgroundColor: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(10, 10, 10, 0.6)',
            borderColor: error 
              ? 'rgba(239, 68, 68, 0.5)' 
              : isFocused 
                ? '#BFFF00' 
                : 'rgba(138, 43, 226, 0.3)',
            color: '#FFFFFF',
            fontSize: 'var(--font-size-body, 16px)',
            boxShadow: isFocused && !error ? '0 0 0 2px rgba(191, 255, 0, 0.2)' : 'none',
          }}
          onFocus={(e) => {
            setIsFocused(true);
            if (!error) {
              e.currentTarget.style.borderColor = '#BFFF00';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(191, 255, 0, 0.2)';
            }
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (!error) {
              e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          type={type}
          value={value}
          {...props}
        />
        {showIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none animate-fade-in flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BFFF00' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {(helpText || error) && (
        <div className="mt-1">
          {helpText && !error && (
            <p className="text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.6 }}>{helpText}</p>
          )}
          {error && (
            <p className="text-xs font-body animate-fade-in" style={{ color: '#FCA5A5' }}>{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

