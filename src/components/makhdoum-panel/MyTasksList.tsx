
"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  assignedBy: string;
}

const mockTasks: Task[] = [
  { id: 'task1', title: 'قراءة إنجيل يوحنا', description: 'قراءة الأصحاحات من 1 إلى 5 هذا الأسبوع.', status: 'pending', assignedBy: 'أبونا مينا' },
  { id: 'task2', title: 'صلاة مزمور 50 يوميًا', description: 'صلاة مزمور التوبة كل صباح لمدة أسبوع.', status: 'pending', assignedBy: 'أبونا مينا' },
  { id: 'task3', title: 'مساعدة في خدمة الكانتين', description: 'المساعدة في توزيع وجبات الإفطار يوم الجمعة القادمة.', status: 'completed', assignedBy: 'أبونا بولس' },
  { id: 'task4', title: 'حفظ لحن "يا كل الصفوف السمائيين"', description: 'محاولة حفظ اللحن قبل مهرجان الكرازة.', status: 'pending', assignedBy: 'أبونا مينا' },
];

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9, x: -100, transition: { duration: 0.3 } },
};

export default function MyTasksList() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center"><Clock className="me-2 h-6 w-6" /> مهام حالية</h2>
        {pendingTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لا توجد مهام حالية. عمل رائع!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {pendingTasks.map((task) => (
                <motion.div key={task.id} variants={cardVariants} initial="initial" animate="animate" exit="exit" layout>
                  <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle>{task.title}</CardTitle>
                      <CardDescription>من: {task.assignedBy}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-foreground/80">{task.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleCompleteTask(task.id)} className="w-full bg-green-600 hover:bg-green-700">
                        <Check className="me-2 h-4 w-4" />
                        إكمال المهمة
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center"><Sparkles className="me-2 h-6 w-6" /> مهام منجزة</h2>
        {completedTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لم تقم بإنجاز أي مهام بعد.</p>
        ) : (
          <div className="space-y-3">
            {completedTasks.map((task) => (
               <motion.div key={task.id} initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 flex justify-between items-center">
                      <p className="text-sm text-muted-foreground line-through">{task.title}</p>
                      <Badge variant="outline" className="border-green-500 text-green-600 bg-green-500/10">
                        <Check className="me-1 h-4 w-4" /> منجزة
                      </Badge>
                    </CardContent>
                  </Card>
               </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
