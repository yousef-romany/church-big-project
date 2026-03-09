import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email-service';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { 
          message: 'إذا كان هذا البريد مسجلاً، ستصلك رسالة إعادة تعيين كلمة المرور قريباً.' 
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetTokenValue = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new reset token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetTokenValue,
        expires: tokenExpires,
      },
    });

    // Send reset email
    await sendPasswordResetEmail(email, resetTokenValue);

    return NextResponse.json(
      {
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}