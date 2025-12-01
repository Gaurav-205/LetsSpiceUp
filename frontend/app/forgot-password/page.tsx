'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authApi } from '@/lib/auth-api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { error?: { message: string } } }; message?: string };
      setError(apiError.response?.data?.error?.message || apiError.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen h-screen relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0A0A0A' }}>
        {/* Background gradient overlay - matching landing page */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#8A2BE2]/8 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#8A2BE2]/3 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.6) 70%, rgba(138, 43, 226, 0.05) 100%)' }} />
        
        <div className="max-w-md w-full space-y-8 relative z-10 text-center">
          <div className="">
            <Link href="/" className="flex justify-center mb-8">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight transition-all duration-300 font-primary neon-glow-lime group-hover:animate-glow-pulse" style={{ color: '#BFFF00', letterSpacing: '0.05em' }}>
                Prank Wizard
              </h1>
            </Link>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 animate-scale-in" style={{ backgroundColor: 'rgba(191, 255, 0, 0.2)', border: '2px solid rgba(191, 255, 0, 0.5)', boxShadow: '0 0 20px rgba(191, 255, 0, 0.3)' }}>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#BFFF00' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight font-primary  delay-200">
              <span className="block" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>
                Check your
              </span>
              <span className="block bg-clip-text text-transparent mt-1 sm:mt-2  delay-400" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                email
              </span>
            </h2>
            <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium font-body  delay-600" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)', opacity: 0.95 }}>
              We've sent a password reset link to <strong style={{ color: '#BFFF00' }}>{email}</strong>
            </p>
            <p className="mt-4 text-sm font-body  delay-600" style={{ color: '#FFFFFF', opacity: 0.8 }}>
              Please check your inbox and click the link to reset your password.
            </p>
            <p className="mt-2 text-xs font-body  delay-600" style={{ color: '#FFFFFF', opacity: 0.6 }}>
              The link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
            <div className="mt-8  delay-600">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold border-2 rounded-xl transition-all duration-300 backdrop-blur-sm font-secondary !border-[#8A2BE2] !text-[#FFFFFF] !bg-transparent hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00]"
                  style={{ boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
                >
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Background gradient overlay - matching landing page */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#8A2BE2]/8 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#8A2BE2]/3 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.6) 70%, rgba(138, 43, 226, 0.05) 100%)' }} />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link href="/" className="flex justify-center mb-8">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight transition-all duration-300 font-primary neon-glow-lime group-hover:animate-glow-pulse" style={{ color: '#BFFF00', letterSpacing: '0.05em' }}>
              Prank Wizard
            </h1>
          </Link>
          <div className="space-y-3 sm:space-y-4 mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight font-primary">
              <span className="block  delay-200" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>
                Forgot your
              </span>
              <span className="block bg-clip-text text-transparent mt-1 sm:mt-2  delay-400" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                password?
              </span>
            </h2>
          </div>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium font-body  delay-600" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)', opacity: 0.95 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 rounded border backdrop-blur-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#FCA5A5' }}>
              {error}
            </div>
          )}
          <div>
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Button 
              type="submit" 
              className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105 active:scale-95 border-0 font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF]  delay-600" 
              isLoading={isLoading} 
              style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(138, 43, 226, 0.6), 0 0 30px rgba(138, 43, 226, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)';
                }
              }}
            >
              Send reset link
            </Button>
          </div>

          <div className="text-center">
            <Link href="/login" className="font-medium font-body transition-colors duration-300 hover:neon-glow-lime" style={{ color: '#BFFF00' }}>
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

