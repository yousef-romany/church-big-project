
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

import { getEvents } from '@/lib/events-store';
import type { ChurchEvent } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MyScheduleView() {
    const [schedule, setSchedule] = useState<ChurchEvent[]>([]);

    useEffect(() => {
        setSchedule(getEvents());
    }, []);


  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>الجدول الزمني للفعاليات والاجتماعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((item) => (
              <motion.div key={item.id} variants={cardVariants}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                        <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                        <Badge variant="outline" className="text-xs bg-yellow-400/20 text-yellow-700 border-yellow-500/50 self-start">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="ms-1.5 font-bold">+{item.points} نقطة</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center">
                          <Calendar className="me-2 h-4 w-4" /> {format(item.datetime, 'EEEE, d MMMM yyyy', { locale: arSA })}
                        </p>
                         <p className="flex items-center">
                          <Clock className="me-2 h-4 w-4" /> {format(item.datetime, 'hh:mm a', { locale: arSA })}
                        </p>
                         <p className="text-xs mt-2">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm bg-muted p-2 rounded-md">
                      <MapPin className="me-2 h-4 w-4 text-primary shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
             {schedule.length === 0 && (
                <p className="text-center text-muted-foreground py-4">لا توجد فعاليات مجدولة حاليًا.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
