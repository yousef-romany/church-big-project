
import LoginForm from '@/components/auth/login-form';

export default function ChildLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول الأبناء"
      description="أهلاً بك يا نجم الكنيسة! ادخل لترى نقاطك وجدولك."
      redirectPath="/makhdoum-child-panel/dashboard"
      userRoleIconName="Baby"
    />
  );
}
