'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LoginButton() {
    // Using a direct link instead of router.push to avoid error boundaries
    return (
        <Link
            href="/api/auth/login?promptreturnTo=/chat"
            className="group relative inline-flex w-full justify-center rounded-lg border border-transparent bg-brand px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
        >
            <span className="flex items-center">
                <svg className="-ml-1 mr-3 h-5 w-5 text-white/80 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Sign in with Auth0
            </span>
        </Link>
    )
} 