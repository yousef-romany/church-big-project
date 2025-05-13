
"use client";
import type { ConfessionAppointment, ConfessionStatus } from '@/types/priest-panel';
import { useState, useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, AlertTriangle, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format, parse, addMinutes, isWithinInterval, differenceInMinutes } from 'date-fns';
import { arSA } from 'date-fns/locale'; // Arabic locale

const appointmentSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  day: z.string().min(1, { message: "يجب اختيار اليوم" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "الوقت يجب أن يكون بصيغة HH:mm (24 ساعة)"}),
  status: z.enum(['قادم', 'تم', 'لم يحضر', 'ملغى']),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const initialAppointments: ConfessionAppointment[] = [
  { id: '1', name: 'يوحنا سمير', day: 'السبت', time: '17:00', status: 'قادم', datetime: parse('2024-08-24 17:00', 'yyyy-MM-dd HH:mm', new Date()) },
  { id: '2', name: 'مريم فؤاد', day: 'السبت', time: '18:30', status: 'تم', datetime: parse('2024-08-17 18:30', 'yyyy-MM-dd HH:mm', new Date()) },
  { id: '3', name: 'بطرس كامل', day: 'الأحد', time: '10:00', status: 'قادم', datetime: parse('2024-08-25 10:00', 'yyyy-MM-dd HH:mm', new Date()) },
  { id: '4', name: 'جورج إبراهيم', day: 'السبت', time: '19:00', status: 'لم يحضر', datetime: parse('2024-08-17 19:00', 'yyyy-MM-dd HH:mm', new Date()) },
];

// Helper to get a realistic future or past date based on day string
const getDatetimeFromDayTime = (day: string, time: string): Date => {
    const daysMap: { [key: string]: number } = { 'الأحد': 0, 'الاثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4, 'الجمعة': 5, 'السبت': 6 };
    const targetDay = daysMap[day];
    const now = new Date();
    let resultDate = new Date(now);
    resultDate.setDate(now.getDate() + (targetDay - now.getDay() + 7) % 7); // Get next occurrence of the day
    const [hours, minutes] = time.split(':').map(Number);
    resultDate.setHours(hours, minutes, 0, 0);

    // If the resulting time is in the past for today, move to next week unless it's for "تم" or "لم يحضر"
    if (resultDate < now && (status !== 'تم' && status !== 'لم يحضر')) {
        resultDate.setDate(resultDate.getDate() + 7);
    }
    return resultDate;
};


initialAppointments.forEach(app => {
    app.datetime = getDatetimeFromDayTime(app.day, app.time);
});


const statusStyles: Record<ConfessionStatus, string> = {
  'تم': 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200',
  'لم يحضر': 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200',
  'قادم': 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200',
  'ملغى': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
};

const statusIcons: Record<ConfessionStatus, JSX.Element> = {
    'تم': <CheckCircle className="h-4 w-4" />,
    'لم يحضر': <XCircle className="h-4 w-4" />,
    'قادم': <Clock className="h-4 w-4" />,
    'ملغى': <Bell className="h-4 w-4" /> // Example, could be something else
};

const daysOfWeek = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export default function ConfessionSchedule() {
  const [appointments, setAppointments] = useState<ConfessionAppointment[]>(initialAppointments.sort((a,b) => a.datetime.getTime() - b.datetime.getTime()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<ConfessionAppointment | null>(null);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const upcomingAlerts = useMemo(() => {
    const now = currentTime;
    const alertWindowEnd = addMinutes(now, 30); // Alert for appointments within the next 30 minutes
    return appointments.filter(
      (app) => app.status === 'قادم' && isWithinInterval(app.datetime, { start: now, end: alertWindowEnd })
    );
  }, [appointments, currentTime]);


  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit: SubmitHandler<AppointmentFormData> = (data) => {
    const datetime = getDatetimeFromDayTime(data.day, data.time);
    if (editingAppointment) {
      setAppointments(prev => prev.map(app => app.id === editingAppointment.id ? { ...editingAppointment, ...data, datetime } : app).sort((a,b) => a.datetime.getTime() - b.datetime.getTime()));
      toast({ title: "تم تعديل الموعد بنجاح!" });
    } else {
      const newAppointment: ConfessionAppointment = { id: Date.now().toString(), ...data, datetime };
      setAppointments(prev => [...prev, newAppointment].sort((a,b) => a.datetime.getTime() - b.datetime.getTime()));
      toast({ title: "تم إضافة الموعد بنجاح!" });
    }
    form.reset({ name: '', day: '', time: '', status: 'قادم'});
    setEditingAppointment(null);
    setIsModalOpen(false);
  };

  const handleEdit = (appointment: ConfessionAppointment) => {
    setEditingAppointment(appointment);
    form.reset(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    toast({ title: "تم حذف الموعد", variant: "destructive" });
  };
  
  const openAddModal = () => {
    setEditingAppointment(null);
    form.reset({ name: '', day: '', time: '', status: 'قادم'});
    setIsModalOpen(true);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {upcomingAlerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200 dark:border-yellow-600 rounded-md shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <Bell className="h-6 w-6 me-3 animate-pulse" />
              <div>
                <p className="font-bold">تنبيه موعد قريب!</p>
                <p>{alert.name} - {alert.day} الساعة {format(alert.datetime, 'hh:mm a', { locale: arSA })} (بعد {differenceInMinutes(alert.datetime, currentTime)} دقيقة)</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => {/* Mark as seen or dismiss */}}>إخفاء</Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>جدول مواعيد الاعتراف</CardTitle>
            <CardDescription>قائمة بجميع مواعيد الاعتراف المسجلة.</CardDescription>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddModal} className="motion-safe:animate-pulse hover:animate-none">
                <PlusCircle className="me-2 h-5 w-5" /> إضافة موعد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingAppointment ? 'تعديل موعد' : 'إضافة موعد جديد'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المعترف</FormLabel>
                      <FormControl><Input placeholder="مثال: يوحنا سمير" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="day" render={({ field }) => (
                    <FormItem>
                      <FormLabel>اليوم</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="اختر اليوم" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="time" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الساعة (صيغة 24 ساعة)</FormLabel>
                      <FormControl><Input type="time" placeholder="مثال: 17:00" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الحالة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {(['قادم', 'تم', 'لم يحضر', 'ملغى'] as ConfessionStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                    <Button type="submit">{editingAppointment ? 'حفظ التعديلات' : 'إضافة الموعد'}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد مواعيد حاليًا.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المعترف</TableHead>
                    <TableHead>اليوم</TableHead>
                    <TableHead>الساعة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-left">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {appointments.map((appointment) => (
                      <motion.tr
                        key={appointment.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{appointment.name}</TableCell>
                        <TableCell>{appointment.day}</TableCell>
                        <TableCell>{format(appointment.datetime, 'hh:mm a', { locale: arSA })}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center w-fit ${statusStyles[appointment.status]}`}>
                            {statusIcons[appointment.status]}
                            <span className="ms-1">{appointment.status}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-left space-x-1 rtl:space-x-reverse">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment)} className="text-blue-500 hover:text-blue-700">
                            <Edit2 className="h-4 w-4" /> <span className="sr-only">تعديل</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" /> <span className="sr-only">حذف</span>
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

