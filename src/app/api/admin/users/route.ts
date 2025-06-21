import auth0 from '@/lib/auth0';
import { NextResponse } from 'next/server';
import { User } from '@/types/user';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth0.getSession();
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // TODO: Replace with actual user data fetching
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin_user',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'regular_user',
      email: 'user@example.com',
      role: 'user',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(mockUsers);
}
