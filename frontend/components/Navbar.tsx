'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  if (isLoading) {
    return null;
  }

  return (
    <nav className="bg-background shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-primary text-lg font-semibold hover:text-primary/80 transition-colors"
            >
              KMSLV Chatbot
            </Link>
            <div className="hidden md:flex space-x-4">
              {user && (
                <>
                  <Link
                    href="/chat"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/chat'
                      ? 'bg-background-secondary text-primary'
                      : 'text-muted hover:bg-accent hover:text-primary'
                      }`}
                  >
                    Chat
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/admin')
                      ? 'bg-background-secondary text-primary'
                      : 'text-muted hover:bg-accent hover:text-primary'
                      }`}
                  >
                    User Management
                  </Link>
                  <Link
                    href="/knowledge"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/knowledge')
                      ? 'bg-background-secondary text-primary'
                      : 'text-muted hover:bg-accent hover:text-primary'
                      }`}
                  >
                    Knowledge
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted">
                  {user.name || user.email}
                  {user.app_metadata?.role === 'admin' && (
                    <span className="ml-2 bg-brand text-white text-xs px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <Link
                  href={`/api/auth/logout?returnTo=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&federated`}
                  className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <Link
                href="/api/auth/login"
                className="bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
