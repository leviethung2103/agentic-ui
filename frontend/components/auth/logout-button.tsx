'use client'

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear any client-side state if needed
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    try {
      // Sign out using NextAuth
      await signOut({
        redirect: false,
        callbackUrl: '/auth/signin'
      });
      
      // Redirect to sign-in page
      router.push('/auth/signin');
      router.refresh();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      Sign Out
    </Button>
  );
}
