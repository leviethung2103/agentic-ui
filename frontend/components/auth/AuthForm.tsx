'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import Icon from '../ui/icon'

type AuthMode = 'login' | 'signup'

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement your authentication logic here
      // For now, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to dashboard on success
      router.push('/dashboard')
      toast.success(
        mode === 'login'
          ? 'Successfully logged in!'
          : 'Account created successfully!'
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Authentication failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
  }

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <div className="mb-8 flex flex-col items-center">
        <Icon type="agno" size="md" />
        <h1 className="mt-6 text-2xl font-bold text-primary">
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {mode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Fill in the details to create a new account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-border bg-background-secondary text-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder={mode === 'login' ? '••••••••' : 'Create a password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-border bg-background-secondary text-primary"
              minLength={8}
            />
          </div>
        </div>

        {mode === 'login' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label
              htmlFor="remember"
              className="cursor-pointer text-sm font-normal"
            >
              Remember me
            </Label>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-brand hover:bg-brand/90 text-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {mode === "login" ? "Signing in..." : "Creating account..."}
            </div>
          ) : (
            <>{mode === "login" ? "Sign in" : "Create account"}</>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}
          <button
            type="button"
            onClick={toggleMode}
            className="ml-1 text-brand hover:underline focus:outline-none"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
