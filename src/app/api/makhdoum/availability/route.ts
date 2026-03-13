import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || (session.user.role !== UserRole.SERVANT && session.user.role !== UserRole.SUNDAY_SCHOOL_SERVANT)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 30); // Default: next 30 days

    const availability: any[] = [];

    // Get visits
    const visitationTasks = await prisma.visitationTask.findMany({
      where: {
        servantId: session.user.id,
        scheduledAt: {
          gte: startDate ? new Date(startDate) : defaultStart,
          lte: endDate ? new Date(endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      include: {
        family: {
          select: {
            id: true,
            familyName: true,
            address: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    visitationTasks.forEach(task => {
      availability.push({
        id: task.id,
        type: 'VISITATION',
        title: `زيارة: ${task.family.familyName}`,
        start: task.scheduledAt,
        end: task.scheduledAt,
        location: task.family.address,
        description: task.notes,
      });
    });

    // Get Sunday School classes
    const sundaySchoolClasses = await prisma.sundaySchoolClass.findMany({
      where: {
        servantId: session.user.id,
        isActive: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    sundaySchoolClasses.forEach(cls => {
      const today = new Date();
      const diff = cls.dayOfWeek - today.getDay();
      const classDate = new Date(today);
      classDate.setDate(today.getDate() + (diff >= 0 ? diff : diff + 7));

      availability.push({
        id: cls.id,
        type: 'CLASS',
        title: cls.name,
        start: new Date(classDate.toDateString() + ' ' + cls.startTime),
        end: new Date(classDate.toDateString() + ' ' + cls.endTime),
        location: cls.location,
        description: cls.grade,
      });
    });

    return NextResponse.json({
      availability,
      summary: {
        visitations: visitationTasks.length,
        classes: sundaySchoolClasses.length,
      },
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, status, notes } = body;

    if (!taskId) {
      return NextResponse.json({ 
        error: 'taskId is required' 
      }, { status: 400 });
    }

    const task = await prisma.visitationTask.update({
      where: { id: taskId },
      data: {
        status: status || 'PENDING',
        notes: notes,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}