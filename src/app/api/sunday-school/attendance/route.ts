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

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const childId = searchParams.get('childId');
    const date = searchParams.get('date');

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const where: any = {};
    if (currentUser.role === UserRole.PRIEST || currentUser.role === UserRole.SUNDAY_SCHOOL_SERVANT) {
      if (classId) where.sessionId = classId;
    }
    if (childId) where.userId = childId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.checkInTime = { gte: startDate, lt: endDate };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      orderBy: { checkInTime: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            childProfile: {
              select: {
                grade: true,
              },
            },
          },
        },
        session: true,
      },
    });

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { userId, sessionId, notes, pointsAwarded = 10 } = body;

    if (!userId || !sessionId) {
      return NextResponse.json({ 
        error: 'userId and sessionId are required' 
      }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        sessionId,
        checkInTime: { gte: today },
      },
    });

    if (existingAttendance) {
      return NextResponse.json({ 
        error: 'Attendance already recorded for today' 
      }, { status: 400 });
    }

    const attendance = await prisma.$transaction([
      prisma.attendance.create({
        data: {
          userId,
          sessionId,
          pointsAwarded,
          notes,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { points: { increment: pointsAwarded } },
      }),
      prisma.pointsTransaction.create({
        data: {
          userId,
          amount: pointsAwarded,
          type: TransactionType.EARNED,
          description: 'حضور مدارس الأحد',
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording class attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
