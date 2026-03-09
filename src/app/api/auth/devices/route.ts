import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserDevices, revokeDeviceToken, revokeAllOtherDevices, markDeviceAsTrusted } from '@/lib/session-manager';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const devices = await getUserDevices(session.user.id);
    
    return NextResponse.json({ devices });
  } catch (error) {
    console.error('Get Devices Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب الأجهزة' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const revokeAll = searchParams.get('revokeAll') === 'true';
    const currentToken = searchParams.get('currentToken');

    if (revokeAll && currentToken) {
      // Revoke all devices except current
      const count = await revokeAllOtherDevices(session.user.id, currentToken);
      return NextResponse.json({ 
        message: `تم إلغاء ${count} جهاز بنجاح`,
        revokedCount: count 
      });
    } else if (deviceId) {
      // Revoke specific device
      const success = await revokeDeviceToken(deviceId, session.user.id);
      if (success) {
        return NextResponse.json({ message: 'تم إلغاء الجهاز بنجاح' });
      } else {
        return NextResponse.json({ message: 'فشل إلغاء الجهاز' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: 'معلمات غير صالحة' }, { status: 400 });
    }
  } catch (error) {
    console.error('Revoke Device Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إلغاء الجهاز' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const { deviceId, action } = await request.json();

    if (action === 'trust') {
      // Mark device as trusted
      const success = await markDeviceAsTrusted(deviceId, session.user.id);
      if (success) {
        return NextResponse.json({ message: 'تمت إضافة الجهاز إلى القائمة الموثوقة' });
      } else {
        return NextResponse.json({ message: 'فشل تحديث الجهاز' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: 'إجراء غير صالح' }, { status: 400 });
    }
  } catch (error) {
    console.error('Update Device Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث الجهاز' },
      { status: 500 }
    );
  }
}