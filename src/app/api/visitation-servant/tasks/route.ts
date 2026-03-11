import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let where: any = {};
    if (currentUser.role === UserRole.SERVANT) {
      where.servantId = session.user.id;
    }

    const visitationTasks = await prisma.visitationTask.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        priest: {
          select: {
            id: true,
            name: true,
          },
        },
        family: {
          select: {
            id: true,
            familyName: true,
            address: true,
            city: true,
            phone: true,
            familyMembers: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ visitationTasks });
  } catch (error) {
    console.error('Error fetching visitation tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
