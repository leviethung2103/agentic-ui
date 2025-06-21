'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { LoginButton } from '@/components/auth/login-button';

export default function LoginPage() {
    const { user, isLoading } = useUser();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/chat';

    // If user is already logged in, redirect to the returnTo URL
    useEffect(() => {
        if (user && !isLoading) {
            window.location.href = returnTo;
        }
    }, [user, isLoading, returnTo]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-background">
            <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-10"></div>
            <div className="relative flex min-h-screen w-full items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl bg-background-secondary p-8 shadow-2xl backdrop-blur-sm border border-border">
                    <div className="space-y-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-primary">Welcome back</h1>
                            <p className="text-muted">
                                Sign in to access your account
                            </p>
                        </div>
                        <div className="pt-2">
                            <LoginButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 