"use client";

import ContentManager from '@/components/sunday-school-servant-panel/ContentManager';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function ContentManagementPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">إدارة المحتوى التعليمي</h1>
        <p className="text-muted-foreground">أضف آيات للحفظ أو أسئلة أسبوعية لتشجيع تفاعل الأبناء.</p>
      </div>
      <Separator />
      <ContentManager />
    </motion.div>
  );
}
