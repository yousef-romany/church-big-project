
import SendServantForm from '@/components/priest-panel/send-servant-form';
import { motion } from 'framer-motion';

export default function SendServantPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary">إرسال خادم للافتقاد</h1>
        <p className="text-muted-foreground">اختر أسرة وقم بتفويض مهمة الافتقاد لأحد الخدام.</p>
      </div>
      <SendServantForm />
    </motion.div>
  );
}
