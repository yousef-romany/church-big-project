
"use client";
import MyTasksList from '@/components/makhdoum-panel/MyTasksList';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function MyTasksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">المهام المكلف بها</h1>
        <p className="text-muted-foreground">هنا يمكنك عرض وتحديث حالة المهام الروحية والخدمية الموكلة إليك.</p>
      </div>
      <Separator />
      <MyTasksList />
    </motion.div>
  );
}
