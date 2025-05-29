
"use client";
import type { ConfessionAppointment, ConfessionStatus, PriestAvailability, PriestAvailabilitySlot } from '@/types/priest-panel';
import { useState, useEffect, useMemo } from 'react'; // Added useMemo here
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { PlusCircle, CalendarDays, Settings, AlertCircle, XCircle as ClearFilterIcon, CalendarClock, CalendarPlus, CalendarRange, Edit2, Trash2 } from 'lucide-react';
import { format, isValid, parse, isBefore, isEqual, startOfDay, addDays } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { 
  getAppointments, 
  addAppointment as addAppointmentToStore, 
  updateAppointment as updateAppointmentInStore, 
  deleteAppointment as deleteAppointmentFromStore,
  getPriestAvailability, 
  setPriestAvailability as setPriestAvailabilityInStore,
  combineDateAndTime,
  saveAppointments
} from '@/lib/appointments-store';
import AppointmentsListDisplay from './AppointmentsListDisplay'; 


const appointmentSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  date: z.date({ required_error: "يجب اختيار التاريخ" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "الوقت يجب أن يكون بصيغة HH:mm (24 ساعة)"}),
  status: z.enum(['قادم', 'تم', 'لم يحضر', 'ملغى']),
  notes: z.string().optional(),
  durationMinutes: z.number().min(15, {message: "مدة الاعتراف يجب ألا تقل عن 15 دقيقة"}).max(120, {message: "مدة الاعتراف يجب ألا تزيد عن 120 دقيقة"}).default(30),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];


