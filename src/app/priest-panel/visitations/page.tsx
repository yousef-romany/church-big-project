
import DailyVisitationSchedule from '@/components/priest-panel/daily-visitation-schedule';
import { motion } from 'framer-motion';

export default function VisitationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary">خدمة الافتقاد اليومية</h1>
        <p className="text-muted-foreground">عرض وجدولة زيارات الأسر.</p>
      </div>
      <DailyVisitationSchedule />
    </motion.div>
  );
}
