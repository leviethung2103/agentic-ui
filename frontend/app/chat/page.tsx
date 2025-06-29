'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/playground/Sidebar/Sidebar';
import { ChatArea } from '../../components/playground/ChatArea';
import { Suspense, useEffect } from 'react';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Optionally, show a spinner or nothing while redirecting
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
          <ChatArea />
        </div>
      </div>
    </Suspense>
  );
}
