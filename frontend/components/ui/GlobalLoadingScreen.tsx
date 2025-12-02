'use client';

/**
 * Global full-screen loading component matching the design
 * Dark background with circular spinner (lime green and purple)
 */
export default function GlobalLoadingScreen() {
  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Circular progress indicator with two segments */}
        <div className="relative">
          {/* Upper-left arc in lime green */}
          <div 
            className="animate-spin rounded-full h-20 w-20 border-4 border-transparent"
            style={{
              borderTopColor: '#BFFF00',
              borderLeftColor: '#BFFF00',
              boxShadow: '0 0 20px rgba(191, 255, 0, 0.5)',
            }}
          />
          {/* Lower-right arc in purple */}
          <div 
            className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent"
            style={{
              borderBottomColor: '#8A2BE2',
              borderRightColor: '#8A2BE2',
              animationDirection: 'reverse',
              animationDuration: '1.5s',
              boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)',
            }}
          />
        </div>
        {/* Loading text in lime green with glow */}
        <p 
          className="mt-6 text-lg font-medium animate-pulse"
          style={{ 
            color: '#BFFF00',
            textShadow: '0 0 10px rgba(191, 255, 0, 0.5)'
          }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}

