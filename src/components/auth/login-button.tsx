'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LoginButton() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/api/auth/login')
  }

  return (
    <Button onClick={handleLogin} size="lg">
      Sign In
    </Button>
  )
}
