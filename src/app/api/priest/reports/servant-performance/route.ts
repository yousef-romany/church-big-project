import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const servantProfiles = await prisma.servantProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const servantMetrics = await Promise.all(
      servantProfiles.map(async (servant) => {
        const assignedCount = await prisma.visitationTask.count({
          where: { priestId: session.user.id, servantId: servant.id },
        });

        const completedCount = await prisma.visitationTask.count({
          where: { priestId: session.user.id, servantId: servant.id, status: 'COMPLETED' },
        });

        const inProgressCount = await prisma.visitationTask.count({
          where: { priestId: session.user.id, servantId: servant.id, status: 'IN_PROGRESS' },
        });

        return {
          servantId: servant.id,
          name: servant.user.name || '',
          email: servant.user.email || '',
          assignedCount,
          completedCount,
          inProgressCount,
          pendingCount: assignedCount - completedCount - inProgressCount,
          completionRate: assignedCount > 0 
            ? Math.round((completedCount / assignedCount) * 100) 
            : 0,
          totalVisitationMinutes: 0,
        };
      })
    );

    const topPerformers = [...servantMetrics]
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 10);

    const overallStats = {
      totalServants: servantMetrics.length,
      totalAssigned: servantMetrics.reduce((sum, s) => sum + s.assignedCount, 0),
      totalCompleted: servantMetrics.reduce((sum, s) => sum + s.completedCount, 0),
      averageCompletionRate: Math.round(
        servantMetrics.reduce((sum, s) => sum + s.completionRate, 0) / servantMetrics.length
      ),
    };

    return NextResponse.json({
      servantMetrics,
      topPerformers,
      overallStats,
    });
  } catch (error) {
    console.error('Error fetching servant performance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}