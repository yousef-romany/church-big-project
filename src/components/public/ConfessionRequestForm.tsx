
"use client";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import type { ConfessionRequestFormInput, PriestData } from '@/types/public';
import type { ConfessionAppointment } from '@/types/priest-panel';
import { findAndBookNextAvailableSlot } from '@/lib/appointments-store';
import { format, addDays, differenceInDays, isValid, parseISO, formatDistanceStrict, isAfter } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { User, Phone, Edit3, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MOCK_USER_ID = "user_123_makhdoom"; // Replace with actual user ID from auth
const REQUEST_COOLDOWN_DAYS = 30;

const confessionRequestSchema = z.object({
  fullName: z.string().min(3, { message: "الاسم الكامل يجب أن يكون 3 أحرف على الأقل" }),
  mobileNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "رقم الموبايل غير صالح (يجب أن يكون 11 رقمًا ويبدأ بـ 010, 011, 012, أو 015)" }),
  selectedPriestId: z.string({ required_error: "يجب اختيار أب الاعتراف" }),
  notes: z.string().max(200, { message: "الملاحظات يجب ألا تتجاوز 200 حرف" }).optional(),
});

const mockPriests: PriestData[] = [
  { id: 'priest_default_01', name: 'أبونا مرقس ميلاد', churchName: 'كنيسة السيدة العذراء والقديس أثناسيوس' },
  { id: 'priest_sunday_special_02', name: 'أبونا بيشوي كامل (للشباب)', churchName: 'كنيسة الأنبا بيشوي' },
  { id: 'priest_evening_only_03', name: 'أبونا متاؤس القمص (للعائلات)', churchName: 'كاتدرائية مارمرقس' },
];

const fieldVariants = (delay: number) => ({
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay } },
});

