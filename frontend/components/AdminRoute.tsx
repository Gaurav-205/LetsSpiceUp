'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GlobalLoadingScreen from '@/components/ui/GlobalLoadingScreen';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin');
      } else if (!isAdmin) {
        router.push('/home');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) {
    return <GlobalLoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>Access Denied</h1>
          <p className="text-lg" style={{ color: '#FFFFFF', opacity: 0.8 }}>
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

