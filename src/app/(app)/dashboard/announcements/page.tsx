
"use client";
import AnnouncementSystem from '@/components/dashboard/announcement-system';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function AnnouncementsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">نظام الإعلانات</h1>
        <p className="text-muted-foreground">إنشاء ونشر الإعلانات الهامة لأعضاء الكنيسة.</p>
      </div>
      <Separator />
      <AnnouncementSystem />
      {/* Potentially add features for scheduling or targeting announcements */}
    </motion.div>
  );
}