export default function ConfessionRequestForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<ConfessionAppointment | null>(null);
  const [errorFindingSlot, setErrorFindingSlot] = useState<string | null>(null);
  
  const [canRequest, setCanRequest] = useState(true);
  const [nextRequestAvailableDate, setNextRequestAvailableDate] = useState<Date | null>(null);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastRequestTimestamp = localStorage.getItem(`lastConfessionRequestedAt_${MOCK_USER_ID}`);
      if (lastRequestTimestamp) {
        const lastRequestDate = parseISO(lastRequestTimestamp);
        if (isValid(lastRequestDate)) {
          const daysSinceLastRequest = differenceInDays(new Date(), lastRequestDate);
          if (daysSinceLastRequest < REQUEST_COOLDOWN_DAYS) {
            setCanRequest(false);
            setNextRequestAvailableDate(addDays(lastRequestDate, REQUEST_COOLDOWN_DAYS));
          }
        }
      }
    }
  }, []);

  const form = useForm<ConfessionRequestFormInput>({
    resolver: zodResolver(confessionRequestSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      notes: '',
      selectedPriestId: '',
    },
  });

  const onSubmit: SubmitHandler<ConfessionRequestFormInput> = async (data) => {
    if (!canRequest) {
      toast({
        title: "لا يمكن تقديم طلب الآن",
        description: `لقد قدمت طلبًا مؤخرًا. يمكنك المحاولة مرة أخرى بعد ${formatDistanceStrict(nextRequestAvailableDate || new Date(), new Date(), { locale: arSA, addSuffix: true })}.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setBookedAppointment(null);
    setErrorFindingSlot(null);
    
    try {
      const requestPayload: ConfessionRequestFormInput = {
        ...data,
        userId: MOCK_USER_ID,
      };
      const appointment = await findAndBookNextAvailableSlot(requestPayload, data.selectedPriestId);

      if (appointment) {
        setBookedAppointment(appointment);
        toast({
          title: "تم حجز موعدك بنجاح!",
          description: `موعدك مع ${mockPriests.find(p=>p.id === data.selectedPriestId)?.name || 'الكاهن'} يوم ${appointment.day} الساعة ${appointment.time}.`,
          duration: 10000,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem(`lastConfessionRequestedAt_${MOCK_USER_ID}`, new Date().toISOString());
        }
        setCanRequest(false);
        setNextRequestAvailableDate(addDays(new Date(), REQUEST_COOLDOWN_DAYS));
        form.reset(); 
      } else {
        setErrorFindingSlot("عذرًا، لم نتمكن من إيجاد موعد متاح في الفترة القادمة. يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع الكنيسة مباشرة.");
        toast({
          title: "لم يتم العثور على موعد",
          description: "لا توجد مواعيد متاحة حاليًا. حاول مرة أخرى بعد فترة.",
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error("Error booking confession:", error);
      setErrorFindingSlot("حدث خطأ أثناء محاولة حجز الموعد. يرجى المحاولة مرة أخرى.");
      toast({
        title: "خطأ في الحجز",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canRequest && nextRequestAvailableDate) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg shadow-md"
      >
        <Clock className="h-12 w-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-2">طلبك الأخير قيد المراجعة أو تم حجزه</h3>
        <p className="text-yellow-600 dark:text-yellow-300">
          لقد قدمت طلب اعتراف مؤخرًا. يمكنك تقديم طلب جديد 
          {isAfter(new Date(), nextRequestAvailableDate) ? " الآن." : ` ${formatDistanceStrict(nextRequestAvailableDate, new Date(), { locale: arSA, addSuffix: true })}.`}
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          (تاريخ آخر طلب مسجل لك: {format(addDays(nextRequestAvailableDate, -REQUEST_COOLDOWN_DAYS), "PPP", { locale: arSA })})
        </p>
      </motion.div>
    );
  }

  if (bookedAppointment) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg shadow-md"
      >
        <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">تم حجز موعدك بنجاح!</h3>
        <p className="text-green-600 dark:text-green-300">
          تم تحديد موعد اعترافك مع <span className="font-bold">{mockPriests.find(p=>p.id === bookedAppointment.priestId)?.name || 'الكاهن المختار'}</span> يوم 
          <span className="font-bold"> {bookedAppointment.day} {format(new Date(bookedAppointment.datetime), 'd MMMM yyyy', { locale: arSA })}</span>,
          الساعة <span className="font-bold">{bookedAppointment.time}</span>.
        </p>
        {bookedAppointment.notes && <p className="text-xs text-muted-foreground mt-3">ملاحظات الحجز: {bookedAppointment.notes}</p>}
        <Button onClick={() => setBookedAppointment(null)} className="mt-6">تقديم طلب جديد (بعد الفترة المسموحة)</Button>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {errorFindingSlot && (
          <motion.p 
            initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}
            className="text-sm text-red-600 bg-red-500/10 p-3 rounded-md flex items-center"
          >
            <AlertCircle className="h-5 w-5 me-2"/> {errorFindingSlot}
          </motion.p>
        )}
        <motion.div variants={fieldVariants(0.1)}>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center"><User className="me-2 h-4 w-4 text-muted-foreground" /> الاسم بالكامل</FormLabel>
                <FormControl><Input placeholder="الاسم كما هو في بطاقة الرقم القومي" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={fieldVariants(0.2)}>
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center"><Phone className="me-2 h-4 w-4 text-muted-foreground" /> رقم الموبايل</FormLabel>
                <FormControl><Input dir="ltr" type="tel" placeholder="01XXXXXXXXX" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={fieldVariants(0.3)}>
            <FormField
                control={form.control}
                name="selectedPriestId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>أب الاعتراف</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="اختر أب الاعتراف" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {mockPriests.map(priest => (
                        <SelectItem key={priest.id} value={priest.id}>
                            {priest.name} - <span className="text-xs text-muted-foreground">{priest.churchName}</span>
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </motion.div>

        <motion.div variants={fieldVariants(0.4)}>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center"><Edit3 className="me-2 h-4 w-4 text-muted-foreground" /> ملاحظات إضافية (اختياري)</FormLabel>
                <FormControl><Textarea placeholder="أي طلبات خاصة أو توضيحات (مثل: أفضلية وقت معين إذا أمكن، إلخ)" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={fieldVariants(0.5)} className="pt-2">
          <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting || !canRequest}>
            {isSubmitting ? 'جاري البحث عن موعد...' : <><Send className="me-2 h-5 w-5"/> إرسال الطلب</>}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
