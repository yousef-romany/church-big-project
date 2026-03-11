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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let attendances;
    let total;

    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'PRIEST') {
      const [attendanceData, totalCount] = await Promise.all([
        prisma.attendance.findMany({
          skip,
          take: limit,
          orderBy: { checkInTime: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        }),
        prisma.attendance.count(),
      ]);

      attendances = attendanceData.map(a => ({
        id: a.id,
        userId: a.userId,
        userName: a.user.name,
        checkInTime: a.checkInTime.toISOString(),
        checkOutTime: a.checkOutTime?.toISOString() || null,
        location: a.location,
        pointsAwarded: a.pointsAwarded,
      }));

      total = totalCount;
    } else {
      const [attendanceData, totalCount] = await Promise.all([
        prisma.attendance.findMany({
          where: { userId: session.user.id },
          skip,
          take: limit,
          orderBy: { checkInTime: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        }),
        prisma.attendance.count({
          where: { userId: session.user.id },
        }),
      ]);

      attendances = attendanceData.map(a => ({
        id: a.id,
        userId: a.userId,
        userName: a.user.name,
        checkInTime: a.checkInTime.toISOString(),
        checkOutTime: a.checkOutTime?.toISOString() || null,
        location: a.location,
        pointsAwarded: a.pointsAwarded,
      }));

      total = totalCount;
    }

    return NextResponse.json({ 
      attendances,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
