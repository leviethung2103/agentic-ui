'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export function useAdminAccess() {
  const { user, isLoading } = useUser();
  const roles = user ? (user['https://app.buddyai.online/roles'] as string[]) : [];
  const isAdmin = roles.includes('admin');
  
  return {
    isAdmin,
    isLoading,
    user
  };
}
