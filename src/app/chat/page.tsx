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
        <div className="flex h-screen bg-background/80">
          <Sidebar />
          <ChatArea />
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}
