
import AddFamilyForm from '@/components/priest-panel/add-family-form';
import { motion } from 'framer-motion';

export default function AddFamilyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary">إضافة أسرة جديدة</h1>
        <p className="text-muted-foreground">قم بتعبئة بيانات الأسرة لإضافتها إلى النظام.</p>
      </div>
      <AddFamilyForm />
    </motion.div>
  );
}
