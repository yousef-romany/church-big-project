
"use client";
import TaskList from '@/components/servant-panel/task-list';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ServantTasksPage() {
  // In a real app, this ID would come from the logged-in user's session/context
  const MOCK_SERVANT_ID = 'serv1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">مهام الافتقاد الحالية</h1>
        <p className="text-muted-foreground">قائمة بالأسر المطلوب منك زيارتها. قم بتحديث الحالة بعد إتمام الزيارة.</p>
      </div>
      <Separator />
      <TaskList servantId={MOCK_SERVANT_ID} />
    </motion.div>
  );
}
