'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

export default function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow-sm">
      {user.picture && (
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={user.picture}
            alt={user.name || 'User'}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
      )}
      <div>
        <h3 className="font-semibold">{user.name || 'User'}</h3>
        <p className="text-sm text-gray-600">{user.email}</p>
        {user.app_metadata?.role && (
          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {user.app_metadata.role}
          </span>
        )}
      </div>
    </div>
  );
}
