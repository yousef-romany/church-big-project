
import LoginForm from '@/components/auth/login-form';

export default function MakhdoumLoginPage() {
  return (
    <LoginForm
      title="بوابة المخدومين"
      description="أهلاً بك! يرجى تسجيل الدخول للوصول إلى خدماتك."
      redirectPath="/makhdoum-panel/dashboard"
      userRoleIconName="UserCheck"
    />
  );
}
