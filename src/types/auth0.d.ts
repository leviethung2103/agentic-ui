import { UserProfile } from '@auth0/nextjs-auth0/client';

declare module '@auth0/nextjs-auth0/client' {
  interface UserProfile extends UserProfile {
    app_metadata?: {
      role?: string;
    };
  }
}

export {};
