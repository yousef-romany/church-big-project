
"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookOpenCheck, Info, ArrowLeft } from 'lucide-react';

const dashboardSections = [
  {
    title: 'طلب موعد اعتراف',
    description: 'اطلب موعدًا للاعتراف مع أحد أباء الكنيسة المتاحين.',
    href: '/public/confession-request',
    icon: BookOpenCheck,
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    borderColor: 'border-sky-500',
  },
  {
    title: 'تعليمات الكنيسة',
    description: 'اطلع على أهم الإرشادات والتعليمات الكنسية والروحية.',
    href: '/public-panel/instructions',
    icon: Info,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PublicDashboardPage() {
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
        className="text-3xl font-bold mb-10 text-center text-primary"
        variants={cardVariants}
      >
        مرحباً بك في بوابتك الروحية
      </motion.h1>
      <motion.p 
        className="text-center text-muted-foreground mb-12 max-w-xl mx-auto"
        variants={cardVariants}
        transition={{delay: 0.1}}
      >
        هنا يمكنك طلب مواعيد الاعتراف، والاطلاع على تعليمات الكنيسة، والمشاركة في الحياة الروحية.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dashboardSections.map((section, index) => (
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
