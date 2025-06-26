
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

import type { Trip, Booking } from '@/types/trips';
import { getTripById, createBooking, getBookingStats } from '@/lib/trips-store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeDollarSign, Calendar, Check, CircleX, Info, List, Loader2, Map, MapPin, Ticket, User, Users, Plane } from 'lucide-react';

interface TripDetailsProps {
  tripId: string;
}

const bookingSchema = z.object({
  userName: z.string().min(3, "الاسم يجب ألا يقل عن 3 أحرف."),
});
type BookingFormData = z.infer<typeof bookingSchema>;

export default function TripDetails({ tripId }: TripDetailsProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { userName: '' },
  });
  
  const refreshData = () => {
       const currentTrip = getTripById(tripId);
       setTrip(currentTrip);
       if (currentTrip) {
           setStats(getBookingStats(currentTrip.id));
       }
  };

  useEffect(() => {
    setIsLoading(true);
    const currentTrip = getTripById(tripId);
    setTrip(currentTrip);
    if(currentTrip) {
        setStats(getBookingStats(currentTrip.id));
    }
    setIsLoading(false);
  }, [tripId]);

  const handleBooking: SubmitHandler<BookingFormData> = (data) => {
    if (!trip) return;
    setIsBooking(true);
    
    // Simulate network delay
    setTimeout(() => {
        const result = createBooking(trip.id, `user_${Date.now()}`, data.userName); // Mock user ID
        if (result.success && result.booking) {
            setBookingResult(result.booking);
            toast({ title: "تم الحجز بنجاح!", description: "تم حجز مكانك في الرحلة. احتفظ بكود التأكيد."});
            refreshData(); // Refresh stats
        } else {
            toast({ title: "فشل الحجز", description: result.message, variant: "destructive" });
        }
        setIsBooking(false);
        form.reset();
    }, 1000);
  };

  const renderTextAsList = (text: string) => {
      return text.split('\n').map((item, index) => item.trim() && <li key={index} className="mb-1">{item.trim()}</li>);
  }

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  if (!trip) {
    return <div className="text-center py-10 text-destructive">لم يتم العثور على الرحلة المطلوبة.</div>;
  }
  
  const isTripFull = stats.total >= trip.capacity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Trip Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3"><Plane className="h-8 w-8 text-primary"/>{trip.title}</CardTitle>
            <CardDescription className="text-lg flex items-center gap-2"><MapPin/>{trip.destination}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
             <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <p className="flex items-center gap-2"><Calendar className="h-4 w-4"/> {format(new Date(trip.startDate), "d MMM", { locale: arSA })} - {format(new Date(trip.endDate), "d MMMM yyyy", { locale: arSA })}</p>
                <p className="flex items-center gap-2 font-semibold"><BadgeDollarSign className="h-4 w-4"/> {trip.price} جنيه</p>
             </div>
             <Separator/>
             <p className="whitespace-pre-line leading-relaxed">{trip.overview}</p>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full space-y-4">
            <Card as="div"><AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="p-4 hover:no-underline font-semibold text-lg">
                    <div className="flex items-center gap-2"><Map className="h-5 w-5"/>خط سير الرحلة</div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4"><ul className="list-disc ps-8 space-y-1 text-muted-foreground">{renderTextAsList(trip.itinerary)}</ul></AccordionContent>
            </AccordionItem></Card>

            <Card as="div"><AccordionItem value="item-2" className="border-0">
                <AccordionTrigger className="p-4 hover:no-underline font-semibold text-lg">
                    <div className="flex items-center gap-2"><Info className="h-5 w-5"/>تفاصيل الاشتراك</div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                     <div>
                        <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2"><Check className="h-5 w-5"/>الاشتراك يشمل</h4>
                        <ul className="list-disc ps-8 space-y-1 text-muted-foreground">{renderTextAsList(trip.included)}</ul>
                     </div>
                     <Separator/>
                     <div>
                        <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-2"><CircleX className="h-5 w-5"/>الاشتراك لا يشمل</h4>
                        <ul className="list-disc ps-8 space-y-1 text-muted-foreground">{renderTextAsList(trip.excluded)}</ul>
                     </div>
                </AccordionContent>
            </AccordionItem></Card>
        </Accordion>
      </div>

      {/* Booking and Stats Side */}
      <div className="space-y-6">
        <Card className="shadow-lg sticky top-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/>حالة الحجز</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm"><span>إجمالي الحجوزات:</span> <span className="font-bold">{stats.total} / {trip.capacity}</span></div>
                <div className="flex justify-between items-center text-sm"><span>تم الدفع:</span> <span className="font-bold text-green-600">{stats.paid}</span></div>
                <div className="flex justify-between items-center text-sm"><span>لم يتم الدفع:</span> <span className="font-bold text-red-600">{stats.unpaid}</span></div>
            </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5"/>احجز مكانك الآن!</CardTitle>
            </CardHeader>
            <CardContent>
                {bookingResult ? (
                    <Alert variant="default" className="bg-green-100 border-green-300">
                        <AlertTitle className="text-green-800 flex items-center gap-2"><Check/>تم الحجز بنجاح!</AlertTitle>
                        <AlertDescription className="text-green-700">
                            <p>مرحباً {bookingResult.userName}، تم حجز مكانك. يرجى تقديم الكود التالي للكاهن عند الدفع لتأكيد حجزك:</p>
                            <p className="text-center font-mono text-2xl my-4 p-2 bg-green-200 rounded-md">{bookingResult.bookingCode}</p>
                            <Button onClick={() => setBookingResult(null)} variant="outline" className="w-full mt-2">حجز لشخص آخر</Button>
                        </AlertDescription>
                    </Alert>
                ) : isTripFull ? (
                     <Alert variant="destructive">
                        <AlertTitle>الرحلة مكتملة</AlertTitle>
                        <AlertDescription>عذرًا، لقد تم حجز جميع الأماكن في هذه الرحلة.</AlertDescription>
                     </Alert>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleBooking)} className="space-y-4">
                            <FormField control={form.control} name="userName" render={({ field }) => (
                                <FormItem><FormLabel>اسم المسافر</FormLabel><FormControl><Input placeholder="اكتب اسمك ثلاثيًا" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" disabled={isBooking} className="w-full">
                                {isBooking ? <Loader2 className="me-2 h-4 w-4 animate-spin"/> : <Ticket className="me-2 h-4 w-4"/>}
                                {isBooking ? 'جاري الحجز...' : 'تأكيد الحجز'}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
