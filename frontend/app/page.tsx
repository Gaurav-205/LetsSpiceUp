'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Ballpit from '@/components/Ballpit';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to home if authenticated (use useEffect to avoid render-time state update)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // If authenticated, show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  const handleGetStarted = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen h-screen relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Ballpit Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <Ballpit
          count={100}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={true}
          className="w-full h-full"
        />
      </div>

      {/* Gradient Overlay for better text readability - reduced opacity to show shapes */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#8A2BE2]/8 z-[1] pointer-events-none" />
      
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#8A2BE2]/3 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.6) 70%, rgba(138, 43, 226, 0.05) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Navigation */}
        <Navbar showAuthButtons={true} />

        {/* Hero Section - Centered in remaining space */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto text-center w-full">
            <div className="space-y-6 sm:space-y-8">
              {/* Main Heading */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight font-primary">
                  <span className="block" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>Plan the Perfect</span>
                  <span className="block mt-1 sm:mt-2">
                    <span style={{ color: '#8A2BE2', textShadow: '0 0 20px rgba(138, 43, 226, 0.5), 0 0 40px rgba(138, 43, 226, 0.3)' }}>Prank</span>
                    <span className="ml-2 sm:ml-3" style={{ color: '#BFFF00', textShadow: '0 0 20px rgba(191, 255, 0, 0.5), 0 0 40px rgba(191, 255, 0, 0.3)' }}>Experience</span>
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4 font-body" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)', opacity: 0.95 }}>
                Describe your friend, and we'll craft a personalized prank plan tailored to their personality
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-5 md:pt-6 px-4 relative z-20">
                <Button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105 active:scale-95 border-0 min-w-[130px] sm:min-w-[150px] md:min-w-[160px] font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF]"
                  style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)', position: 'relative', zIndex: 20 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(138, 43, 226, 0.6), 0 0 30px rgba(138, 43, 226, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)';
                  }}
                >
                  Get Started
                </Button>
                <Link href="/login" className="w-full sm:w-auto relative z-20">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold border-2 rounded-xl transition-all duration-300 backdrop-blur-sm min-w-[130px] sm:min-w-[150px] md:min-w-[160px] font-secondary !border-[#8A2BE2] !text-[#FFFFFF] !bg-transparent hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00]"
                    style={{ boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)', position: 'relative', zIndex: 20 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 25px rgba(191, 255, 0, 0.5), 0 0 20px rgba(191, 255, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(138, 43, 226, 0.3)';
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 sm:pt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs sm:text-sm font-body">
                <div className="flex items-center gap-2 group cursor-default transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(191,255,0,0.8)]" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#BFFF00', filter: 'drop-shadow(0 0 5px rgba(191, 255, 0, 0.5))' }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium transition-colors duration-300 group-hover:text-[#BFFF00]" style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>Free to Use</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(191,255,0,0.8)]" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#BFFF00', filter: 'drop-shadow(0 0 5px rgba(191, 255, 0, 0.5))' }}>
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium transition-colors duration-300 group-hover:text-[#BFFF00]" style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(191,255,0,0.8)]" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#BFFF00', filter: 'drop-shadow(0 0 5px rgba(191, 255, 0, 0.5))' }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium transition-colors duration-300 group-hover:text-[#BFFF00]" style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>Personalized Plans</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
