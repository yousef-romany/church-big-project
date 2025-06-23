
"use client";
import type { CompletedServantTask } from '@/types/servant-panel';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, MapPin, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { getCompletedTasksForServant } from '@/lib/visitation-tasks-store';

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.9 },
};

interface CompletedTasksHistoryProps {
    servantId: string;
}

export default function CompletedTasksHistory({ servantId }: CompletedTasksHistoryProps) {
  const [completedTasks, setCompletedTasks] = useState<CompletedServantTask[]>([]);

  useEffect(() => {
    setCompletedTasks(getCompletedTasksForServant(servantId));
  }, [servantId]);


  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      {completedTasks.length === 0 && (
        <motion.p variants={cardVariants} className="text-center text-muted-foreground py-8 text-lg">
          لا توجد مهام منجزة بعد.
        </motion.p>
      )}
      <AnimatePresence>
        {completedTasks.map((task) => (
          <motion.div key={task.id} variants={cardVariants} layout>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <CardHeader className="bg-card-foreground/5 dark:bg-card-foreground/10">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold flex items-center">
                        <User className="me-2 h-6 w-6 text-primary" /> {task.familyName}
                    </CardTitle>
                    {task.completedAt && (
                        <Badge variant="outline" className="border-green-500 text-green-600 bg-green-500/10">
                            <CalendarCheck className="me-1 h-4 w-4" /> 
                            {format(new Date(task.completedAt), 'd MMMM yyyy, hh:mm a', { locale: arSA })}
                        </Badge>
                    )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
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
                    data-ai-hint="map location family visited"
                  />
                </div>
                {task.servantNotes && (
                  <div className="pt-2">
                    <h4 className="font-semibold text-sm flex items-center text-primary">
                        <MessageSquare className="me-2 h-4 w-4"/> ملاحظاتي:
                    </h4>
                    <p className="text-muted-foreground text-sm mt-1 p-2 bg-muted/50 rounded-md whitespace-pre-line">{task.servantNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
