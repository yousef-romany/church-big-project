import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyTwoFactorToken } from '@/lib/two-factor';
import { z } from 'zod';

const verify2FASchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
  secret: z.string().min(1, 'Secret is required'),
});

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ enabled: false }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true }
    });

    return NextResponse.json({ 
      enabled: user?.twoFactorEnabled || false 
    });
  } catch (error) {
    console.error('2FA Status Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء التحقق من حالة المصادقة الثنائية' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'غير مصرح لك' }, { status: 401 });
    }

    const body = await request.json();
    const { token, secret } = verify2FASchema.parse(body);

    // Verify the token
    const isValid = verifyTwoFactorToken(token, secret);
    
    if (!isValid) {
      return NextResponse.json(
        { message: 'رمز التحقق غير صالح' },
        { status: 400 }
      );
    }

    // Enable 2FA for the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
    });

    return NextResponse.json(
      { message: 'تم تفعيل المصادقة الثنائية بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error('2FA Verify Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تفعيل المصادقة الثنائية' },
      { status: 500 }
    );
  }
}