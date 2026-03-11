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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let tasks = [];

    if (currentUser.role === UserRole.PRIEST) {
      tasks = await prisma.visitationTask.findMany({
        where: {
          priestId: session.user.id,
          ...(status && { status }),
          ...(priority && { priority }),
        },
        orderBy: { createdAt: 'desc' },
        include: {
          servant: {
            select: {
              name: true,
            },
          },
          family: {
            select: {
              familyName: true,
              address: true,
            },
          },
        },
      });
    } else if (currentUser.role === UserRole.SERVANT) {
      tasks = await prisma.visitationTask.findMany({
        where: {
          servantId: session.user.id,
          ...(status && { status }),
          ...(priority && { priority }),
        },
        orderBy: { createdAt: 'desc' },
        include: {
          priest: {
            select: {
              name: true,
            },
          },
          family: {
            select: {
              familyName: true,
              address: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { servantId, familyId, priority, scheduledAt, notes } = body;

    if (!servantId || !familyId) {
      return NextResponse.json({ 
        error: 'servantId and familyId are required' 
      }, { status: 400 });
    }

    const task = await prisma.visitationTask.create({
      data: {
        priestId: session.user.id,
        servantId,
        familyId,
        priority: priority || 'MEDIUM',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
      },
      include: {
        family: true,
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
