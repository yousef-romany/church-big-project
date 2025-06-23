"use client";

import ClassAttendanceManager from '@/components/sunday-school-servant-panel/ClassAttendanceManager';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ClassAttendancePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">تسجيل حضور أبناء الفصل</h1>
        <p className="text-muted-foreground">استخدم الكاميرا أو أدخل الكود لتسجيل حضور الأبناء ومنحهم نقاطًا للمشاركة.</p>
      </div>
      <Separator />
      <ClassAttendanceManager />
    </motion.div>
  );
}
