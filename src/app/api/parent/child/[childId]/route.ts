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

    const { childId } = params;

    const child = await prisma.user.findUnique({
      where: { id: childId },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        createdAt: true,
        childProfile: true,
        attendances: {
          take: 20,
          orderBy: { checkInTime: 'desc' },
        },
        pointsTransactions: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ child });
  } catch (error) {
    console.error('Error fetching child data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
