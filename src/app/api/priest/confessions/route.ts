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

    const { searchParams } = new URL(request.url);
    const priestId = searchParams.get('priestId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: any = {};
    if (priestId) where.priestId = priestId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const confessions = await prisma.confession.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
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
    const { userId, scheduledAt, duration, notes } = body;

    if (!userId || !scheduledAt) {
      return NextResponse.json({ 
        error: 'userId and scheduledAt are required' 
      }, { status: 400 });
    }

    const confession = await prisma.confession.create({
      data: {
        priestId: session.user.id,
        userId,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        notes,
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
