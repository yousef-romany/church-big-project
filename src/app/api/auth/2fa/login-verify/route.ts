import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyTwoFactorToken } from '@/lib/two-factor';
import { z } from 'zod';

const loginVerify2FASchema = z.object({
  code: z.string().length(6, 'Token must be 6 digits'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = loginVerify2FASchema.parse(body);

    // Get the session
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { message: 'جلسة غير صالحة. يرجى تسجيل الدخول مرة أخرى.' },
        { status: 401 }
      );
    }

    // Get the user with 2FA details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        email: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        role: true
      }
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { message: 'المصادقة الثنائية غير مفعلة لهذا الحساب' },
        { status: 400 }
      );
    }

    // Verify the 2FA token
    const isValid = verifyTwoFactorToken(code, user.twoFactorSecret);
    
    if (!isValid) {
      // Log failed 2FA attempt
      await import('@/lib/audit-log').then(({ logAuditEvent }) => 
        logAuditEvent({
          userId: session.user.id,
          email: session.user.email || undefined,
          action: 'LOGIN_2FA_FAILED',
          resource: 'AUTH',
          success: false,
          errorMessage: 'Invalid 2FA token'
        })
      );
      
      return NextResponse.json(
        { message: 'رمز التحقق غير صالح' },
        { status: 400 }
      );
    }

    // Log successful 2FA verification
    await import('@/lib/audit-log').then(({ logAuditEvent }) => 
      logAuditEvent({
        userId: session.user.id,
        email: session.user.email || undefined,
        action: 'LOGIN_2FA_SUCCESS',
        resource: 'AUTH',
        success: true
      })
    );

    // Create a special session flag to indicate 2FA is verified
    // In a real implementation, you might want to update the session
    // or use a separate mechanism to track 2FA verification
    
    return NextResponse.json(
      { 
        message: 'تم التحقق بنجاح',
        verified: true,
        role: user.role
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error('2FA Login Verify Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء التحقق من المصادقة الثنائية' },
      { status: 500 }
    );
  }
}