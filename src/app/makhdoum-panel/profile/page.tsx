
"use client";
import UserProfile from '@/components/shared/UserProfile';
import { motion } from 'framer-motion';

const makhdoumProfileData = {
  name: "جرجس رؤوف",
  avatarUrl: "https://picsum.photos/seed/makhdoumuser/200/200",
  role: "مخدوم",
  details: [
    { label: "أب الاعتراف", value: "أبونا بولس", icon: "UserSquare" as const },
    { label: "آخر اعتراف", value: "منذ 3 أسابيع", icon: "CalendarCheck" as const },
    { label: "فصيلة الدم", value: "A+", icon: "HeartPulse" as const },
    { label: "رقم الموبايل", value: "01122334455", icon: "Phone" as const, dir: "ltr" as const },
    { label: "الوظيفة", value: "مهندس", icon: "Briefcase" as const },
  ]
};

export default function MakhdoumProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserProfile profileData={makhdoumProfileData} />
    </motion.div>
  );
}
