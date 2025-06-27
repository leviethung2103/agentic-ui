'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Button 
      onClick={handleSignOut}
      variant="ghost"
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      Sign Out
    </Button>
  );
}
