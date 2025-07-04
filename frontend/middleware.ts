import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const res = new NextResponse();
  const session = await getSession(req, res);
  const user = session?.user;
  const pathname = req.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/403', '/api/auth'];

  // Check if the current route is public
  const isPublicRoute = pathname === '/' || publicRoutes.some(route => pathname.startsWith(route));

  // Redirect to login if trying to access protected route without session
  if (!user && !isPublicRoute) {
    const loginUrl = new URL('/api/auth/login', req.url);
    loginUrl.searchParams.set('returnTo', pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  const roles = user ? user['https://app.buddyai.online/roles'] as string[] : undefined;
  if (user && pathname.startsWith('/admin') && (!roles || !roles.includes('admin'))) {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
