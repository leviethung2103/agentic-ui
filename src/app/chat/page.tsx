'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/playground/Sidebar/Sidebar';
import { ChatArea } from '@/components/playground/ChatArea';
import UserProfile from '@/components/UserProfile';

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
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-background">
            <h1 className="text-xl font-semibold text-foreground">Chat</h1>
          </div>
          <div className="flex-1 overflow-auto">
            <ChatArea />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
