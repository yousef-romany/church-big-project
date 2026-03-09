import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Query schema for listing notifications
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  unreadOnly: z.coerce.boolean().default(false),
  type: z.enum(['URGENT', 'INFO', 'REMINDER', 'EVENT', 'APPOINTMENT', 'ANNOUNCEMENT', 'SYSTEM']).optional(),
});

// GET /api/notifications
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const { page, limit, unreadOnly, type } = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      unreadOnly: searchParams.get('unreadOnly'),
      type: searchParams.get('type'),
    });

    // Build where clause
    const where: any = {
      recipientId: userId,
    };

    if (unreadOnly) {
      where.readStatus = false;
    }

    if (type) {
      where.type = type;
    }

    // Get notifications with pagination
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: (page - 1) * limit,
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
      }),
      prisma.notification.count({ where }),
    ]);

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: userId,
        readStatus: false,
      },
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('List notifications error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب الإشعارات' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications/[id]/read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = session.user.id;

    // Update notification as read
    const notification = await prisma.notification.updateMany({
      where: {
        id,
        recipientId: userId,
        readStatus: false,
      },
      data: {
        readStatus: true,
        readAt: new Date(),
      },
    });

    if (notification.count === 0) {
      return NextResponse.json(
        { message: 'الإشعار غير موجود أو تمت قراءته بالفعل' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'تم تحديث حالة الإشعار' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث الإشعار' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = session.user.id;

    // Delete notification
    const deleted = await prisma.notification.deleteMany({
      where: {
        id,
        recipientId: userId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: 'الإشعار غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'تم حذف الإشعار بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء حذف الإشعار' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications/mark-all-read
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Mark all notifications as read
    const result = await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        readStatus: false,
      },
      data: {
        readStatus: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json(
      { 
        message: 'تم تحديث جميع الإشعارات كمقروءة',
        updatedCount: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث الإشعارات' },
      { status: 500 }
    );
  }
}