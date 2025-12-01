'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium font-secondary" style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.3)' }}>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(138, 43, 226, 0.2)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ 
            width: `${percentage}%`,
            background: 'linear-gradient(to right, #8A2BE2, #BFFF00)',
            boxShadow: '0 0 10px rgba(191, 255, 0, 0.5)'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

