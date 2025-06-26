
"use client";
import ChildDashboard from '@/components/makhdoum-child-panel/ChildDashboard';
import { motion } from 'framer-motion';

export default function ChildDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <ChildDashboard />
    </motion.div>
  );
}
