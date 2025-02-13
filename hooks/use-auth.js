"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasRole } from '@/lib/utils';

export function useAuth(requiredRoles) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();

        if (!data.user || !hasRole(data.user, requiredRoles)) {
          router.push('/auth/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [requiredRoles, router]);

  return { isLoading, isAuthorized };
}