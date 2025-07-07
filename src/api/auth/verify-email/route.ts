import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ message: 'كود التفعيل غير صالح.' }, { status: 400 });
    }

    const hasExpired = new Date(verificationToken.expires) < new Date();
    if (hasExpired) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ message: 'انتهت صلاحية كود التفعيل. يرجى طلب كود جديد.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'المستخدم غير موجود.' }, { status: 404 });
    }
    
    if (existingUser.emailVerified) {
        // If already verified, just delete the token and inform the user.
        await prisma.verificationToken.delete({ where: { token } });
        return NextResponse.json({ message: 'تم تفعيل هذا الحساب بالفعل. يمكنك تسجيل الدخول.' }, { status: 200 });
    }

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete the token after use
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.' }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error('Verification Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
