
"use client";
import MyPointsDisplay from '@/components/makhdoum-panel/MyPointsDisplay';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function MyPointsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">النقاط المكتسبة</h1>
        <p className="text-muted-foreground">هنا يمكنك تتبع نقاطك التي جمعتها من خلال مشاركتك في الأنشطة الكنسية المختلفة.</p>
      </div>
      <Separator />
      <MyPointsDisplay />
    </motion.div>
  );
}
