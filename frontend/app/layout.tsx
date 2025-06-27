import type { Metadata } from 'next';
import { DM_Mono, Geist } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '../components/ui/sonner';
import './globals.css';
import '../styles/animations.css';
import { AuthProvider } from '../providers/auth-provider';
import ClientLayout from './ClientLayout';

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
        className={`${geistSans.variable} ${dmMono.variable} font-sans h-screen bg-background text-primary overflow-hidden`}
      >
        <AuthProvider>
          <NuqsAdapter>
            <ClientLayout>{children}</ClientLayout>
            <Toaster position="top-center" />
          </NuqsAdapter>
        </AuthProvider>
      </body>
    </html>
  );
}
