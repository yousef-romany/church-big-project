import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateTwoFactorSecret, generateQRCodeDataURL } from '@/lib/two-factor';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'غير مصرح لك' }, { status: 401 });
    }

    // Generate 2FA secret
    const setup = generateTwoFactorSecret(session.user.email || '');
    
    // Generate QR code data URL
    const qrCodeDataUrl = await generateQRCodeDataURL(setup.qrCode);

    return NextResponse.json({
      secret: setup.secret,
      qrCode: qrCodeDataUrl,
      backupCodes: setup.backupCodes,
    });
  } catch (error) {
    console.error('2FA Setup Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إعداد المصادقة الثنائية' },
      { status: 500 }
    );
  }
}