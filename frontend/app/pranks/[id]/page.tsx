'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { prankApi } from '@/lib/prank-api';
import { PrankResponse } from '@/types/prank';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import GamingBackground from '@/components/ui/GamingBackground';
import Link from 'next/link';
import { showToast } from '@/components/ToastProvider';
import { PRANK_TYPE_LABELS, STATUS_LABELS } from '@/lib/constants/prank';
import Navbar from '@/components/Navbar';

export default function PrankDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [prank, setPrank] = useState<PrankResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrank = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await prankApi.getPrankById(id);
      setPrank(response.prank);
    } catch (err: unknown) {
      const apiError = err as { 
        response?: { 
          data?: { error?: { message: string } };
          status?: number;
        }; 
        message?: string;
      };
      
      if (apiError.response?.status === 404) {
        setError('Prank not found');
        showToast('Prank not found', 'error');
        router.push('/pranks');
      } else {
        const errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Failed to load prank';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (params.id) {
      loadPrank(params.id as string);
    }
  }, [params.id, loadPrank]);

  // Prevent body scrolling on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <div className="h-screen h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: '#0A0A0A', height: '100dvh' }}>
        {/* Navigation */}
        <Navbar 
          rightContent={
                <Link href="/pranks">
              <Button variant="outline" className="text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg backdrop-blur-sm transition-all duration-300 border whitespace-nowrap font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00]" style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}>
                    Back to List
                  </Button>
                </Link>
          }
        />

        <div className="flex-1 overflow-y-auto">
          <GamingBackground fullHeight={false}>
        <main className="max-w-4xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 md:pt-20" style={{ paddingTop: 'max(calc(3.5rem + env(safe-area-inset-top, 0px)), calc(56px + env(safe-area-inset-top, 0px)))' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="rounded-lg border backdrop-blur-sm p-8 text-center " style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <p className="font-body mb-6" style={{ color: '#FCA5A5' }}>{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/pranks')} 
                  variant="outline" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] rounded-xl transition-all duration-300" 
                  style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
                >
                  Back to List
                </Button>
                <Button 
                  onClick={() => loadPrank(params.id as string)} 
                  variant="outline" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] rounded-xl transition-all duration-300" 
                  style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : prank ? (
            <div className="rounded-xl backdrop-blur-sm border p-5 sm:p-6 md:p-8 lg:p-10 " style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-primary mb-2 sm:mb-3" style={{ color: '#FFFFFF', textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>Prank Plan Details</h1>
                  <p className="font-body text-sm sm:text-base" style={{ color: '#FFFFFF', opacity: 0.7 }}>Created on {formatDate(prank.createdAt)}</p>
                </div>
                <span
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium font-secondary border backdrop-blur-sm self-start sm:self-auto whitespace-nowrap"
                  style={{ 
                    color: STATUS_LABELS[prank.status]?.color || STATUS_LABELS.pending?.color || 'text-[#EAB308]',
                    borderColor: STATUS_LABELS[prank.status]?.borderColor || STATUS_LABELS.pending?.borderColor || 'rgba(234, 179, 8, 0.3)',
                    backgroundColor: 'rgba(10, 10, 10, 0.4)'
                  }}
                >
                  {STATUS_LABELS[prank.status]?.label || prank.status}
                </span>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {/* Prank Type */}
                <div className="border-b pb-6 sm:pb-8" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                  <h2 className="text-lg sm:text-xl font-semibold font-secondary mb-4 sm:mb-5" style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.3)' }}>Prank Type</h2>
                  <div className="flex items-start gap-4">
                    <span className="text-4xl sm:text-5xl flex-shrink-0">
                      {PRANK_TYPE_LABELS[prank.prankType]?.emoji || '🎭'}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-medium font-secondary mb-2" style={{ color: '#FFFFFF' }}>
                        {PRANK_TYPE_LABELS[prank.prankType]?.label || prank.prankType}
                      </h3>
                      <p className="font-body text-sm sm:text-base" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                        {PRANK_TYPE_LABELS[prank.prankType]?.description || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Your Information */}
                <div className="border-b pb-6 sm:pb-8" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                  <h2 className="text-lg sm:text-xl font-semibold font-secondary mb-4 sm:mb-5" style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.3)' }}>Your Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Name</span>
                      <p className="font-body text-base sm:text-lg" style={{ color: '#FFFFFF' }}>{prank.yourName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Phone</span>
                      <p className="font-body text-base sm:text-lg" style={{ color: '#FFFFFF' }}>{prank.yourPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Email</span>
                      <p className="font-body text-base sm:text-lg break-all" style={{ color: '#FFFFFF' }}>{prank.yourEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Target Information */}
                <div className="border-b pb-6 sm:pb-8" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                  <h2 className="text-lg sm:text-xl font-semibold font-secondary mb-4 sm:mb-5" style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.3)' }}>Target&apos;s Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Name</span>
                      <p className="font-body text-base sm:text-lg" style={{ color: '#FFFFFF' }}>{prank.friendName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Age Range</span>
                      <p className="font-body text-base sm:text-lg" style={{ color: '#FFFFFF' }}>{prank.friendAge}</p>
                    </div>
                    {prank.friendGender && (
                      <div>
                        <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Gender</span>
                        <p className="font-body text-base sm:text-lg capitalize" style={{ color: '#FFFFFF' }}>{prank.friendGender}</p>
                      </div>
                    )}
                    {prank.relationship && (
                      <div>
                        <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Relationship</span>
                        <p className="font-body text-base sm:text-lg capitalize" style={{ color: '#FFFFFF' }}>{prank.relationship}</p>
                      </div>
                    )}
                    {prank.friendPhone && (
                      <div>
                        <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Phone</span>
                        <p className="font-body text-base sm:text-lg" style={{ color: '#FFFFFF' }}>{prank.friendPhone}</p>
                      </div>
                    )}
                    {prank.friendEmail && (
                      <div>
                        <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Email</span>
                        <p className="font-body text-base sm:text-lg break-all" style={{ color: '#FFFFFF' }}>{prank.friendEmail}</p>
                      </div>
                    )}
                    {prank.friendLocation && (
                      <div className="sm:col-span-2">
                        <span className="text-sm font-medium font-body block mb-1.5" style={{ color: '#FFFFFF', opacity: 0.7 }}>Location</span>
                        <p className="font-body text-base sm:text-lg" style={{ color: '#FFFFFF' }}>{prank.friendLocation}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium font-body block mb-3" style={{ color: '#FFFFFF', opacity: 0.7 }}>Personality Types</span>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {prank.personalityTypes.map((type) => (
                        <span
                          key={type}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-body border backdrop-blur-sm"
                          style={{ 
                            color: '#BFFF00',
                            borderColor: 'rgba(191, 255, 0, 0.3)',
                            backgroundColor: 'rgba(10, 10, 10, 0.4)'
                          }}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {prank.additionalInfo && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold font-secondary mb-4 sm:mb-5" style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.3)' }}>Additional Notes</h2>
                    <p className="font-body whitespace-pre-wrap p-4 sm:p-5 rounded-lg backdrop-blur-sm border text-sm sm:text-base" style={{ 
                      color: '#FFFFFF', 
                      backgroundColor: 'rgba(10, 10, 10, 0.4)',
                      borderColor: 'rgba(138, 43, 226, 0.2)'
                    }}>
                      {prank.additionalInfo}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t flex flex-col sm:flex-row gap-4 sm:gap-5" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                <Link href="/pranks" className="w-full sm:w-auto flex-1 sm:flex-none">
                  <Button 
                    variant="outline" 
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] rounded-xl transition-all duration-300" 
                    style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 25px rgba(191, 255, 0, 0.5), 0 0 20px rgba(191, 255, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(138, 43, 226, 0.3)';
                    }}
                  >
                    Back to List
                  </Button>
                </Link>
                <Link href="/prank-wizard" className="w-full sm:w-auto flex-1 sm:flex-none">
                  <Button 
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF] rounded-xl transition-all duration-300 transform hover:scale-105" 
                    style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 40px rgba(138, 43, 226, 0.6), 0 0 30px rgba(138, 43, 226, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)';
                    }}
                  >
                    Create Another
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </main>
      </GamingBackground>
        </div>
      </div>
    </ProtectedRoute>
  );
}

