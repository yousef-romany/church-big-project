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
    const { qrCode } = body;

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code is required' }, { status: 400 });
    }

    const childProfile = await prisma.childProfile.findUnique({
      where: { qrCode },
      include: { user: true },
    });

    if (!childProfile) {
      return NextResponse.json({ 
        success: false, 
        message: 'رمز الاستجابة السريعة غير صالح' 
      }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: childProfile.userId,
        checkInTime: {
          gte: today,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json({ 
        success: false, 
        message: 'تم تسجيل الحضور بالفعل اليوم' 
      });
    }

    const pointsAwarded = 10;

    await prisma.$transaction([
      prisma.attendance.create({
        data: {
          userId: childProfile.userId,
          qrCode: qrCode,
          pointsAwarded,
        },
      }),
      prisma.user.update({
        where: { id: childProfile.userId },
        data: { points: { increment: pointsAwarded } },
      }),
      prisma.pointsTransaction.create({
        data: {
          userId: childProfile.userId,
          amount: pointsAwarded,
          type: TransactionType.EARNED,
          description: 'نقاط الحضور',
        },
      }),
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'تم تسجيل الحضور بنجاح',
      userId: childProfile.userId,
      userName: childProfile.user.name,
      attendancePoints: pointsAwarded,
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
