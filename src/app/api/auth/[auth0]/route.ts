import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin((req) => {
    return {
      returnTo: '/chat'
    };
  }),
  logout: handleLogout((req) => {
    if (req.url) {
      const url = new URL(req.url);
      return {
        returnTo: url.origin
      };
    }
    return { returnTo: '/' };
  })
});
export const POST = handleAuth(); 