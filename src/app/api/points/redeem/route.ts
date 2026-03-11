import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json({ error: 'Reward ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.isActive) {
      return NextResponse.json({ error: 'Reward not found or unavailable' }, { status: 404 });
    }

    if (user.points < reward.cost) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { points: { decrement: reward.cost } },
      }),
      prisma.pointRedemption.create({
        data: {
          userId: session.user.id,
          rewardId: rewardId,
          pointsCost: reward.cost,
        },
      }),
      prisma.pointsTransaction.create({
        data: {
          userId: session.user.id,
          amount: -reward.cost,
          type: TransactionType.REDEEMED,
          description: `استبدال: ${reward.title}`,
        },
      }),
    ]);

    return NextResponse.json({ 
      success: true, 
      remainingPoints: user.points - reward.cost 
    });
  } catch (error) {
    console.error('Error redeeming points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
