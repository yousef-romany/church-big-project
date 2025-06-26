
import LoginForm from '@/components/auth/login-form';

export default function RegularMakhdoumLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول المخدوم"
      description="أهلاً بك في بوابتك الروحية! يرجى تسجيل الدخول للوصول إلى خدماتك."
      redirectPath="/makhdoum-panel/dashboard"
      userRoleIconName="UserCheck"
    />
  );
}