export default function ConfessionSchedule() {
  const [appointments, setAppointments] = useState<ConfessionAppointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<ConfessionAppointment | null>(null);
  const { toast } = useToast();
  
  const [priestAvailability, setLocalPriestAvailability] = useState<PriestAvailability>({});
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  
  const [isCancelRescheduleModalOpen, setIsCancelRescheduleModalOpen] = useState(false);
  const [dateToCancel, setDateToCancel] = useState<Date | undefined>();
  const [newDateForReschedule, setNewDateForReschedule] = useState<Date | undefined>();
  const [newTimeForReschedule, setNewTimeForReschedule] = useState<string>("");

  useEffect(() => {
    const loadedAppointments = getAppointments().sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    setAppointments(loadedAppointments);
    
    const loadedAvailability = getPriestAvailability();
    setLocalPriestAvailability(loadedAvailability);
    availabilityForm.reset(loadedAvailability); 

  }, []);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { name: '', time: '', status: 'قادم', notes: '', durationMinutes: 30}
  });

  const availabilityForm = useForm<PriestAvailability>({
    defaultValues: getPriestAvailability() 
  });
  
  useEffect(() => {
    if (isAvailabilityModalOpen) {
      availabilityForm.reset(priestAvailability);
    }
  }, [isAvailabilityModalOpen, priestAvailability, availabilityForm]);


  const handleSaveAvailability: SubmitHandler<PriestAvailability> = (data) => {
    const newAvailability: PriestAvailability = {};
    let hasError = false;

    daysOfWeek.forEach(day => {
      const dayKey = day as keyof PriestAvailability;
      const dayData = data[dayKey] as PriestAvailabilitySlot | undefined | null;

      if (dayData && dayData.enabled) {
        if (!dayData.startTime || !dayData.endTime) {
          toast({ title: `خطأ في يوم ${day}`, description: "يجب تحديد وقت البداية والنهاية لليوم المفعّل.", variant: "destructive" });
          hasError = true;
          newAvailability[dayKey] = { startTime: dayData.startTime || "", endTime: dayData.endTime || "", enabled: true }; 
          return; 
        }

        const baseDate = new Date();
        const parsedStartTime = parse(dayData.startTime, 'HH:mm', baseDate);
        const parsedEndTime = parse(dayData.endTime, 'HH:mm', baseDate);

        if (!isValid(parsedStartTime) || !isValid(parsedEndTime)) {
            toast({ title: `خطأ في يوم ${day}`, description: "صيغة الوقت غير صالحة.", variant: "destructive" });
            hasError = true;
            newAvailability[dayKey] = { ...dayData }; 
            return; 
        }

        if (isBefore(parsedEndTime, parsedStartTime) || isEqual(parsedEndTime, parsedStartTime)) {
            toast({ title: `خطأ في يوم ${day}`, description: "وقت النهاية يجب أن يكون بعد وقت البداية وبفارق زمني.", variant: "destructive" });
            hasError = true;
            newAvailability[dayKey] = { ...dayData }; 
            return; 
        }
        newAvailability[dayKey] = { startTime: dayData.startTime, endTime: dayData.endTime, enabled: true };
      } else {
        newAvailability[dayKey] = { startTime: dayData?.startTime || "", endTime: dayData?.endTime || "", enabled: false };
      }
    });

    if (hasError) {
      availabilityForm.reset(newAvailability); 
      setLocalPriestAvailability(newAvailability); 
      toast({ title: "خطأ في الحفظ", description: "يرجى تصحيح أخطاء التوافر الموضحة ثم حاول الحفظ مرة أخرى.", variant: "destructive", duration: 7000 });
      return;
    }

    setPriestAvailabilityInStore(newAvailability);
    setLocalPriestAvailability(newAvailability); 
    availabilityForm.reset(newAvailability); 
    toast({ title: "تم حفظ إعدادات التوافر بنجاح!" });
    setIsAvailabilityModalOpen(false);
  };


  const onSubmit: SubmitHandler<AppointmentFormData> = (data) => {
    const newDatetime = combineDateAndTime(data.date, data.time);
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
    
    const appointmentData = { 
        ...data, 
        datetime: newDatetime, 
        day: dayName, 
        durationMinutes: data.durationMinutes || 30 
    };

    if (editingAppointment) {
      const updatedAppt = { ...editingAppointment, ...appointmentData };
      updateAppointmentInStore(updatedAppt);
      setAppointments(prev => prev.map(app => app.id === editingAppointment.id ? updatedAppt : app).sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
      toast({ title: "تم تعديل الموعد بنجاح!" });
    } else {
      const newAppointment = addAppointmentToStore(appointmentData);
      setAppointments(prev => [...prev, newAppointment].sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
      toast({ title: "تم إضافة الموعد بنجاح!" });
    }
    form.reset({ name: '', time: '', status: 'قادم', notes: '', date: undefined, durationMinutes: 30 });
    setEditingAppointment(null);
    setIsModalOpen(false);
  };

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
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAppointmentFromStore(id);
    setAppointments(prev => prev.filter(app => app.id !== id));
    toast({ title: "تم حذف الموعد", variant: "destructive" });
  };
  
  const openAddModal = () => {
    setEditingAppointment(null);
    form.reset({ name: '', time: '', status: 'قادم', notes: '', date: undefined, durationMinutes: 30 });
    setIsModalOpen(true);
  }

  const appointmentsOnDateToCancel = useMemo(() => {
    if (!dateToCancel) return [];
    const selectedDateStart = startOfDay(dateToCancel);
    return appointments.filter(app => isValid(new Date(app.datetime)) && isEqual(startOfDay(new Date(app.datetime)), selectedDateStart) && app.status === 'قادم');
  }, [dateToCancel, appointments]);

  const handleConfirmReschedule = () => {
    if (!dateToCancel || !newDateForReschedule || !newTimeForReschedule || appointmentsOnDateToCancel.length === 0) {
      toast({ title: "بيانات غير مكتملة", description: "يرجى تحديد اليوم المُراد إلغاؤه واليوم والوقت الجديد للترحيل.", variant: "destructive" });
      return;
    }

    const updatedAppointmentsList = [...appointments]; 

    appointmentsOnDateToCancel.forEach(appToReschedule => {
        const newDatetime = combineDateAndTime(newDateForReschedule, newTimeForReschedule);
        const rescheduledApp: ConfessionAppointment = {
          ...appToReschedule,
          datetime: newDatetime,
          day: format(newDateForReschedule, 'EEEE', { locale: arSA }),
          time: newTimeForReschedule,
          status: 'قادم',
          notes: `${appToReschedule.notes || ''} (تم الترحيل من ${format(dateToCancel, 'PPPp', { locale: arSA })})`.trim(),
          originalDatetime: appToReschedule.datetime,
        };
        
        const index = updatedAppointmentsList.findIndex(a => a.id === appToReschedule.id);
        if (index > -1) {
            updatedAppointmentsList[index] = rescheduledApp;
        }
    });
    
    saveAppointments(updatedAppointmentsList.sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
    setAppointments(updatedAppointmentsList.sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())); 

    toast({ title: "تم ترحيل المواعيد بنجاح!" });
    setIsCancelRescheduleModalOpen(false);
    setDateToCancel(undefined);
    setNewDateForReschedule(undefined);
    setNewTimeForReschedule("");
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2">
            <Dialog open={isAvailabilityModalOpen} onOpenChange={setIsAvailabilityModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto"><Settings className="me-2 h-5 w-5" /> إدارة التوافر</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>إدارة أوقات التوافر للاعترافات</DialogTitle></DialogHeader>
                <Form {...availabilityForm}>
                  <form onSubmit={availabilityForm.handleSubmit(handleSaveAvailability)} className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    {!Object.values(availabilityForm.watch()).some(daySlot => daySlot && daySlot.enabled) && (
                        <p className="text-sm text-center text-muted-foreground p-3 bg-muted/30 rounded-md border border-dashed">
                            <AlertCircle className="inline h-4 w-4 me-1 mb-0.5"/>
                            لم يتم تفعيل أي أيام توافر. يرجى تحديد أيام وساعات عملك لاستقبال الاعترافات.
                        </p>
                    )}
                    {daysOfWeek.map((day) => (
                      <Card key={day} className="p-4 bg-background/70">
                         <FormField
                            control={availabilityForm.control}
                            name={`${day}.enabled` as keyof PriestAvailability}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 rtl:space-x-reverse space-y-0 mb-3">
                                 <FormControl>
                                    <Checkbox
                                      checked={!!field.value} 
                                      onCheckedChange={(checked) => {
                                          field.onChange(checked);
                                          if (checked && !availabilityForm.getValues(`${day}.startTime` as keyof PriestAvailability)) {
                                              availabilityForm.setValue(`${day}.startTime` as keyof PriestAvailability, "09:00" as any);
                                              availabilityForm.setValue(`${day}.endTime` as keyof PriestAvailability, "17:00" as any);
                                          }
                                      }}
                                    />
                                </FormControl>
                                <FormLabel className="font-semibold text-md select-none">{day}</FormLabel>
                                </FormItem>
                            )}
                            />
                        {availabilityForm.watch(`${day}.enabled` as keyof PriestAvailability) && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 gap-x-4 gap-y-2"
                          >
                            <FormField control={availabilityForm.control} name={`${day}.startTime` as keyof PriestAvailability} render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">من الساعة</FormLabel>
                                <FormControl><Input type="time" {...field} className="h-9" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={availabilityForm.control} name={`${day}.endTime` as keyof PriestAvailability}  render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">حتى الساعة</FormLabel>
                                <FormControl><Input type="time" {...field} className="h-9" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                        )}
                      </Card>
                    ))}
                    <DialogFooter className="pt-4">
                      <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                      <Button type="submit">حفظ الإعدادات</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCancelRescheduleModalOpen} onOpenChange={setIsCancelRescheduleModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto"><CalendarDays className="me-2 h-5 w-5" /> إلغاء يوم وترحيل</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>إلغاء يوم كامل وترحيل المواعيد</DialogTitle>
                    <CardDescription className="pt-1">قم بإلغاء جميع المواعيد القادمة في يوم محدد وترحيلها إلى يوم ووقت جديدين.</CardDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="dateToCancelCalendar">1. اختر اليوم المُراد إلغاؤه:</Label>
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

                  {dateToCancel && (
                    <div className="p-3 bg-muted/50 rounded-md border">
                        <h4 className="text-sm font-semibold mb-2">المواعيد القادمة في هذا اليوم ({appointmentsOnDateToCancel.length}):</h4>
                        {appointmentsOnDateToCancel.length > 0 ? (
                            <ul className="text-xs list-disc ps-5 max-h-32 overflow-y-auto">
                                {appointmentsOnDateToCancel.map(app => <li key={app.id}>{app.name} - {app.time}</li>)}
                            </ul>
                        ) : (
                             <p className="text-xs text-muted-foreground">لا توجد مواعيد قادمة في هذا اليوم لإلغائها.</p>
                        )}
                    </div>
                  )}

                  {appointmentsOnDateToCancel.length > 0 && (
                    <>
                      <div>
                        <Label htmlFor="newDateForRescheduleCalendar">2. اختر اليوم الجديد للترحيل إليه:</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button id="newDateForRescheduleCalendar" variant={"outline"} className="w-full justify-start text-left font-normal mt-1">
                              <CalendarDays className="me-2 h-4 w-4" />
                              {newDateForReschedule ? format(newDateForReschedule, "PPP", { locale: arSA }) : <span>اختر تاريخًا جديدًا</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newDateForReschedule} onSelect={setNewDateForReschedule} initialFocus locale={arSA} disabled={(date) => isBefore(date, startOfDay(new Date()))} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="newTimeForRescheduleInput">3. الوقت الجديد للترحيل (HH:mm):</Label>
                        <Input id="newTimeForRescheduleInput" type="time" value={newTimeForReschedule} onChange={(e) => setNewTimeForReschedule(e.target.value)} className="mt-1" />
                      </div>
                    </>
                  )}
                  <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                    <Button onClick={handleConfirmReschedule} disabled={appointmentsOnDateToCancel.length === 0 || !newDateForReschedule || !newTimeForReschedule}>تأكيد الترحيل ({appointmentsOnDateToCancel.length})</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddModal} className="w-full sm:w-auto"><PlusCircle className="me-2 h-5 w-5" /> إضافة موعد</Button>
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
                      <Button type="submit">{editingAppointment ? 'حفظ التعديلات' : 'إضافة الموعد'}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
      </div>
      
      <AppointmentsListDisplay 
        appointments={appointments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showUpcomingAlerts={true}
      />
    </motion.div>
  );
}

    
