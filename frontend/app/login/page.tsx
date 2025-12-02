'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { redirectToGoogleAuth } from '@/lib/auth-utils';
import GlobalLoadingScreen from '@/components/ui/GlobalLoadingScreen';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/home');
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, general: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await login(formData);
      // Redirect will happen automatically via useEffect
    } catch (error: unknown) {
      const apiError = error as { 
        response?: { 
          data?: { error?: { message: string } };
          status?: number;
        }; 
        message?: string;
      };
      
      // Handle rate limiting (429 status)
      if (apiError.response?.status === 429) {
        const errorMessage = apiError.response?.data?.error?.message || 'Too many authentication attempts. Please try again later.';
        setErrors({ general: errorMessage });
      } else {
        const errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Login failed. Please try again.';
        if (errorMessage.includes('email') || errorMessage.includes('Email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.includes('password') || errorMessage.includes('Password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    redirectToGoogleAuth();
  };

  // Check if Google OAuth is enabled
  const isGoogleAuthEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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
              <span className="block" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>
                Sign in to
              </span>
              <span className="block bg-clip-text text-transparent mt-1 sm:mt-2" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                your account
              </span>
            </h2>
          </div>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium font-body" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)', opacity: 0.95 }}>
            Or{' '}
            <Link href="/signup" className="font-medium transition-colors duration-300 hover:neon-glow-lime" style={{ color: '#BFFF00' }}>
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="px-4 py-3 rounded border backdrop-blur-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#FCA5A5' }}>
              {errors.general}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              showSuccessIcon={true}
            />
            <PasswordInput
              label="Password"
              name="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot password disabled */}
          {/* <div className="flex items-center justify-between">
            <div className="text-sm font-body">
              <Link href="/forgot-password" className="font-medium transition-colors duration-300 hover:neon-glow-lime" style={{ color: '#BFFF00' }}>
                Forgot your password?
              </Link>
            </div>
          </div> */}

          <div>
            <Button 
              type="submit" 
              className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105 active:scale-95 border-0 font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF]" 
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
              Sign in
            </Button>
          </div>

          {isGoogleAuthEnabled && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'rgba(138, 43, 226, 0.3)' }} />
                </div>
                <div className="relative flex justify-center text-sm font-body">
                  <span className="px-2" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF', opacity: 0.7 }}>Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00]"
                  onClick={handleGoogleLogin}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<GlobalLoadingScreen />}>
      <LoginPageContent />
    </Suspense>
  );
}

