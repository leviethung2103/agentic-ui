// import { getServerSession } from 'next-auth/next';
import getServerSession from 'next-auth'
import authConfig from '@/auth';
import { NextResponse } from 'next/server';
import type { User } from '../../../../types/user';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to create date with offset in days
const createDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    const isDevelopment = process.env.NODE_ENV === 'development';

    const user = session && 'user' in session ? (session.user as any) : null;
    // In development, bypass auth check for easier testing
    if (!isDevelopment && !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // In production, check for admin role
    if (
      !isDevelopment &&
      (!user || typeof user !== 'object' || !('role' in user) || user.role !== 'admin')
    ) {
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

    // If using database, fetch users and map 'name' to 'username'
    // Example: const dbUsers = await prisma.user.findMany();
    // return NextResponse.json(dbUsers.map(u => ({ ...u, username: u.name || '' })));

    return NextResponse.json(mockUsers);
  } catch (error) {
    console.error('Error in users API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    const isDevelopment = process.env.NODE_ENV === 'development';
    const user = session && 'user' in session ? (session.user as any) : null;
    if (!isDevelopment && (!user || user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role } = body;
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const userRole = role === 'admin' ? 'admin' : 'user';

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    // Exclude password from response and map 'name' to 'username'
    const { password: _, ...userWithoutPassword } = newUser;
    const userWithUsername = { ...userWithoutPassword, username: newUser.name || '' };
    return NextResponse.json(userWithUsername, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
