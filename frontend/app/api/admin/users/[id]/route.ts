import getServerSession from 'next-auth';
import authConfig from '@/auth';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig);
    const isDevelopment = process.env.NODE_ENV === 'development';
    const user = session && 'user' in session ? (session.user as any) : null;
    if (!isDevelopment && (!user || user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id } = params;
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (userToDelete.role === 'admin') {
      return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 403 });
    }
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig);
    const isDevelopment = process.env.NODE_ENV === 'development';
    const user = session && 'user' in session ? (session.user as any) : null;
    if (!isDevelopment && (!user || user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id } = params;
    const body = await request.json();
    if (!body.role || !['admin', 'user'].includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    const userToUpdate = await prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Only allow role update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: body.role },
    });
    return NextResponse.json({
      id: updatedUser.id,
      username: updatedUser.name || '',
      email: updatedUser.email,
      role: updatedUser.role,
      status: 'active',
      lastLogin: null,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 