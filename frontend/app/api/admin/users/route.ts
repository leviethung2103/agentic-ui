import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { User } from '../../../../types/user';
import { NextRequest } from 'next/server';

// Helper function to create date with offset in days
const createDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    const isDevelopment = process.env.NODE_ENV === 'development';

    const user = session?.user;
    const roles = user ? (user['https://app.buddyai.online/roles'] as string[]) : [];

    // In development, bypass auth check for easier testing
    if (!isDevelopment && !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In production, check for admin role
    if (!isDevelopment && !roles.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

  // Generate mock users with realistic data
  const mockUsers: User[] = [
    // Admin users
    {
      id: '1',
      username: 'alex_johnson',
      email: 'alex.johnson@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: createDate(1),
      createdAt: createDate(365),
      updatedAt: createDate(5),
    },
    {
      id: '2',
      username: 'sarah_williams',
      email: 'sarah.w@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: createDate(0),
      createdAt: createDate(180),
      updatedAt: createDate(2),
    },
    // Regular users - active
    {
      id: '3',
      username: 'mike_chen',
      email: 'mike.chen@example.com',
      role: 'user',
      status: 'active',
      lastLogin: createDate(3),
      createdAt: createDate(120),
      updatedAt: createDate(3),
    },
    {
      id: '4',
      username: 'emily_rodriguez',
      email: 'emily.r@example.com',
      role: 'user',
      status: 'active',
      lastLogin: createDate(7),
      createdAt: createDate(90),
      updatedAt: createDate(7),
    },
    // Inactive users
    {
      id: '5',
      username: 'david_kim',
      email: 'david.kim@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: createDate(60),
      createdAt: createDate(200),
      updatedAt: createDate(60),
    },
    {
      id: '6',
      username: 'lisa_patel',
      email: 'lisa.p@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: createDate(120),
      createdAt: createDate(240),
      updatedAt: createDate(120),
    },
    // Recently added users
    {
      id: '7',
      username: 'james_wilson',
      email: 'james.w@example.com',
      role: 'user',
      status: 'active',
      lastLogin: createDate(0),
      createdAt: createDate(2),
      updatedAt: createDate(0),
    },
    {
      id: '8',
      username: 'sophia_garcia',
      email: 'sophia.g@example.com',
      role: 'user',
      status: 'active',
      lastLogin: createDate(1),
      createdAt: createDate(7),
      updatedAt: createDate(1),
    },
  ];

    return NextResponse.json(mockUsers);
  } catch (error) {
    console.error('Error in users API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
