import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, NotificationType, NotificationPriority } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session.user.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = session.user.role as UserRole;

    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        targetRoles: {
          has: role,
        },
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
      orderBy: [
        { priority: 'desc' },
        { publishAt: 'desc' },
      ],
      take: 10,
    });

    return NextResponse.json({ 
      announcements: announcements.map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        priority: a.priority,
        publishAt: a.publishAt.toISOString(),
      }))
    });
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, targetRoles, priority = 'MEDIUM', expiresAt } = body;

    if (!title || !content || !targetRoles || !Array.isArray(targetRoles)) {
      return NextResponse.json({ 
        error: 'title, content, and targetRoles are required' 
      }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        targetRoles,
        priority,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        role: { in: targetRoles as UserRole[] },
      },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: users.map(user => ({
        userId: user.id,
        title: `إعلان: ${title}`,
        message: content,
        type: NotificationType.ANNOUNCEMENT,
        priority: priority === 'HIGH' ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
      })),
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
