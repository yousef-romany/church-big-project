
"use client";
import PriestOverview from '@/components/dashboard/priest-overview';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function PriestsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">إدارة الكهنة</h1>
        <p className="text-muted-foreground">عرض بيانات الكهنة وحالاتهم وإحصائيات خدمتهم.</p>
      </div>
      <Separator />
      <PriestOverview />
      {/* Add priest management functionalities here, e.g., add/edit/delete priests */}
    </motion.div>
  );
}
