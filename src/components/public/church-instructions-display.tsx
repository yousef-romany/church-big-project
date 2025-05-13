
"use client";
import type { ChurchInstruction } from '@/types/public';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Users, ClipboardEdit, HelpCircle } from 'lucide-react';

const mockInstructions: ChurchInstruction[] = [
  { id: 'instr1', title: 'قانون الاعتراف والتناول', content: 'يجب على المعترف أن يكون صائمًا انقطاعيًا لمدة لا تقل عن ٩ ساعات قبل التناول. ينصح بالاستعداد الجيد للاعتراف بمراجعة الذات والصلاة.', icon: BookOpen, category: 'الحياة الروحية' },
  { id: 'instr2', title: 'مواعيد الأصوام الكنسية لعام ٢٠٢٤', content: 'صوم الميلاد: ٢٥ نوفمبر - ٦ يناير.\nالصوم الكبير: ...\nصوم الرسل: ...\nصوم السيدة العذراء: ٧ أغسطس - ٢١ أغسطس.', icon: CalendarDays, category: 'الأصوام والأعياد' },
  { id: 'instr3', title: 'اجتماعات الكنيسة الأسبوعية', content: 'اجتماع الشباب: الجمعة ٧ مساءً.\nدرس الكتاب: الأربعاء ٦ مساءً.\nاجتماع السيدات: الثلاثاء ١٠ صباحًا.', icon: Users, category: 'الأنشطة الكنسية' },
  { id: 'instr4', title: 'خدمات مدارس الأحد', content: 'تبدأ فصول مدارس الأحد بعد القداس الإلهي يوم الأحد من الساعة ١١ صباحًا حتى ١ ظهرًا لجميع المراحل.', icon: ClipboardEdit, category: 'خدمات الأطفال' },
  { id: 'instr5', title: 'سلوكيات داخل الكنيسة', content: 'يرجى الحفاظ على الهدوء والخشوع داخل الكنيسة. إغلاق الهواتف المحمولة أو وضعها على الصامت. الالتزام بالملابس اللائقة.', icon: HelpCircle, category: 'آداب عامة' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", damping: 15, stiffness: 100 }
  },
};

export default function ChurchInstructionsDisplay() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {mockInstructions.map((instruction) => (
        <motion.div key={instruction.id} variants={cardVariants} whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}>
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-3 bg-primary/5">
              <instruction.icon className="h-10 w-10 text-primary shrink-0" />
              <div>
                <CardTitle className="text-xl font-semibold">{instruction.title}</CardTitle>
                <CardDescription className="text-xs text-primary/80">{instruction.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-grow">
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{instruction.content}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
