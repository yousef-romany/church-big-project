"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

import { findAndBookNextAvailableSlot } from '@/lib/appointments-store';
import type { ConfessionRequestFormInput, PriestData } from '@/types/public';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Phone, Edit, Send, CheckCircle, Loader2 } from 'lucide-react';

const requestSchema = z.object({
  fullName: z.string().min(5, "الاسم يجب أن يكون 5 أحرف على الأقل"),
  mobileNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم الموبايل غير صالح"),
  selectedPriestId: z.string().optional(),
  notes: z.string().max(200, "الملاحظات يجب ألا تتجاوز 200 حرف").optional(),
});

// Mock data, in a real app this would come from a database
const availablePriests: PriestData[] = [
    { id: 'priest_default_01', name: 'الكاهن الافتراضي', churchName: 'الكنيسة الرئيسية' },
    // Add more priests here if needed
];

export default function ConfessionRequestForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<{success: boolean; message: string} | null>(null);

    const form = useForm<ConfessionRequestFormInput>({
        resolver: zodResolver(requestSchema),
        defaultValues: { fullName: '', mobileNumber: '', notes: '', selectedPriestId: availablePriests[0]?.id || '' },
    });

    const onSubmit: SubmitHandler<ConfessionRequestFormInput> = async (data) => {
        setIsSubmitting(true);
        setSubmissionResult(null);

        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const bookedAppointment = await findAndBookNextAvailableSlot(data, data.selectedPriestId, 30, 60);

        if (bookedAppointment && bookedAppointment.datetime) {
            const successMessage = `تم حجز موعدك بنجاح يوم ${format(bookedAppointment.datetime, "EEEE, d MMMM", { locale: arSA })} الساعة ${format(bookedAppointment.datetime, "hh:mm a", { locale: arSA })}. سيتم إرسال تذكير لك.`;
            setSubmissionResult({ success: true, message: successMessage });
            toast({
                title: "تم الحجز بنجاح!",
                description: `موعدك يوم ${format(bookedAppointment.datetime, "PPPp", { locale: arSA })}`,
                duration: 10000,
            });
            form.reset();
        } else {
            const errorMessage = "عذرًا، لا توجد مواعيد متاحة في الفترة القادمة. يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع الكنيسة مباشرة.";
            setSubmissionResult({ success: false, message: errorMessage });
            toast({
                title: "لا توجد مواعيد متاحة",
                description: "يرجى المحاولة مرة أخرى لاحقًا.",
                variant: "destructive",
            });
        }

        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full max-w-2xl mx-auto shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">طلب موعد اعتراف</CardTitle>
                    <CardDescription>املأ النموذج التالي لطلب موعد للاعتراف. سيقوم النظام بالبحث عن أقرب موعد متاح لك.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            {submissionResult && (
                                <Alert variant={submissionResult.success ? "default" : "destructive"} className={submissionResult.success ? "bg-green-500/10 border-green-500/50" : ""}>
                                    {submissionResult.success && <CheckCircle className="h-4 w-4" />}
                                    <AlertTitle>{submissionResult.success ? "تم بنجاح!" : "محاولة فاشلة"}</AlertTitle>
                                    <AlertDescription>
                                        {submissionResult.message}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {!submissionResult?.success && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="fullName" render={({ field }) => (
                                            <FormItem><FormLabel className="flex items-center"><User className="me-2 h-4 w-4" /> الاسم بالكامل</FormLabel><FormControl><Input placeholder="اسمك الثلاثي" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                                            <FormItem><FormLabel className="flex items-center"><Phone className="me-2 h-4 w-4" /> رقم الموبايل</FormLabel><FormControl><Input dir="ltr" placeholder="01XXXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="selectedPriestId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اختر أب الاعتراف</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="اختر أب الاعتراف المفضل" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {availablePriests.map(priest => (
                                                        <SelectItem key={priest.id} value={priest.id}>{priest.name} - {priest.churchName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="notes" render={({ field }) => (
                                        <FormItem><FormLabel className="flex items-center"><Edit className="me-2 h-4 w-4" /> ملاحظات (اختياري)</FormLabel><FormControl><Textarea placeholder="هل هناك أي شيء تود إعلام أب الاعتراف به مسبقًا؟" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                           {submissionResult?.success ? (
                               <Button onClick={() => setSubmissionResult(null)} className="w-full" variant="outline">
                                   تقديم طلب جديد
                               </Button>
                           ) : (
                                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="me-2 h-5 w-5 animate-spin" /> جاري البحث عن موعد...</> : <><Send className="me-2 h-5 w-5" /> إرسال الطلب</>}
                                </Button>
                           )}
                           <p className="text-xs text-muted-foreground text-center">سيتم حجز أول موعد متاح في الأيام القادمة. سيتم إعلامك بالموعد المحدد عبر رسالة نصية (محاكاة).</p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </motion.div>
    );
}
