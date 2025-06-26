
"use client";
import LinkChildForm from '@/components/makhdoum-parent-panel/LinkChildForm';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function LinkChildPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
       <div>
        <h1 className="text-3xl font-bold text-primary mb-1">ربط حساب ابن</h1>
        <p className="text-muted-foreground">أدخل كود الـ QR الخاص بابنك لإرسال طلب ربط ومتابعة تقدمه.</p>
      </div>
      <Separator />
      <LinkChildForm />
    </motion.div>
  );
}
