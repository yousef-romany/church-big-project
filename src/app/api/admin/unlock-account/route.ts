import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { accountLockout } from '@/lib/account-lockout';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ message: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    // Unlock the account
    await accountLockout.unlockAccount(email);

    return NextResponse.json({ message: 'تم فتح الحساب بنجاح' });
  } catch (error) {
    console.error('Unlock Account Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء فتح الحساب' },
      { status: 500 }
    );
  }
}