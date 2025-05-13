
import CompletedTasksHistory from '@/components/servant-panel/completed-tasks-history';
import { motion } from 'framer-motion';

export default function ServantHistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary">المهام المنجزة</h1>
        <p className="text-muted-foreground">سجل بالزيارات التي قمت بإتمامها والملاحظات المسجلة.</p>
      </div>
      <CompletedTasksHistory />
    </motion.div>
  );
}
