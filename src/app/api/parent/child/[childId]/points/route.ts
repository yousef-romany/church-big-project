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

    const childId = params.childId;

    // Verify parent is linked to this child
    const childLink = await prisma.familyMember.findFirst({
      where: {
        userId: childId,
        family: {
          familyMembers: {
            some: {
              userId: session.user.id,
              role: 'parent',
            },
          },
        },
      },
    });

    if (!childLink) {
      return NextResponse.json({ error: 'Not authorized to view this child' }, { status: 403 });
    }

    const childUser = await prisma.user.findUnique({
      where: { id: childId },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        childProfile: {
          select: {
            grade: true,
            points: true,
          },
        },
      },
    });

    const pointsTransactions = await prisma.pointsTransaction.findMany({
      where: { userId: childId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: childId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    const totalPointsEarned = pointsTransactions
      .filter(t => t.type === 'EARNED')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPointsRedeemed = pointsTransactions
      .filter(t => t.type === 'REDEEMED')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return NextResponse.json({
      child: {
        id: childUser!.id,
        name: childUser!.name,
        email: childUser!.email,
        grade: childUser!.childProfile?.grade,
        currentPoints: childUser!.points,
      },
      stats: {
        totalEarned: totalPointsEarned,
        totalRedeemed: totalPointsRedeemed,
        achievementsCount: userAchievements.length,
      },
      transactions: pointsTransactions,
      achievements: userAchievements,
    });
  } catch (error) {
    console.error('Error fetching child points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}