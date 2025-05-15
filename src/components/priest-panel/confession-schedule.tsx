
"use client";
import type { ConfessionAppointment, ConfessionStatus, PriestAvailability } from '@/types/priest-panel';
import { useState, useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Added import
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, AlertTriangle, Bell, CheckCircle, XCircle, Clock, CalendarDays, Settings, AlertCircle } from 'lucide-react';
import { format, parse, addMinutes, isWithinInterval, differenceInMinutes, isValid, getDay, formatISO, startOfDay } from 'date-fns';
import { arSA } from 'date-fns/locale';

const appointmentSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  day: z.string().min(1, { message: "يجب اختيار اليوم" }), // This will be derived from date
  date: z.date({ required_error: "يجب اختيار التاريخ" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "الوقت يجب أن يكون بصيغة HH:mm (24 ساعة)"}),
  status: z.enum(['قادم', 'تم', 'لم يحضر', 'ملغى']),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Helper to combine Date object (date part) and time string (HH:mm) into a new Date object
const combineDateAndTime = (dateObj: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(dateObj);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const initialAppointments: ConfessionAppointment[] = [
  { id: '1', name: 'يوحنا سمير', day: 'السبت', time: '17:00', status: 'قادم', datetime: combineDateAndTime(new Date('2024-08-24'), '17:00') },
  { id: '2', name: 'مريم فؤاد', day: 'السبت', time: '18:30', status: 'تم', datetime: combineDateAndTime(new Date('2024-08-17'), '18:30') },
  { id: '3', name: 'بطرس كامل', day: 'الأحد', time: '10:00', status: 'قادم', datetime: combineDateAndTime(new Date('2024-08-25'), '10:00') },
  { id: '4', name: 'جورج إبراهيم', day: 'السبت', time: '19:00', status: 'لم يحضر', datetime: combineDateAndTime(new Date('2024-08-17'), '19:00') },
].map(app => ({...app, datetime: isValid(app.datetime) ? app.datetime : new Date() })).sort((a,b) => a.datetime.getTime() - b.datetime.getTime());


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
    'ملغى': <Bell className="h-4 w-4" />
};

const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const dayToIndexMap: { [key: string]: number } = { "الأحد": 0, "الاثنين": 1, "الثلاثاء": 2, "الأربعاء": 3, "الخميس": 4, "الجمعة": 5, "السبت": 6 };


