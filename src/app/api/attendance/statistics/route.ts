import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    let totalAttendances = 0;
    let thisMonthAttendances = 0;
    let thisWeekAttendances = 0;
    let totalPointsEarned = 0;
    let averagePointsPerAttendance = 0;

    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'PRIEST') {
      totalAttendances = await prisma.attendance.count();
      thisMonthAttendances = await prisma.attendance.count({
        where: {
          checkInTime: { gte: startOfMonth },
        },
      });
      thisWeekAttendances = await prisma.attendance.count({
        where: {
          checkInTime: { gte: startOfWeek },
        },
      });
      
      const attendances = await prisma.attendance.findMany({
        select: { pointsAwarded: true },
      });
      
      totalPointsEarned = attendances.reduce((sum, a) => sum + a.pointsAwarded, 0);
      averagePointsPerAttendance = totalAttendances > 0 
        ? Math.round(totalPointsEarned / totalAttendances) 
        : 0;
    } else {
      totalAttendances = await prisma.attendance.count({
        where: { userId: session.user.id },
      });
      thisMonthAttendances = await prisma.attendance.count({
        where: {
          userId: session.user.id,
          checkInTime: { gte: startOfMonth },
        },
      });
      thisWeekAttendances = await prisma.attendance.count({
        where: {
          userId: session.user.id,
          checkInTime: { gte: startOfWeek },
        },
      });
      
      const attendances = await prisma.attendance.findMany({
        where: { userId: session.user.id },
        select: { pointsAwarded: true },
      });
      
      totalPointsEarned = attendances.reduce((sum, a) => sum + a.pointsAwarded, 0);
      averagePointsPerAttendance = totalAttendances > 0 
        ? Math.round(totalPointsEarned / totalAttendances) 
        : 0;
    }

    const streak = await calculateStreak(session.user.id, currentUser?.role);

    const stats = {
      totalAttendances,
      thisMonthAttendances,
      thisWeekAttendances,
      totalPointsEarned,
      averagePointsPerAttendance,
      streak,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function calculateStreak(userId: string, role?: string | null) {
  try {
    const whereClause = role === 'ADMIN' || role === 'PRIEST' 
      ? {} 
      : { userId };

    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      orderBy: { checkInTime: 'desc' },
      select: { checkInTime: true },
      take: 365,
    });

    if (attendances.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const attendanceDates = attendances.map(a => {
      const date = new Date(a.checkInTime);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    for (let i = 0; i < 365; i++) {
      if (attendanceDates.some(d => d.getTime() === currentDate.getTime())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i > 0) {
        break;
      } else {
        currentDate.setDate(currentDate.getDate() - 1);
        if (attendanceDates.some(d => d.getTime() === currentDate.getTime())) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}
