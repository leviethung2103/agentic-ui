// src/components/auth/logout-button.tsx
'use client'

import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'

export function LogoutButton() {
  const router = useRouter()
  const { user } = useUser()

  const handleLogout = () => {
    // Clear any client-side state if needed
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }

    // Redirect to Auth0 logout with federated logout
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(window.location.origin)}&federated`
  }

  if (!user) return null

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      Sign Out
    </Button>
  )
}