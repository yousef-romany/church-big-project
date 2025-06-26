
"use client";
import UserProfile from '@/components/shared/UserProfile';
import { motion } from 'framer-motion';

const adminProfileData = {
  name: "مدير النظام",
  avatarUrl: "https://picsum.photos/id/237/200/200",
  role: "مدير لوحة تحكم الكنيسة",
  details: [
    { label: "البريد الإلكتروني", value: "admin@church.app", icon: "Mail", dir: "ltr" as const },
    { label: "رقم الموبايل", value: "01000111222", icon: "Phone", dir: "ltr" as const },
    { label: "الكنيسة التابع لها", value: "كنيسة السيدة العذراء والأنبا أثناسيوس", icon: "Building" },
  ]
};

export default function AdminProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserProfile profileData={adminProfileData} />
    </motion.div>
  );
}
