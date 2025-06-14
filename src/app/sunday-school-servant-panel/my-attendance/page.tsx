
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
    
    if (!currentServant && MOCK_LOGGED_IN_SERVANT_ID === "servant1_ss_mock_id" && allServants.length > 0) {
        setServant(allServants[0]); // Fallback for demo
    } else if (currentServant) {
        setServant(currentServant);
    } else {
        console.warn(`Servant with ID ${MOCK_LOGGED_IN_SERVANT_ID} not found. Using a placeholder or ensure servant exists.`);
        // Example of creating a placeholder if needed for UI structure during development,
        // but generally, this should be handled by auth.
        // setServant({ 
        //   id: MOCK_LOGGED_IN_SERVANT_ID, 
        //   name: "خادم افتراضي", 
        //   servingDays: ['Thursday', 'Friday'], 
        //   isActive: true,
        //   contactNumber: "01000000000",
        //   birthDate: "1990-01-01"
        // });
         setServant(null);
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
