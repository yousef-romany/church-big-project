import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.notificationSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: { userId: session.user.id },
      });
    }

    return NextResponse.json({
      settings: {
        emailEnabled: settings.emailEnabled,
        pushEnabled: settings.pushEnabled,
        smsEnabled: settings.smsEnabled,
        quietHoursStart: settings.quietHoursStart,
        quietHoursEnd: settings.quietHoursEnd,
        receiveAnnouncements: settings.receiveAnnouncements,
        receiveMessages: settings.receiveMessages,
        receiveReminders: settings.receiveReminders,
      },
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const settings = await prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...body,
      },
      update: body,
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
