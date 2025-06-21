'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    // Redirect to chat page
    router.push('/chat')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="mb-4 text-4xl font-bold">Welcome to KMSLV Chatbot</h1>
      <p className="mb-8 text-lg text-gray-600">
        An advanced, intelligent chatbot built with Next.js, Tailwind CSS, and
        TypeScript.
      </p>
      <button
        className="rounded-lg bg-brand px-6 py-3 text-primary shadow-lg transition hover:bg-brand/90"
        onClick={handleGetStarted}
      >
        Getting Started
      </button>
    </main>
  )
}
