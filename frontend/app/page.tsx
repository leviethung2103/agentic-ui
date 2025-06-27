'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [isFading, setIsFading] = useState(false)

  const handleGetStarted = () => {
    setIsFading(true)
    setTimeout(() => {
      router.push('/auth/signin')
    }, 400) // Duration matches the fade-out
  }

  return (
    <div className="relative w-full min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-10"></div>
      <AnimatePresence>
        {!isFading && (
          <motion.main
            key="home-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center min-h-screen text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                Welcome to <span className="text-brand">KMSLV Chatbot</span>
              </h1>
              <p className="text-xl text-primary/80 mb-10 max-w-2xl mx-auto">
                An advanced, intelligent chatbot built with Next.js, Tailwind CSS, and TypeScript.
                Experience the future of conversational AI today.
              </p>
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden text-lg font-medium text-white rounded-lg bg-brand hover:bg-brand/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                <span className="relative">
                  Get Started
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}
