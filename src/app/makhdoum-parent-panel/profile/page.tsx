
"use client";
import UserProfile from '@/components/shared/UserProfile';
import { motion } from 'framer-motion';

const parentProfileData = {
  name: "مايكل سمير",
  avatarUrl: "https://picsum.photos/seed/parentuser/200/200",
  role: "ولي أمر",
  details: [
    { label: "أب الاعتراف", value: "أبونا مرقس", icon: "UserSquare" as const },
    { label: "آخر اعتراف", value: "منذ شهر", icon: "CalendarCheck" as const },
    { label: "فصيلة الدم", value: "B-", icon: "HeartPulse" as const },
    { label: "رقم الموبايل", value: "01556677889", icon: "Phone" as const, dir: "ltr" as const },
    { label: "الوظيفة", value: "محاسب", icon: "Briefcase" as const },
  ]
};

export default function ParentProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserProfile profileData={parentProfileData} />
    </motion.div>
  );
}
