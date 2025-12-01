'use client';

import React from 'react';

interface MascotProps {
  expression?: 'excited' | 'thinking' | 'mischievous' | 'happy';
  size?: 'small' | 'medium' | 'large';
}

const Mascot: React.FC<MascotProps> = ({ expression = 'happy', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-64 h-64',
  };

  const getExpression = () => {
    switch (expression) {
      case 'excited':
        return '😈';
      case 'thinking':
        return '🤔';
      case 'mischievous':
        return '😏';
      case 'happy':
      default:
        return '😊';
    }
  };

  return (
    <div className={`${sizeClasses[size]} relative animate-bounce-slow`}>
      <div className="relative w-full h-full">
        {/* Main Character - Playful Ghost/Devil */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Body - Rounded shape */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-full w-full h-full shadow-lg flex items-center justify-center">
              <span className="text-6xl md:text-8xl">{getExpression()}</span>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-teal-300 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mascot;

