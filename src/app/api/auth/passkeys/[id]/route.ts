import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const passkeys = await prisma.passkey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        credentialId: true,
        name: true,
        deviceType: true,
        transports: true,
        createdAt: true,
        isBackup: true,
        isPreferred: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ passkeys });
  } catch (error) {
    console.error('Get Passkeys Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب مفاتيح المصادقة' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const passkeyId = params.id;

    // Verify the passkey belongs to the user
    const passkey = await prisma.passkey.findFirst({
      where: { 
        id: passkeyId,
        userId: session.user.id
      }
    });

    if (!passkey) {
      return NextResponse.json({ message: 'مفتاح المصادقة غير موجود' }, { status: 404 });
    }

    // Delete the passkey
    await prisma.passkey.delete({
      where: { id: passkeyId }
    });

    // Log the event
    await import('@/lib/audit-log').then(({ logAuditEvent }) => 
      logAuditEvent({
        userId: session.user.id,
        email: session.user.email || undefined,
        action: 'PASSKEY_DELETED',
        resource: 'AUTH',
        success: true,
        details: { passkeyId, passkeyName: passkey.name }
      })
    );

    return NextResponse.json({ message: 'تم حذف مفتاح المصادقة بنجاح' });
  } catch (error) {
    console.error('Delete Passkey Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء حذف مفتاح المصادقة' },
      { status: 500 }
    );
  }
}