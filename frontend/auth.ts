import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();

const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Type guard for credentials
        if (!credentials || typeof credentials !== 'object') return null;
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl || '/';
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
    newUser: '/auth/signup',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  trustHost: true,
};


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

export default authConfig;
