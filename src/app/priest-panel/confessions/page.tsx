
import ConfessionSchedule from '@/components/priest-panel/confession-schedule';
import { motion } from 'framer-motion';

export default function ConfessionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary">سكرتارية الاعتراف</h1>
        <p className="text-muted-foreground">إدارة وتنظيم مواعيد الاعترافات.</p>
      </div>
      <ConfessionSchedule />
    </motion.div>
  );
}
