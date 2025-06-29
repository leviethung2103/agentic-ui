"use client";

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import React from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { status } = useSession();

    // Define routes where Navbar should be hidden
    const hideNavbarRoutes = [
        '/',
        '/auth/signin',
        '/auth/signup',
        '/forgot-password',
        '/check-email',
    ];
    const shouldShowNavbar = status === 'authenticated' && !hideNavbarRoutes.includes(pathname);

    return (
        <div className="flex flex-col h-screen">
            {shouldShowNavbar && <Navbar />}
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
} 