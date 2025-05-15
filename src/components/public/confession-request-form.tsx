
"use client";
import type { ConfessionRequestFormInput, PriestData } from '@/types/public';
import type { ConfessionAppointment, PriestAvailability } from '@/types/priest-panel';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Send, User, Phone, Users, CalendarPlus, Info } from 'lucide-react';
import { 
  getPriestAvailability, 
  getAppointments as getExistingAppointments, 
  addAppointment as addAppointmentToStore,
  combineDateAndTime,
  isSlotOverlapping
} from '@/lib/appointments-store';
import { format, addDays, addMinutes, parse, startOfDay } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { useState } from 'react';

const confessionRequestSchema = z.object({
  fullName: z.string().min(3, { message: "الاسم الكامل يجب أن يكون 3 أحرف على الأقل" }),
  mobileNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "رقم الموبايل غير صالح (مثال: 01234567890)" }),
  selectedPriestId: z.string({ required_error: "يرجى اختيار الكاهن" }),
});

type FormValues = z.infer<typeof confessionRequestSchema>;

interface ConfessionRequestFormProps {
  priests: PriestData[];
}

const CONFESSION_DURATION_MINUTES = 30; // Standard duration for a confession slot

export default function ConfessionRequestForm({ priests }: ConfessionRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'success' | 'error' | null>(null);


  const form = useForm<FormValues>({
    resolver: zodResolver(confessionRequestSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      selectedPriestId: '',
    },
  });

  const findAndBookNextAvailableSlot = (requestData: FormValues): ConfessionAppointment | null => {
    const priestAvailability = getPriestAvailability(); // Assuming this gets the relevant priest's schedule or a general one
    const existingAppointments = getExistingAppointments();
    let currentDate = startOfDay(new Date()); // Start checking from today

    for (let i = 0; i < 60; i++) { // Check for the next 60 days
      const dayName = format(currentDate, 'EEEE', { locale: arSA });
      const dayAvail = priestAvailability[dayName];

      if (dayAvail && dayAvail.enabled && dayAvail.startTime && dayAvail.endTime) {
        let slotTime = parse(dayAvail.startTime, 'HH:mm', new Date()); // Base date for time parsing doesn't matter here
        const endTime = parse(dayAvail.endTime, 'HH:mm', new Date());

        while (addMinutes(slotTime, CONFESSION_DURATION_MINUTES) <= endTime) {
          const potentialSlotStartDateTime = combineDateAndTime(currentDate, format(slotTime, 'HH:mm'));
          
          // Ensure the slot is in the future
          if (potentialSlotStartDateTime < new Date()) {
            slotTime = addMinutes(slotTime, CONFESSION_DURATION_MINUTES); // Try next slot
            continue;
          }

          if (!isSlotOverlapping(potentialSlotStartDateTime, CONFESSION_DURATION_MINUTES, existingAppointments)) {
            // Found a free slot!
            const newAppointmentData = {
              name: requestData.fullName,
              priestId: requestData.selectedPriestId,
              datetime: potentialSlotStartDateTime,
              day: dayName,
              time: format(potentialSlotStartDateTime, 'HH:mm'),
              status: 'قادم' as const,
              durationMinutes: CONFESSION_DURATION_MINUTES,
              notes: `طلب من ${requestData.fullName} عبر البوابة العامة. رقم الموبايل: ${requestData.mobileNumber}`,
            };
            return addAppointmentToStore(newAppointmentData);
          }
          slotTime = addMinutes(slotTime, CONFESSION_DURATION_MINUTES); // Check next slot
        }
      }
      currentDate = addDays(currentDate, 1); // Move to the next day
    }
    return null; // No slot found within 60 days
  };


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    setBookingMessage(null);
    setBookingStatus(null);

    // Simulate a short delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const bookedAppointment = findAndBookNextAvailableSlot(data);

    if (bookedAppointment) {
      const priestName = priests.find(p => p.id === data.selectedPriestId)?.name || 'الكاهن';
      const successMsg = `تم حجز موعد اعتراف لك بنجاح! 🗓️\nمع: ${priestName}\nاليوم: ${bookedAppointment.day}\nالتاريخ: ${format(bookedAppointment.datetime, 'PPP', { locale: arSA })}\nالساعة: ${format(bookedAppointment.datetime, 'hh:mm a', { locale: arSA })}.`;
      toast({
        title: "تم الحجز بنجاح!",
        description: successMsg.replace(/\n/g, ' '), // Toast doesn't render newlines well
        variant: "default",
        duration: 10000, // Longer duration for important info
      });
      setBookingMessage(successMsg);
      setBookingStatus('success');
      form.reset();
    } else {
      const errorMsg = "عذرًا، لم نتمكن من العثور على موعد متاح حاليًا. يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع الكنيسة مباشرة.";
      toast({
        title: "لم يتم العثور على موعد",
        description: errorMsg,
        variant: "destructive",
        duration: 10000,
      });
      setBookingMessage(errorMsg);
      setBookingStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="shadow-xl overflow-hidden border-primary/20">
        <CardHeader className="bg-primary/10">
          <div className="flex items-center gap-3">
            <CalendarPlus className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl font-bold text-primary">طلب موعد اعتراف</CardTitle>
                <CardDescription>املأ النموذج لطلب موعد اعتراف، وسنحاول تحديد أقرب وقت متاح لك.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 space-y-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-md"><User className="me-2 h-5 w-5 text-muted-foreground" /> الاسم الكامل</FormLabel>
                  <FormControl><Input placeholder="مثال: مينا جرجس عوض" {...field} className="h-11" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-md"><Phone className="me-2 h-5 w-5 text-muted-foreground" /> رقم الموبايل</FormLabel>
                  <FormControl><Input dir="ltr" placeholder="01XXXXXXXXX" {...field} className="h-11" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="selectedPriestId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-md"><Users className="me-2 h-5 w-5 text-muted-foreground" /> اختر الكاهن</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="h-11"><SelectValue placeholder="اختر من قائمة الكهنة" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {priests.map(priest => (
                        <SelectItem key={priest.id} value={priest.id}>{priest.name} - {priest.churchName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 border-t border-border/20">
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold transition-transform hover:scale-105 active:scale-95 group"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="me-2 h-5 w-5 border-2 border-transparent border-t-primary-foreground rounded-full"
                    />
                    جاري البحث عن موعد...
                  </>
                ) : (
                  <>
                    <Send className="me-2 h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /> طلب الموعد
                  </>
                )}
              </Button>
               {bookingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-md text-sm text-center whitespace-pre-line ${
                    bookingStatus === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' : 
                    bookingStatus === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : ''
                  }`}
                >
                  {bookingMessage}
                </motion.div>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
