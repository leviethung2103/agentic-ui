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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background/80">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h1 className="text-xl font-semibold">Chat</h1>
            {user && <UserProfile />}
          </div>
          <ChatArea />
        </div>
      </div>
    </ProtectedRoute>
  );
}
