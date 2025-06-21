import { handleAuth, handleLogin, handleLogout, handleCallback, handleProfile } from '@auth0/nextjs-auth0';

// Check for required environment variables
const requiredVars = [
  'AUTH0_SECRET',
  'AUTH0_ISSUER_BASE_URL',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_BASE_URL',
  'AUTH0_AUDIENCE'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required Auth0 environment variables:', missingVars.join(', '));
  throw new Error(`Missing required Auth0 environment variables: ${missingVars.join(', ')}`);
}

// Export the main auth handler
export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      // Request the necessary scopes
      scope: 'openid profile email',
      // Add audience if you're using an API
      audience: process.env.AUTH0_AUDIENCE,
    },
  }),
  logout: handleLogout({ 
    returnTo: process.env.AUTH0_BASE_URL 
  }),
  callback: handleCallback({
    // Add any callback configuration here
  }),
  profile: handleProfile({ refetch: true }),
});
