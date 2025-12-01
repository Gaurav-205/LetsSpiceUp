'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen h-screen relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <Navbar />

        {/* Background gradient overlay - matching landing page */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#8A2BE2]/8 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#8A2BE2]/3 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.6) 70%, rgba(138, 43, 226, 0.05) 100%)' }} />

        <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto w-full">
            <div className="animate-fade-in space-y-6 sm:space-y-8">
              {/* Hero Welcome Section - Matching landing page style */}
              <div className="space-y-3 sm:space-y-4 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight font-primary">
                  <span className="block animate-fade-in delay-200" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>
                    Welcome back,
                  </span>
                  <span className="block bg-clip-text text-transparent mt-1 sm:mt-2 animate-fade-in delay-400" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                    {user?.name?.split(' ')[0]}!
                  </span>
                </h1>
              </div>

              {/* Subtitle - Matching landing page */}
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4 font-body animate-fade-in delay-600 text-center" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)', opacity: 0.95 }}>
                Ready to craft the perfect prank? Let's create something legendary together.
              </p>

              {/* CTA Buttons - Matching landing page style */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 px-4">
                <Link href="/prank-wizard" className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105 active:scale-95 border-0 min-w-[140px] sm:min-w-[160px] font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF] animate-fade-in delay-600"
                    style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 40px rgba(138, 43, 226, 0.6), 0 0 30px rgba(138, 43, 226, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)';
                    }}
                  >
                    Plan a Prank
                  </Button>
                </Link>
                <Link href="/pranks" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold border-2 rounded-xl transition-all duration-300 backdrop-blur-sm min-w-[140px] sm:min-w-[160px] font-secondary !border-[#8A2BE2] !text-[#FFFFFF] !bg-transparent hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] animate-fade-in delay-600"
                    style={{ boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 25px rgba(191, 255, 0, 0.5), 0 0 20px rgba(191, 255, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(138, 43, 226, 0.3)';
                    }}
                  >
                    View My Pranks
                  </Button>
                </Link>
              </div>

              {/* Account Information - Styled as trust indicators */}
              <div className="pt-8 sm:pt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs sm:text-sm font-body animate-fade-in delay-600">
                <div className="flex items-center gap-2 group cursor-default transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(191,255,0,0.8)]" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#BFFF00', filter: 'drop-shadow(0 0 5px rgba(191, 255, 0, 0.5))' }}>
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium transition-colors duration-300 group-hover:text-[#BFFF00]" style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>{user?.name}</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(191,255,0,0.8)]" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#BFFF00', filter: 'drop-shadow(0 0 5px rgba(191, 255, 0, 0.5))' }}>
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="font-medium transition-colors duration-300 group-hover:text-[#BFFF00]" style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