export default function ConfessionSchedule() {
  const [appointments, setAppointments] = useState<ConfessionAppointment[]>(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<ConfessionAppointment | null>(null);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const [priestAvailability, setPriestAvailability] = useState<PriestAvailability>({});
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  
  const [isCancelRescheduleModalOpen, setIsCancelRescheduleModalOpen] = useState(false);
  const [dateToCancel, setDateToCancel] = useState<Date | undefined>();
  const [newDateForReschedule, setNewDateForReschedule] = useState<Date | undefined>();
  const [newTimeForReschedule, setNewTimeForReschedule] = useState<string>("");


  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const upcomingAlerts = useMemo(() => {
    if (!currentTime) return [];
    const now = currentTime;
    const alertWindowEnd = addMinutes(now, 30);
    return appointments.filter(
      (app) => app.status === 'قادم' && isValid(app.datetime) && isWithinInterval(app.datetime, { start: now, end: alertWindowEnd })
    );
  }, [appointments, currentTime]);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { name: '', day: '', time: '', status: 'قادم', notes: ''}
  });

  const availabilityForm = useForm<PriestAvailability>();
  
  useEffect(() => {
    if (isAvailabilityModalOpen) {
      availabilityForm.reset(priestAvailability);
    }
  }, [isAvailabilityModalOpen, priestAvailability, availabilityForm]);


  const handleSaveAvailability: SubmitHandler<PriestAvailability> = (data) => {
    const newAvailability: PriestAvailability = {};
    daysOfWeek.forEach(day => {
      const dayData = data[day as keyof PriestAvailability] as any; // Temp any for easier access
      if (dayData && dayData.enabled && dayData.startTime && dayData.endTime) {
        newAvailability[day] = { startTime: dayData.startTime, endTime: dayData.endTime };
      } else {
        newAvailability[day] = null;
      }
    });
    setPriestAvailability(newAvailability);
    toast({ title: "تم حفظ إعدادات التوافر!" });
    setIsAvailabilityModalOpen(false);
  };


  const onSubmit: SubmitHandler<AppointmentFormData> = (data) => {
    const newDatetime = combineDateAndTime(data.date, data.time);
    const dayName = format(data.date, 'EEEE', { locale: arSA });

    // Check priest availability
    const dayAvailability = priestAvailability[dayName];
    let availabilityWarning = false;
    if (dayAvailability) {
        if (data.time < dayAvailability.startTime || data.time > dayAvailability.endTime) {
            availabilityWarning = true;
        }
    } else { // Day not marked as available at all
      if (Object.keys(priestAvailability).length > 0 && Object.values(priestAvailability).some(slot => slot !== null)) { // Only warn if availability is set for *any* day
        availabilityWarning = true;
      }
    }

    if (availabilityWarning) {
        toast({
            title: "تحذير: الوقت خارج أوقات التوافر",
            description: `الموعد المحدد (${dayName} الساعة ${data.time}) خارج أوقات التوافر المحددة أو في يوم غير متاح.`,
            variant: "default", 
        });
    }

    if (editingAppointment) {
      setAppointments(prev => prev.map(app => app.id === editingAppointment.id ? { ...editingAppointment, ...data, datetime: newDatetime, day: dayName } : app).sort((a,b) => a.datetime.getTime() - b.datetime.getTime()));
      toast({ title: "تم تعديل الموعد بنجاح!" });
    } else {
      const newAppointment: ConfessionAppointment = { id: Date.now().toString(), ...data, datetime: newDatetime, day: dayName };
      setAppointments(prev => [...prev, newAppointment].sort((a,b) => a.datetime.getTime() - b.datetime.getTime()));
      toast({ title: "تم إضافة الموعد بنجاح!" });
    }
    form.reset({ name: '', day: '', time: '', status: 'قادم', notes: '', date: undefined });
    setEditingAppointment(null);
    setIsModalOpen(false);
  };

  const handleEdit = (appointment: ConfessionAppointment) => {
    setEditingAppointment(appointment);
    form.reset({
      name: appointment.name,
      day: appointment.day,
      date: appointment.datetime,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    toast({ title: "تم حذف الموعد", variant: "destructive" });
  };
  
  const openAddModal = () => {
    setEditingAppointment(null);
    form.reset({ name: '', day: '', time: '', status: 'قادم', notes: '', date: undefined });
    setIsModalOpen(true);
  }

  const appointmentsOnDateToCancel = useMemo(() => {
    if (!dateToCancel) return [];
    const selectedDateStart = startOfDay(dateToCancel);
    return appointments.filter(app => isValid(app.datetime) && startOfDay(app.datetime).getTime() === selectedDateStart.getTime() && app.status === 'قادم');
  }, [dateToCancel, appointments]);

  const handleConfirmReschedule = () => {
    if (!dateToCancel || !newDateForReschedule || !newTimeForReschedule || appointmentsOnDateToCancel.length === 0) {
      toast({ title: "بيانات غير مكتملة", description: "يرجى تحديد اليوم المُراد إلغاؤه واليوم والوقت الجديد للترحيل.", variant: "destructive" });
      return;
    }

    const updatedAppointments = appointments.map(app => {
      if (appointmentsOnDateToCancel.find(a => a.id === app.id)) {
        const newDatetime = combineDateAndTime(newDateForReschedule, newTimeForReschedule);
        return {
          ...app,
          datetime: newDatetime,
          day: format(newDateForReschedule, 'EEEE', { locale: arSA }),
          time: newTimeForReschedule,
          status: 'قادم' as ConfessionStatus, // Ensure it's marked as upcoming
          notes: `${app.notes || ''} (تم الترحيل من ${format(dateToCancel, 'PPPp', { locale: arSA })})`.trim(),
          originalDatetime: app.datetime,
        };
      }
      return app;
    }).sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
    
    setAppointments(updatedAppointments);
    toast({ title: "تم ترحيل المواعيد بنجاح!" });
    setIsCancelRescheduleModalOpen(false);
    setDateToCancel(undefined);
    setNewDateForReschedule(undefined);
    setNewTimeForReschedule("");
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AnimatePresence>
        {upcomingAlerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200 dark:border-yellow-600 rounded-md shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <Bell className="h-6 w-6 me-3 animate-pulse" />
              <div>
                <p className="font-bold">تنبيه موعد قريب!</p>
                <p>{alert.name} - {alert.day} الساعة {isValid(alert.datetime) ? format(alert.datetime, 'hh:mm a', { locale: arSA }) : '--:--'} (بعد {currentTime && isValid(alert.datetime) ? differenceInMinutes(alert.datetime, currentTime) : 'دقائق'} دقيقة)</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => {/* Mark as seen or dismiss logic */}}>إخفاء</Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>جدول مواعيد الاعتراف</CardTitle>
            <CardDescription>قائمة بجميع مواعيد الاعتراف المسجلة وأوقات التوافر.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <Dialog open={isAvailabilityModalOpen} onOpenChange={setIsAvailabilityModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Settings className="me-2 h-5 w-5" /> إدارة التوافر</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>إدارة أوقات التوافر للاعترافات</DialogTitle></DialogHeader>
                <Form {...availabilityForm}>
                  <form onSubmit={availabilityForm.handleSubmit(handleSaveAvailability)} className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    {daysOfWeek.map((day, index) => (
                      <Card key={day} className="p-4">
                         <FormField
                            control={availabilityForm.control}
                            name={`${day}.enabled` as any}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rtl:space-x-reverse mb-3">
                                 <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="font-semibold text-md">{day}</FormLabel>
                                </FormItem>
                            )}
                            />
                        {availabilityForm.watch(`${day}.enabled` as any) && (
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={availabilityForm.control} name={`${day}.startTime` as any} render={({ field }) => (
                              <FormItem>
                                <FormLabel>من الساعة</FormLabel>
                                <FormControl><Input type="time" {...field} /></FormControl>
                              </FormItem>
                            )} />
                            <FormField control={availabilityForm.control} name={`${day}.endTime` as any} render={({ field }) => (
                              <FormItem>
                                <FormLabel>حتى الساعة</FormLabel>
                                <FormControl><Input type="time" {...field} /></FormControl>
                              </FormItem>
                            )} />
                          </div>
                        )}
                      </Card>
                    ))}
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                      <Button type="submit">حفظ الإعدادات</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCancelRescheduleModalOpen} onOpenChange={setIsCancelRescheduleModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><CalendarDays className="me-2 h-5 w-5" /> إلغاء يوم وترحيل</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>إلغاء يوم وترحيل المواعيد</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="dateToCancelCalendar">اختر اليوم المُراد إلغاؤه:</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="dateToCancelCalendar" variant={"outline"} className="w-full justify-start text-left font-normal mt-1">
                          <CalendarDays className="me-2 h-4 w-4" />
                          {dateToCancel ? format(dateToCancel, "PPP", { locale: arSA }) : <span>اختر تاريخًا</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateToCancel} onSelect={setDateToCancel} initialFocus locale={arSA} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {dateToCancel && appointmentsOnDateToCancel.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border p-2 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">المواعيد في هذا اليوم ({appointmentsOnDateToCancel.length}):</h4>
                      <ul className="text-xs list-disc ps-5">
                        {appointmentsOnDateToCancel.map(app => <li key={app.id}>{app.name} - {app.time}</li>)}
                      </ul>
                    </div>
                  )}
                  {dateToCancel && appointmentsOnDateToCancel.length === 0 && (
                    <p className="text-sm text-muted-foreground">لا توجد مواعيد قادمة في هذا اليوم لإلغائها.</p>
                  )}

                  {appointmentsOnDateToCancel.length > 0 && (
                    <>
                      <div>
                        <Label htmlFor="newDateForRescheduleCalendar">اختر اليوم الجديد للترحيل إليه:</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button id="newDateForRescheduleCalendar" variant={"outline"} className="w-full justify-start text-left font-normal mt-1">
                              <CalendarDays className="me-2 h-4 w-4" />
                              {newDateForReschedule ? format(newDateForReschedule, "PPP", { locale: arSA }) : <span>اختر تاريخًا جديدًا</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newDateForReschedule} onSelect={setNewDateForReschedule} initialFocus locale={arSA} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="newTimeForRescheduleInput">الوقت الجديد للترحيل (HH:mm):</Label>
                        <Input id="newTimeForRescheduleInput" type="time" value={newTimeForReschedule} onChange={(e) => setNewTimeForReschedule(e.target.value)} className="mt-1" />
                      </div>
                    </>
                  )}
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                    <Button onClick={handleConfirmReschedule} disabled={appointmentsOnDateToCancel.length === 0 || !newDateForReschedule || !newTimeForReschedule}>تأكيد الترحيل</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddModal}><PlusCircle className="me-2 h-5 w-5" /> إضافة موعد</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader><DialogTitle>{editingAppointment ? 'تعديل موعد' : 'إضافة موعد جديد'}</DialogTitle></DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < startOfDay(new Date())} initialFocus locale={arSA} />
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )} />

                    <FormField control={form.control} name="time" render={({ field }) => (
                      <FormItem><FormLabel>الساعة (صيغة 24 ساعة)</FormLabel><FormControl><Input type="time" placeholder="مثال: 17:00" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    {form.watch("date") && form.watch("time") && 
                     priestAvailability[format(form.watch("date")!, 'EEEE', { locale: arSA })] === null &&
                     Object.keys(priestAvailability).length > 0 && Object.values(priestAvailability).some(slot => slot !== null) && (
                        <p className="text-xs text-yellow-600 flex items-center"><AlertCircle className="h-4 w-4 me-1"/>هذا اليوم غير محدد ضمن أيام التوافر.</p>
                    )}
                    {form.watch("date") && form.watch("time") && 
                     priestAvailability[format(form.watch("date")!, 'EEEE', { locale: arSA })] && 
                     (form.watch("time") < priestAvailability[format(form.watch("date")!, 'EEEE', { locale: arSA })]!.startTime || 
                      form.watch("time") > priestAvailability[format(form.watch("date")!, 'EEEE', { locale: arSA })]!.endTime) && (
                        <p className="text-xs text-yellow-600 flex items-center"><AlertCircle className="h-4 w-4 me-1"/>الوقت المحدد خارج نطاق التوافر لهذا اليوم.</p>
                    )}


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
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                      <Button type="submit">{editingAppointment ? 'حفظ التعديلات' : 'إضافة الموعد'}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
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
                    <TableHead>اليوم والتاريخ</TableHead>
                    <TableHead>الساعة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>ملاحظات</TableHead>
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
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{appointment.name}</TableCell>
                        <TableCell>{isValid(appointment.datetime) ? format(appointment.datetime, "EEEE, PPP", { locale: arSA }) : 'تاريخ غير صالح'}</TableCell>
                        <TableCell>{isValid(appointment.datetime) ? format(appointment.datetime, 'hh:mm a', { locale: arSA }) : '--:--'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center w-fit ${statusStyles[appointment.status]}`}>
                            {statusIcons[appointment.status]}
                            <span className="ms-1">{appointment.status}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={appointment.notes}>{appointment.notes || '-'}</TableCell>
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

