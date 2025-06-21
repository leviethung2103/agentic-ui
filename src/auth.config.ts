import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const role = session?.user?.app_metadata?.role;
  const url = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/403', '/api/auth'];
  
  // Redirect to login if trying to access protected route without session
  if (!session && !publicRoutes.some(route => url.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (url.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
