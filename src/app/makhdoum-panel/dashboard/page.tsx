
"use client";
import MakhdoumDashboardContent from '@/components/makhdoum-panel/MakhdoumDashboardContent';
import { motion } from 'framer-motion';

export default function MakhdoumDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <MakhdoumDashboardContent />
    </motion.div>
  );
}
