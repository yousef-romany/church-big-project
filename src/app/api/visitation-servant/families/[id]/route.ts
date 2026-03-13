import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, TaskStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const familyId = params.id;

    // Check if servant is assigned to this family
    const assignedTask = await prisma.visitationTask.findFirst({
      where: {
        servantId: session.user.id,
        familyId,
      },
    });

    if (!assignedTask) {
      return NextResponse.json({ error: 'Not authorized to view this family' }, { status: 403 });
    }

    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        familyMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        visitationTasks: {
          where: {
            servantId: session.user.id,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            priest: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    return NextResponse.json({ family });
  } catch (error) {
    console.error('Error fetching family info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}