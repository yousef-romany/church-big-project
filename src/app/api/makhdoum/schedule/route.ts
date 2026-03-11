import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

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

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const weekOffset = parseInt(searchParams.get('weekOffset') || '0');

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + (weekOffset * 7));
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    let scheduleItems = [];

    if (currentUser.role === UserRole.PRIEST) {
      const confessions = await prisma.confession.findMany({
        where: {
          priestId: session.user.id,
          scheduledAt: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
        orderBy: { scheduledAt: 'asc' },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      const tasks = await prisma.visitationTask.findMany({
        where: {
          priestId: session.user.id,
          scheduledAt: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
        orderBy: { scheduledAt: 'asc' },
        include: {
          family: {
            select: {
              familyName: true,
              address: true,
            },
          },
        },
      });

      scheduleItems = [
        ...confessions.map(c => ({
          id: c.id,
          type: 'CONFESSION',
          title: `اعتراف: ${c.user.name}`,
          startTime: c.scheduledAt.toISOString(),
          endTime: new Date(c.scheduledAt.getTime() + c.duration * 60000).toISOString(),
          status: c.status,
        })),
        ...tasks.map(t => ({
          id: t.id,
          type: 'VISITATION',
          title: `زيارة عائلة: ${t.family.familyName}`,
          startTime: t.scheduledAt?.toISOString(),
          endTime: t.scheduledAt 
            ? new Date(t.scheduledAt.getTime() + 3600000).toISOString()
            : null,
          status: t.status,
          location: t.family.address,
        })),
      ];
    } else if (currentUser.role === UserRole.SERVANT) {
      const tasks = await prisma.visitationTask.findMany({
        where: {
          servantId: session.user.id,
          scheduledAt: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
        orderBy: { scheduledAt: 'asc' },
        include: {
          family: {
            select: {
              familyName: true,
              address: true,
            },
          },
        },
      });

      scheduleItems = tasks.map(t => ({
        id: t.id,
        type: 'VISITATION',
        title: `زيارة: ${t.family.familyName}`,
        startTime: t.scheduledAt?.toISOString(),
        endTime: t.scheduledAt 
          ? new Date(t.scheduledAt.getTime() + 3600000).toISOString()
          : null,
        status: t.status,
        location: t.family.address,
      }));
    }

    return NextResponse.json({ 
      scheduleItems,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString() 
    });
  } catch (error) {
    console.error('Error fetching makhdoum schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
