import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childProfile = await prisma.childProfile.findUnique({
      where: { userId: session.user.id },
      select: { qrCode: true },
    });

    if (!childProfile) {
      return NextResponse.json({ error: 'Child profile not found' }, { status: 404 });
    }

    const qrCodeDataURL = await QRCode.toDataURL(childProfile.qrCode, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({ qrCode: qrCodeDataURL });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
