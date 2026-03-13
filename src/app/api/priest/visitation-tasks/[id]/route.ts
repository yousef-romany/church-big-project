import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, TaskStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const visitationId = params.id;

    const visitation = await prisma.visitationTask.findUnique({
      where: { id: visitationId },
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

    if (!visitation) {
      return NextResponse.json({ error: 'Visitation not found' }, { status: 404 });
    }

    if (visitation.priestId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ visitation });
  } catch (error) {
    console.error('Error fetching visitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const visitationId = params.id;
    const body = await request.json();
    const { status, priority, scheduledAt, notes } = body;

    const existing = await prisma.visitationTask.findUnique({
      where: { id: visitationId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Visitation not found' }, { status: 404 });
    }

    if (existing.priestId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (notes !== undefined) updateData.notes = notes;

    if (status === 'COMPLETED' && !existing.completedAt) {
      updateData.completedAt = new Date();
    }

    const visitation = await prisma.visitationTask.update({
      where: { id: visitationId },
      data: updateData,
      include: {
        family: {
          select: {
            id: true,
            familyName: true,
          },
        },
        servant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ visitation });
  } catch (error) {
    console.error('Error updating visitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const visitationId = params.id;

    const existing = await prisma.visitationTask.findUnique({
      where: { id: visitationId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Visitation not found' }, { status: 404 });
    }

    if (existing.priestId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.visitationTask.delete({
      where: { id: visitationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting visitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}