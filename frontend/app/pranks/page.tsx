'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { prankApi } from '@/lib/prank-api';
import { PrankResponse } from '@/types/prank';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import GamingBackground from '@/components/ui/GamingBackground';
import Link from 'next/link';
import { showToast } from '@/components/ToastProvider';
import { PRANK_TYPE_LABELS_SIMPLE, STATUS_LABELS } from '@/lib/constants/prank';
import Navbar from '@/components/Navbar';

export default function PranksPage() {
  const [pranks, setPranks] = useState<PrankResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPranks();
  }, []);

  const loadPranks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prankApi.getPranks();
      setPranks(response.pranks);
    } catch (err: unknown) {
      const apiError = err as { 
        response?: { 
          data?: { error?: { message: string } };
        }; 
        message?: string;
      };
      const errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Failed to load pranks';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <GamingBackground fullHeight={false}>
        <Navbar 
          breadcrumbs={[
            { label: 'My Pranks' }
          ]}
          rightContent={
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/prank-wizard">
                <Button className="text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 shadow-lg hover:shadow-2xl transition-all duration-300 border-0 whitespace-nowrap font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF] rounded-lg" style={{ boxShadow: '0 4px 15px rgba(191, 255, 0, 0.4)' }}>
                    Create New
                  </Button>
                </Link>
                <Link href="/home">
                <Button variant="outline" className="text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg backdrop-blur-sm transition-all duration-300 border whitespace-nowrap font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00]" style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}>
                    Back to Home
                  </Button>
                </Link>
              </div>
          }
        />

        <main className="max-w-7xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10 md:mb-12 text-center ">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-primary mb-3 sm:mb-4">
              <span className="block" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>
                My Prank
              </span>
              <span className="block bg-clip-text text-transparent mt-1 sm:mt-2" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                Plans
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-body max-w-2xl mx-auto" style={{ color: '#FFFFFF', opacity: 0.8, textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
              View and manage all your prank submissions
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="rounded-lg border backdrop-blur-sm p-8 text-center " style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <p className="font-body mb-6" style={{ color: '#FCA5A5' }}>{error}</p>
              <Button 
                onClick={loadPranks} 
                variant="outline" 
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] rounded-xl transition-all duration-300" 
                style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
              >
                Try Again
              </Button>
            </div>
          ) : pranks.length === 0 ? (
            <div className="rounded-lg backdrop-blur-sm border p-6 sm:p-8 md:p-12 text-center " style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
              <div className="text-6xl mb-6 animate-bounce-slow">🎭</div>
              <h2 className="text-2xl sm:text-3xl font-semibold font-primary mb-4" style={{ color: '#FFFFFF', textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>No Prank Plans Yet</h2>
              <p className="font-body mb-8" style={{ color: '#FFFFFF', opacity: 0.8 }}>Create your first prank plan to get started!</p>
              <Link href="/prank-wizard">
                <Button 
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF] rounded-xl transition-all duration-300 transform hover:scale-105" 
                  style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
                >
                  Create Your First Prank Plan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6  delay-200">
              {pranks.map((prank, index) => (
                <div
                  key={prank.id}
                  className="rounded-xl backdrop-blur-sm border p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02]  flex flex-col"
                  style={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.6)', 
                    borderColor: 'rgba(138, 43, 226, 0.3)', 
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    animationDelay: `${index * 100}ms`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(191, 255, 0, 0.5)';
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(191, 255, 0, 0.2), 0 0 20px rgba(191, 255, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.3)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-lg sm:text-xl font-semibold font-secondary mb-1 truncate" style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.3)' }}>
                        {prank.friendName}
                      </h3>
                      <p className="text-xs sm:text-sm font-body" style={{ color: '#FFFFFF', opacity: 0.6 }}>{formatDate(prank.createdAt)}</p>
                    </div>
                    <span
                      className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium font-secondary border backdrop-blur-sm whitespace-nowrap flex-shrink-0"
                      style={{ 
                        color: STATUS_LABELS[prank.status]?.color || STATUS_LABELS.pending?.color || 'text-[#EAB308]',
                        borderColor: STATUS_LABELS[prank.status]?.borderColor || STATUS_LABELS.pending?.borderColor || 'rgba(234, 179, 8, 0.3)',
                        backgroundColor: 'rgba(10, 10, 10, 0.4)'
                      }}
                    >
                      {STATUS_LABELS[prank.status]?.label || prank.status}
                    </span>
                  </div>

                  <div className="space-y-2.5 mb-4 flex-1">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium font-body flex-shrink-0" style={{ color: '#FFFFFF', opacity: 0.7 }}>Prank Type:</span>
                      <span className="text-sm font-body" style={{ color: '#FFFFFF' }}>
                        {PRANK_TYPE_LABELS_SIMPLE[prank.prankType] || prank.prankType}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium font-body flex-shrink-0" style={{ color: '#FFFFFF', opacity: 0.7 }}>Age:</span>
                      <span className="text-sm font-body" style={{ color: '#FFFFFF' }}>{prank.friendAge}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium font-body flex-shrink-0" style={{ color: '#FFFFFF', opacity: 0.7 }}>Personality:</span>
                      <span className="text-sm font-body" style={{ color: '#FFFFFF' }}>
                        {prank.personalityTypes.slice(0, 2).join(', ')}
                        {prank.personalityTypes.length > 2 && ` +${prank.personalityTypes.length - 2}`}
                      </span>
                    </div>
                  </div>

                  {prank.additionalInfo && (
                    <div className="mb-4">
                      <p className="text-sm font-body line-clamp-2" style={{ color: '#FFFFFF', opacity: 0.8 }}>{prank.additionalInfo}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t mt-auto" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                    <Link href={`/pranks/${prank.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] rounded-lg transition-all duration-300" 
                        style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 25px rgba(191, 255, 0, 0.5), 0 0 20px rgba(191, 255, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(138, 43, 226, 0.3)';
                        }}
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </GamingBackground>
    </ProtectedRoute>
  );
}

