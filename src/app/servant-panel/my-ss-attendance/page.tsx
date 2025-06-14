
"use client";
import MySundaySchoolAttendanceTable from '@/components/servant-panel/MySundaySchoolAttendanceTable';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function MySundaySchoolAttendancePage() {
  // In a real app, you'd get the logged-in servant's ID
  const MOCK_LOGGED_IN_SERVANT_ID = "servant1_ss_mock_id"; // Replace with actual logic later

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">سجل حضوري في مدارس الأحد</h1>
        <p className="text-muted-foreground">عرض تاريخ حضورك وغيابك في خدمة مدارس الأحد.</p>
      </div>
      <Separator />
      <MySundaySchoolAttendanceTable servantId={MOCK_LOGGED_IN_SERVANT_ID} />
    </motion.div>
  );
}
