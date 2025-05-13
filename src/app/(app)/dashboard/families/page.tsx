
"use client";
import FamilyManagement from '@/components/dashboard/family-management';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function FamiliesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">إدارة العائلات</h1>
        <p className="text-muted-foreground">فلترة وبحث في بيانات العائلات وتفاصيلهم.</p>
      </div>
      <Separator />
      <FamilyManagement />
      {/* Add family management functionalities here, e.g., add/edit/delete families */}
    </motion.div>
  );
}
