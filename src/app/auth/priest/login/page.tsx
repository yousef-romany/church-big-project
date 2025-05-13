
import LoginForm from '@/components/auth/login-form';
import { UserSquare } from 'lucide-react';

export default function PriestLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول الكاهن"
      description="مرحباً بك أيها الأب الفاضل! يرجى تسجيل الدخول لمتابعة مهام الخدمة."
      redirectPath="/priest-panel/dashboard"
      userRoleIcon={UserSquare}
    />
  );
}
