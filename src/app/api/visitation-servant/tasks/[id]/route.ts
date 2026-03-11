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
    const servantId = searchParams.get('servantId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: any = {};
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, notes, latitude, longitude, completedAt } = body;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const visitationTask = await prisma.visitationTask.update({
      where: { id },
      data: {
        status,
        notes,
        latitude,
        longitude,
        completedAt: completedAt ? new Date(completedAt) : (status === 'COMPLETED' ? new Date() : null),
      },
      include: {
        family: true,
      },
    });

    return NextResponse.json({ visitationTask });
  } catch (error) {
    console.error('Error updating visitation task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
