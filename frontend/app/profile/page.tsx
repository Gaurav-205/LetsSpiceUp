'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen h-screen relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <Navbar 
          breadcrumbs={[
            { label: 'Profile' }
          ]}
          rightContent={
                <Link href="/home">
              <Button variant="outline" className="text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg backdrop-blur-sm transition-all duration-300 border whitespace-nowrap font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00]" style={{ backgroundColor: 'transparent', textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}>
                    Back to Home
                  </Button>
                </Link>
          }
        />

        {/* Background gradient overlay - matching landing page */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#8A2BE2]/8 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#8A2BE2]/3 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.6) 70%, rgba(138, 43, 226, 0.05) 100%)' }} />

        <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto w-full">
            <div className=" space-y-8">
              {/* Hero Heading - Matching landing page style */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight font-primary">
                  <span className="block  delay-200" style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }}>
                    Your
                  </span>
                  <span className="block bg-clip-text text-transparent mt-1 sm:mt-2  delay-400" style={{ backgroundImage: 'linear-gradient(to right, #8A2BE2, #BFFF00, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.3))' }}>
                    Profile
                  </span>
                </h1>
              </div>

              {/* Profile Card */}
              <div className="rounded-lg backdrop-blur-sm border p-8  delay-600" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
                <div className="space-y-6">
                  <div className="border-b pb-6" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
                    <label className="block text-sm font-medium font-body mb-2" style={{ color: '#FFFFFF', opacity: 0.7 }}>Full Name</label>
                    <p className="font-body text-xl font-secondary" style={{ color: '#BFFF00', textShadow: '0 0 10px rgba(191, 255, 0, 0.3)' }}>{user?.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-body mb-2" style={{ color: '#FFFFFF', opacity: 0.7 }}>Email Address</label>
                    <p className="font-body text-xl font-secondary" style={{ color: '#FFFFFF' }}>{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

