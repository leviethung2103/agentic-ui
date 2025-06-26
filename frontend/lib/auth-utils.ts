import { getSession as getAuth0Session } from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';

export async function getCurrentUser(req?: NextRequest) {
  if (!req) return null;
  const res = new NextResponse();
  const session = await getAuth0Session(req, res);
  return session?.user || null;
}

export async function isAdminUser(req?: NextRequest) {
  const user = await getCurrentUser(req);
  return user?.app_metadata?.role === 'admin';
}

export async function getUserRole(req?: NextRequest) {
  const user = await getCurrentUser(req);
  return user?.app_metadata?.role || 'user';
}

export async function requireAuth(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireAdmin(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Admin privileges required');
  }
  return user;
}
