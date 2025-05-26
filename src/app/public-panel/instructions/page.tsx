
"use client";
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollText, CalendarDays, Users, BookHeart, Handshake, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChurchInstruction } from '@/types/public'; // Make sure this type exists and is correctly defined

const instructions: ChurchInstruction[] = [
  {
    id: '1',
    title: 'قانون الاعتراف والتناول',
    content: 'يجب الصوم الانقطاعي قبل سر التناول بـ 9 ساعات على الأقل. الاعتراف الدوري مهم للنمو الروحي. استعد جيدًا قبل الاعتراف.',
    icon: BookHeart,
    category: 'الحياة الروحية',
  },
  {
    id: '2',
    title: 'مواعيد الأصوام الكنسية',
    content: 'الصوم الكبير: يبدأ ... وينتهي ...\nصوم الرسل: يبدأ ... وينتهي ...\nصوم السيدة العذراء: يبدأ ... وينتهي ...\nصوم الميلاد: يبدأ ... وينتهي ...\nصوم يونان: ...\nالأربعاء والجمعة: صوم انقطاعي حتى الغروب أو حسب إرشاد أب الاعتراف.',
    icon: CalendarDays,
    category: 'الأصوام والأعياد',
  },
  {
    id: '3',
    title: 'اجتماعات الكنيسة الأسبوعية',
    content: 'اجتماع الشباب: الجمعة الساعة 7 مساءً.\nدرس الكتاب: الأربعاء بعد القداس.\nمدارس الأحد: الجمعة صباحًا والأحد صباحًا.\nاجتماع السيدات: الثلاثاء الساعة 11 صباحًا.',
    icon: Users,
    category: 'الأنشطة والاجتماعات',
  },
   {
    id: '4',
    title: 'إرشادات عامة للمشاركة في القداس الإلهي',
    content: 'الحضور مبكرًا للمشاركة في صلوات الاستعداد. الحفاظ على الهدوء والخشوع داخل الكنيسة. إغلاق الهواتف المحمولة. ارتداء ملابس لائقة ببيت الله.',
    icon: ScrollText,
    category: 'الحياة الروحية',
  },
  {
    id: '5',
    title: 'خدمات الكنيسة للمجتمع',
    content: 'الكنيسة تقدم خدمات متنوعة مثل فصول محو الأمية، مساعدات للفقراء والمحتاجين، ندوات توعية أسرية. للمشاركة أو الاستفادة، تواصل مع مكتب الخدمة.',
    icon: Handshake,
    category: 'خدمات الكنيسة',
  },
  {
    id: '6',
    title: 'للاستفسارات والمساعدة',
    content: 'إذا كان لديك أي استفسار أو تحتاج إلى مساعدة روحية أو اجتماعية، لا تتردد في التواصل مع أباء الكنيسة أو مكتب الخدمة.',
    icon: HelpCircle,
    category: 'الدعم والمساعدة',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    },
  }),
};

export default function ChurchInstructionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-0 md:px-4"
    >
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-4 text-center text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        تعليمات وإرشادات الكنيسة
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        هنا تجد أهم التعليمات الروحية والكنسية التي تساعدك في مسيرتك وحياتك مع الكنيسة.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {instructions.map((instruction, index) => (
          <motion.div
            key={instruction.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              y: -8, 
              boxShadow: "0px 15px 30px -10px hsla(var(--primary), 0.2), 0px 8px 15px -12px hsla(var(--primary), 0.15)" 
            }}
            className="h-full"
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border-2 border-transparent hover:border-primary/30">
              <CardHeader className="flex flex-row items-center gap-4 bg-primary/5 p-4">
                <instruction.icon className="h-10 w-10 text-primary shrink-0" />
                <div>
                  <CardTitle className="text-xl font-semibold text-primary">{instruction.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{instruction.category}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6 flex-grow">
                <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{instruction.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
