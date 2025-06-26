
"use client";
import UserProfile from '@/components/shared/UserProfile';
import { motion } from 'framer-motion';

const childProfileData = {
  name: "بيتر جورج",
  avatarUrl: "https://picsum.photos/seed/childuser/200/200",
  role: "ابن مدارس الأحد",
  details: [
    { label: "أب الاعتراف", value: "أبونا مينا", icon: "UserSquare" as const },
    { label: "آخر اعتراف", value: "منذ شهرين", icon: "CalendarCheck" as const },
    { label: "فصيلة الدم", value: "O+", icon: "HeartPulse" as const },
    { label: "الفصل الدراسي", value: "رابع ابتدائي", icon: "BookOpen" as const },
    { label: "رقم ولي الأمر", value: "01234567890", icon: "Phone" as const, dir: "ltr" as const },
  ]
};

export default function ChildProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserProfile profileData={childProfileData} />
    </motion.div>
  );
}
