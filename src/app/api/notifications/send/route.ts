import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendNotification, sendMulticastNotification } from '@/lib/firebase/admin';
import { renderTemplate } from '@/lib/notifications/template-renderer';

// Validation schemas
const singleNotificationSchema = z.object({
  recipientId: z.string().min(1, 'معرف المستلم مطلوب'),
  title: z.string().min(1, 'عنوان الإشعار مطلوب'),
  body: z.string().min(1, 'محتوى الإشعار مطلوب'),
  type: z.enum(['URGENT', 'INFO', 'REMINDER', 'EVENT', 'APPOINTMENT', 'ANNOUNCEMENT', 'SYSTEM']).default('INFO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  imageUrl: z.string().url().optional(),
  actionUrl: z.string().url().optional(),
  data: z.record(z.string()).optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.string()).optional(),
  scheduledFor: z.string().datetime().optional(),
});

const batchNotificationSchema = z.object({
  recipientIds: z.array(z.string()).min(1, 'يجب تحديد مستلم واحد على الأقل'),
  title: z.string().min(1, 'عنوان الإشعار مطلوب'),
  body: z.string().min(1, 'محتوى الإشعار مطلوب'),
  type: z.enum(['URGENT', 'INFO', 'REMINDER', 'EVENT', 'APPOINTMENT', 'ANNOUNCEMENT', 'SYSTEM']).default('INFO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  imageUrl: z.string().url().optional(),
  actionUrl: z.string().url().optional(),
  data: z.record(z.string()).optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.string()).optional(),
  scheduledFor: z.string().datetime().optional(),
});

const roleBasedNotificationSchema = z.object({
  recipientRole: z.enum(['USER', 'ADMIN', 'PRIEST', 'SERVANT', 'PARENT', 'CHILD']),
  title: z.string().min(1, 'عنوان الإشعار مطلوب'),
  body: z.string().min(1, 'محتوى الإشعار مطلوب'),
  type: z.enum(['URGENT', 'INFO', 'REMINDER', 'EVENT', 'APPOINTMENT', 'ANNOUNCEMENT', 'SYSTEM']).default('INFO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  imageUrl: z.string().url().optional(),
  actionUrl: z.string().url().optional(),
  data: z.record(z.string()).optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.string()).optional(),
  scheduledFor: z.string().datetime().optional(),
});

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_NOTIFICATIONS_PER_MINUTE = 50;
const notificationCounts = new Map<string, { count: number; resetTime: number }();

