'use client';

import React from 'react';

interface RadioOption {
  value: string;
  emoji: string;
  label: string;
  description?: string;
}

interface RadioButtonGroupProps {
  options: RadioOption[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  selected,
  onChange,
  label,
  error,
  required = false,
  helpText,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium font-body mb-3" style={{ fontSize: 'var(--font-size-label, 14px)', color: '#FFFFFF', opacity: 0.9 }}>
          {label}
          {required && <span className="ml-1" style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="w-full p-4 rounded-lg border transition-all duration-200 text-left font-body"
              style={{
                backgroundColor: isSelected ? 'rgba(138, 43, 226, 0.2)' : 'rgba(10, 10, 10, 0.4)',
                borderColor: isSelected ? '#BFFF00' : 'rgba(138, 43, 226, 0.3)',
                boxShadow: isSelected ? '0 0 15px rgba(191, 255, 0, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(191, 255, 0, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(191, 255, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{option.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium font-secondary" style={{ color: '#FFFFFF' }}>{option.label}</div>
                  {option.description && (
                    <div className="text-sm font-body mt-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>{option.description}</div>
                  )}
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? '#BFFF00' : 'rgba(138, 43, 226, 0.5)',
                    backgroundColor: isSelected ? '#BFFF00' : 'transparent',
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0A0A0A' }}></div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {(helpText || error) && (
        <div className="mt-2">
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
};

export default RadioButtonGroup;

