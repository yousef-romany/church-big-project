"use client";
import type { ConfessionAppointment } from '@/types/priest-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isValid } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { ChevronRight, ChevronLeft, Edit, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarViewProps {
  appointments: ConfessionAppointment[];
  onEdit: (appointment: ConfessionAppointment) => void;
  onDelete: (id: string) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
}

const statusColors: Record<string, string> = {
  'قادم': 'bg-blue-500',
  'تم': 'bg-green-500',
  'لم يحضر': 'bg-red-500',
  'ملغى': 'bg-gray-500',
};

export default function CalendarView({ 
  appointments, 
  onEdit, 
  onDelete, 
  month, 
  onMonthChange 
}: CalendarViewProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add days from previous month to fill the first week
  const startDay = monthStart.getDay();
  const prevMonthDays = startDay > 0 
    ? eachDayOfInterval({ 
        start: new Date(monthStart.getFullYear(), monthStart.getMonth(), -startDay + 1), 
        end: new Date(monthStart.getFullYear(), monthStart.getMonth(), 0) 
      })
    : [];
  
  // Add days from next month to fill the last week
  const endDay = monthEnd.getDay();
  const nextMonthDays = endDay < 6 
    ? eachDayOfInterval({ 
        start: new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + 1), 
        end: new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + (6 - endDay)) 
      })
    : [];
  
  const allDays = [...prevMonthDays, ...monthDays, ...nextMonthDays];
  
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => 
      isValid(new Date(apt.datetime)) && isSameDay(new Date(apt.datetime), day)
    );
  };

  const handlePreviousMonth = () => {
    onMonthChange(subMonths(month, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(month, 1));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl">
            {format(month, 'MMMM yyyy', { locale: arSA })}
          </CardTitle>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {allDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isCurrentMonth = isSameMonth(day, month);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.div
                key={index}
                className={`min-h-[80px] p-1 border rounded-md ${
                  isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                } ${isToday ? 'ring-2 ring-primary' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                <div className="text-xs font-medium text-center mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1 overflow-hidden">
                  {dayAppointments.slice(0, 2).map((appointment, aptIndex) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: aptIndex * 0.05 }}
                      className="group relative"
                    >
                      <div 
                        className={`text-xs p-1 rounded text-white cursor-pointer truncate ${statusColors[appointment.status]}`}
                        onClick={() => onEdit(appointment)}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(appointment.datetime), 'HH:mm')}
                        </div>
                        <div className="font-medium truncate">{appointment.name}</div>
                      </div>
                      
                      {/* Actions on hover */}
                      <div className="absolute top-0 right-0 bg-white shadow-lg rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(appointment);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(appointment.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-center">
                      <Badge variant="outline" className="text-[10px]">
                        +{dayAppointments.length - 2} آخرين
                      </Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}