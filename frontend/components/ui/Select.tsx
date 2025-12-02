import React, { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

export default function Select({
  label,
  error,
  options,
  placeholder = 'Select an option',
  helpText,
  className = '',
  value,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value !== '';

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium font-body mb-1" style={{ fontSize: 'var(--font-size-label, 14px)', color: '#FFFFFF', opacity: 0.9 }}>
          {label}
          {props.required && <span className="ml-1" style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 font-body appearance-none cursor-pointer ${className}`}
          style={{
            height: 'var(--input-height, 44px)',
            padding: 'var(--input-padding, 10px 12px)',
            paddingRight: '40px',
            borderRadius: 'var(--input-radius, 6px)',
            minHeight: '44px',
            backgroundColor: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(10, 10, 10, 0.6)',
            borderColor: error 
              ? 'rgba(239, 68, 68, 0.5)' 
              : isFocused 
                ? '#BFFF00' 
                : 'rgba(138, 43, 226, 0.3)',
            color: hasValue ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
            fontSize: '16px', // Always 16px to prevent iOS auto-zoom
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
          value={value}
          {...props}
        >
          <option value="" disabled style={{ backgroundColor: '#0A0A0A', color: 'rgba(255, 255, 255, 0.5)' }}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div 
          className="absolute right-3 top-1/2 pointer-events-none transition-transform duration-200 flex items-center justify-center"
          style={{ 
            transform: isFocused ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
            color: isFocused ? '#BFFF00' : 'rgba(255, 255, 255, 0.6)',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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

