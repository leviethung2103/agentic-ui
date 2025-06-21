'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function LoginButton() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/chat');
    }
  }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Our App</h1>
      <a
        href="/api/auth/login"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Log in / Sign up
      </a>
    </div>
  );
}
