"use client";
import ChurchInstructionsDisplay from '@/components/public/church-instructions-display';
import { motion } from 'framer-motion';

export default function ChurchInstructionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-bold text-primary tracking-tight"
        >
          تعليمات وإرشادات الكنيسة
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          هنا تجد أهم التعليمات والإرشادات الخاصة بالحياة الروحية والأنشطة الكنسية.
        </motion.p>
      </div>
      <ChurchInstructionsDisplay />
    </motion.div>
  );
}
