import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = validateTokenSchema.parse(body);

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ message: 'رابط إعادة التعيين غير صالح.' }, { status: 400 });
    }

    const hasExpired = new Date(verificationToken.expires) < new Date();
    if (hasExpired) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ message: 'انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'المستخدم غير موجود.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Token is valid' }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error('Validate Token Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}