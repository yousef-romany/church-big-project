"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ListChecks, History, ArrowLeft, Award } from 'lucide-react';

const dashboardSections = [
  {
    title: 'مهام الافتقاد',
    description: 'عرض وإدارة قائمة الأسر المطلوب زيارتها.',
    href: '/visitation-servant-panel/tasks',
    icon: ListChecks,
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    borderColor: 'border-sky-500',
  },
  {
    title: 'المهام المنجزة',
    description: 'مراجعة سجل الزيارات التي قمت بها سابقًا.',
    href: '/visitation-servant-panel/history',
    icon: History,
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-500',
  },
  {
    title: 'نقاطي الخدمية',
    description: 'عرض رصيدك من النقاط والأوسمة المكتسبة.',
    href: '/visitation-servant-panel/points',
    icon: Award,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ServantDashboardContent() {
  return (
    <motion.div
      className="container mx-auto py-8 px-0 md:px-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-primary"
        variants={cardVariants}
      >
        مرحباً بك في لوحة تحكم خادم الافتقاد
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardSections.map((section, index) => (
          <motion.div key={index} variants={cardVariants} whileHover={{ y: -5 }}>
            <Link href={section.href} legacyBehavior passHref>
              <Card className={`cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 ${section.borderColor}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                  <section.icon className={`h-8 w-8 ${section.color.split(' ')[1]}`} />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{section.description}</CardDescription>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary hover:underline">
                    اذهب إلى القسم
                    <ArrowLeft className="ms-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
