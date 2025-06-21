'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    router.push('/api/auth/logout')
  }

  return (
    <Button onClick={handleLogout} variant="ghost">
      Sign Out
    </Button>
  )
}
