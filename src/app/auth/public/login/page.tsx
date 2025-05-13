
import LoginForm from '@/components/auth/login-form';
import { UserCheck } from 'lucide-react';

export default function PublicUserLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول المخدومين"
      description="مرحباً بك! يرجى تسجيل الدخول للوصول إلى خدمات المخدومين."
      redirectPath="/public/instructions" // Or a new public dashboard if created
      userRoleIcon={UserCheck}
    />
  );
}
