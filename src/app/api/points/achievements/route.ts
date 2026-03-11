import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allAchievements = await prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { points: 'desc' },
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true, earnedAt: true },
    });

    const userAchievementIds = new Set(userAchievements.map(ua => ua.achievementId));

    const achievements = allAchievements.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      points: a.points,
      earnedAt: userAchievementIds.has(a.id) 
        ? userAchievements.find(ua => ua.achievementId === a.id)?.earnedAt?.toISOString()
        : undefined,
    }));

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
