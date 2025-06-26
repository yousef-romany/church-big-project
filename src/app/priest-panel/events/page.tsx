
"use client";
import ManageEvents from '@/components/priest-panel/events/ManageEvents';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ManageEventsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">إدارة الفعاليات والاجتماعات الخاصة</h1>
        <p className="text-muted-foreground">
          هنا يمكنك إنشاء وتعديل الفعاليات والاجتماعات الخاصة، وتحديد نقاط الحضور لها.
        </p>
      </div>
      <Separator />
      <ManageEvents />
    </motion.div>
  );
}
