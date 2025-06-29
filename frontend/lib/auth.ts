import { auth as serverAuth, signIn, signOut } from '@/app/api/auth/[...nextauth]/route';

export { signIn, signOut };

// This is a server-side auth function
export const auth = serverAuth;

// Client-side auth functions can be added here if needed
