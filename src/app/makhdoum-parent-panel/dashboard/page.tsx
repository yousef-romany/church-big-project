
"use client";
import ParentDashboard from '@/components/makhdoum-parent-panel/ParentDashboard';
import { motion } from 'framer-motion';

export default function ParentDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <ParentDashboard />
    </motion.div>
  );
}
