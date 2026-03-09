import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import UAParser from 'ua-parser-js';

// Rate limiting for token registration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms
const MAX_TOKENS_PER_USER = 5; // Max tokens per user
const tokenRegistrations = new Map<string, { count: number; resetTime: number }>();

const schema = z.object({
  token: z.string().min(1, 'FCM token is required'),
});

// Rate limiting check
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userTokens = tokenRegistrations.get(userId);

  if (!userTokens || now > userTokens.resetTime) {
    tokenRegistrations.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userTokens.count >= MAX_TOKENS_PER_USER) {
    return false;
  }

  userTokens.count++;
  return true;
}

// Get device information from user agent
function getDeviceInfo(userAgent?: string) {
  if (!userAgent) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
  }

  const parser = UAParser(userAgent);
  return {
    browser: `${parser.getBrowser().name} ${parser.getBrowser().version}`,
    os: `${parser.getOS().name} ${parser.getOS().version}`,
    device: parser.getDevice().type || 'desktop',
  };
}

// POST /api/notifications/register-token
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول لتسجيل جهاز' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { token } = schema.parse(body);

    const userId = session.user.id;
    const userAgent = request.headers.get('user-agent');
    const deviceInfo = getDeviceInfo(userAgent || undefined);

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { message: 'تم تجاوز الحد المسموح من تسجيل الأجهزة. يرجى المحاولة لاحقًا' },
        { status: 429 }
      );
    }

    // Check if token already exists
    const existingToken = await prisma.userDeviceToken.findUnique({
      where: { token },
    });

    if (existingToken) {
      // Update the existing token with new user and device info
      if (existingToken.userId !== userId) {
        // Token belongs to another user, update it
        await prisma.userDeviceToken.update({
          where: { token },
          data: {
            userId,
            deviceInfo,
            isActive: true,
            lastSeenAt: new Date(),
          },
        });
        console.log(`Token reassigned from user ${existingToken.userId} to user ${userId}`);
      } else {
        // Same user, just update last seen
        await prisma.userDeviceToken.update({
          where: { token },
          data: {
            lastSeenAt: new Date(),
          },
        });
      }
    } else {
      // Deactivate old tokens for this user (maintain MAX_TOKENS_PER_USER)
      await prisma.userDeviceToken.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      // Create new token record
      await prisma.userDeviceToken.create({
        data: {
          userId,
          token,
          deviceInfo,
          isActive: true,
          lastSeenAt: new Date(),
        },
      });

      // Create notification preferences if not exists
      const existingPreferences = await prisma.notificationPreference.findUnique({
        where: { userId },
      });

      if (!existingPreferences) {
        await prisma.notificationPreference.create({
          data: {
            userId,
            emailEnabled: true,
            pushEnabled: true,
            smsEnabled: false,
            urgentEnabled: true,
            infoEnabled: true,
            reminderEnabled: true,
          },
        });
      }

      console.log(`New FCM token registered for user ${userId}`);
    }

    return NextResponse.json(
      { message: 'تم تسجيل الجهاز بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token registration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ أثناء تسجيل الجهاز' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/register-token
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { token } = schema.parse(body);

    const userId = session.user.id;

    // Delete the token
    const deleted = await prisma.userDeviceToken.deleteMany({
      where: {
        token,
        userId,
      },
    });

    if (deleted.count > 0) {
      console.log(`Token deleted for user ${userId}`);
      return NextResponse.json(
        { message: 'تم حذف الجهاز بنجاح' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'الجهاز غير موجود' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Token deletion error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ أثناء حذف الجهاز' },
      { status: 500 }
    );
  }
}