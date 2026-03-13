import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, TaskStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {
      priestId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) {
        where.scheduledAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.scheduledAt.lte = new Date(endDate);
      }
    }

    const visitations = await prisma.visitationTask.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        family: {
          select: {
            id: true,
            familyName: true,
            address: true,
            phone: true,
          },
        },
        servant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const [pending, inProgress, completed] = await Promise.all([
      prisma.visitationTask.count({ where: { priestId: session.user.id, status: 'PENDING' } }),
      prisma.visitationTask.count({ where: { priestId: session.user.id, status: 'IN_PROGRESS' } }),
      prisma.visitationTask.count({ where: { priestId: session.user.id, status: 'COMPLETED' } }),
    ]);

    const stats = {
      total: visitations.length,
      pending,
      inProgress,
      completed,
    };

    return NextResponse.json({
      visitations,
      stats,
    });
  } catch (error) {
    console.error('Error fetching visitations:', error);
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
    const { familyId, servantId, scheduledAt, priority, notes } = body;

    if (!familyId || !servantId || !scheduledAt) {
      return NextResponse.json({ 
        error: 'familyId, servantId, and scheduledAt are required' 
      }, { status: 400 });
    }

    const visitation = await prisma.visitationTask.create({
      data: {
        priestId: session.user.id,
        familyId,
        servantId,
        scheduledAt: new Date(scheduledAt),
        priority: priority || 'MEDIUM',
        notes,
        status: TaskStatus.PENDING,
      },
      include: {
        family: {
          select: {
            id: true,
            familyName: true,
            address: true,
          },
        },
        servant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ visitation });
  } catch (error) {
    console.error('Error creating visitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}