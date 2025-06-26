
"use client";
import UserProfile from '@/components/shared/UserProfile';
import { motion } from 'framer-motion';

const priestProfileData = {
  name: "أبونا يوحنا",
  avatarUrl: "https://picsum.photos/seed/priestavatar/200/200",
  role: "كاهن الكنيسة",
  details: [
    { label: "رقم الموبايل", value: "01098765432", icon: "Phone" as const, dir: "ltr" as const },
    { label: "البريد الإلكتروني", value: "abouna.yohanna@church.app", icon: "Mail" as const, dir: "ltr" as const },
    { label: "أسقف الإيبارشية", value: "نيافة الأنبا ...", icon: "UserSquare" as const },
    { label: "تاريخ الرسامة", value: "20 مارس 2005", icon: "CalendarCheck" as const },
  ]
};

export default function PriestProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserProfile profileData={priestProfileData} />
    </motion.div>
  );
}
