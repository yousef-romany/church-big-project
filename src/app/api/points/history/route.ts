import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.pointsTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ 
      transactions: transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        createdAt: t.createdAt.toISOString(),
        type: t.type === TransactionType.EARNED ? 'EARNED' : 'REDEEMED',
      }))
    });
  } catch (error) {
    console.error('Error fetching points history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
