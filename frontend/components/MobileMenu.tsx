'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, isAdmin, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Blocks all interactions outside menu */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] md:hidden animate-fade-in"
        onClick={onClose}
        onTouchStart={(e) => {
          // Prevent any touch interactions outside the menu
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        style={{
          pointerEvents: 'auto',
        }}
      />
      
      {/* Menu Drawer - Wider to cover majority of screen */}
      <div
        className="fixed top-0 right-0 bottom-0 w-96 max-w-[90vw] bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] border-l z-[9999] md:hidden overflow-y-auto animate-slide-in-right"
        style={{
          borderColor: 'rgba(138, 43, 226, 0.3)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => {
          // Prevent clicks inside menu from closing it
          e.stopPropagation();
        }}
      >
        <div className="p-6 pb-24 space-y-6">
          {/* Header with User Info */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
            <div className="flex items-center gap-3">
              {user && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-primary text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #8A2BE2, #BFFF00)',
                    color: '#0A0A0A',
                    boxShadow: '0 0 15px rgba(191, 255, 0, 0.4)',
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold font-primary" style={{ color: '#BFFF00', textShadow: '0 0 20px rgba(191, 255, 0, 0.5)' }}>
                  {user?.name?.split(' ')[0] || 'Menu'}
                </h2>
                {user && (
                  <p className="text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.6 }}>
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-300 hover:bg-[#8A2BE2]/20 active:scale-95"
              style={{ color: '#FFFFFF' }}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Actions - Only for authenticated users */}
          {isAuthenticated && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Link
                href="/prank-wizard"
                onClick={handleLinkClick}
                className="p-4 rounded-xl border transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: 'rgba(138, 43, 226, 0.1)',
                  borderColor: 'rgba(138, 43, 226, 0.3)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #8A2BE2, #BFFF00)',
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0A0A0A' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold font-body" style={{ color: '#FFFFFF' }}>New Prank</span>
                </div>
              </Link>
              <Link
                href="/pranks"
                onClick={handleLinkClick}
                className="p-4 rounded-xl border transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: 'rgba(191, 255, 0, 0.1)',
                  borderColor: 'rgba(191, 255, 0, 0.3)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #BFFF00, #8A2BE2)',
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0A0A0A' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold font-body" style={{ color: '#FFFFFF' }}>My Pranks</span>
                </div>
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/home"
                  onClick={handleLinkClick}
                  className={`group block px-4 py-3 rounded-xl transition-all duration-300 font-body active:scale-95 ${
                    pathname === '/home' ? 'bg-[#8A2BE2]/20 border-l-4' : 'hover:bg-[#8A2BE2]/10'
                  }`}
                  style={{
                    color: pathname === '/home' ? '#BFFF00' : '#FFFFFF',
                    borderColor: pathname === '/home' ? '#BFFF00' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      pathname === '/home' ? 'bg-[#BFFF00]/20' : 'bg-[#8A2BE2]/10 group-hover:bg-[#8A2BE2]/20'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="font-medium">Home</span>
                    {pathname === '/home' && (
                      <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#BFFF00', boxShadow: '0 0 10px rgba(191, 255, 0, 0.8)' }} />
                    )}
                  </div>
                </Link>

                <Link
                  href="/prank-wizard"
                  onClick={handleLinkClick}
                  className={`group block px-4 py-3 rounded-xl transition-all duration-300 font-body active:scale-95 ${
                    pathname === '/prank-wizard' ? 'bg-[#8A2BE2]/20 border-l-4' : 'hover:bg-[#8A2BE2]/10'
                  }`}
                  style={{
                    color: pathname === '/prank-wizard' ? '#BFFF00' : '#FFFFFF',
                    borderColor: pathname === '/prank-wizard' ? '#BFFF00' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      pathname === '/prank-wizard' ? 'bg-[#BFFF00]/20' : 'bg-[#8A2BE2]/10 group-hover:bg-[#8A2BE2]/20'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="font-medium">Prank Wizard</span>
                    {pathname === '/prank-wizard' && (
                      <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#BFFF00', boxShadow: '0 0 10px rgba(191, 255, 0, 0.8)' }} />
                    )}
                  </div>
                </Link>

                <Link
                  href="/pranks"
                  onClick={handleLinkClick}
                  className={`group block px-4 py-3 rounded-xl transition-all duration-300 font-body active:scale-95 ${
                    pathname === '/pranks' || pathname?.startsWith('/pranks/') ? 'bg-[#8A2BE2]/20 border-l-4' : 'hover:bg-[#8A2BE2]/10'
                  }`}
                  style={{
                    color: pathname === '/pranks' || pathname?.startsWith('/pranks/') ? '#BFFF00' : '#FFFFFF',
                    borderColor: pathname === '/pranks' || pathname?.startsWith('/pranks/') ? '#BFFF00' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      pathname === '/pranks' || pathname?.startsWith('/pranks/') ? 'bg-[#BFFF00]/20' : 'bg-[#8A2BE2]/10 group-hover:bg-[#8A2BE2]/20'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">My Pranks</span>
                    {(pathname === '/pranks' || pathname?.startsWith('/pranks/')) && (
                      <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#BFFF00', boxShadow: '0 0 10px rgba(191, 255, 0, 0.8)' }} />
                    )}
                  </div>
                </Link>

                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className={`group block px-4 py-3 rounded-xl transition-all duration-300 font-body active:scale-95 ${
                    pathname === '/profile' ? 'bg-[#8A2BE2]/20 border-l-4' : 'hover:bg-[#8A2BE2]/10'
                  }`}
                  style={{
                    color: pathname === '/profile' ? '#BFFF00' : '#FFFFFF',
                    borderColor: pathname === '/profile' ? '#BFFF00' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      pathname === '/profile' ? 'bg-[#BFFF00]/20' : 'bg-[#8A2BE2]/10 group-hover:bg-[#8A2BE2]/20'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-medium">Profile</span>
                    {pathname === '/profile' && (
                      <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#BFFF00', boxShadow: '0 0 10px rgba(191, 255, 0, 0.8)' }} />
                    )}
                  </div>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={handleLinkClick}
                    className={`group block px-4 py-3 rounded-xl transition-all duration-300 font-body active:scale-95 ${
                      pathname === '/admin' ? 'bg-[#8A2BE2]/20 border-l-4' : 'hover:bg-[#8A2BE2]/10'
                    }`}
                    style={{
                      color: '#BFFF00',
                      borderColor: pathname === '/admin' ? '#BFFF00' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        pathname === '/admin' ? 'bg-[#BFFF00]/20' : 'bg-[#BFFF00]/10 group-hover:bg-[#BFFF00]/20'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">Admin Portal</span>
                      {pathname === '/admin' && (
                        <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#BFFF00', boxShadow: '0 0 10px rgba(191, 255, 0, 0.8)' }} />
                      )}
                    </div>
                  </Link>
                )}

                {/* Logout Button */}
                <div className="pt-6 mt-6 border-t" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                  <Button
                    onClick={handleLogout}
                    className="w-full px-4 py-3.5 text-base font-semibold font-secondary !bg-red-600/20 !border-red-500/50 !text-red-400 hover:!bg-red-600/30 hover:!border-red-400 active:scale-95 transition-all duration-300"
                    style={{ borderWidth: '1px' }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className={`group block px-4 py-3 rounded-xl transition-all duration-300 font-body active:scale-95 ${
                    pathname === '/' ? 'bg-[#8A2BE2]/20 border-l-4' : 'hover:bg-[#8A2BE2]/10'
                  }`}
                  style={{
                    color: pathname === '/' ? '#BFFF00' : '#FFFFFF',
                    borderColor: pathname === '/' ? '#BFFF00' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      pathname === '/' ? 'bg-[#BFFF00]/20' : 'bg-[#8A2BE2]/10 group-hover:bg-[#8A2BE2]/20'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="font-medium">Home</span>
                  </div>
                </Link>

                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="group block px-4 py-3 rounded-xl transition-all duration-300 font-body hover:bg-[#8A2BE2]/10 active:scale-95"
                  style={{ color: '#FFFFFF' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#8A2BE2]/10 group-hover:bg-[#8A2BE2]/20 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span className="font-medium">Sign In</span>
                  </div>
                </Link>

                <Link
                  href="/signup"
                  onClick={handleLinkClick}
                  className="group block px-4 py-3 rounded-xl transition-all duration-300 font-body hover:bg-[#BFFF00]/10 active:scale-95"
                  style={{ color: '#BFFF00' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#BFFF00]/10 group-hover:bg-[#BFFF00]/20 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <span className="font-medium">Get Started</span>
                  </div>
                </Link>
              </>
            )}
          </nav>
          
          {/* Bottom Spacing */}
          <div className="h-8" />
        </div>
      </div>

    </>
  );
}

