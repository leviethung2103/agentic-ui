import type { Metadata } from 'next';
import { DM_Mono, Geist } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/auth/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  weight: '400',
  subsets: ['latin'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'KMSLV Chatbot',
  description:
    'A modern chat interface for AI agents built with Next.js, Tailwind CSS, and TypeScript.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background">
      <body
        className={`${geistSans.variable} ${dmMono.variable} font-sans h-full bg-background text-primary`}
      >
        <AuthProvider>
          <NuqsAdapter>
            <div className="min-h-full flex flex-col bg-background">
              <Navbar />
              <main className="flex-1">
                <div className="w-full">{children}</div>
              </main>
            </div>
            <Toaster position="top-center" />
          </NuqsAdapter>
        </AuthProvider>
      </body>
    </html>
  );
}
