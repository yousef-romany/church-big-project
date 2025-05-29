
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppointmentsListDisplay from '@/components/priest-panel/AppointmentsListDisplay';
import type { ConfessionAppointment } from '@/types/priest-panel';
import { getAppointments, updateAppointment, deleteAppointment } from '@/lib/appointments-store';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay, isEqual } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { combineDateAndTime } from '@/lib/appointments-store';
import type { ConfessionStatus } from '@/types/priest-panel';
import { CalendarDays, AlertCircle } from 'lucide-react';

const appointmentSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  date: z.date({ required_error: "يجب اختيار التاريخ" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "الوقت يجب أن يكون بصيغة HH:mm (24 ساعة)"}),
  status: z.enum(['قادم', 'تم', 'لم يحضر', 'ملغى']),
  notes: z.string().optional(),
  durationMinutes: z.number().min(15, {message: "المدة يجب ألا تقل عن 15 دقيقة"}).max(120, {message: "المدة يجب ألا تزيد عن 120 دقيقة"}).default(30),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentsPlanPage() {
  const [appointments, setAppointments] = useState<ConfessionAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<ConfessionAppointment | null>(null);
  const { toast } = useToast();
  const priestAvailability = typeof window !== 'undefined' ? getAppointmentsStoreModule().getPriestAvailability() : {}; // Helper for availability check

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { name: '', time: '', status: 'قادم', notes: '', durationMinutes: 30}
  });

  // Helper to safely import appointments-store module only on client
  const getAppointmentsStoreModule = () => require('@/lib/appointments-store');


  useEffect(() => {
    const store = getAppointmentsStoreModule();
    setAppointments(store.getAppointments().sort((a: ConfessionAppointment, b: ConfessionAppointment) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
    setIsLoading(false);
  }, []);

  const handleEdit = (appointment: ConfessionAppointment) => {
    setEditingAppointment(appointment);
    form.reset({
      name: appointment.name,
      date: new Date(appointment.datetime),
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes || '',
      durationMinutes: appointment.durationMinutes || 30,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const store = getAppointmentsStoreModule();
    store.deleteAppointment(id);
    setAppointments(prev => prev.filter(app => app.id !== id));
    toast({ title: "تم حذف الموعد", variant: "destructive" });
  };

  const onEditSubmit: SubmitHandler<AppointmentFormData> = (data) => {
    if (!editingAppointment) return;
    const store = getAppointmentsStoreModule();
    const newDatetime = store.combineDateAndTime(data.date, data.time);
    const dayName = format(data.date, 'EEEE', { locale: arSA });

    const dayAvailability = priestAvailability[dayName];
    let availabilityWarning = false;
    if (dayAvailability && dayAvailability.enabled) {
        if (data.time < dayAvailability.startTime || data.time > dayAvailability.endTime) {
            availabilityWarning = true;
        }
    } else {
      if (Object.values(priestAvailability).some(slot => slot && slot.enabled)) {
        availabilityWarning = true;
      }
    }

    if (availabilityWarning) {
        toast({
            title: "تحذير: الوقت خارج أوقات التوافر",
            description: `الموعد المحدد (${dayName} الساعة ${data.time}) خارج أوقات التوافر المحددة أو في يوم غير متاح. تم حفظ الموعد على أي حال.`,
            variant: "default",
            duration: 7000,
        });
    }

    const updatedAppt = { 
      ...editingAppointment, 
      ...data, 
      datetime: newDatetime, 
      day: dayName,
      durationMinutes: data.durationMinutes || 30 
    };
    store.updateAppointment(updatedAppt);
    setAppointments(prev => prev.map(app => app.id === editingAppointment.id ? updatedAppt : app).sort((a: ConfessionAppointment, b: ConfessionAppointment) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
    toast({ title: "تم تعديل الموعد بنجاح!" });
    form.reset();
    setEditingAppointment(null);
    setIsEditModalOpen(false);
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>جاري تحميل خطة المواعيد...</p></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">خطة مواعيد الاعتراف</h1>
        <p className="text-muted-foreground">عرض مفصل لجميع مواعيد الاعتراف المسجلة مع إمكانيات الفلترة.</p>
      </div>
      
      <AppointmentsListDisplay 
        appointments={appointments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>تعديل موعد</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>اسم المعترف</FormLabel><FormControl><Input placeholder="مثال: يوحنا سمير" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem className="flex flex-col">
                      <FormLabel>التاريخ</FormLabel>
                      <Popover>
                      <PopoverTrigger asChild>
                          <FormControl>
                          <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                              <CalendarDays className="me-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP", { locale: arSA }) : <span>اختر تاريخًا</span>}
                          </Button>
                          </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => isBefore(date, startOfDay(new Date())) && !isEqual(date, startOfDay(new Date()))} initialFocus locale={arSA} />
                      </PopoverContent>
                      </Popover>
                      <FormMessage />
                  </FormItem>
                  )} />

              <FormField control={form.control} name="time" render={({ field }) => (
                <FormItem><FormLabel>الساعة (صيغة 24 ساعة)</FormLabel><FormControl><Input type="time" placeholder="مثال: 17:00" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مدة الاعتراف (بالدقائق)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="مثال: 30" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || 30)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              {form.watch("date") && form.watch("time") && (() => {
                  const selectedDate = form.watch("date");
                  const selectedTime = form.watch("time");
                  if (!selectedDate || !selectedTime) return null;

                  const dayName = format(selectedDate, 'EEEE', { locale: arSA });
                  const dayAvail = priestAvailability[dayName];

                  if (dayAvail === null || !dayAvail?.enabled) {
                       if (Object.values(priestAvailability).some(slot => slot && slot.enabled)) {
                          return <p className="text-xs text-yellow-600 flex items-center"><AlertCircle className="h-4 w-4 me-1"/>هذا اليوم غير محدد ضمن أيام التوافر.</p>;
                       }
                  } else if (dayAvail && dayAvail.enabled && (selectedTime < dayAvail.startTime || selectedTime > dayAvail.endTime)) {
                      return <p className="text-xs text-yellow-600 flex items-center"><AlertCircle className="h-4 w-4 me-1"/>الوقت المحدد خارج نطاق التوافر لهذا اليوم ({dayAvail.startTime} - {dayAvail.endTime}).</p>;
                  }
                  return null;
              })()}


              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>الحالة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {(['قادم', 'تم', 'لم يحضر', 'ملغى'] as ConfessionStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
               <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>ملاحظات (اختياري)</FormLabel><FormControl><Input placeholder="ملاحظات عن الموعد..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                <Button type="submit">حفظ التعديلات</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

    