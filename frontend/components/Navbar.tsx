'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
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
          {/* Left side - Logo and Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
            <Link 
              href={isAuthenticated ? "/home" : "/"} 
              className="flex items-center group flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight transition-all duration-300 font-primary whitespace-nowrap" style={{ color: '#BFFF00', letterSpacing: '0.05em', textShadow: '0 0 20px rgba(191, 255, 0, 0.5)' }}>
                <span className="group-hover:drop-shadow-[0_0_15px_rgba(191,255,0,0.8)] transition-all duration-300">
                  Prank Wizard
                </span>
              </h1>
            </Link>
            {/* Breadcrumbs - Hidden on very small screens, shown on larger */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 md:gap-3 min-w-0 overflow-hidden">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <span className="font-body text-xs md:text-sm flex-shrink-0" style={{ color: '#FFFFFF', opacity: 0.5 }}>/</span>
                    {crumb.href ? (
                      <Link 
                        href={crumb.href} 
                        className="font-body text-xs md:text-sm transition-colors duration-300 hover:text-[#BFFF00] truncate max-w-[120px] md:max-w-[200px]" 
                        style={{ color: '#FFFFFF', opacity: 0.8 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-body text-xs md:text-sm truncate max-w-[120px] md:max-w-[200px]" style={{ color: '#FFFFFF', opacity: 0.8 }}>{crumb.label}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {rightContent ? rightContent : (
              <>
                {showAuthButtons && !isAuthenticated && (
                  <>
                    <Link href="/login" className="flex items-center">
                      <button 
                        className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap font-secondary border backdrop-blur-sm min-h-[44px]"
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
                        className="px-5 py-2 text-sm font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 border-0 whitespace-nowrap font-secondary !bg-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] rounded-lg min-h-[44px]"
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
                          className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 border whitespace-nowrap font-secondary !border-[#BFFF00] !text-[#BFFF00] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] min-h-[44px]" 
                          style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(191, 255, 0, 0.5)' }}
                        >
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="text-sm font-medium px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 border whitespace-nowrap font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] min-h-[44px]" 
                      style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button - Enhanced Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="relative p-2.5 rounded-lg transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center group"
              style={{ 
                color: '#FFFFFF',
                backgroundColor: isMobileMenuOpen ? 'rgba(138, 43, 226, 0.3)' : 'rgba(10, 10, 10, 0.3)',
                border: `1px solid ${isMobileMenuOpen ? 'rgba(191, 255, 0, 0.4)' : 'rgba(138, 43, 226, 0.2)'}`,
                boxShadow: isMobileMenuOpen 
                  ? '0 0 20px rgba(191, 255, 0, 0.3), 0 0 40px rgba(138, 43, 226, 0.2)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isMobileMenuOpen) {
                  e.currentTarget.style.backgroundColor = 'rgba(138, 43, 226, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.4)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(138, 43, 226, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobileMenuOpen) {
                  e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.2)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                }
              }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {/* Animated Hamburger Icon */}
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span 
                  className="block h-0.5 w-full rounded-full transition-all duration-300 origin-center"
                  style={{
                    backgroundColor: isMobileMenuOpen ? '#BFFF00' : '#FFFFFF',
                    transform: isMobileMenuOpen 
                      ? 'rotate(45deg) translateY(8px) translateX(0)' 
                      : 'rotate(0) translateY(0)',
                    boxShadow: isMobileMenuOpen 
                      ? '0 0 10px rgba(191, 255, 0, 0.8)' 
                      : 'none'
                  }}
                />
                <span 
                  className="block h-0.5 w-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isMobileMenuOpen ? 'transparent' : '#FFFFFF',
                    opacity: isMobileMenuOpen ? 0 : 1,
                    transform: isMobileMenuOpen ? 'scaleX(0)' : 'scaleX(1)'
                  }}
                />
                <span 
                  className="block h-0.5 w-full rounded-full transition-all duration-300 origin-center"
                  style={{
                    backgroundColor: isMobileMenuOpen ? '#BFFF00' : '#FFFFFF',
                    transform: isMobileMenuOpen 
                      ? 'rotate(-45deg) translateY(-8px) translateX(0)' 
                      : 'rotate(0) translateY(0)',
                    boxShadow: isMobileMenuOpen 
                      ? '0 0 10px rgba(191, 255, 0, 0.8)' 
                      : 'none'
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Enhanced */}
        {isMobile && (
          <div 
            className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
              isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ 
              borderTop: '1px solid rgba(138, 43, 226, 0.3)',
              background: isMobileMenuOpen 
                ? 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(15, 15, 15, 0.98) 100%)'
                : 'transparent',
              backdropFilter: isMobileMenuOpen ? 'blur(20px) saturate(180%)' : 'none',
              boxShadow: isMobileMenuOpen 
                ? '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(138, 43, 226, 0.2)' 
                : 'none'
            }}
          >
            <div 
              className={`py-4 px-4 space-y-2 transition-all duration-500 ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}
            >
              {/* Mobile Breadcrumbs - Enhanced */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div 
                  className="pb-3 mb-3 border-b transition-all duration-500"
                  style={{ 
                    borderColor: 'rgba(138, 43, 226, 0.3)',
                    animationDelay: '100ms'
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                    {breadcrumbs.map((crumb, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                        style={{ 
                          animationDelay: `${(index + 1) * 50}ms`,
                          transitionDelay: `${(index + 1) * 50}ms`
                        }}
                      >
                        {index > 0 && (
                          <span style={{ color: '#8A2BE2', opacity: 0.5 }}>/</span>
                        )}
                        {crumb.href ? (
                          <Link 
                            href={crumb.href} 
                            className="hover:text-[#BFFF00] transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(191,255,0,0.6)]"
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{ textShadow: '0 0 5px rgba(255, 255, 255, 0.1)' }}
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span style={{ color: '#BFFF00', textShadow: '0 0 8px rgba(191, 255, 0, 0.4)' }}>
                            {crumb.label}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Right Content */}
              {rightContent ? (
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  {rightContent}
                </div>
              ) : (
                <>
                  {showAuthButtons && !isAuthenticated && (
                    <div className="space-y-3">
                      <Link 
                        href="/login" 
                        className="block transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ animationDelay: '150ms' }}
                      >
                        <button 
                          className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 font-secondary border backdrop-blur-sm min-h-[44px] relative overflow-hidden group"
                          style={{ 
                            color: '#FFFFFF', 
                            borderColor: 'rgba(138, 43, 226, 0.4)',
                            backgroundColor: 'rgba(10, 10, 10, 0.4)',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(191, 255, 0, 0.6)';
                            e.currentTarget.style.color = '#BFFF00';
                            e.currentTarget.style.backgroundColor = 'rgba(191, 255, 0, 0.1)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(191, 255, 0, 0.3), 0 0 30px rgba(191, 255, 0, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.4)';
                            e.currentTarget.style.color = '#FFFFFF';
                            e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.4)';
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                          }}
                        >
                          <span className="relative z-10">Sign In</span>
                        </button>
                      </Link>
                      <Link 
                        href="/signup" 
                        className="block transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ animationDelay: '200ms' }}
                      >
                        <Button 
                          className="w-full px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 border-0 font-secondary !bg-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] rounded-lg min-h-[44px] relative overflow-hidden"
                          style={{ 
                            boxShadow: '0 4px 20px rgba(138, 43, 226, 0.5), 0 0 30px rgba(138, 43, 226, 0.2)',
                            background: 'linear-gradient(135deg, #8A2BE2 0%, #9B3DF3 100%)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 6px 30px rgba(191, 255, 0, 0.6), 0 0 40px rgba(191, 255, 0, 0.3)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #BFFF00 0%, #D4FF4D 100%)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(138, 43, 226, 0.5), 0 0 30px rgba(138, 43, 226, 0.2)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #8A2BE2 0%, #9B3DF3 100%)';
                          }}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                  {isAuthenticated && (
                    <div className="space-y-2">
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          className="block transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{ animationDelay: '150ms' }}
                        >
                          <Button 
                            className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 border font-secondary !border-[#BFFF00] !text-[#BFFF00] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] min-h-[44px] relative overflow-hidden" 
                            style={{ 
                              backgroundColor: 'rgba(191, 255, 0, 0.05)',
                              textShadow: '0 0 10px rgba(191, 255, 0, 0.5)',
                              boxShadow: '0 2px 15px rgba(191, 255, 0, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 4px 25px rgba(191, 255, 0, 0.4), 0 0 30px rgba(191, 255, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 2px 15px rgba(191, 255, 0, 0.2)';
                            }}
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Admin Portal
                            </span>
                          </Button>
                        </Link>
                      )}
                      {[
                        { href: '/home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { href: '/pranks', label: 'My Pranks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                        { href: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
                      ].map((item, index) => (
                        <Link 
                          key={item.href}
                          href={item.href} 
                          className="block transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{ animationDelay: `${(index + (isAdmin ? 2 : 1)) * 50 + 150}ms` }}
                        >
                          <button 
                            className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 font-secondary text-left min-h-[44px] flex items-center gap-3 group relative overflow-hidden"
                            style={{ 
                              color: '#FFFFFF', 
                              backgroundColor: 'rgba(10, 10, 10, 0.3)',
                              border: '1px solid rgba(138, 43, 226, 0.2)',
                              opacity: 0.9
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(138, 43, 226, 0.15)';
                              e.currentTarget.style.borderColor = 'rgba(191, 255, 0, 0.4)';
                              e.currentTarget.style.color = '#BFFF00';
                              e.currentTarget.style.opacity = '1';
                              e.currentTarget.style.boxShadow = '0 2px 15px rgba(191, 255, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.3)';
                              e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.2)';
                              e.currentTarget.style.color = '#FFFFFF';
                              e.currentTarget.style.opacity = '0.9';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <svg 
                              className="w-5 h-5 transition-all duration-300 group-hover:scale-110" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            <span className="flex-1">{item.label}</span>
                            <svg 
                              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </Link>
                      ))}
                      <div 
                        className="pt-2 mt-2 border-t"
                        style={{ 
                          borderColor: 'rgba(138, 43, 226, 0.2)',
                          animationDelay: `${(isAdmin ? 4 : 3) * 50 + 200}ms`
                        }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={handleLogout} 
                          className="w-full text-sm font-medium px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 border font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] min-h-[44px] flex items-center justify-center gap-2" 
                          style={{ 
                            backgroundColor: 'rgba(10, 10, 10, 0.4)',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 2px 10px rgba(138, 43, 226, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(191, 255, 0, 0.3), 0 0 30px rgba(191, 255, 0, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(138, 43, 226, 0.2)';
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

