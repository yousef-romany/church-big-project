import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, ConfessionStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const priestId = searchParams.get('priestId') || session.user.id;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {
      priestId,
    };

    if (userId) {
      where.userId = userId;
    }

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

    const confessions = await prisma.confession.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        priest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ confessions });
  } catch (error) {
    console.error('Error fetching confessions:', error);
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
    const { userId, scheduledAt, duration = 30, notes } = body;

    if (!userId || !scheduledAt) {
      return NextResponse.json({ 
        error: 'userId and scheduledAt are required' 
      }, { status: 400 });
    }

    // Check for scheduling conflicts
    const scheduledDate = new Date(scheduledAt);
    const conflictStart = new Date(scheduledDate.getTime() - duration * 60000);
    const conflictEnd = new Date(scheduledDate.getTime() + duration * 60000);

    const conflicts = await prisma.confession.findMany({
      where: {
        priestId: session.user.id,
        status: { in: [ConfessionStatus.SCHEDULED, ConfessionStatus.IN_PROGRESS] },
        scheduledAt: {
          gte: conflictStart,
          lte: conflictEnd,
        },
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json({ 
        error: 'يوجد تعارض في الموعد المحدد',
        conflicts: conflicts.map(c => ({
          id: c.id,
          scheduledAt: c.scheduledAt,
        }))
      }, { status: 409 });
    }

    const confession = await prisma.confession.create({
      data: {
        priestId: session.user.id,
        userId,
        scheduledAt: new Date(scheduledAt),
        duration,
        notes,
        status: ConfessionStatus.SCHEDULED,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ confession });
  } catch (error) {
    console.error('Error creating confession:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}