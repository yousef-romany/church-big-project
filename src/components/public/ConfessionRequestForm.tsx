
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { findAndBookNextAvailableSlot } from '@/lib/appointments-store';
import type { ConfessionRequestFormInput, ConfessionRequest } from '@/types/public';
import type { ConfessionAppointment } from '@/types/priest-panel'; // For the return type of findAndBook
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

const requestSchema = z.object({
  fullName: z.string().min(5, { message: "الاسم يجب أن يكون 5 أحرف على الأقل" }),
  mobileNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "رقم الموبايل غير صالح (مثال: 01234567890)" }),
  notes: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function ConfessionRequestForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ success: boolean; message: string; appointment?: ConfessionAppointment } | null>(null);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      notes: '',
    },
  });

  const onSubmit: SubmitHandler<RequestFormData> = async (data) => {
    setIsLoading(true);
    setBookingResult(null);
    try {
      // Simulate priest ID if needed for multi-priest setup later
      const bookedAppointment = await findAndBookNextAvailableSlot(data, undefined, 30); // Assuming 30 min default duration

      if (bookedAppointment) {
        const successMsg = `تم حجز موعدك بنجاح! يوم ${bookedAppointment.day} الموافق ${format(bookedAppointment.datetime, "d MMMM yyyy", { locale: arSA })}، الساعة ${bookedAppointment.time}.`;
        setBookingResult({ success: true, message: successMsg, appointment: bookedAppointment });
        toast({
          title: "تم الحجز بنجاح!",
          description: successMsg,
          duration: 10000,
        });
        form.reset();
      } else {
        const failMsg = "عذرًا، لم نتمكن من إيجاد موعد متاح قريب. يرجى المحاولة لاحقًا أو التواصل مع الكنيسة.";
        setBookingResult({ success: false, message: failMsg });
        toast({
          title: "فشل الحجز",
          description: failMsg,
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMsg = "حدث خطأ أثناء محاولة حجز الموعد. يرجى المحاولة مرة أخرى.";
      setBookingResult({ success: false, message: errorMsg });
      toast({
        title: "خطأ",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-primary/20">
      <CardHeader>
        <CardTitle className="text-center text-xl text-primary">بيانات طلب الاعتراف</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم بالكامل</FormLabel>
                  <FormControl><Input placeholder="الاسم ثلاثي كما في البطاقة" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الموبايل</FormLabel>
                  <FormControl><Input dir="ltr" type="tel" placeholder="01234567890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                  <FormControl><Textarea placeholder="أي ملاحظات تود إضافتها للكاهن..." {...field} rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2 pb-6 px-6">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="me-2 h-5 w-5 animate-spin" /> جاري البحث عن موعد...
                </>
              ) : (
                <>
                  <Send className="me-2 h-5 w-5" /> طلب الموعد
                </>
              )}
            </Button>
            {bookingResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-md text-sm w-full text-center ${
                  bookingResult.success ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 border border-green-300' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 border border-red-300'
                }`}
              >
                {bookingResult.success ? <CheckCircle className="inline h-5 w-5 me-2 mb-0.5" /> : <XCircle className="inline h-5 w-5 me-2 mb-0.5" />}
                {bookingResult.message}
              </motion.div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

