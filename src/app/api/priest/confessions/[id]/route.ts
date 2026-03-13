import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ConfessionStatus, UserRole } from '@prisma/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const confessionId = params.id;
    const body = await request.json();
    const { status, notes, completedAt } = body;

    if (!status) {
      return NextResponse.json({ 
        error: 'status is required' 
      }, { status: 400 });
    }

    // Verify the priest owns this confession
    const existingConfession = await prisma.confession.findUnique({
      where: { id: confessionId },
    });

    if (!existingConfession) {
      return NextResponse.json({ error: 'Confession not found' }, { status: 404 });
    }

    if (existingConfession.priestId !== session.user.id && session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = { status };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (completedAt) {
      updateData.completedAt = new Date(completedAt);
    } else if (status === ConfessionStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    const confession = await prisma.confession.update({
      where: { id: confessionId },
      data: updateData,
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
    console.error('Error updating confession:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const confessionId = params.id;

    // Verify the priest owns this confession
    const existingConfession = await prisma.confession.findUnique({
      where: { id: confessionId },
    });

    if (!existingConfession) {
      return NextResponse.json({ error: 'Confession not found' }, { status: 404 });
    }

    if (existingConfession.priestId !== session.user.id && session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.confession.delete({
      where: { id: confessionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting confession:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}