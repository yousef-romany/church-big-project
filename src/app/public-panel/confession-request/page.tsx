
"use client";
import ConfessionRequestForm from '@/components/public/ConfessionRequestForm';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookHeart } from 'lucide-react';

export default function ConfessionRequestPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-6">
          <BookHeart className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">طلب موعد اعتراف</CardTitle>
          <CardDescription className="text-sm md:text-base mt-1">
            الرجاء تعبئة البيانات لطلب موعد. سيقوم النظام بمحاولة إيجاد أقرب موعد متاح لك.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <ConfessionRequestForm />
        </CardContent>
      </Card>
    </motion.div>
  );
}

