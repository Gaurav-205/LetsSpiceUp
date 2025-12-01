'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth check is complete AND user is not authenticated
    // Add a small delay to ensure auth check has fully completed
    if (!loading && !isAuthenticated) {
      // Double-check that there's really no token before redirecting
      const timer = setTimeout(() => {
        if (!isAuthenticated && !loading) {
          router.push('/login');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // If not authenticated after check, show nothing (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

