import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, TransactionType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classes = await prisma.sundaySchoolClass.findMany({
      where: {
        servantId: session.user.id,
        isActive: true,
      },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error('Error fetching Sunday school classes:', error);
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
    const { name, grade, description, servantId, dayOfWeek, startTime, endTime, location } = body;

    if (!name || !grade || !servantId || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json({ 
        error: 'name, grade, servantId, dayOfWeek, startTime, and endTime are required' 
      }, { status: 400 });
    }

    const sundaySchoolClass = await prisma.sundaySchoolClass.create({
      data: {
        name,
        grade,
        description,
        servantId,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        location,
      },
    });

    return NextResponse.json({ sundaySchoolClass });
  } catch (error) {
    console.error('Error creating Sunday school class:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
