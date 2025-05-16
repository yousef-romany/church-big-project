
"use client";
import type { ConfessionRequestFormInput, PriestData, ConfessionRequest } from '@/types/public';
import type { ConfessionAppointment, PriestAvailability } from '@/types/priest-panel';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Send, User, Phone, Church, CalendarClock } from 'lucide-react';
import { getPriestAvailability, getAppointments, addAppointment as addAppointmentToStore, combineDateAndTime, isSlotOverlapping } from '@/lib/appointments-store';
import { format, addDays, startOfDay, addMinutes, parse, isValid } from 'date-fns';
import { arSA } from 'date-fns/locale';

const requestSchema = z.object({
  fullName: z.string().min(3, { message: "الاسم الكامل يجب أن يكون 3 أحرف على الأقل" }),
  mobileNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "رقم الموبايل غير صالح" }),
  selectedPriestId: z.string({ required_error: "يرجى اختيار الكاهن" }),
});

type RequestFormData = z.infer<typeof requestSchema>;

// Mock data for priests - in a real app, this would come from an API
const priests: PriestData[] = [
  { id: 'كاهن_افتراضي_1', name: 'أبونا مرقس بولس', churchName: 'كنيسة السيدة العذراء مريم والقديس أثناسيوس الرسولي، مدينة نصر' },
  { id: 'كاهن_افتراضي_2', name: 'أبونا بيشوي كامل', churchName: 'كنيسة مارجرجس والأنبا أنطونيوس، مصر الجديدة' },
];

