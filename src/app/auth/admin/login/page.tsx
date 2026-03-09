
import LoginForm from '@/components/auth/login-form';

export default function AdminLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول الإدارة"
      description="مرحباً بك! يرجى إدخال بيانات الاعتماد الخاصة بك للوصول إلى لوحة تحكم الإدارة."
      redirectPath="/admin"
      userRoleIconName="Building"
    />
  );
}
