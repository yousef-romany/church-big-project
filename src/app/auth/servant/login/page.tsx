
import LoginForm from '@/components/auth/login-form';
import { Users } from 'lucide-react';

export default function ServantLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول الخادم"
      description="أهلاً بك أيها الخادم الأمين! يرجى تسجيل الدخول للاطلاع على مهام الافتقاد."
      redirectPath="/servant-panel/dashboard"
      userRoleIcon={Users}
    />
  );
}