export default function ConfessionRequestForm() {
  const { toast } = useToast();
  const [selectedPriest, setSelectedPriest] = useState<PriestData>(priests[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{success: boolean, message: string, details?: string} | null>(null);


  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      selectedPriestId: priests[0].id,
    },
  });

  const findAndBookNextAvailableSlot = (data: RequestFormData) => {
    setIsSubmitting(true);
    setBookingResult(null);

    const availability = getPriestAvailability();
    const existingAppointments = getAppointments();
    const appointmentDuration = 30; // Default duration in minutes
    let slotFound = false;

    // Iterate through next 60 days to find a slot
    for (let i = 0; i < 60; i++) {
      const currentDate = addDays(startOfDay(new Date()), i);
      const dayName = format(currentDate, 'EEEE', { locale: arSA });
      const dayAvailability = availability[dayName];

      if (dayAvailability && dayAvailability.enabled && dayAvailability.startTime && dayAvailability.endTime) {
        let currentTimeInSlot = parse(dayAvailability.startTime, 'HH:mm', currentDate);
        const slotEndTime = parse(dayAvailability.endTime, 'HH:mm', currentDate);

        while (isValid(currentTimeInSlot) && isValid(slotEndTime) && currentTimeInSlot < slotEndTime) {
          const potentialSlotEnd = addMinutes(currentTimeInSlot, appointmentDuration);
          if (potentialSlotEnd > slotEndTime) break; // Slot exceeds day's availability

          // Check if current time is in the past (only for today)
          if (i === 0 && currentTimeInSlot < new Date()) {
            currentTimeInSlot = addMinutes(currentTimeInSlot, appointmentDuration);
            continue;
          }
          
          if (!isSlotOverlapping(currentTimeInSlot, appointmentDuration, existingAppointments)) {
            // Found a slot
            const bookedAppointment: Omit<ConfessionAppointment, 'id'> = {
              name: data.fullName,
              datetime: currentTimeInSlot,
              day: format(currentTimeInSlot, 'EEEE', { locale: arSA }),
              time: format(currentTimeInSlot, 'HH:mm', { locale: arSA }),
              status: 'قادم',
              durationMinutes: appointmentDuration,
              notes: `حجز تلقائي لـ ${data.fullName} عبر البوابة العامة. رقم الموبايل: ${data.mobileNumber}`,
              priestId: selectedPriest.id, // Using the currently selected priest
            };
            
            try {
                addAppointmentToStore(bookedAppointment);
                const successMsg = `تم حجز موعدك بنجاح!`;
                const detailsMsg = `مع ${selectedPriest.name} يوم ${bookedAppointment.day} الموافق ${format(bookedAppointment.datetime, 'PPP', { locale: arSA })} الساعة ${format(bookedAppointment.datetime, 'hh:mm a', { locale: arSA })}.`;
                toast({
                    title: successMsg,
                    description: detailsMsg,
                    duration: 10000, // Longer duration for important info
                });
                setBookingResult({success: true, message: successMsg, details: detailsMsg });
                form.reset();
            } catch (e) {
                console.error("Error saving appointment:", e);
                toast({ title: "خطأ في الحجز", description: "حدث خطأ أثناء محاولة حفظ الموعد. يرجى المحاولة مرة أخرى.", variant: "destructive" });
                setBookingResult({success: false, message: "حدث خطأ أثناء محاولة حفظ الموعد."});
            }
            slotFound = true;
            break;
          }
          currentTimeInSlot = addMinutes(currentTimeInSlot, 15); // Check in 15-minute increments
        }
      }
      if (slotFound) break;
    }

    if (!slotFound) {
      toast({
        title: "لم يتم العثور على موعد متاح",
        description: `عذرًا، لم نتمكن من العثور على موعد متاح مع ${selectedPriest.name} خلال الـ 60 يومًا القادمة. يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع الكنيسة.`,
        variant: "default",
        duration: 10000,
      });
       setBookingResult({success: false, message: `عذرًا، لم نتمكن من العثور على موعد متاح مع ${selectedPriest.name} حاليًا.`});
    }
    setIsSubmitting(false);
  };


  const onSubmit: SubmitHandler<RequestFormData> = (data) => {
    findAndBookNextAvailableSlot(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-6">
          <CalendarClock className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">طلب موعد اعتراف</CardTitle>
          <CardDescription className="text-md mt-2">
            يرجى ملء البيانات التالية لطلب موعد اعتراف. سيقوم النظام بمحاولة إيجاد أقرب موعد متاح لك.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 p-6 md:p-8">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-base"><User className="me-2 h-5 w-5 text-muted-foreground" /> الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: مينا عادل فانوس" {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-base"><Phone className="me-2 h-5 w-5 text-muted-foreground" /> رقم الموبايل</FormLabel>
                    <FormControl>
                      <Input dir="ltr" placeholder="01XXXXXXXXX" {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selectedPriestId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-base"><Church className="me-2 h-5 w-5 text-muted-foreground" /> اختر الأب الكاهن</FormLabel>
                    <Select 
                        onValueChange={(value) => {
                            field.onChange(value);
                            const currentPriest = priests.find(p => p.id === value);
                            if (currentPriest) setSelectedPriest(currentPriest);
                        }} 
                        defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="اختر الكاهن" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priests.map((priest) => (
                          <SelectItem key={priest.id} value={priest.id} className="text-base py-2">
                            <div className="flex flex-col">
                                <span>{priest.name}</span>
                                <span className="text-xs text-muted-foreground">{priest.churchName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {bookingResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-md text-sm ${bookingResult.success ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200'}`}
                >
                  <p className="font-semibold">{bookingResult.message}</p>
                  {bookingResult.details && <p className="mt-1">{bookingResult.details}</p>}
                </motion.div>
              )}

            </CardContent>
            <CardFooter className="p-6 md:p-8 border-t">
              <Button type="submit" className="w-full h-12 text-lg font-semibold group" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                   <>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="me-3 h-5 w-5 border-2 border-transparent border-t-primary-foreground rounded-full"
                       />
                      جاري البحث عن موعد...
                   </>
                ) : (
                  <>
                    <Send className="me-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /> إرسال الطلب وحجز موعد
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
       <p className="text-xs text-muted-foreground text-center mt-4 px-4">
        سيقوم النظام بالبحث عن أقرب موعد متاح لك مع الكاهن المختار خلال الـ 60 يومًا القادمة. مدة الاعتراف الافتراضية هي 30 دقيقة.
      </p>
    </motion.div>
  );
}

