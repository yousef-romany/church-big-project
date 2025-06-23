
import LoginForm from '@/components/auth/login-form';

export default function MakhdoumLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول المخدومين"
      description="أهلاً بك في بوابتك الروحية! يرجى تسجيل الدخول للوصول إلى خدماتك."
      redirectPath="/makhdoum-panel/dashboard"
      userRoleIconName="UserCheck"
    />
  );
}
