'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut({
      redirect: false,
      callbackUrl: '/auth/signin'
    });
    router.push('/auth/signin');
    router.refresh();
  };

  if (status === 'loading') {
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
              {status === 'authenticated' && session?.user && (
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
                  {session.user.role === 'admin' && (
                    <Link
                      href="/admin/users"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/admin')
                        ? 'bg-background-secondary text-primary'
                        : 'text-muted hover:bg-accent hover:text-primary'
                        }`}
                    >
                      User Management
                    </Link>
                  )}
                  {session.user.role === 'admin' && (
                    <Link
                      href="/knowledge"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/knowledge')
                        ? 'bg-background-secondary text-primary'
                        : 'text-muted hover:bg-accent hover:text-primary'
                        }`}
                    >
                      Knowledge
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  {session.user.name && (
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                {session.user.role === 'admin' && (
                  <span className="ml-2 bg-brand text-white text-xs px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              null
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
