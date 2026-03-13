import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { servantId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const servantId = params.servantId === 'me' ? session.user.id : params.servantId;

    const serviceHistory = await prisma.visitationTask.findMany({
      where: {
        servantId,
        status: 'COMPLETED',
      },
      include: {
        priest: {
          select: {
            id: true,
            name: true,
          },
        },
        family: {
          select: {
            id: true,
            familyName: true,
            address: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      serviceHistory,
      totalServices: serviceHistory.length,
    });
  } catch (error) {
    console.error('Error fetching service history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}