
"use client";
import CompletedTasksHistory from '@/components/servant-panel/completed-tasks-history';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ServantHistoryPage() {
  // In a real app, this would come from an authentication context
  const MOCK_SERVANT_ID = 'serv1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">المهام المنجزة</h1>
        <p className="text-muted-foreground">هنا يمكنك مراجعة سجل الزيارات التي قمت بها سابقًا.</p>
      </div>
      <Separator />
      <CompletedTasksHistory servantId={MOCK_SERVANT_ID} />
    </motion.div>
  );
}
