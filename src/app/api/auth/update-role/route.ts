import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-log';
import { UserRole } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      return NextResponse.json(
        { message: 'Invalid role provided' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'USER' && user.role !== role) {
      return NextResponse.json(
        { message: 'You already have a role. Please contact administrator to change it.' },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
    });

    await logAuditEvent({
      userId: updatedUser.id,
      email: updatedUser.email,
      action: 'ROLE_UPDATED',
      resource: 'USER_ROLE',
      success: true,
      details: { previousRole: user.role, newRole: role }
    });

    return NextResponse.json(
      { 
        message: 'Role updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Role Update Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
