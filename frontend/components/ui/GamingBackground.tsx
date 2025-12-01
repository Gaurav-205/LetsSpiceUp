'use client';

interface GamingBackgroundProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export default function GamingBackground({ children, className = '', fullHeight = true }: GamingBackgroundProps) {
  return (
    <div 
      className={`min-h-screen relative overflow-x-hidden ${fullHeight ? 'h-screen' : ''} ${className}`} 
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#8A2BE2]/8 pointer-events-none" />
      <div 
        className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#8A2BE2]/3 pointer-events-none" 
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.6) 70%, rgba(138, 43, 226, 0.05) 100%)' }}
      />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

