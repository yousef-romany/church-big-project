
"use client";
import ConfessionRequestForm from '@/components/public/confession-request-form';
import { motion } from 'framer-motion';
import { Church, ScrollText, UserCheck } from 'lucide-react';

// Mock data for priests - in a real app, this would come from an API
const mockPriests = [
  { id: 'priest1', name: 'الأب يوحنا بطرس', churchName: 'كنيسة السيدة العذراء بالزيتون' },
  { id: 'priest2', name: 'الأب مينا عبدالسيد', churchName: 'كنيسة مارجرجس هليوبوليس' },
  { id: 'priest3', name: 'الأب بولس حليم', churchName: 'كنيسة الأنبا بيشوي بالعباسية' },
];

// Mock data for church instructions
const churchInstructions = [
  { id: 'instr1', title: 'قانون الإيمان', content: 'نؤمن بإله واحد، الله الآب، ضابط الكل، خالق السماء والأرض، ما يُرى وما لا يُرى...', icon: ScrollText, category: "الحياة الروحية" },
  { id: 'instr2', title: 'مواعيد الأصوام الكبرى', content: 'الصوم الكبير: يبدأ يوم الإثنين الموافق ٢٠ فبراير. صوم الرسل: يبدأ...', icon: CalendarDays, category: "الأصوام والطقوس" },
  { id: 'instr3', title: 'اجتماع الشباب الأسبوعي', content: 'كل يوم جمعة الساعة السابعة مساءً بقاعة الأنبا أبرآم.', icon: Users, category: "الأنشطة الكنسية" },
  { id: 'instr4', title: 'آداب الاعتراف', content: 'قبل الاعتراف: فحص الضمير جيدًا، الصلاة لطلب الإرشاد. أثناء الاعتراف: الصدق الكامل، عدم تبرير الخطايا...', icon: UserCheck, category: "الحياة الروحية" },
];


export default function ConfessionRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <Church className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
          بوابة المخدومين
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          مرحبًا بك في مساحتك الخاصة للتواصل الروحي وطلب الخدمات الكنسية.
        </p>
      </motion.header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <ConfessionRequestForm priests={mockPriests} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-primary mb-4 text-center md:text-right">تعليمات وإرشادات كنسية</h2>
          {churchInstructions.map((item, index) => {
             const IconComponent = item.icon;
             return (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.15, ease: "easeOut" }}
                    className="bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                    <div className="flex items-center mb-3">
                        <IconComponent className="h-7 w-7 text-primary me-3" />
                        <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.content}</p>
                    <p className="text-xs text-primary/70 mt-3 pt-2 border-t border-border/50">{item.category}</p>
                </motion.div>
             );
          })}
        </motion.div>
      </div>
       <footer className="text-center mt-16 py-8 border-t border-border/20">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لكنيستك. طور بحب.</p>
        </footer>
    </div>
  );
}

// Adding missing imports for icons
import { CalendarDays, Users } from 'lucide-react';
