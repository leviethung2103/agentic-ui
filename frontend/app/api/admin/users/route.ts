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

    // Fetch users from the database
    const dbUsers = await prisma.user.findMany();
    const users: User[] = dbUsers.map((u: any) => ({
      id: u.id,
      username: u.name || '',
      email: u.email,
      role: u.role === 'admin' ? 'admin' : 'user',
      status: 'active', // Default to 'active' since not in DB
      lastLogin: null, // Not tracked in DB
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));

    return NextResponse.json(users);
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
