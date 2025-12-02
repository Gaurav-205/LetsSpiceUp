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
    if (isMobileMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('nav')) {
          setIsMobileMenuOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 rounded-lg transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ 
                color: '#FFFFFF',
                backgroundColor: isMobileMenuOpen ? 'rgba(138, 43, 226, 0.2)' : 'transparent'
              }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg 
                className="w-6 h-6 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobile && (
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ borderTop: '1px solid rgba(138, 43, 226, 0.2)' }}
          >
            <div className="py-4 px-3 space-y-3">
              {/* Mobile Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="pb-3 mb-3 border-b" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                  <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                    {breadcrumbs.map((crumb, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index > 0 && <span>/</span>}
                        {crumb.href ? (
                          <Link 
                            href={crumb.href} 
                            className="hover:text-[#BFFF00] transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span>{crumb.label}</span>
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
                      <Link href="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <button 
                          className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 font-secondary border backdrop-blur-sm min-h-[44px]"
                          style={{ 
                            color: '#FFFFFF', 
                            borderColor: 'rgba(138, 43, 226, 0.4)',
                            backgroundColor: 'rgba(10, 10, 10, 0.3)',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          Sign In
                        </button>
                      </Link>
                      <Link href="/signup" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button 
                          className="w-full px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 border-0 font-secondary !bg-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] rounded-lg min-h-[44px]"
                          style={{ boxShadow: '0 4px 20px rgba(138, 43, 226, 0.5), 0 0 30px rgba(138, 43, 226, 0.2)' }}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                  {isAuthenticated && (
                    <div className="space-y-3">
                      {isAdmin && (
                        <Link href="/admin" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button 
                            className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 border font-secondary !border-[#BFFF00] !text-[#BFFF00] hover:!bg-[#BFFF00] hover:!text-[#0A0A0A] min-h-[44px]" 
                            style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(191, 255, 0, 0.5)' }}
                          >
                            Admin Portal
                          </Button>
                        </Link>
                      )}
                      <Link href="/home" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <button 
                          className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 font-secondary text-left min-h-[44px]"
                          style={{ color: '#FFFFFF', opacity: 0.8 }}
                        >
                          Home
                        </button>
                      </Link>
                      <Link href="/pranks" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <button 
                          className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 font-secondary text-left min-h-[44px]"
                          style={{ color: '#FFFFFF', opacity: 0.8 }}
                        >
                          My Pranks
                        </button>
                      </Link>
                      <Link href="/profile" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <button 
                          className="w-full text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 font-secondary text-left min-h-[44px]"
                          style={{ color: '#FFFFFF', opacity: 0.8 }}
                        >
                          Profile
                        </button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout} 
                        className="w-full text-sm font-medium px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 border font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] min-h-[44px]" 
                        style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
                      >
                        Logout
                      </Button>
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

