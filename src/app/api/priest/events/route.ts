import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { TransactionType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { startTime: 'desc' },
      include: {
        registrations: true,
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
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
    const { title, description, type, startTime, endTime, location, capacity, points } = body;

    if (!title || !type || !startTime || !endTime) {
      return NextResponse.json({ 
        error: 'title, type, startTime, and endTime are required' 
      }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        capacity,
        points: points || 10,
        priestId: session.user.id,
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const event = await prisma.event.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
