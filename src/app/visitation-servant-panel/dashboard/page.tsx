
"use client";
import ServantDashboardContent from '@/components/servant-panel/servant-dashboard-content';
import { motion } from 'framer-motion';

export default function ServantDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <ServantDashboardContent />
    </motion.div>
  );
}
