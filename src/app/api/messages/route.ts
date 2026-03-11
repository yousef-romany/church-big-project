import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: { recipientId: session.user.id },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
        attachments: true,
      },
    });

    const total = await prisma.message.count({
      where: { recipientId: session.user.id },
    });

    const unreadCount = await prisma.message.count({
      where: {
        recipientId: session.user.id,
        read: false,
      },
    });

    return NextResponse.json({
      messages: messages.map(m => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.sender.name,
        subject: m.subject,
        content: m.content,
        priority: m.priority,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
        attachments: m.attachments,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, subject, content, priority = 'MEDIUM' } = body;

    if (!recipientId || !subject || !content) {
      return NextResponse.json({ 
        error: 'recipientId, subject, and content are required' 
      }, { status: 400 });
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        subject,
        content,
        priority,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
