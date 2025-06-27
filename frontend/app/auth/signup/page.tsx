"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

interface PasswordRequirement {
  text: string
  met: boolean
}

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const router = useRouter()

  const passwordRequirements: PasswordRequirement[] = [
    { text: "At least 8 characters long", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) },
    { text: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ""

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields", {
        style: {
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        style: {
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      })
      return
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet requirements", {
        style: {
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      })
      return
    }

    if (!doPasswordsMatch) {
      toast.error("Passwords do not match", {
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to create account", {
          style: {
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
          },
        })
        return
      }

      toast.success("Account created successfully!", {
        description: "You can now sign in with your credentials.",
        style: {
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          color: "#16a34a",
        },
      })

      // Redirect to sign in page with success indicator
      router.push("/auth/signin?registered=true")
    } catch (error) {
      console.error("Sign up error:", error)
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
          <h1 className="mt-6 text-2xl font-bold text-primary">Create your account</h1>
          <p className="mt-2 text-center text-sm text-muted">Join us and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="border-border bg-background text-primary"
                placeholder="Enter your full name"
              />
            </div>

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
                value={formData.email}
                onChange={handleInputChange}
                className="border-border bg-background text-primary"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setShowPasswordRequirements(true)}
                className="border-border bg-background text-primary"
                placeholder="Create a password"
              />
              {showPasswordRequirements && (
                <div className="mt-2 space-y-2 rounded-xl border border-border bg-background-secondary p-3">
                  <p className="text-sm font-medium text-primary">Password requirements:</p>
                  {passwordRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {requirement.met ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ${requirement.met ? "text-green-600" : "text-red-600"}`}>
                        {requirement.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-primary">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="border-border bg-background text-primary"
                placeholder="Confirm your password"
              />
              {formData.confirmPassword && (
                <div className="flex items-center space-x-2">
                  {doPasswordsMatch ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-brand text-white hover:bg-brand/90"
            disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
          >
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
                Creating account...
              </div>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted">Already have an account?</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full border-border bg-background text-primary hover:bg-background-secondary"
              onClick={() => router.push("/auth/signin")}
            >
              Sign in instead
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
