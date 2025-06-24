
"use client";
import type { ServantTask } from '@/types/servant-panel';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, MapPin, User, MessageSquare, Edit3, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { getTasksForServant, completeVisitationTask } from '@/lib/visitation-tasks-store';

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } },
};

interface TaskListProps {
    servantId: string;
}

export default function TaskList({ servantId }: TaskListProps) {
  const [tasks, setTasks] = useState<ServantTask[]>([]);
  const [editingNotesTaskId, setEditingNotesTaskId] = useState<string | null>(null);
  const [currentServantNotes, setCurrentServantNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setTasks(getTasksForServant(servantId));
  }, [servantId]);

  const handleMarkAsVisited = (taskId: string) => {
    const completedTask = tasks.find(t => t.id === taskId);
    if (completedTask) {
        completeVisitationTask(taskId, currentServantNotes);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        toast({
            title: "تم تسجيل الزيارة بنجاح!",
            description: `تم تحديث حالة زيارة ${completedTask.familyName}.`,
        });
        setEditingNotesTaskId(null);
        setCurrentServantNotes('');
    }
  };

  const toggleEditNotes = (taskId: string) => {
    if (editingNotesTaskId === taskId) {
      setEditingNotesTaskId(null);
      setCurrentServantNotes('');
    } else {
      const task = tasks.find(t => t.id === taskId);
      setEditingNotesTaskId(taskId);
      setCurrentServantNotes(task?.servantNotes || ''); 
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      {tasks.length === 0 && (
        <motion.p variants={cardVariants} className="text-center text-muted-foreground py-8 text-lg">
          لا توجد مهام افتقاد حالية. عمل رائع!
        </motion.p>
      )}
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div key={task.id} variants={cardVariants} layout>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className="bg-card-foreground/5 dark:bg-card-foreground/10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <User className="me-2 h-6 w-6 text-primary" /> {task.familyName}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    مُسندة منذ: {formatDistanceToNow(new Date(task.assignedAt), { addSuffix: true, locale: arSA })}
                  </span>
                </div>
                {task.notesFromPriest && (
                  <CardDescription className="mt-2 text-sm text-amber-700 dark:text-amber-500 border-s-2 border-amber-500 ps-2 py-1 bg-amber-500/10 rounded-sm">
                    <MessageSquare className="inline h-4 w-4 me-1"/> ملاحظات الكاهن: {task.notesFromPriest}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start text-sm">
                  <MapPin className="h-5 w-5 me-2 mt-1 text-primary shrink-0" />
                  <div>
                    <p className="font-medium">الموقع:</p>
                    <p className="text-muted-foreground">{task.address}</p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border shadow-sm aspect-video">
                  <Image
                    src={task.mapLocationImageUrl}
                    alt={`موقع ${task.familyName}`}
                    width={600}
                    height={300}
                    className="w-full h-full object-cover"
                    data-ai-hint="map location family"
                  />
                </div>

                {editingNotesTaskId === task.id && (
                  <motion.div initial={{ opacity:0, height:0}} animate={{ opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="space-y-2 mt-2">
                    <Textarea
                      placeholder="أضف ملاحظاتك عن الزيارة (اختياري)..."
                      value={currentServantNotes}
                      onChange={(e) => setCurrentServantNotes(e.target.value)}
                      rows={3}
                      className="transition-all duration-300 ease-in-out focus:ring-primary focus:border-primary text-sm"
                    />
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => toggleEditNotes(task.id)} className="w-full sm:w-auto">
                  <Edit3 className="me-2 h-4 w-4" /> 
                  {editingNotesTaskId === task.id ? "إخفاء الملاحظات" : "إضافة/تعديل ملاحظة"}
                </Button>
                {task.latitude && task.longitude && (
                    <Button asChild variant="secondary" className="w-full sm:w-auto">
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${task.latitude},${task.longitude}`} target="_blank" rel="noopener noreferrer">
                            <Map className="me-2 h-4 w-4" />
                            اذهب للموقع
                        </Link>
                    </Button>
                )}
                <Button onClick={() => handleMarkAsVisited(task.id)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="me-2 h-4 w-4" /> تمت الزيارة
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
