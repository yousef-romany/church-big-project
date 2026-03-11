import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parent = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        parentProfile: true,
      },
    });

    const linkedChildren = await prisma.user.findMany({
      where: {
        parentProfile: {
          isNot: null,
        },
      },
      take: 10,
    });

    return NextResponse.json({ parent, linkedChildren });
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
