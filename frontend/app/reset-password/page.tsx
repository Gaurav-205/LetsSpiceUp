'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { authApi } from '@/lib/auth-api';
import { showToast } from '@/components/ToastProvider';
import { validatePassword } from '@/lib/password-validation';
import Cookies from 'js-cookie';

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setErrors({ general: 'Invalid reset token. Please request a new password reset.' });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, general: undefined });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (formData.password) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    } else {
      newErrors.password = 'Password is required';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ general: 'Invalid reset token. Please request a new password reset link.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.resetPassword({
        token,
        password: formData.password,
      });

      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Show success message
      setIsSuccess(true);
      showToast('Password reset successful! Logging you in...', 'success');

      // Set the token cookie with proper security settings
      const cookieOptions = {
        expires: 7,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      };

      Cookies.set('token', response.token, cookieOptions);
      
      // The token is now set. When the user navigates to /home,
      // AuthContext will automatically verify the token and set the user state.
      // ProtectedRoute will handle the authentication check.

      // Small delay to show success message before redirect
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (err: unknown) {
      const apiError = err as { 
        response?: { 
          data?: { error?: { message: string } };
          status?: number;
        }; 
        message?: string;
      };
      
      let errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Password reset failed. Please try again.';
      
      // Handle specific error cases
      if (apiError.response?.status === 400) {
        if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
          errorMessage = 'This password reset link is invalid or has expired. Please request a new one.';
          setErrors({ general: errorMessage });
        } else if (errorMessage.includes('password') || errorMessage.includes('Password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (apiError.response?.status === 429) {
        errorMessage = 'Too many password reset attempts. Please try again later.';
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
      
      setIsLoading(false);
    }
  };

  // Show success state
  if (isSuccess) {
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
                Password Reset
              </span>
              <span className="block bg-clip-text text-transparent mt-1 sm:mt-2  delay-400" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                Successful!
              </span>
            </h2>
            <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium font-body  delay-600" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)', opacity: 0.95 }}>
              Your password has been reset successfully. You are being logged in...
            </p>
            <div className="mt-8  delay-600">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#8A2BE2] border-r-[#BFFF00]" style={{ boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)' }}></div>
                  <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#BFFF00] border-r-[#8A2BE2]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
              </div>
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
                Reset your
              </span>
              <span className="block bg-clip-text text-transparent mt-1 sm:mt-2  delay-400" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                password
              </span>
            </h2>
          </div>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium font-body  delay-600" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)', opacity: 0.95 }}>
            Enter your new password below
          </p>
          {!token && (
            <p className="mt-4 text-center text-sm font-body" style={{ color: '#FCA5A5' }}>
              No reset token found. Please use the link from your email.
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="px-4 py-3 rounded border backdrop-blur-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#FCA5A5' }}>
              {errors.general}
            </div>
          )}
          <div className="space-y-4">
            <PasswordInput
              label="New password"
              name="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your new password (min. 8 characters, uppercase, lowercase, number, special char)"
              showStrength={true}
            />
            <PasswordInput
              label="Confirm new password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
            />
          </div>

          <div>
            <Button 
              type="submit" 
              className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105 active:scale-95 border-0 font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF]  delay-600" 
              isLoading={isLoading} 
              disabled={!token}
              style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
              onMouseEnter={(e) => {
                if (!isLoading && token) {
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(138, 43, 226, 0.6), 0 0 30px rgba(138, 43, 226, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)';
                }
              }}
            >
              Reset password
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#8A2BE2] border-r-[#BFFF00]" style={{ boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)' }}></div>
        </div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

