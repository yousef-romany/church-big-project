
import LoginForm from '@/components/auth/login-form';

export default function ParentLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول أولياء الأمور"
      description="مرحباً بك! سجل الدخول لمتابعة تقدم أبنائك في الكنيسة."
      redirectPath="/makhdoum-parent-panel/dashboard"
      userRoleIconName="Shield"
    />
  );
}
