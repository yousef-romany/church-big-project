"use client";
import RequestConfessionForm from '@/components/public/request-confession-form';
import { motion } from 'framer-motion';

export default function RequestConfessionPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <RequestConfessionForm />
    </motion.div>
  );
}
