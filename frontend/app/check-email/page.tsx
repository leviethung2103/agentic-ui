"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"
import { Mail, ArrowLeft } from "lucide-react"

export default function CheckEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()

  const handleResendEmail = async () => {
    setIsResending(true)

    // Simulate API call
    setTimeout(() => {
      toast.success("Email sent!", {
        description: "We've sent another copy to your inbox.",
        style: {
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          color: "#16a34a",
        },
        duration: 1000
      })
      setIsResending(false)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
            <Mail className="h-8 w-8 text-brand" />
          </div>
          <Icon type="agno" size="sm" />
          <h1 className="mt-6 text-2xl font-bold text-primary">Check your email</h1>
          <p className="mt-2 text-center text-sm text-muted">
            We've sent a password reset link to your email address. Click the link in the email to reset your password.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background-secondary p-4">
            <h3 className="text-sm font-medium text-primary">What to do next:</h3>
            <ul className="mt-2 space-y-1 text-left text-sm text-muted">
              <li>• Check your inbox for an email from us</li>
              <li>• Click the reset link in the email</li>
              <li>• Create a new password</li>
              <li>• Sign in with your new password</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full border-border bg-background text-primary hover:bg-background-secondary"
            >
              {isResending ? (
                <div className="flex items-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resending...
                </div>
              ) : (
                "Resend email"
              )}
            </Button>

            <Button
              onClick={() => router.push("/auth/signin")}
              variant="ghost"
              className="w-full text-primary hover:bg-background-secondary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted">
            Didn't receive the email? Check your spam folder or contact support if you continue to have issues.
          </p>
        </div>
      </div>
    </div>
  )
}
