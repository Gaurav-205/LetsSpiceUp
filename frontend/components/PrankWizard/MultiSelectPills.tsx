'use client';

import React from 'react';

interface MultiSelectPillsProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

const MultiSelectPills: React.FC<MultiSelectPillsProps> = ({
  options,
  selected,
  onChange,
  label,
  error,
  required = false,
  helpText,
}) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium font-body mb-3" style={{ fontSize: 'var(--font-size-label, 14px)', color: '#FFFFFF', opacity: 0.9 }}>
          {label}
          {required && <span className="ml-1" style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-body"
              style={{
                backgroundColor: isSelected ? '#8A2BE2' : 'rgba(10, 10, 10, 0.6)',
                color: isSelected ? '#FFFFFF' : '#FFFFFF',
                border: isSelected ? '1px solid #BFFF00' : '1px solid rgba(138, 43, 226, 0.3)',
                boxShadow: isSelected ? '0 0 10px rgba(138, 43, 226, 0.5)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#BFFF00';
                  e.currentTarget.style.boxShadow = '0 0 5px rgba(191, 255, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isSelected && <span className="mr-1">✓</span>}
              {option}
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

export default MultiSelectPills;

