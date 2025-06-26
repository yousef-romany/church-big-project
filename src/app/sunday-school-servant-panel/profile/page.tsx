
"use client";
import UserProfile from '@/components/shared/UserProfile';
import { motion } from 'framer-motion';

const servantProfileData = {
  name: "مارينا عادل",
  avatarUrl: "https://picsum.photos/seed/sundayschoolservantavatar/200/200",
  role: "خادمة مدارس الأحد",
  details: [
    { label: "أب الاعتراف", value: "أبونا بولس", icon: "UserSquare" as const },
    { label: "آخر اعتراف", value: "منذ 6 أسابيع", icon: "CalendarCheck" as const },
    { label: "فصيلة الدم", value: "AB+", icon: "HeartPulse" as const },
    { label: "رقم الموبايل", value: "01112223334", icon: "Phone" as const, dir: "ltr" as const },
    { label: "فصل الخدمة", value: "فصل 2 ابتدائي بنات", icon: "BookOpen" as const },
  ]
};

export default function SundaySchoolServantProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserProfile profileData={servantProfileData} />
    </motion.div>
  );
}
