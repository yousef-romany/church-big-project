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
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childId = params.childId === 'me' ? session.user.id : params.childId;

    // For children, only allow viewing their own data
    if (session.user.role === UserRole.CHILD && childId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const attendances = await prisma.attendance.findMany({
      where: { userId: childId },
      orderBy: { checkInTime: 'desc' },
      take: 100,
    });

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}