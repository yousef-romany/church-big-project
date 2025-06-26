
"use client";
import UserProfile from '@/components/shared/UserProfile';
import { motion } from 'framer-motion';

const servantProfileData = {
  name: "طوني صبحي",
  avatarUrl: "https://picsum.photos/seed/visitationservantavatar/200/200",
  role: "خادم افتقاد",
  details: [
    { label: "أب الاعتراف", value: "أبونا يوحنا", icon: "UserSquare" as const },
    { label: "آخر اعتراف", value: "منذ أسبوعين", icon: "CalendarCheck" as const },
    { label: "فصيلة الدم", value: "A-", icon: "HeartPulse" as const },
    { label: "رقم الموبايل", value: "01276543210", icon: "Phone" as const, dir: "ltr" as const },
    { label: "نوع الخدمة", value: "افتقاد أسر", icon: "Briefcase" as const },
  ]
};

export default function VisitationServantProfilePage() {
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
