'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/playground/Sidebar/Sidebar';
import { ChatArea } from '@/components/playground/ChatArea';
import { Suspense } from 'react';

export default function ChatPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
