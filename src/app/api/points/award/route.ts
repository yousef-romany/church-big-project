import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TransactionType, UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const allowedRoles = [UserRole.ADMIN, UserRole.PRIEST, UserRole.SERVANT, UserRole.SUNDAY_SCHOOL_SERVANT];
    if (!allowedRoles.includes(currentUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, amount, description } = body;

    if (!userId || !amount || !description) {
      return NextResponse.json({ 
        error: 'userId, amount, and description are required' 
      }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ 
        error: 'Amount must be positive' 
      }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: { increment: amount } },
      }),
      prisma.pointsTransaction.create({
        data: {
          userId: userId,
          amount: amount,
          type: TransactionType.EARNED,
          description: description,
        },
      }),
    ]);

    return NextResponse.json({ 
      success: true, 
      newBalance: targetUser.points + amount 
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
