
"use client";
import ViewChildData from '@/components/makhdoum-parent-panel/ViewChildData';
import { motion } from 'framer-motion';

export default function ViewChildPage({ params }: { params: { childId: string } }) {
  const { childId } = params;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <ViewChildData childId={childId} />
    </motion.div>
  );
}
