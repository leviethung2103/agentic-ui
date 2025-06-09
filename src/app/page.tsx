'use client'
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Welcome to KMSLV Chatbot</h1>
      <p className="mb-8 text-lg text-gray-600">
        An advanced, intelligent chatbot built with Next.js, Tailwind CSS, and TypeScript.
      </p>
      <button
        className="px-6 py-3 bg-brand text-primary rounded-lg shadow-lg hover:bg-brand/90 transition"
        onClick={() => loginWithRedirect()}
      >
        Getting Started
      </button>
    </main>
  );
}
