import React, { useState } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
  helpText?: string;
}

export default function Textarea({
  label,
  error,
  maxLength,
  showCharCount = false,
  helpText,
  className = '',
  value,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = typeof value === 'string' ? value.length : 0;
  const hasValue = charCount > 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.9;

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium font-body mb-1" style={{ fontSize: 'var(--font-size-label, 14px)', color: '#FFFFFF', opacity: 0.9 }}>
          {label}
          {props.required && <span className="ml-1" style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 font-body resize-none ${className}`}
          style={{
            minHeight: 'var(--input-height, 44px)',
            padding: 'var(--input-padding, 10px 12px)',
            borderRadius: 'var(--input-radius, 6px)',
            backgroundColor: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(10, 10, 10, 0.6)',
            borderColor: error 
              ? 'rgba(239, 68, 68, 0.5)' 
              : isFocused 
                ? '#BFFF00' 
                : 'rgba(138, 43, 226, 0.3)',
            color: '#FFFFFF',
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
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {hasValue && !error && (
          <div className="absolute top-2 right-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BFFF00' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {(showCharCount || helpText || error) && (
        <div className="flex items-center justify-between mt-1">
          <div className="flex-1">
            {helpText && !error && (
              <p className="text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.6 }}>{helpText}</p>
            )}
            {error && (
              <p className="text-xs font-body animate-fade-in" style={{ color: '#FCA5A5' }}>{error}</p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p 
              className={`text-xs font-body ml-2 ${isNearLimit ? 'font-semibold' : ''}`}
              style={{ 
                color: charCount >= maxLength ? '#EF4444' : isNearLimit ? '#F97316' : '#FFFFFF',
                opacity: 0.7
              }}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

