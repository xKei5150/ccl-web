'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/app/(app)/auth/actions';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          // Ensure we have the full user data with permissions
          setUser(userData);
          // If we're on a login-related page, redirect to dashboard
          if (window.location.pathname.startsWith('/auth')) {
            router.replace('/dashboard');
          }
        } else if (!window.location.pathname.startsWith('/auth')) {
          // If no user and not on auth page, redirect to login
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isCitizen: user?.role === 'citizen',
    permissions: user?.permissions || {},
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};