'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          {user && (
            <Link href="/chat" className="text-white hover:text-gray-300">
              Chat
            </Link>
          )}
          {user?.app_metadata?.role === 'admin' && (
            <Link href="/admin" className="text-white hover:text-gray-300">
              Admin
            </Link>
          )}
        </div>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">
                {user.name || user.email}
                {user.app_metadata?.role === 'admin' && ' (Admin)'}
              </span>
              <a
                href="/api/auth/logout"
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </a>
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
