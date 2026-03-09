import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  generatePasskeyRegistrationOptions,
  verifyPasskeyRegistration,
  bufferToBase64url,
  getDeviceName
} from '@/lib/webauthn';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    // Get existing passkeys for this user
    const existingPasskeys = await prisma.passkey.findMany({
      where: { userId: session.user.id },
      select: { credentialId: true }
    });

    // Generate registration options
    const options = await generatePasskeyRegistrationOptions(
      session.user.id,
      session.user.email,
      existingPasskeys
    );

    return NextResponse.json({ options });
  } catch (error) {
    console.error('WebAuthn Registration Options Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إعداد المصادقة البيومترية' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const { credential, name } = await request.json();
    
    if (!credential) {
      return NextResponse.json({ message: 'بيانات المصادقة مطلوبة' }, { status: 400 });
    }

    // Get the challenge for this user
    const challenge = await import('@/lib/webauthn').then(m => m.getChallenge(`register_${session.user.id}`));
    
    if (!challenge) {
      return NextResponse.json({ message: 'انتهت صلاحية طلب المصادقة' }, { status: 400 });
    }

    // Verify the registration response
    const verification = await verifyPasskeyRegistration(credential, challenge);
    
    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ message: 'فشل التحقق من المصادقة البيومترية' }, { status: 400 });
    }

    const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

    // Store the new passkey
    await prisma.passkey.create({
      data: {
        userId: session.user.id,
        credentialId: bufferToBase64url(credentialID),
        publicKey: bufferToBase64url(credentialPublicKey),
        counter: BigInt(counter),
        deviceType: 'biometric',
        transports: credential.response.transports?.join(',') || '',
        name: name || getDeviceName(),
        isBackup: false,
        isPreferred: false,
      }
    });

    // Clean up the challenge
    await import('@/lib/webauthn').then(m => m.removeChallenge(`register_${session.user.id}`));

    // Log the event
    await import('@/lib/audit-log').then(({ logAuditEvent }) => 
      logAuditEvent({
        userId: session.user.id,
        email: session.user.email || undefined,
        action: 'PASSKEY_REGISTERED',
        resource: 'AUTH',
        success: true,
        details: { name: name || getDeviceName() }
      })
    );

    return NextResponse.json({ message: 'تم إضافة المصادقة البيومترية بنجاح' });
  } catch (error) {
    console.error('WebAuthn Registration Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إضافة المصادقة البيومترية' },
      { status: 500 }
    );
  }
}