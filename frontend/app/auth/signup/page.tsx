'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', '111111', '123123', 'password1', '1234', '12345', '12345678', 'admin', 'letmein', 'welcome', 'monkey', 'login', 'football', 'iloveyou', 'starwars', 'dragon'
  ];

  // Password validation logic
  const passwordRequirements = [
    {
      label: '8-32 characters',
      test: (pw: string) => pw.length >= 8 && pw.length <= 32,
    },
    {
      label: 'At least 1 uppercase letter',
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: 'At least 1 lowercase letter',
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: 'At least 1 number',
      test: (pw: string) => /[0-9]/.test(pw),
    },
    {
      label: 'At least 1 special character',
      test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
    {
      label: 'Not a common password',
      test: (pw: string) => !commonPasswords.includes(pw.toLowerCase()),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password.length > 32) {
      setError('Password must not exceed 32 characters');
      return;
    }

    if (commonPasswords.includes(password.toLowerCase())) {
      setError('This password is too common. Please choose a more secure password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Redirect to sign-in page after successful registration
      router.push('/auth/signin?registered=true');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-900">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-900">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-900">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full placeholder:text-gray-500"
                placeholder="Enter your password"
              />
              <ul className="mt-2 space-y-1 text-xs">
                {passwordRequirements.map((req, idx) => (
                  <li
                    key={req.label}
                    className={clsx(
                      req.test(password)
                        ? 'text-green-600'
                        : 'text-gray-400',
                      'flex items-center gap-1'
                    )}
                  >
                    <span>
                      {req.test(password) ? '✓' : '•'}
                    </span>
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-900">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full placeholder:text-gray-500"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full justify-center bg-brand text-white hover:bg-brand/90"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/auth/signin')}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
