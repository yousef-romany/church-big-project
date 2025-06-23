
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ClipboardList, BookOpenCheck, Star, Calendar, ShieldCheck, ArrowLeft, Users, Baby, HandHelping } from 'lucide-react';
import MyPointsDisplay from './MyPointsDisplay';

const dashboardSections = {
  regular: [
    {
      title: 'المهام المكلف بها',
      description: 'عرض ومتابعة المهام الروحية أو الخدمية الموكلة إليك من أب الاعتراف.',
      href: '/makhdoum-panel/tasks',
      icon: ClipboardList,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      borderColor: 'border-sky-500',
    },
    {
      title: 'طلب موعد اعتراف',
      description: 'اطلب موعدًا للاعتراف، وسيقوم النظام بتحديد أقرب وقت متاح لك.',
      href: '/public-panel/confession-request',
      icon: BookOpenCheck,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500',
    },
  ],
  child: [
     {
      title: 'نقاطي المكتسبة',
      description: 'شاهد النقاط التي جمعتها من خلال الحضور والأنشطة المختلفة.',
      href: '/makhdoum-panel/points',
      icon: Star,
      color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-500',
    },
    {
      title: 'جدولي الزمني',
      description: 'اطلع على مواعيد مدارس الأحد، اجتماعات الشباب، والأنشطة الأخرى.',
      href: '/makhdoum-panel/schedule',
      icon: Calendar,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-500',
    },
  ],
  parent: [
    {
      title: 'متابعة الابن/الابنة',
      description: 'اطلع على نقاط ابنك/ابنتك وتأكد من انتظامه في أنشطة الكنيسة.',
      href: '/makhdoum-panel/points', // This will lead to their own points page, but parent view is shown below
      icon: ShieldCheck,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-500',
    },
     {
      title: 'طلب موعد اعتراف (للأسرة)',
      description: 'يمكنك طلب موعد اعتراف لك أو لأحد أفراد أسرتك.',
      href: '/public-panel/confession-request',
      icon: BookOpenCheck,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500',
    },
  ]
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Section = ({ title, icon: Icon, cards }: { title: string, icon: React.ElementType, cards: typeof dashboardSections.regular }) => (
    <div className="mb-12">
        <motion.div variants={cardVariants} className="flex items-center mb-6">
            <Icon className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-primary ms-3">{title}</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((section) => (
            <motion.div key={section.title} variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
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
    </div>
);

export default function MakhdoumDashboardContent() {

  return (
    <motion.div
      className="container mx-auto py-8 px-0 md:px-4"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={cardVariants} className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-primary">أهلاً بك في بوابتك الروحية</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">هنا تجد كل الخدمات المخصصة لمتابعة حياتك الروحية والكنسية، سواء كنت مخدومًا عامًا، أو ابنًا، أو ولي أمر.</p>
      </motion.div>

      <Section title="خدمات عامة" icon={Users} cards={dashboardSections.regular} />
      <Section title="خدمات الأبناء (الأطفال والشباب)" icon={Baby} cards={dashboardSections.child} />
      <Section title="خدمات أولياء الأمور" icon={HandHelping} cards={dashboardSections.parent} />
      
      <motion.div variants={cardVariants} className="mt-8">
         <div className="flex items-center mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-primary ms-3">متابعة الأبناء (مثال)</h2>
        </div>
         <MyPointsDisplay isParentView={true} />
      </motion.div>

    </motion.div>
  );
}
