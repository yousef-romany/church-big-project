
"use client";
import ConfessionRequestForm from '@/components/public/ConfessionRequestForm';
import { motion } from 'framer-motion';
import { Church, BookHeart } from 'lucide-react';

export default function ConfessionRequestPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-2xl"
    >
      <div className="text-center mb-10">
        <BookHeart className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">طلب موعد اعتراف</h1>
        <p className="text-muted-foreground mt-2">
          يرجى ملء البيانات التالية لطلب موعد للاعتراف. سيقوم النظام بمحاولة إيجاد أقرب موعد متاح لك.
        </p>
      </div>
      <ConfessionRequestForm />
       <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center"
      >
        <Church className="mx-auto h-10 w-10 text-primary mb-3" />
        <h3 className="text-lg font-semibold text-primary mb-2">معلومات هامة</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          بعد تقديم الطلب، سيتم إعلامك بالموعد المحدد. يرجى الاستعداد جيدًا للاعتراف.
          إذا كنت بحاجة إلى إلغاء الموعد أو تعديله بعد تحديده، يرجى التواصل مباشرة مع الكنيسة.
          الرب يبارك حياتكم.
        </p>
      </motion.div>
    </motion.div>
  );
}
