
"use client";
import type { ConfessionRequestFormInput, PriestData } from '@/types/public';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Added CardFooter
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ScrollText, User, Phone, Church, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { addAppointment, getAppointments, getPriestAvailability, combineDateAndTime, isSlotOverlapping } from '@/lib/appointments-store';
import type { ConfessionAppointment } from '@/types/priest-panel';
import { format, addDays, startOfDay, addMinutes } from 'date-fns';
import { arSA } from 'date-fns/locale';

const confessionRequestSchema = z.object({
  fullName: z.string().min(3, { message: "الاسم الكامل يجب أن يكون 3 أحرف على الأقل" }),
  mobileNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "رقم الموبايل غير صالح (يجب أن يكون 11 رقمًا ويبدأ بـ 010, 011, 012, أو 015)" }),
  selectedPriestId: z.string({ required_error: "الرجاء اختيار الكاهن" }),
});

type FormValues = z.infer<typeof confessionRequestSchema>;

const mockPriests: PriestData[] = [
  { id: 'priest1', name: 'الأب يوحنا', churchName: 'كنيسة السيدة العذراء مريم' },
  { id: 'priest2', name: 'الأب بطرس', churchName: 'كنيسة مارجرجس' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};


export default function ConfessionRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlotInfo, setBookedSlotInfo] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(confessionRequestSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      selectedPriestId: undefined,
    },
  });

  const findAndBookNextAvailableSlot = (requestData: FormValues): ConfessionAppointment | null => {
    const availability = getPriestAvailability();
    const existingAppointments = getAppointments();
    const confessionDuration = 30; // Default duration in minutes

    let currentDate = startOfDay(new Date());
    const endDateLimit = addDays(currentDate, 60); // Search up to 60 days in the future

    while (currentDate <= endDateLimit) {
      const dayName = format(currentDate, 'EEEE', { locale: arSA });
      const dayAvailability = availability[dayName];

      if (dayAvailability && dayAvailability.enabled && dayAvailability.startTime && dayAvailability.endTime) {
        let slotTime = combineDateAndTime(currentDate, dayAvailability.startTime);
        const dayEndTime = combineDateAndTime(currentDate, dayAvailability.endTime);

        while (addMinutes(slotTime, confessionDuration) <= dayEndTime) {
          if (!isSlotOverlapping(slotTime, confessionDuration, existingAppointments)) {
            // Found an available slot
            const newAppointment: Omit<ConfessionAppointment, 'id'> = {
              name: requestData.fullName,
              datetime: slotTime,
              day: dayName,
              time: format(slotTime, 'HH:mm'),
              status: 'قادم',
              notes: `طلب من المخدوم: ${requestData.fullName}, موبايل: ${requestData.mobileNumber}`,
              durationMinutes: confessionDuration,
              priestId: requestData.selectedPriestId,
            };
            return addAppointment(newAppointment);
          }
          slotTime = addMinutes(slotTime, confessionDuration); // Move to the next potential slot
        }
      }
      currentDate = addDays(currentDate, 1); // Move to the next day
    }
    return null; // No slot found
  };


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setBookedSlotInfo(null);
    setErrorInfo(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const bookedAppointment = findAndBookNextAvailableSlot(data);

    if (bookedAppointment) {
      const priestName = mockPriests.find(p => p.id === bookedAppointment.priestId)?.name || "الكاهن المحدد";
      const successMessage = `تم حجز موعد اعتراف لك بنجاح مع ${priestName} يوم ${bookedAppointment.day} (${format(bookedAppointment.datetime, 'PPP', { locale: arSA })}) الساعة ${format(bookedAppointment.datetime, 'hh:mm a', { locale: arSA })}.`;
      
      setBookedSlotInfo(successMessage);
      setIsSuccess(true);
      toast({
        title: "تم إرسال طلبك بنجاح!",
        description: successMessage,
        variant: "default",
        duration: 10000, // Show longer
      });
      form.reset();
    } else {
      const errorMessage = "عذرًا، لم نتمكن من إيجاد موعد متاح حاليًا. يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع الكنيسة مباشرة.";
      setErrorInfo(errorMessage);
      toast({
        title: "لم يتم العثور على موعد",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    }
    setIsLoading(false);
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold">
            <ScrollText className="me-3 h-7 w-7 text-primary" /> طلب موعد اعتراف
          </CardTitle>
          <CardDescription>الرجاء تعبئة البيانات التالية لطلب موعد اعتراف. سيقوم النظام بالبحث عن أقرب موعد متاح.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-6">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="me-2 h-4 w-4 text-muted-foreground" /> الاسم الكامل</FormLabel>
                      <FormControl><Input placeholder="مثال: مينا جرجس" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={itemVariants} transition={{ delay: 0.1 }}>
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Phone className="me-2 h-4 w-4 text-muted-foreground" /> رقم الموبايل</FormLabel>
                      <FormControl><Input dir="ltr" placeholder="01XXXXXXXXX" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
                <FormField
                  control={form.control}
                  name="selectedPriestId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Church className="me-2 h-4 w-4 text-muted-foreground" /> اختيار الكاهن</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="اختر الكاهن الذي تود الاعتراف معه" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {mockPriests.map(priest => (
                            <SelectItem key={priest.id} value={priest.id}>{priest.name} - {priest.churchName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 border-t">
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading || isSuccess}>
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="me-2 h-5 w-5 border-2 border-transparent border-t-primary-foreground rounded-full"
                    />
                    جاري البحث عن موعد...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="me-2 h-5 w-5" /> تم الحجز بنجاح
                  </>
                ) : (
                  <>
                    <Send className="me-2 h-5 w-5" /> إرسال الطلب وحجز موعد
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
        {isSuccess && bookedSlotInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 m-6 mt-0 border border-green-500 bg-green-500/10 rounded-md text-green-700"
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 me-2" />
              <h3 className="font-semibold">تم تأكيد موعدك!</h3>
            </div>
            <p className="text-sm mt-1">{bookedSlotInfo}</p>
          </motion.div>
        )}
        {errorInfo && (
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 m-6 mt-0 border border-destructive bg-destructive/10 rounded-md text-destructive"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 me-2" />
              <h3 className="font-semibold">خطأ في الحجز</h3>
            </div>
            <p className="text-sm mt-1">{errorInfo}</p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}

