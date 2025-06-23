
"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScheduleItem {
  id: string;
  title: string;
  day: string;
  time: string;
  location: string;
  type: 'service' | 'spiritual' | 'educational';
}

const mockSchedule: ScheduleItem[] = [
  { id: 's1', title: 'مدارس الأحد', day: 'الجمعة', time: '9:00 ص - 12:00 م', location: 'مبنى مدارس الأحد', type: 'educational' },
  { id: 's2', title: 'اجتماع الشباب', day: 'الجمعة', time: '7:00 م - 9:00 م', location: 'قاعة البابا كيرلس', type: 'spiritual' },
  { id: 's3', title: 'القداس الإلهي', day: 'الأحد', time: '8:00 ص - 10:30 ص', location: 'الكنيسة الرئيسية', type: 'spiritual' },
  { id: 's4', title: 'فصل الألحان', day: 'السبت', time: '6:00 م - 7:30 م', location: 'قاعة الأنبا أبرآم', type: 'educational' },
  { id: 's5', title: 'يوم الخدمة المجتمعية', day: 'السبت الأول من كل شهر', time: '10:00 ص - 2:00 م', location: 'مكتب الخدمة', type: 'service' },
];

const typeStyles: Record<ScheduleItem['type'], { label: string, icon: JSX.Element, color: string }> = {
  educational: { label: 'تعليمي', icon: <Users className="h-4 w-4" />, color: 'bg-blue-500/10 text-blue-600 border-blue-500/50' },
  spiritual: { label: 'روحي', icon: <Heart className="h-4 w-4" />, color: 'bg-purple-500/10 text-purple-600 border-purple-500/50' },
  service: { label: 'خدمي', icon: <Users className="h-4 w-4" />, color: 'bg-green-500/10 text-green-600 border-green-500/50' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MyScheduleView() {
  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>الجدول الأسبوعي للأنشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSchedule.map((item) => (
              <motion.div key={item.id} variants={cardVariants}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                        <Badge variant="outline" className={`text-xs ${typeStyles[item.type].color}`}>
                          {typeStyles[item.type].icon}
                          <span className="ms-1.5">{typeStyles[item.type].label}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center">
                          <Calendar className="me-2 h-4 w-4" /> {item.day}
                        </p>
                         <p className="flex items-center">
                          <Clock className="me-2 h-4 w-4" /> {item.time}
                        </p>
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
