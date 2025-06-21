import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin((req) => {
    return {
      returnTo: '/chat',
    };
  }),
});
export const POST = handleAuth(); 