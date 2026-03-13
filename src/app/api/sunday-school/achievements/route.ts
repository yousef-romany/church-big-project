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

    const allAchievements = await prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    });

    const userAchievementIds = new Set(
      userAchievements.map(ua => ua.achievementId)
    );

    const availableAchievements = allAchievements
      .filter(a => !userAchievementIds.has(a.id))
      .map(a => ({
        ...a,
        earned: false,
        progress: 0,
      }));

    const earnedAchievements = userAchievements.map(ua => ({
        ...ua.achievement,
        earned: true,
        progress: 100,
        earnedAt: ua.earnedAt,
      }));

    return NextResponse.json({
      achievements: [...earnedAchievements, ...availableAchievements],
      stats: {
        totalEarned: earnedAchievements.length,
        totalAvailable: availableAchievements.length,
        completionRate: earnedAchievements.length / allAchievements.length,
      },
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const achievementId = params.id;

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Award achievement and points
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: session.user.id,
        achievementId,
      },
    });

    // Award points
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { points: { increment: achievement.points } },
      }),
      prisma.pointsTransaction.create({
        data: {
          userId: session.user.id,
          amount: achievement.points,
          type: 'EARNED',
          description: `إنجاز: ${achievement.title}`,
        },
      }),
    ]);

    return NextResponse.json({ 
      userAchievement,
      pointsAwarded: achievement.points 
    });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}