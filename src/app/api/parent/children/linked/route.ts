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

    const linkedChildren = await prisma.familyMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        family: {
          select: {
            id: true,
            familyName: true,
            phone: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            childProfile: {
              select: {
                grade: true,
                points: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ 
      children: linkedChildren.map(link => ({
        id: link.user.id,
        name: link.user.name,
        email: link.user.email,
        grade: link.user.childProfile?.grade,
        points: link.user.childProfile?.points || link.user.points,
        role: link.role,
        familyId: link.familyId,
        familyName: link.family.familyName,
      }))
    });
  } catch (error) {
    console.error('Error fetching linked children:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}