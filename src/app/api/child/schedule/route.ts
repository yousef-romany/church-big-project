import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.CHILD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekOffset = parseInt(searchParams.get('weekOffset') || '0');

    const child = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        childProfile: {
          select: {
            grade: true,
          },
        },
      },
    });

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + (weekOffset * 7));
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const classes = await prisma.sundaySchoolClass.findMany({
      where: {
        isActive: true,
        childProfile: {
          grade: child?.childProfile?.grade,
        },
      },
      orderBy: { dayOfWeek: 'asc' },
    });

    const attendances = await prisma.attendance.findMany({
      where: {
        userId: session.user.id,
        checkInTime: {
          gte: weekStart,
          lt: weekEnd,
        },
      },
    });

    const attendedDates = attendances.map(a => 
      new Date(a.checkInTime).toISOString().split('T')[0]
    );

    return NextResponse.json({ 
      classes, 
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      attendedDates 
    });
  } catch (error) {
    console.error('Error fetching child schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
