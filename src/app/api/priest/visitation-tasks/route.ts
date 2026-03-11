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
    const servantId = searchParams.get('servantId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: any = {};
    if (priestId) where.priestId = priestId;
    if (servantId) where.servantId = servantId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

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
        servant: {
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { servantId, familyId, priority, scheduledAt, notes, latitude, longitude } = body;

    if (!servantId || !familyId) {
      return NextResponse.json({ 
        error: 'servantId and familyId are required' 
      }, { status: 400 });
    }

    const visitationTask = await prisma.visitationTask.create({
      data: {
        priestId: session.user.id,
        servantId,
        familyId,
        priority: priority || 'MEDIUM',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
        latitude,
        longitude,
      },
      include: {
        family: true,
      },
    });

    return NextResponse.json({ visitationTask });
  } catch (error) {
    console.error('Error creating visitation task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
