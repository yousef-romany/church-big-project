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

    const child = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        createdAt: true,
        childProfile: true,
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    const attendances = await prisma.attendance.findMany({
      where: { userId: session.user.id },
      take: 10,
      orderBy: { checkInTime: 'desc' },
    });

    const achievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ child, attendances, achievements });
  } catch (error) {
    console.error('Error fetching child dashboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
