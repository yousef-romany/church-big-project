import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendNotification, sendMulticastNotification } from '@/lib/firebase/admin';
import { renderTemplate } from '@/lib/notifications/template-renderer';

// GET /api/notifications/process-scheduled
// This endpoint should be called by a cron job periodically
export async function GET(request: NextRequest) {
  try {
    // Simple authentication for cron jobs (could use a secret key)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { message: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const now = new Date();
    
    // Find all notifications scheduled for now or past
    const scheduledNotifications = await prisma.notification.findMany({
      where: {
        scheduledFor: {
          lte: now,
        },
        deliveryStatus: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      take: 100 // Process in batches to avoid overwhelming
    });

    if (scheduledNotifications.length === 0) {
      return NextResponse.json({
        message: 'لا توجد إشعارات مجدولة للمعالجة',
        processedCount: 0,
      });
    }

    const processedNotifications = [];
    const failedNotifications = [];

    for (const notification of scheduledNotifications) {
      try {
        const deviceTokens = await prisma.userDeviceToken.findMany({
          where: {
            userId: notification.recipientId,
            isActive: true,
          },
          select: { token: true },
        });

        if (deviceTokens.length === 0) {
          console.warn(`No active devices for user ${notification.recipientId}`);
          await prisma.notification.update({
            where: { id: notification.id },
            data: { deliveryStatus: 'FAILED' },
          });
          failedNotifications.push(notification.id);
          continue;
        }

        const tokens = deviceTokens.map(dt => dt.token);
        const notificationData = {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl || undefined,
        };

        const additionalData = {
          ...(notification.data as any),
          notificationId: notification.id,
          actionUrl: notification.actionUrl || undefined,
        };

        // Send notification
        const result = await sendMulticastNotification(tokens, notificationData, additionalData);

        // Update notification status
        await prisma.notification.update({
          where: { id: notification.id },
          data: {
            deliveryStatus: result.successCount > 0 ? 'SENT' : 'FAILED',
            sentAt: new Date(),
          },
        });

        // Handle invalid tokens
        if (result.invalidTokens.length > 0) {
          await prisma.userDeviceToken.updateMany({
            where: {
              token: { in: result.invalidTokens },
            },
            data: {
              isActive: false,
            },
          });
        }

        if (result.successCount > 0) {
          processedNotifications.push(notification.id);
        } else {
          failedNotifications.push(notification.id);
        }

        console.log(`Processed scheduled notification ${notification.id}: ${result.successCount} sent, ${result.failureCount} failed`);
      } catch (error) {
        console.error(`Error processing scheduled notification ${notification.id}:`, error);
        
        // Mark as failed
        await prisma.notification.update({
          where: { id: notification.id },
          data: {
            deliveryStatus: 'FAILED',
            sentAt: new Date(),
          },
        });

        failedNotifications.push(notification.id);
      }
    }

    // Clean up old tokens (30 days inactive)
    await cleanupOldTokens();

    return NextResponse.json({
      message: 'تمت معالجة الإشعارات المجدولة',
      processedCount: processedNotifications.length,
      failedCount: failedNotifications.length,
      processedNotifications,
      failedNotifications,
    });
  } catch (error) {
    console.error('Process scheduled notifications error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء معالجة الإشعارات المجدولة' },
      { status: 500 }
    );
  }
}

// Clean up inactive device tokens
async function cleanupOldTokens() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedTokens = await prisma.userDeviceToken.deleteMany({
      where: {
        lastSeenAt: {
          lt: thirtyDaysAgo,
        },
        isActive: true,
      },
    });

    if (deletedTokens.count > 0) {
      console.log(`Cleaned up ${deletedTokens.count} inactive device tokens`);
    }
  } catch (error) {
    console.error('Error cleaning up old tokens:', error);
  }
}

// Optional: POST endpoint for manual trigger (for testing)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    // Only admins can manually trigger
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'غير مصرح لك بتشغيل هذه العملية' },
        { status: 403 }
      );
    }

    // Call the GET handler logic
    return GET(request);
  } catch (error) {
    console.error('Manual trigger scheduled notifications error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تشغيل المعالج' },
      { status: 500 }
    );
  }
}