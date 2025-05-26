
import LoginForm from '@/components/auth/login-form';

export default function PublicLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول المخدومين"
      description="أهلاً بك! يرجى تسجيل الدخول للاستفادة من خدمات المنصة المخصصة للمخدومين."
      redirectPath="/public-panel/dashboard"
      userRoleIconName="UserCheck"
    />
  );
}
