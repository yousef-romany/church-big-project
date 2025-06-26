
"use client";
import ManageTrips from '@/components/priest-panel/trips/ManageTrips';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ManageTripsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">إدارة الرحلات الكنسية</h1>
        <p className="text-muted-foreground">
          هنا يمكنك إنشاء رحلات جديدة، عرض تفاصيلها، ومتابعة الحجوزات والمدفوعات.
        </p>
      </div>
      <Separator />
      <ManageTrips />
    </motion.div>
  );
}
