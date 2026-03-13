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

    const now = new Date();

    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        startTime: {
          gte: now,
        },
      },
      orderBy: { startTime: 'asc' },
      include: {
        registrations: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    // Get events where children of the parent can register
    const familyMembers = await prisma.familyMember.findMany({
      where: {
        userId: session.user.id,
        role: 'parent',
      },
      include: {
        family: {
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
          },
        },
      },
    });

    const familyUserIds = familyMembers.flatMap(fm =>
      fm.family.familyMembers.map(fm2 => fm2.userId)
    );

    return NextResponse.json({
      events,
      familyUserIds,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}