import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  generatePasskeyAuthenticationOptions,
  verifyPasskeyAuthentication,
  base64urlToBuffer,
} from '@/lib/webauthn';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ message: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        passkeys: {
          select: { 
            credentialId: true,
            transports: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 404 });
    }

    if (!user.passkeys || user.passkeys.length === 0) {
      return NextResponse.json({ 
        message: 'لا توجد مفاتيح مصادقة مسجلة لهذا الحساب' 
      }, { status: 400 });
    }

    // Generate authentication options
    const options = await generatePasskeyAuthenticationOptions(
      user.id,
      user.passkeys
    );

    return NextResponse.json({ 
      options,
      userId: user.id,
      userEmail: user.email,
      userRole: user.role
    });
  } catch (error) {
    console.error('WebAuthn Authentication Options Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إعداد المصادقة البيومترية' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { credential, userId, userEmail, userRole } = await request.json();
    
    if (!credential || !userId) {
      return NextResponse.json({ message: 'بيانات المصادقة مطلوبة' }, { status: 400 });
    }

    // Get the challenge
    const challenge = await import('@/lib/webauthn').then(m => m.getChallenge(`auth_${userId}`));
    
    if (!challenge) {
      return NextResponse.json({ message: 'انتهت صلاحية طلب المصادقة' }, { status: 400 });
    }

    // Find the passkey that matches this credential
    const passkey = await prisma.passkey.findFirst({
      where: { 
        userId,
        credentialId: credential.id
      }
    });

    if (!passkey) {
      return NextResponse.json({ message: 'مفتاح المصادقة غير موجود' }, { status: 404 });
    }

    // Verify the authentication response
    const verification = await verifyPasskeyAuthentication(
      credential,
      challenge,
      {
        credentialID: base64urlToBuffer(passkey.credentialId),
        credentialPublicKey: base64urlToBuffer(passkey.publicKey),
        counter: Number(passkey.counter)
      }
    );
    
    if (!verification.verified || !verification.authenticationInfo) {
      return NextResponse.json({ message: 'فشل التحقق من المصادقة البيومترية' }, { status: 400 });
    }

    // Update the passkey counter
    await prisma.passkey.update({
      where: { id: passkey.id },
      data: { 
        counter: BigInt(verification.authenticationInfo.newCounter)
      }
    });

    // Clean up the challenge
    await import('@/lib/webauthn').then(m => m.removeChallenge(`auth_${userId}`));

    // Log the event
    await import('@/lib/audit-log').then(({ logAuditEvent }) => 
      logAuditEvent({
        userId,
        email: userEmail,
        action: 'PASSKEY_LOGIN_SUCCESS',
        resource: 'AUTH',
        success: true,
        details: { 
          passkeyId: passkey.id,
          passkeyName: passkey.name,
          role: userRole
        }
      })
    );

    // Create a session token (simplified - in production use proper session management)
    return NextResponse.json({ 
      message: 'تم تسجيل الدخول بنجاح',
      userId,
      userEmail,
      userRole,
      passkeyName: passkey.name
    });
  } catch (error) {
    console.error('WebAuthn Authentication Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء المصادقة البيومترية' },
      { status: 500 }
    );
  }
}