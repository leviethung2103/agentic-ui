import NextAuth from 'next-auth';
import authConfig from '@/auth';

const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Add any additional NextAuth config here
});

export const { GET, POST } = handlers;
export { auth, signIn, signOut };
