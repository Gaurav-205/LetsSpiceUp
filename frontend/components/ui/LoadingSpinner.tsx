'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  return (
    <div className={`flex flex-col items-center justify-center font-primary ${className}`}>
      <div className="relative">
        <div 
          className={`animate-spin rounded-full border-4 border-transparent border-t-[#8A2BE2] border-r-[#BFFF00] ${sizeClasses[size]}`}
          style={{ boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)' }}
        />
        <div 
          className={`absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#BFFF00] border-r-[#8A2BE2] ${sizeClasses[size]}`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {message && (
        <p 
          className="mt-6 text-sm font-secondary animate-pulse" 
          style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.5)' }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

