"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address", {
        style: {
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        style: {
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to send reset email", {
          style: {
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
          },
        })
        return
      }

      toast.success("Reset email sent!", {
        description: "Check your email for password reset instructions.",
        style: {
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          color: "#16a34a",
        },
        duration: 1000
      })

      // Redirect to check email page
      router.push("/check-email")
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("An error occurred. Please try again.", {
        style: {
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Icon type="agno" size="md" />
          <h1 className="mt-6 text-2xl font-bold text-primary">Forgot your password?</h1>
          <p className="mt-2 text-center text-sm text-muted">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-background text-primary"
              placeholder="Enter your email"
            />
          </div>

          <Button type="submit" className="w-full bg-brand text-white hover:bg-brand/90" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                Sending reset email...
              </div>
            ) : (
              "Send reset email"
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted">Remember your password?</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full border-border bg-background text-primary hover:bg-background-secondary"
              onClick={() => router.push("/auth/signin")}
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
