'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/button'
import Icon from '../ui/icon'

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <div className="mx-auto w-full max-w-md px-4 text-center">
      <div className="mb-8 flex flex-col items-center">
        <div className="rounded-full bg-brand/10 p-4">
          <Icon type="mail" size="lg" className="text-brand" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-primary">
          Check your email
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          We've sent a password reset link to{' '}
          <span className="font-medium text-primary">{email}</span>. Please
          check your inbox and follow the instructions.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted">
          Didn't receive an email? Check your spam folder or request another
          link.
        </p>

        <div className="flex flex-col space-y-3">
          <Link href="/forgot-password">
            <Button variant="outline" className="w-full border-border">
              Request another link
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="ghost" className="w-full text-primary">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
