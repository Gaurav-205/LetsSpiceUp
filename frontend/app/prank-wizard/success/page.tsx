'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function SuccessPage() {
  const router = useRouter();

  // Prevent body scrolling on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-h-screen h-screen h-[100dvh] relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0A0A0A', height: '100dvh' }}>
      {/* Background gradient overlay - matching landing page */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#8A2BE2]/8 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#8A2BE2]/3 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.6) 70%, rgba(138, 43, 226, 0.05) 100%)' }} />
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="rounded-lg backdrop-blur-sm border p-8 md:p-12 " style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
          {/* Success Animation - Removed checkmark */}

          {/* Success Message - Matching landing page style */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-primary mb-4  delay-200">
            <span className="block" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>
              Plan Created
            </span>
            <span className="block bg-clip-text text-transparent mt-2  delay-400" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
              Successfully!
            </span>
          </h1>
          <p className="text-base sm:text-lg font-body mb-8  delay-600" style={{ color: '#FFFFFF', opacity: 0.8, textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
            Your perfect prank plan is being generated. You&apos;ll receive it shortly!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center  delay-600">
            <Button
              onClick={() => router.push('/prank-wizard')}
              className="font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF] px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105"
              style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
            >
              Create Another
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/pranks')}
              className="font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg backdrop-blur-sm transition-all duration-300 rounded-xl"
              style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
            >
              View My Pranks
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/home')}
              className="font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg backdrop-blur-sm transition-all duration-300 rounded-xl"
              style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
            >
              Back to Home
            </Button>
          </div>

          {/* Optional: Discord Link */}
          <div className="mt-8 pt-8 border-t  delay-600" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
            <p className="text-sm sm:text-base font-body mb-4" style={{ color: '#FFFFFF', opacity: 0.7 }}>
              Want to join our community?
            </p>
            <Button
              variant="outline"
              onClick={() => {
                const discordLink = process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK || 'https://discord.gg/A4ptUUEr';
                window.open(discordLink, '_blank', 'noopener,noreferrer');
              }}
              className="font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg backdrop-blur-sm transition-all duration-300 rounded-xl"
              style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
            >
              💬 Join Discord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

