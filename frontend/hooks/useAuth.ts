'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export function useAuth() {
  const { user, isLoading, error } = useUser();
  const isAuthenticated = !!user;
  const role = user?.app_metadata?.role || 'user';
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    role,
    isAdmin: role === 'admin'
  };
}