function checkRateLimit(senderId: string): boolean {
  const now = Date.now();
  const senderStats = notificationCounts.get(senderId);

  if (!senderStats || now > senderStats.resetTime) {
    notificationCounts.set(senderId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (senderStats.count >= MAX_NOTIFICATIONS_PER_MINUTE) {
    return false;
  }

  senderStats.count++;
  return true;
}

// Check user notification preferences
async function checkUserPreferences(userId: string, type: string, priority: string): Promise<boolean> {
  try {
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return true; // Default to allowing notifications
    }

    // Check quiet hours
    if (preferences.quietHoursStart && preferences.quietHoursEnd) {
      const now = new Date();
      const userTime = new Date(now.toLocaleString("en-US", { timeZone: preferences.timezone || "UTC" }));
      const currentTime = userTime.getHours() * 60 + userTime.getMinutes();
      
      const [startHour, startMin] = preferences.quietHoursStart.split(':').map(Number);
      const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      // Handle overnight quiet hours (e.g., 22:00 to 06:00)
      let inQuietHours = false;
      if (startTime > endTime) {
        inQuietHours = currentTime >= startTime || currentTime < endTime;
      } else {
        inQuietHours = currentTime >= startTime && currentTime < endTime;
      }

      // Only skip for non-urgent notifications during quiet hours
      if (inQuietHours && priority !== 'CRITICAL' && priority !== 'HIGH') {
        return false;
      }
    }

    // Check category preferences
    if (type === 'URGENT' && !preferences.urgentEnabled) return false;
    if (type === 'INFO' && !preferences.infoEnabled) return false;
    if (type === 'REMINDER' && !preferences.reminderEnabled) return false;

    return preferences.pushEnabled;
  } catch (error) {
    console.error('Error checking user preferences:', error);
    return true; // Default to allowing notifications on error
  }
}

// Store notification in database
async function storeNotification(data: {
  recipientId: string;
  senderId?: string;
  title: string;
  body: string;
  type: string;
  priority: string;
  imageUrl?: string;
  actionUrl?: string;
  data?: Record<string, string>;
  templateId?: string;
  scheduledFor?: Date;
}) {
  try {
    return await prisma.notification.create({
      data: {
        ...data,
        deliveryStatus: data.scheduledFor ? 'PENDING' : 'SENDING',
      },
    });
  } catch (error) {
    console.error('Error storing notification:', error);
    throw error;
  }
}

// Send notification and update delivery status
async function sendAndTrackNotification(notification: any) {
  try {
    // Get user's active device tokens
    const deviceTokens = await prisma.userDeviceToken.findMany({
      where: {
        userId: notification.recipientId,
        isActive: true,
      },
      select: { token: true },
    });

    if (deviceTokens.length === 0) {
      console.warn(`No active devices found for user ${notification.recipientId}`);
      await prisma.notification.update({
        where: { id: notification.id },
        data: { deliveryStatus: 'FAILED' },
      });
      return;
    }

    const tokens = deviceTokens.map(dt => dt.token);
    const notificationData = {
      title: notification.title,
      body: notification.body,
      imageUrl: notification.imageUrl,
    };

    const additionalData = {
      ...notification.data,
      notificationId: notification.id,
      actionUrl: notification.actionUrl,
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
      console.log(`Deactivated ${result.invalidTokens.length} invalid tokens`);
    }

    console.log(`Notification sent to ${result.successCount} devices, ${result.failureCount} failed`);
  } catch (error) {
    console.error('Error sending notification:', error);
    await prisma.notification.update({
      where: { id: notification.id },
      data: { deliveryStatus: 'FAILED' },
    });
  }
}

// POST /api/notifications/send
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    // Only admins can send notifications
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'غير مصرح لك بإرسال الإشعارات' },
        { status: 403 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { message: 'تم تجاوز الحد المسموح من الإشعارات. يرجى المحاولة لاحقًا' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const senderId = session.user.id;

    // Handle different notification types
    if (body.recipientId) {
      // Single notification
      const data = singleNotificationSchema.parse(body);
      
      // Check if using template
      if (data.templateId) {
        const template = await prisma.notificationTemplate.findUnique({
          where: { id: data.templateId, isActive: true },
        });
        
        if (template) {
          data.title = renderTemplate(template.titleTemplate, data.templateData || {});
          data.body = renderTemplate(template.bodyTemplate, data.templateData || {});
          data.type = template.type;
          data.priority = template.priority;
        }
      }

      // Check user preferences
      const canSend = await checkUserPreferences(data.recipientId, data.type, data.priority);
      if (!canSend) {
        return NextResponse.json(
          { message: 'المستخدم لا يفضل تلقي هذا النوع من الإشعارات' },
          { status: 200 }
        );
      }

      const scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null;
      const notification = await storeNotification({
        ...data,
        senderId,
        scheduledFor,
      });

      if (!scheduledFor) {
        // Send immediately
        await sendAndTrackNotification(notification);
      }

      return NextResponse.json(
        { 
          message: scheduledFor ? 'تم جدولة الإشعار بنجاح' : 'تم إرسال الإشعار بنجاح',
          notificationId: notification.id 
        },
        { status: 200 }
      );
    } else if (body.recipientIds) {
      // Batch notification
      const data = batchNotificationSchema.parse(body);
      
      // Check if using template
      if (data.templateId) {
        const template = await prisma.notificationTemplate.findUnique({
          where: { id: data.templateId, isActive: true },
        });
        
        if (template) {
          data.title = renderTemplate(template.titleTemplate, data.templateData || {});
          data.body = renderTemplate(template.bodyTemplate, data.templateData || {});
          data.type = template.type;
          data.priority = template.priority;
        }
      }

      const scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null;
      
      // Check preferences for each recipient
      const validRecipients = [];
      for (const recipientId of data.recipientIds) {
        const canSend = await checkUserPreferences(recipientId, data.type, data.priority);
        if (canSend) {
          validRecipients.push(recipientId);
        }
      }

      // Create notifications for valid recipients
      const notifications = await Promise.all(
        validRecipients.map(recipientId =>
          storeNotification({
            ...data,
            recipientId,
            senderId,
            scheduledFor,
          })
        )
      );

      if (!scheduledFor) {
        // Send immediately
        await Promise.all(notifications.map(sendAndTrackNotification));
      }

      return NextResponse.json(
        { 
          message: scheduledFor ? 'تم جدولة الإشعارات بنجاح' : 'تم إرسال الإشعارات بنجاح',
          sentCount: notifications.length,
          skippedCount: data.recipientIds.length - notifications.length
        },
        { status: 200 }
      );
    } else if (body.recipientRole) {
      // Role-based notification
      const data = roleBasedNotificationSchema.parse(body);
      
      // Check if using template
      if (data.templateId) {
        const template = await prisma.notificationTemplate.findUnique({
          where: { id: data.templateId, isActive: true },
        });
        
        if (template) {
          data.title = renderTemplate(template.titleTemplate, data.templateData || {});
          data.body = renderTemplate(template.bodyTemplate, data.templateData || {});
          data.type = template.type;
          data.priority = template.priority;
        }
      }

      // Get all users with the specified role
      const users = await prisma.user.findMany({
        where: { role: data.recipientRole },
        select: { id: true },
      });

      const scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null;
      
      // Check preferences and create notifications
      const notifications = [];
      for (const user of users) {
        const canSend = await checkUserPreferences(user.id, data.type, data.priority);
        if (canSend) {
          notifications.push(
            await storeNotification({
              ...data,
              recipientId: user.id,
              senderId,
              scheduledFor,
            })
          );
        }
      }

      if (!scheduledFor) {
        // Send immediately
        await Promise.all(notifications.map(sendAndTrackNotification));
      }

      return NextResponse.json(
        { 
          message: scheduledFor ? 'تم جدولة الإشعارات بنجاح' : 'تم إرسال الإشعارات بنجاح',
          sentCount: notifications.length,
          totalUsers: users.length
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'يجب تحديد المستلم أو المستلمين' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Send notification error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ أثناء إرسال الإشعار' },
      { status: 500 }
    );
  }
}