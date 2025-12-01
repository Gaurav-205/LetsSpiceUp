'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, LoginData, RegisterData } from '@/types/auth';
import { authApi } from '@/lib/auth-api';
import { showToast } from '@/components/ToastProvider';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // Check for token immediately on mount (before checkAuth runs)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for token immediately to prevent false "no token" state
      let token = Cookies.get('token');
      // Fallback: read directly from document.cookie
      if (!token && typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
          token = decodeURIComponent(tokenCookie.split('=')[1].trim());
        }
      }
      
      if (token) {
        setHasToken(true);
        logger.debug('Initial token check: Token found');
      } else {
        setHasToken(false);
        logger.debug('Initial token check: No token found');
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      // Get token from cookie
      let token = Cookies.get('token');
      // Also try document.cookie as a fallback
      if (!token && typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
      
      if (!token) {
        // No token - user is not logged in
        setLoading(false);
        setUser(null);
        setHasToken(false);
        logger.debug('Auth check: No token found');
        return;
      }

      // Token exists - ensure hasToken is set
      setHasToken(true);
      logger.debug('Auth check: Token found, verifying with backend');

      // Verify token with backend
      const response = await authApi.getCurrentUser();
      if (response?.user) {
        setUser(response.user);
        logger.debug('Auth check: User authenticated', response.user.email);
      } else {
        // No user in response - this shouldn't happen with a valid token
        // But don't logout immediately - only logout if we get a 401
        logger.warn('No user in response, but keeping session');
      }
    } catch (error: unknown) {
      const apiError = error as { 
        response?: { 
          status?: number;
          data?: { error?: { message: string } };
        };
        message?: string;
      };
      
      // CRITICAL: Only remove token and logout if we get a 401 (Unauthorized)
      // This means the token is invalid, expired, or the user doesn't exist
      if (apiError.response?.status === 401) {
        // Token is invalid or expired - this is the ONLY case where we logout automatically
        Cookies.remove('token', { path: '/' });
        Cookies.remove('token');
        setUser(null);
        setHasToken(false);
        logger.debug('Auth check: Token invalid or expired - logging out');
      } else {
        // For ANY other error (network, rate limit, server error, etc.):
        // KEEP the user logged in by checking if token exists
        // This prevents logout on temporary issues
        
        const token = Cookies.get('token');
        
        if (token) {
          setHasToken(true);
          logger.debug('Auth check failed but token exists - keeping session');
        } else {
          setHasToken(false);
        }
        
        if (apiError.response?.status === 429) {
          logger.warn('Rate limited during auth check - keeping session');
        } else if (apiError.response?.status === 500) {
          logger.warn('Server error during auth check - keeping session');
        } else if (!apiError.response) {
          logger.warn('Network error during auth check - keeping session');
        } else {
          logger.warn(`Auth check failed but keeping session: ${apiError.response?.status}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    const response = await authApi.login(data);
    
    if (!response.token) {
      throw new Error('No token received from server');
    }
    
    // Set cookie with proper security settings
    const cookieOptions = {
      expires: 7,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };
    
    try {
      Cookies.set('token', response.token, cookieOptions);
      
      // Verify cookie was set
      const verifyToken = Cookies.get('token');
      if (verifyToken) {
        setHasToken(true);
        logger.debug('Cookie set successfully');
      } else {
        logger.error('Failed to set authentication cookie');
        // Still set hasToken to keep user logged in for this session
        setHasToken(true);
      }
    } catch (error) {
      logger.error('Error setting authentication cookie', error);
      // Still set hasToken to keep user logged in for this session
      setHasToken(true);
    }
    
    setUser(response.user);
    showToast('Login successful!', 'success');
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    
    if (!response.token) {
      throw new Error('No token received from server');
    }
    
    // Set cookie with proper security settings
    const cookieOptions = {
      expires: 7,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };
    
    try {
      Cookies.set('token', response.token, cookieOptions);
      
      // Verify cookie was set
      const verifyToken = Cookies.get('token');
      if (verifyToken) {
        setHasToken(true);
        logger.debug('Cookie set successfully');
      } else {
        logger.error('Failed to set authentication cookie');
        setHasToken(true);
      }
    } catch (error) {
      logger.error('Error setting authentication cookie', error);
      setHasToken(true);
    }
    
    setUser(response.user);
    showToast('Account created successfully!', 'success');
  };

  const logout = () => {
    // Explicit logout - remove token from all possible paths
    Cookies.remove('token', { path: '/' });
    Cookies.remove('token'); // Remove without path too
    setUser(null);
    setHasToken(false);
  };

  // Determine if user is authenticated
  // User is authenticated if:
  // 1. User data exists, OR
  // 2. Token exists (even if API call failed temporarily)
  const isAuthenticated = !!user || hasToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

