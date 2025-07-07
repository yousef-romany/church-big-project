import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email-service';

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // To prevent email enumeration, you might want to send a "successful" response
      // but in the background, you could send an email to the existing user
      // saying someone tried to register with their email.
      // For this project, we'll return a clear error.
      return NextResponse.json(
        { message: 'هذا البريد الإلكتروني مسجل بالفعل.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate verification token
    const verificationTokenValue = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    // In a transaction, create the verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationTokenValue,
        expires: tokenExpires,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationTokenValue);

    return NextResponse.json(
      {
        message: 'تم إنشاء الحساب بنجاح. الرجاء مراجعة بريدك الإلكتروني لتفعيل الحساب.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
