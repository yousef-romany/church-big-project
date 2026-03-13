import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.CHILD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childProfile = await prisma.childProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!childProfile) {
      return NextResponse.json({ error: 'Child profile not found' }, { status: 404 });
    }

    const qrCodeUrl = await QRCode.toDataURL(childProfile.qrCode, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return NextResponse.json({
      qrCode: childProfile.qrCode,
      qrCodeUrl,
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}