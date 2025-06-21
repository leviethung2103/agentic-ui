import { handleAuth, handleLogin, handleLogout} from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin((req) => {
    return {
      returnTo: '/chat',
      authorizationParams: {
        prompt: 'login' // This forces the login screen every time
      }
    };
  }),
  logout: handleLogout({
    logoutParams: {
      returnTo: '/', // Where to redirect after logout
      federated: true // This will also log out from the identity provider
    }
  })
});
export const POST = handleAuth(); 