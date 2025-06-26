
"use client";
import TripsList from '@/components/public-panel/trips/TripsList';
import { motion } from 'framer-motion';

export default function PublicTripsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">الرحلات الكنسية المتاحة</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
            اكتشف الرحلات الروحية والترفيهية التي تنظمها الكنيسة. اختر رحلتك واحجز مكانك الآن!
        </p>
      </div>
      <TripsList />
    </motion.div>
  );
}
