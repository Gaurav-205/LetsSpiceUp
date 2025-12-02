'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import GlobalLoadingScreen from '@/components/ui/GlobalLoadingScreen';

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

  return <GlobalLoadingScreen />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<GlobalLoadingScreen />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

