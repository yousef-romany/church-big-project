
"use client";
import ChurchInformation from '@/components/dashboard/church-information';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ChurchInfoPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">بيانات الكنيسة</h1>
        <p className="text-muted-foreground">عرض وتعديل معلومات الكنيسة الأساسية والموقع.</p>
      </div>
      <Separator />
      <ChurchInformation />
      {/* Add other church settings or configurations here if needed */}
    </motion.div>
  );
}
