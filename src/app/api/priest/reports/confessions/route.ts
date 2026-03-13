import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, ConfessionStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {
      priestId: session.user.id,
    };

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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const stats = {
      total: confessions.length,
      scheduled: confessions.filter(c => c.status === ConfessionStatus.SCHEDULED).length,
      completed: confessions.filter(c => c.status === ConfessionStatus.COMPLETED).length,
      cancelled: confessions.filter(c => c.status === ConfessionStatus.CANCELLED).length,
      totalMinutes: confessions
        .filter(c => c.status === ConfessionStatus.COMPLETED)
        .reduce((sum, c) => sum + (c.duration || 30), 0),
    };

    return NextResponse.json({
      confessions,
      stats,
    });
  } catch (error) {
    console.error('Error fetching confession report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}