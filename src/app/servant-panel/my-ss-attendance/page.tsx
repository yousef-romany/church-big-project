
"use client";
import MySundaySchoolAttendanceTable from '@/components/servant-panel/MySundaySchoolAttendanceTable';
import SundaySchoolSelfAttendanceCard from '@/components/servant-panel/SundaySchoolSelfAttendanceCard';
import type { SundaySchoolServant } from '@/types/sunday-school';
import { getSundaySchoolServants } from '@/lib/sunday-school-store';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

export default function MySundaySchoolAttendancePage() {
  const [servant, setServant] = useState<SundaySchoolServant | null>(null);
  // In a real app, you'd get the logged-in servant's ID from auth context
  const MOCK_LOGGED_IN_SERVANT_ID = "servant1_ss_mock_id"; // Replace with actual logic later

  useEffect(() => {
    const allServants = getSundaySchoolServants();
    const currentServant = allServants.find(s => s.id === MOCK_LOGGED_IN_SERVANT_ID);
    // If mock servant doesn't exist, create a placeholder one for demo if needed
    if (!currentServant && MOCK_LOGGED_IN_SERVANT_ID === "servant1_ss_mock_id" && allServants.length > 0) {
        // Fallback to the first servant if mock ID doesn't exist but there are servants
        // This is just for making the demo work more easily without manually adding "servant1_ss_mock_id"
        setServant(allServants[0]);
    } else if (currentServant) {
        setServant(currentServant);
    } else {
        // If no servants or specific mock ID not found, create a temporary mock servant for UI structure
        // This should be removed or handled better in a real app with actual auth
        console.warn(`Servant with ID ${MOCK_LOGGED_IN_SERVANT_ID} not found. Using a placeholder for UI or ensure servant exists.`);
        // setServant({ id: MOCK_LOGGED_IN_SERVANT_ID, name: "خادم افتراضي", servingDays: ['Thursday', 'Friday'], isActive: true });
        setServant(null); // Or set to null if no servant should mean no UI
    }
  }, [MOCK_LOGGED_IN_SERVANT_ID]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">تسجيل وحالة حضوري (مدارس الأحد)</h1>
        <p className="text-muted-foreground">قم بتسجيل حضورك ليوم الخدمة الحالي واطلع على سجل حضورك السابق.</p>
      </div>
      <Separator />
      
      <SundaySchoolSelfAttendanceCard servant={servant} />
      
      <Separator />
      
      <div>
        <h2 className="text-2xl font-semibold text-primary mb-3">سجل حضوري السابق</h2>
        {servant ? (
          <MySundaySchoolAttendanceTable servantId={servant.id} />
        ) : (
          <p className="text-center text-muted-foreground py-4">
            لا يمكن عرض سجل الحضور. بيانات الخادم غير متوفرة.
          </p>
        )}
      </div>
    </motion.div>
  );
}
