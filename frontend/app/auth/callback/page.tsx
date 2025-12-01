'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import GamingBackground from '@/components/ui/GamingBackground';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      Cookies.set('token', token, { 
        expires: 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      router.push('/home');
    } else {
      router.push('/login?error=no_token');
    }
  }, [router, searchParams]);

  return (
    <GamingBackground>
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Completing authentication..." />
      </div>
    </GamingBackground>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <GamingBackground>
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </GamingBackground>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

