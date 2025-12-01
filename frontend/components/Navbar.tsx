'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import MobileMenu from './MobileMenu';

interface NavbarProps {
  showAuthButtons?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  rightContent?: React.ReactNode;
}

export default function Navbar({ 
  showAuthButtons = false, 
  breadcrumbs,
  rightContent 
}: NavbarProps) {
  const router = useRouter();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="backdrop-blur-2xl border-b transition-all duration-300 fixed top-0 left-0 right-0 z-[9999] relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(15, 15, 15, 0.95) 30%, rgba(10, 10, 10, 0.95) 60%, rgba(5, 5, 5, 0.95) 100%)',
      borderColor: 'rgba(138, 43, 226, 0.2)', 
      borderTopColor: 'rgba(191, 255, 0, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(138, 43, 226, 0.15)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      backdropFilter: 'blur(20px) saturate(180%)'
    }}>
      {/* Glass reflection effect */}
      <div className="absolute inset-0 opacity-10" style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
        pointerEvents: 'none'
      }}></div>
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-30" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(191, 255, 0, 0.4) 50%, transparent 100%)',
        pointerEvents: 'none'
      }}></div>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
            {/* Mobile Menu Button - Available for all users */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-[#8A2BE2]/20 active:bg-[#8A2BE2]/30"
              style={{ color: '#FFFFFF' }}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center group min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight transition-all duration-300 font-primary truncate" style={{ color: '#BFFF00', letterSpacing: '0.05em', textShadow: '0 0 20px rgba(191, 255, 0, 0.5)' }}>
                <span className="group-hover:drop-shadow-[0_0_15px_rgba(191,255,0,0.8)] transition-all duration-300">
                  Prank Wizard
                </span>
              </h1>
            </Link>
            
            {/* Breadcrumbs - Hidden on mobile, shown on tablet+ */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 md:gap-3 md:gap-4">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 md:gap-4">
                    <span className="font-body text-xs md:text-sm" style={{ color: '#FFFFFF', opacity: 0.5 }}>/</span>
                    {crumb.href ? (
                      <Link href={crumb.href} className="font-body text-xs md:text-sm transition-colors duration-300 hover:text-[#BFFF00] truncate max-w-[120px] md:max-w-none" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-body text-xs md:text-sm truncate max-w-[120px] md:max-w-none" style={{ color: '#FFFFFF', opacity: 0.8 }}>{crumb.label}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {rightContent ? rightContent : (
              <>
                {showAuthButtons && !isAuthenticated && (
                  <>
                    <Link href="/login" className="flex items-center">
                      <button 
                        className="text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap font-secondary border backdrop-blur-sm"
                        style={{ 
                          color: '#FFFFFF', 
                          borderColor: 'rgba(138, 43, 226, 0.4)',
                          backgroundColor: 'rgba(10, 10, 10, 0.3)',
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(191, 255, 0, 0.6)';
                          e.currentTarget.style.color = '#BFFF00';
                          e.currentTarget.style.backgroundColor = 'rgba(191, 255, 0, 0.1)';
                          e.currentTarget.style.boxShadow = '0 0 15px rgba(191, 255, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.4)';
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.3)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Sign In
                      </button>
                    </Link>
                    <Link href="/signup" className="flex items-center">
                      <Button 
                        className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 border-0 whitespace-nowrap font-secondary !bg-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] rounded-lg"
                        style={{ boxShadow: '0 4px 20px rgba(138, 43, 226, 0.5), 0 0 30px rgba(138, 43, 226, 0.2)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 6px 30px rgba(191, 255, 0, 0.6), 0 0 40px rgba(191, 255, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(138, 43, 226, 0.5), 0 0 30px rgba(138, 43, 226, 0.2)';
                        }}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center">
                        <Button 
                          className="text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg transition-all duration-300 border whitespace-nowrap font-secondary !border-[#BFFF00] !text-[#BFFF00] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A]" 
                          style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(191, 255, 0, 0.5)' }}
                        >
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg backdrop-blur-sm transition-all duration-300 border whitespace-nowrap font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00]" 
                      style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Mobile Actions - Only show for non-authenticated users on mobile */}
          {!isAuthenticated && showAuthButtons && (
            <div className="md:hidden flex items-center gap-2">
              <Link href="/login" className="flex items-center">
                <button 
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-300 font-secondary border backdrop-blur-sm"
                  style={{ 
                    color: '#FFFFFF', 
                    borderColor: 'rgba(138, 43, 226, 0.4)',
                    backgroundColor: 'rgba(10, 10, 10, 0.3)',
                  }}
                >
                  Sign In
                </button>
              </Link>
              <Link href="/signup" className="flex items-center">
                <Button 
                  className="px-3 py-1.5 text-xs font-semibold font-secondary !bg-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] rounded-lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </nav>
  );
}

