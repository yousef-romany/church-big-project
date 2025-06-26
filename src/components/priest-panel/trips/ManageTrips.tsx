
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

import type { Trip, Booking } from '@/types/trips';
import { getTrips, createTrip, getBookingsForTrip, getBookingStats } from '@/lib/trips-store';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DatePickerWithPresets } from '@/components/ui/DatePickerWithPresets';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Plane, Calendar, Users, BadgeDollarSign, Eye, ChevronDown } from 'lucide-react';
import TripBookingsView from './TripBookingsView';

const tripSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  destination: z.string().min(3, "الوجهة قصيرة جدًا"),
  startDate: z.date({ required_error: "يجب تحديد تاريخ البدء" }),
  endDate: z.date({ required_error: "يجب تحديد تاريخ الانتهاء" }),
  price: z.preprocess((val) => Number(val), z.number().min(0, "السعر لا يمكن أن يكون سالبًا")),
  capacity: z.preprocess((val) => Number(val), z.number().int().min(1, "السعة يجب أن تكون 1 على الأقل")),
  overview: z.string().min(20, "النظرة العامة يجب أن تكون 20 حرفًا على الأقل"),
  itinerary: z.string().min(20, "خط السير يجب أن يكون 20 حرفًا على الأقل"),
  included: z.string().min(10, "يجب تحديد ما تشمله الرحلة"),
  excluded: z.string().min(10, "يجب تحديد ما لا تشمله الرحلة"),
});

type TripFormData = z.infer<typeof tripSchema>;

export default function ManageTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const { toast } = useToast();

  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: { title: '', destination: '', price: 0, capacity: 50, overview: '', itinerary: '', included: '', excluded: '' },
  });

  useEffect(() => {
    setTrips(getTrips());
  }, []);
  
  const refreshTrips = () => {
      setTrips(getTrips());
  }

  const handleCreateTrip: SubmitHandler<TripFormData> = (data) => {
    if (data.endDate < data.startDate) {
        form.setError("endDate", { message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء." });
        return;
    }
    const newTrip = createTrip(data);
    setTrips(prev => [...prev, newTrip].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
    toast({ title: "تم إنشاء الرحلة بنجاح!", description: `تمت إضافة رحلة "${data.title}".` });
    form.reset();
    setIsCreateModalOpen(false);
  };

  const viewBookings = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsBookingsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="me-2 h-5 w-5" /> إنشاء رحلة جديدة</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader><DialogTitle>إنشاء رحلة جديدة</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateTrip)} className="py-4 max-h-[80vh] overflow-y-auto px-2">
                 <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full space-y-3">
                    <Card as="div" className="overflow-hidden">
                      <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="p-4 hover:no-underline bg-primary/5 rounded-t-lg">
                          <div className="font-semibold text-primary">1. المعلومات الأساسية</div>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                              <FormItem><FormLabel>عنوان الرحلة</FormLabel><FormControl><Input placeholder="مثال: رحلة دير الأنبا أنطونيوس" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="destination" render={({ field }) => (
                              <FormItem><FormLabel>الوجهة</FormLabel><FormControl><Input placeholder="مثال: البحر الأحمر" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField control={form.control} name="startDate" render={({ field }) => (
                                  <FormItem><FormLabel>تاريخ البدء</FormLabel><FormControl><DatePickerWithPresets date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="endDate" render={({ field }) => (
                                  <FormItem><FormLabel>تاريخ الانتهاء</FormLabel><FormControl><DatePickerWithPresets date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem>
                              )} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                     <Card as="div" className="overflow-hidden">
                      <AccordionItem value="item-2" className="border-b-0">
                        <AccordionTrigger className="p-4 hover:no-underline bg-primary/5">
                          <div className="font-semibold text-primary">2. السعة والتكلفة</div>
                           <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField control={form.control} name="price" render={({ field }) => (
                                  <FormItem><FormLabel>السعر (بالجنيه)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="capacity" render={({ field }) => (
                                  <FormItem><FormLabel>السعة (عدد الأفراد)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                     <Card as="div" className="overflow-hidden">
                      <AccordionItem value="item-3" className="border-b-0">
                        <AccordionTrigger className="p-4 hover:no-underline bg-primary/5 rounded-b-lg">
                           <div className="font-semibold text-primary">3. تفاصيل الرحلة</div>
                           <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-2 space-y-4">
                          <FormField control={form.control} name="overview" render={({ field }) => (
                              <FormItem><FormLabel>نظرة عامة على الرحلة</FormLabel><FormControl><Textarea placeholder="وصف موجز للرحلة وأهدافها الروحية والترفيهية..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="itinerary" render={({ field }) => (
                              <FormItem><FormLabel>خط سير الرحلة (كل سطر عنصر)</FormLabel><FormControl><Textarea placeholder="اليوم الأول: الوصول والتسكين&#10;اليوم الثاني: زيارة الدير..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField control={form.control} name="included" render={({ field }) => (
                                  <FormItem><FormLabel>الاشتراك يشمل (كل سطر عنصر)</FormLabel><FormControl><Textarea placeholder="الانتقالات&#10;الإقامة..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="excluded" render={({ field }) => (
                                  <FormItem><FormLabel>الاشتراك لا يشمل (كل سطر عنصر)</FormLabel><FormControl><Textarea placeholder="المصاريف الشخصية&#10;الوجبات الإضافية..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                </Accordion>
                <DialogFooter className="pt-4"><DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose><Button type="submit">إنشاء الرحلة</Button></DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
            {trips.map(trip => {
                const bookingStats = getBookingStats(trip.id);
                return (
                    <motion.div key={trip.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <Card className="shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Plane className="h-5 w-5 text-primary"/>{trip.title}</CardTitle>
                                <CardDescription>{trip.destination}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2 text-sm">
                                <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> 
                                    {format(new Date(trip.startDate), "d MMM", { locale: arSA })} - {format(new Date(trip.endDate), "d MMM yyyy", { locale: arSA })}
                                </p>
                                <p className="flex items-center gap-2"><BadgeDollarSign className="h-4 w-4 text-muted-foreground"/> {trip.price} جنيه</p>
                                <p className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground"/> {bookingStats.total} / {trip.capacity} محجوز</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => viewBookings(trip)}><Eye className="me-2 h-4 w-4"/> عرض الحجوزات</Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )
            })}
        </AnimatePresence>
         {trips.length === 0 && <p className="text-center col-span-full text-muted-foreground">لم يتم إنشاء أي رحلات بعد.</p>}
      </div>

       <Dialog open={isBookingsModalOpen} onOpenChange={setIsBookingsModalOpen}>
            <DialogContent className="sm:max-w-4xl">
                {selectedTrip && <TripBookingsView trip={selectedTrip} onBookingUpdate={refreshTrips} />}
            </DialogContent>
        </Dialog>
    </div>
  );
}
