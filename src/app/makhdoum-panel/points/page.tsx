
"use client";
import MyPointsDisplay from '@/components/makhdoum-panel/MyPointsDisplay';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { useMakhdoumRole } from '@/contexts/MakhdoumRoleContext';

export default function MyPointsPage() {
  const { role } = useMakhdoumRole();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">
          {role === 'parent' ? 'متابعة نقاط الأبناء' : 'النقاط المكتسبة'}
        </h1>
        <p className="text-muted-foreground">
          {role === 'parent' 
            ? 'هنا يمكنك تتبع النقاط التي جمعها أبناؤك من خلال مشاركتهم.' 
            : 'هنا يمكنك تتبع نقاطك التي جمعتها من خلال مشاركتك في الأنشطة الكنسية المختلفة.'}
        </p>
      </div>
      <Separator />
      <MyPointsDisplay isParentView={role === 'parent'} />
    </motion.div>
  );
}
