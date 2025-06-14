
"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CalendarCheck, ArrowLeft } from 'lucide-react';

const dashboardSections = [
  {
    title: 'سجل حضوري في مدارس الأحد',
    description: 'عرض وتتبع سجل حضورك في خدمة مدارس الأحد.',
    href: '/sunday-school-servant-panel/my-attendance',
    icon: CalendarCheck,
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    borderColor: 'border-green-500',
  },
  // Add more sections relevant to Sunday School servants later if needed
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SundaySchoolServantDashboardPage() {
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
        مرحباً بك في لوحة تحكم خادم مدارس الأحد
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
