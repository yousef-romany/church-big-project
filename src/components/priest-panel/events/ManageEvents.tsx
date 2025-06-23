"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

import type { ChurchEvent } from '@/types';
import { getEvents, addEvent, deleteEvent } from '@/lib/events-store';
import { combineDateAndTime } from '@/lib/appointments-store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithPresets } from '@/components/ui/DatePickerWithPresets';
import { Award, Calendar, Clock, MapPin, PlusCircle, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const eventSchema = z.object({
  title: z.string().min(3, { message: "العنوان قصير جدًا" }),
  description: z.string().min(10, { message: "الوصف قصير جدًا" }),
  location: z.string().min(3, { message: "الموقع قصير جدًا" }),
  date: z.date({ required_error: "يجب اختيار تاريخ" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "صيغة الوقت غير صحيحة" }),
  points: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "النقاط لا يمكن أن تكون سالبة").max(100, "النقاط لا يجب أن تتجاوز 100")
  ),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function ManageEvents() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      time: '',
      points: 10,
    },
  });

  const onSubmit: SubmitHandler<EventFormData> = (data) => {
    const newEventData = {
      title: data.title,
      description: data.description,
      location: data.location,
      points: data.points,
      datetime: combineDateAndTime(data.date, data.time),
    };
    const newEvent = addEvent(newEventData);
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.datetime.getTime() - b.datetime.getTime()));
    form.reset();
    toast({
      title: "تم إنشاء الفعالية بنجاح!",
      description: `تم إضافة فعالية "${data.title}".`,
    });
  };

  const handleDelete = (eventId: string, eventTitle: string) => {
    if (confirm(`هل أنت متأكد من حذف فعالية "${eventTitle}"؟`)) {
      deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      toast({
        title: "تم حذف الفعالية",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="me-2 h-6 w-6" /> إنشاء فعالية جديدة
          </CardTitle>
          <CardDescription>
            أضف تفاصيل الفعالية أو الاجتماع الخاص وحدد النقاط التي سيحصل عليها الحاضرون.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>عنوان الفعالية</FormLabel><FormControl><Input placeholder="مثال: يوم روحي للشباب" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>الموقع</FormLabel><FormControl><Input placeholder="مثال: قاعة الكنيسة" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>الوصف</FormLabel><FormControl><Textarea placeholder="تفاصيل الفعالية..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>التاريخ</FormLabel><FormControl><DatePickerWithPresets date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="time" render={({ field }) => (
                  <FormItem><FormLabel>الوقت</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="points" render={({ field }) => (
                  <FormItem><FormLabel>النقاط الممنوحة</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء الفعالية"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-2xl font-semibold mb-4">الفعاليات القادمة</h3>
        <div className="space-y-4">
          <AnimatePresence>
            {events.length > 0 ? events.map(event => (
              <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center mt-2 text-sm gap-x-4 gap-y-1">
                        <Badge variant="secondary" className="me-2">
                          <Star className="h-3 w-3 me-1.5 text-yellow-500" /> +{event.points} نقطة
                        </Badge>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 me-1.5" /> {format(event.datetime, 'EEEE, d MMM', { locale: arSA })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 me-1.5" /> {format(event.datetime, 'hh:mm a', { locale: arSA })}
                        </span>
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(event.id, event.title)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 me-1.5" /> {event.location}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )) : <p className="text-center text-muted-foreground">لا توجد فعاليات قادمة.</p>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
