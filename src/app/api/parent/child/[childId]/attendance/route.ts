import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childId = params.childId;

    // Verify parent is linked to this child
    const childLink = await prisma.familyMember.findFirst({
      where: {
        childId,
        family: {
          familyMembers: {
            some: {
              userId: session.user.id,
              role: 'parent',
            },
          },
        },
      },
    });

    if (!childLink) {
      return NextResponse.json({ error: 'Not authorized to view this child' }, { status: 403 });
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        userId: childId,
        checkInTime: {
          gte: startDate,
        },
      },
      orderBy: { checkInTime: 'desc' },
      take: 50,
    });

    const attendanceStats = {
      total: attendances.length,
      thisMonth: attendances.filter(a => {
        const now = new Date();
        const checkIn = new Date(a.checkInTime);
        return checkIn.getMonth() === now.getMonth() && checkIn.getFullYear() === now.getFullYear();
      }).length,
      totalPoints: attendances.reduce((sum, a) => sum + (a.pointsAwarded || 0), 0),
    };

    return NextResponse.json({ 
      attendances,
      stats: attendanceStats 
    });
  } catch (error) {
    console.error('Error fetching child attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}