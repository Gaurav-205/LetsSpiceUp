import React, { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showStrength?: boolean;
}

export default function PasswordInput({
  label,
  error,
  showStrength = false,
  className = '',
  value,
  onChange,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = value as string || '';

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];

    return {
      strength: Math.min(strength, 5),
      ...levels[Math.min(strength, 4)],
    };
  };

  const strength = showStrength ? getPasswordStrength(passwordValue) : null;

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium font-body mb-1" style={{ fontSize: 'var(--font-size-label, 14px)', color: '#FFFFFF', opacity: 0.9 }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 font-body ${className}`}
          style={{
            height: 'var(--input-height, 44px)',
            paddingLeft: '14px',
            paddingRight: '50px',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderRadius: 'var(--input-radius, 6px)',
            minHeight: '44px',
            backgroundColor: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(10, 10, 10, 0.6)',
            borderColor: error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(138, 43, 226, 0.3)',
            color: '#FFFFFF',
            fontSize: '16px', // Always 16px to prevent iOS auto-zoom
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = '#BFFF00';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(191, 255, 0, 0.2)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          onInvalid={(e) => {
            e.preventDefault();
            // Prevent browser's default validation tooltip
          }}
          {...props}
          value={passwordValue}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
          style={{ 
            color: '#FFFFFF', 
            opacity: 0.6,
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#BFFF00'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = '#FFFFFF'; }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs font-body animate-fade-in" style={{ color: '#FCA5A5' }}>{error}</p>
      )}
      {showStrength && strength && passwordValue && (
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 rounded-full h-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: `${(strength.strength / 5) * 100}%`,
                  backgroundColor: strength.strength <= 1 ? '#EF4444' : 
                                   strength.strength <= 2 ? '#F97316' : 
                                   strength.strength <= 3 ? '#EAB308' : 
                                   strength.strength <= 4 ? '#8A2BE2' : '#BFFF00'
                }}
              />
            </div>
            <span className="text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>{strength.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}

