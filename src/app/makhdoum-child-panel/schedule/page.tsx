
"use client";
import MyScheduleView from '@/components/makhdoum-panel/MyScheduleView';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function MySchedulePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">جدولي الزمني</h1>
        <p className="text-muted-foreground">اطلع على مواعيد الأنشطة والاجتماعات الخاصة بك في الكنيسة.</p>
      </div>
      <Separator />
      <MyScheduleView />
    </motion.div>
  );
}
