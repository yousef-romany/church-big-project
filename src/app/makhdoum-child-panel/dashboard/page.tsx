"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Star, Calendar, BookOpenCheck, Plane, ArrowLeft } from 'lucide-react';
import ChildDashboard from '@/components/makhdoum-child-panel/ChildDashboard';

const childSections = [
    {
      title: 'نقاطي المكتسبة',
      description: 'شاهد النقاط التي جمعتها من خلال الحضور والأنشطة المختلفة.',
      href: '/makhdoum-child-panel/points',
      icon: Star,
      color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-500',
    },
    {
      title: 'جدولي الزمني',
      description: 'اطلع على مواعيد مدارس الأحد، اجتماعات الشباب، والأنشطة الأخرى.',
      href: '/makhdoum-child-panel/schedule',
      icon: Calendar,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-500',
    },
    {
      title: 'طلب موعد اعتراف',
      description: 'اطلب موعدًا للاعتراف، وسيقوم النظام بتحديد أقرب وقت متاح لك.',
      href: '/public-panel/confession-request',
      icon: BookOpenCheck,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500',
    },
    {
      title: 'الرحلات المتاحة',
      description: 'اكتشف الرحلات الروحية والترفيهية التي تنظمها الكنيسة.',
      href: '/public-panel/trips',
      icon: Plane,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      borderColor: 'border-sky-500',
    },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ChildDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
        <ChildDashboard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {childSections.map((section, index) => (
            <motion.div key={index} variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Link href={section.href} legacyBehavior passHref>
                <Card className={`cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${section.borderColor} flex flex-col h-full`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-xl font-semibold text-primary">{section.title}</CardTitle>
                    <div className={`p-3 rounded-full ${section.color}`}>
                        <section.icon className={`h-7 w-7 ${section.color.split(' ')[1].replace('text-','text-')}`} />
                    </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <CardDescription className="text-sm leading-relaxed">{section.description}</CardDescription>
                    </CardContent>
                    <CardContent className="pt-0">
                    <div className="mt-auto flex items-center text-sm font-medium text-primary hover:underline">
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
