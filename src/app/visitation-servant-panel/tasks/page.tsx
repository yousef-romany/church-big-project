
"use client";
import TaskList from '@/components/servant-panel/task-list';
import { motion } from 'framer-motion';

export default function VisitationServantTasksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary">مهام الافتقاد</h1>
        <p className="text-muted-foreground">قائمة بالأسر المطلوب زيارتها. يمكنك تسجيل الزيارة وإضافة ملاحظات.</p>
      </div>
      <TaskList />
    </motion.div>
  );
}
