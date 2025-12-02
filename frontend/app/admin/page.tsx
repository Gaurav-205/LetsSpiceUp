'use client';

import { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';
import { adminApi, AdminStats, User, Prank } from '@/lib/admin-api';
import { showToast } from '@/components/ToastProvider';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pranks, setPranks] = useState<Prank[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'pranks'>('stats');
  const [usersPage, setUsersPage] = useState(1);
  const [pranksPage, setPranksPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [pranksTotal, setPranksTotal] = useState(0);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletingPrankId, setDeletingPrankId] = useState<string | null>(null);
  const [selectedPrank, setSelectedPrank] = useState<Prank | null>(null);
  const [showPrankModal, setShowPrankModal] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, usersPage, pranksPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'stats') {
        const statsData = await adminApi.getStats();
        setStats(statsData.stats);
      } else if (activeTab === 'users') {
        const usersData = await adminApi.getUsers(usersPage, 20);
        setUsers(usersData.users || []);
        setUsersTotal(usersData.pagination.total);
      } else if (activeTab === 'pranks') {
        const pranksData = await adminApi.getPranks(pranksPage, 20);
        setPranks(pranksData.pranks || []);
        setPranksTotal(pranksData.pagination.total);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number }; message?: string };
      if (err.response?.status === 403) {
        showToast('Access denied. Admin privileges required.', 'error');
      } else {
        showToast('Failed to load admin data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await adminApi.deleteUser(userId);
      showToast('User deleted successfully', 'success');
      loadData();
    } catch {
      showToast('Failed to delete user', 'error');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeletePrank = async (prankId: string) => {
    if (!confirm('Are you sure you want to delete this prank? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingPrankId(prankId);
      await adminApi.deletePrank(prankId);
      showToast('Prank deleted successfully', 'success');
      loadData();
    } catch {
      showToast('Failed to delete prank', 'error');
    } finally {
      setDeletingPrankId(null);
    }
  };

  const handleViewPrankDetails = async (prankId: string) => {
    try {
      const response = await adminApi.getPrank(prankId);
      setSelectedPrank(response.prank);
      setShowPrankModal(true);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number }; message?: string };
      if (err.response?.status === 404) {
        showToast('Prank not found', 'error');
      } else {
        showToast('Failed to load prank details', 'error');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminRoute>
      <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <Navbar />
        
        <div className="flex-1 overflow-y-auto pt-16 sm:pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 font-primary" style={{ color: '#FFFFFF' }}>
                Admin Portal
              </h1>
              <p className="text-lg" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                Manage users, pranks, and view statistics
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b" style={{ borderColor: 'rgba(138, 43, 226, 0.3)' }}>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'stats'
                  ? 'border-b-2 font-secondary'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: activeTab === 'stats' ? '#BFFF00' : '#FFFFFF',
                borderColor: activeTab === 'stats' ? '#BFFF00' : 'transparent',
              }}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 font-secondary'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: activeTab === 'users' ? '#BFFF00' : '#FFFFFF',
                borderColor: activeTab === 'users' ? '#BFFF00' : 'transparent',
              }}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('pranks')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'pranks'
                  ? 'border-b-2 font-secondary'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: activeTab === 'pranks' ? '#BFFF00' : '#FFFFFF',
                borderColor: activeTab === 'pranks' ? '#BFFF00' : 'transparent',
              }}
            >
              Pranks
            </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="mt-6">
              {/* Statistics Tab */}
              {activeTab === 'stats' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="rounded-xl backdrop-blur-sm border p-6" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                    <h3 className="text-sm font-medium mb-2" style={{ color: '#FFFFFF', opacity: 0.7 }}>Total Users</h3>
                    <p className="text-3xl font-bold font-primary" style={{ color: '#BFFF00' }}>{stats.users.total}</p>
                  </div>
                  <div className="rounded-xl backdrop-blur-sm border p-6" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                    <h3 className="text-sm font-medium mb-2" style={{ color: '#FFFFFF', opacity: 0.7 }}>Verified Users</h3>
                    <p className="text-3xl font-bold font-primary" style={{ color: '#BFFF00' }}>{stats.users.verified}</p>
                  </div>
                  <div className="rounded-xl backdrop-blur-sm border p-6" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                    <h3 className="text-sm font-medium mb-2" style={{ color: '#FFFFFF', opacity: 0.7 }}>Total Pranks</h3>
                    <p className="text-3xl font-bold font-primary" style={{ color: '#BFFF00' }}>{stats.pranks.total}</p>
                  </div>
                  <div className="rounded-xl backdrop-blur-sm border p-6" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                    <h3 className="text-sm font-medium mb-2" style={{ color: '#FFFFFF', opacity: 0.7 }}>Recent (7 days)</h3>
                    <p className="text-3xl font-bold font-primary" style={{ color: '#BFFF00' }}>
                      {stats.users.recent} users, {stats.pranks.recent} pranks
                    </p>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div className="mb-4">
                    <p className="text-sm" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                      Total: {usersTotal} users
                    </p>
                  </div>
                  <div className="rounded-xl backdrop-blur-sm border overflow-hidden" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(138, 43, 226, 0.3)' }}>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Name</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Email</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Status</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Joined</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                                No users found
                              </td>
                            </tr>
                          ) : (
                            users.map((user) => (
                            <tr key={user._id} style={{ borderBottom: '1px solid rgba(138, 43, 226, 0.1)' }}>
                              <td className="p-4 font-body" style={{ color: '#FFFFFF' }}>{user.name}</td>
                              <td className="p-4 font-body" style={{ color: '#FFFFFF' }}>{user.email}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  user.isEmailVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {user.isEmailVerified ? 'Verified' : 'Unverified'}
                                </span>
                                {user.googleId && (
                                  <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                                    Google
                                  </span>
                                )}
                              </td>
                              <td className="p-4 font-body text-sm" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="p-4">
                                <Button
                                  onClick={() => handleDeleteUser(user._id, user.name)}
                                  disabled={deletingUserId === user._id}
                                  className="px-3 py-1 text-xs font-secondary !bg-red-600 hover:!bg-red-700 !text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                                </Button>
                              </td>
                            </tr>
                          ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {usersTotal > 20 && (
                      <div className="flex justify-between items-center p-4 border-t" style={{ borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                        <Button
                          onClick={() => setUsersPage(prev => Math.max(1, prev - 1))}
                          disabled={usersPage === 1}
                          className="px-4 py-2 font-secondary"
                        >
                          Previous
                        </Button>
                        <span className="text-sm font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                          Page {usersPage} of {Math.ceil(usersTotal / 20)}
                        </span>
                        <Button
                          onClick={() => setUsersPage(prev => prev + 1)}
                          disabled={usersPage >= Math.ceil(usersTotal / 20)}
                          className="px-4 py-2 font-secondary"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pranks Tab */}
              {activeTab === 'pranks' && (
                <div>
                  <div className="mb-4">
                    <p className="text-sm" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                      Total: {pranksTotal} pranks
                    </p>
                  </div>
                  <div className="rounded-xl backdrop-blur-sm border overflow-hidden" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(138, 43, 226, 0.3)' }}>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Planner</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Friend</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Type</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Status</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Created</th>
                            <th className="text-left p-4 font-semibold font-secondary" style={{ color: '#BFFF00' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pranks.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                                No pranks found
                              </td>
                            </tr>
                          ) : (
                            pranks.map((prank) => {
                            const user = typeof prank.userId === 'object' ? prank.userId : null;
                            return (
                              <tr key={prank._id} style={{ borderBottom: '1px solid rgba(138, 43, 226, 0.1)' }}>
                                <td className="p-4 font-body" style={{ color: '#FFFFFF' }}>
                                  <div>{prank.yourName}</div>
                                  <div className="text-xs" style={{ color: '#FFFFFF', opacity: 0.6 }}>
                                    {user ? user.email : prank.yourEmail}
                                  </div>
                                </td>
                                <td className="p-4 font-body" style={{ color: '#FFFFFF' }}>
                                  {prank.friendName} ({prank.friendAge})
                                </td>
                                <td className="p-4 font-body capitalize" style={{ color: '#FFFFFF' }}>{prank.prankType}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                                    prank.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    prank.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                    prank.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                    {prank.status}
                                  </span>
                                </td>
                                <td className="p-4 font-body text-sm" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                                  {formatDate(prank.createdAt)}
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleViewPrankDetails(prank._id)}
                                      className="px-3 py-1 text-xs font-secondary !bg-[#8A2BE2] hover:!bg-[#9B3DF3] !text-white"
                                    >
                                      Details
                                    </Button>
                                    <Button
                                      onClick={() => handleDeletePrank(prank._id)}
                                      disabled={deletingPrankId === prank._id}
                                      className="px-3 py-1 text-xs font-secondary !bg-red-600 hover:!bg-red-700 !text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {deletingPrankId === prank._id ? 'Deleting...' : 'Delete'}
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                          )}
                        </tbody>
                      </table>
                    </div>
                    {pranksTotal > 20 && (
                      <div className="flex justify-between items-center p-4 border-t" style={{ borderColor: 'rgba(138, 43, 226, 0.3)' }}>
                        <Button
                          onClick={() => setPranksPage(prev => Math.max(1, prev - 1))}
                          disabled={pranksPage === 1}
                          className="px-4 py-2 font-secondary"
                        >
                          Previous
                        </Button>
                        <span className="text-sm font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                          Page {pranksPage} of {Math.ceil(pranksTotal / 20)}
                        </span>
                        <Button
                          onClick={() => setPranksPage(prev => prev + 1)}
                          disabled={pranksPage >= Math.ceil(pranksTotal / 20)}
                          className="px-4 py-2 font-secondary"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Prank Details Modal */}
      {showPrankModal && selectedPrank && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-16 sm:pt-16 md:pt-20"
          onClick={() => setShowPrankModal(false)}
        >
          <div 
            className="rounded-xl backdrop-blur-sm border p-6 max-w-3xl w-full my-4 overflow-y-auto"
            style={{ 
              backgroundColor: 'rgba(10, 10, 10, 0.95)', 
              borderColor: 'rgba(138, 43, 226, 0.5)', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              maxHeight: 'calc(100vh - 120px)' // Account for navbar + padding
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold font-primary" style={{ color: '#FFFFFF' }}>Prank Details</h2>
              <Button
                onClick={() => setShowPrankModal(false)}
                variant="outline"
                className="px-3 py-1 text-sm font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20"
              >
                ✕ Close
              </Button>
            </div>

            <div className="space-y-6">
              {/* Planner Info */}
              <div>
                <h3 className="text-lg font-semibold font-secondary mb-3" style={{ color: '#BFFF00' }}>Planner Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Name</span>
                    <p className="font-body" style={{ color: '#FFFFFF' }}>{selectedPrank.yourName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Phone</span>
                    <p className="font-body" style={{ color: '#FFFFFF' }}>{selectedPrank.yourPhone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Email</span>
                    <p className="font-body break-all" style={{ color: '#FFFFFF' }}>{selectedPrank.yourEmail}</p>
                  </div>
                </div>
              </div>

              {/* Target Info */}
              <div>
                <h3 className="text-lg font-semibold font-secondary mb-3" style={{ color: '#BFFF00' }}>Target Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Name</span>
                    <p className="font-body" style={{ color: '#FFFFFF' }}>{selectedPrank.friendName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Age Range</span>
                    <p className="font-body" style={{ color: '#FFFFFF' }}>{selectedPrank.friendAge}</p>
                  </div>
                  {selectedPrank.friendPhone && (
                    <div>
                      <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Phone</span>
                      <p className="font-body" style={{ color: '#FFFFFF' }}>{selectedPrank.friendPhone}</p>
                    </div>
                  )}
                  {selectedPrank.friendEmail && (
                    <div>
                      <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Email</span>
                      <p className="font-body break-all" style={{ color: '#FFFFFF' }}>{selectedPrank.friendEmail}</p>
                    </div>
                  )}
                  {selectedPrank.relationship && (
                    <div>
                      <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Relationship</span>
                      <p className="font-body capitalize" style={{ color: '#FFFFFF' }}>{selectedPrank.relationship}</p>
                    </div>
                  )}
                  {selectedPrank.friendGender && (
                    <div>
                      <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Gender</span>
                      <p className="font-body capitalize" style={{ color: '#FFFFFF' }}>{selectedPrank.friendGender}</p>
                    </div>
                  )}
                  {selectedPrank.friendLocation && (
                    <div className="sm:col-span-2">
                      <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Location</span>
                      <p className="font-body" style={{ color: '#FFFFFF' }}>{selectedPrank.friendLocation}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium font-body block mb-2" style={{ color: '#FFFFFF', opacity: 0.7 }}>Personality Types</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrank.personalityTypes.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full text-sm font-body border"
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

              {/* Prank Details */}
              <div>
                <h3 className="text-lg font-semibold font-secondary mb-3" style={{ color: '#BFFF00' }}>Prank Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Type</span>
                    <p className="font-body capitalize" style={{ color: '#FFFFFF' }}>{selectedPrank.prankType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize inline-block ${
                      selectedPrank.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      selectedPrank.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      selectedPrank.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedPrank.status}
                    </span>
                  </div>
                  {selectedPrank.additionalInfo && (
                    <div>
                      <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Additional Notes</span>
                      <p className="font-body whitespace-pre-wrap p-3 rounded-lg" style={{ 
                        color: '#FFFFFF', 
                        backgroundColor: 'rgba(10, 10, 10, 0.4)',
                        borderColor: 'rgba(138, 43, 226, 0.2)'
                      }}>
                        {selectedPrank.additionalInfo}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium font-body block mb-1" style={{ color: '#FFFFFF', opacity: 0.7 }}>Created</span>
                    <p className="font-body text-sm" style={{ color: '#FFFFFF', opacity: 0.7 }}>{formatDate(selectedPrank.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  );
}

