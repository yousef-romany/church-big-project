
import LoginForm from '@/components/auth/login-form';

export default function VisitationServantLoginPage() {
  return (
    <LoginForm
      title="تسجيل دخول خادم الافتقاد"
      description="أهلاً بك أيها الخادم الأمين! يرجى تسجيل الدخول للاطلاع على مهام الافتقاد."
      redirectPath="/visitation-servant-panel/dashboard"
      userRoleIconName="Footprints"
    />
  );
}
