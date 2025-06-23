
"use client";
import ServantPointsDisplay from '@/components/servant-panel/ServantPointsDisplay';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ServantPointsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">نقاطي الخدمية</h1>
        <p className="text-muted-foreground">تابع نقاطك التي اكتسبتها من خلال خدمتك ومواظبتك.</p>
      </div>
      <Separator />
      <ServantPointsDisplay servantType="visitation" />
    </motion.div>
  );
}
