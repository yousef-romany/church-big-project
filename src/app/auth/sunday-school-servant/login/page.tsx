
import LoginForm from '@/components/auth/login-form';

export default function SundaySchoolServantLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول خادم مدارس الأحد"
      description="مرحباً بك! يرجى تسجيل الدخول لمتابعة خدمتك في مدارس الأحد."
      redirectPath="/sunday-school-servant-panel/dashboard"
      userRoleIconName="CalendarCheck"
    />
  );
}
