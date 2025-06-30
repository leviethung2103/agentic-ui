import { auth } from '@/auth';
import type { User } from '../../../../types/user';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Helper function to create date with offset in days
const createDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export async function GET(request: Request) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const session = await auth();
    const user = session?.user || null;
    // Debug logs
    console.log('[DEBUG] /api/admin/users GET', {
      NODE_ENV: process.env.NODE_ENV,
      session,
      user,
    });
    // In development, bypass auth check for easier testing
    if (!isDevelopment && !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    // In production, check for admin role
    if (
      !isDevelopment &&
      (!user || typeof user !== 'object' || !('role' in user) || user.role !== 'admin')
    ) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
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

    return new Response(JSON.stringify(users), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in users API route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request: Request) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const session = await auth();
    const user = session?.user || null;
    // Debug logs
    console.log('[DEBUG] /api/admin/users POST', {
      NODE_ENV: process.env.NODE_ENV,
      session,
      user,
    });
    if (!isDevelopment && (!user || user.role !== 'admin')) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const { username, email, password, role } = body;
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const userRole = role === 'admin' ? 'admin' : 'user';

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
    return new Response(JSON.stringify(userWithUsername), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}

export async function PATCH() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
