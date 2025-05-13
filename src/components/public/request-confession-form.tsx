
"use client";
import type { ConfessionRequestFormInput } from '@/types/public';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Send, User, Phone, UserSquare } from 'lucide-react'; // Changed Home to UserSquare

const confessionRequestSchema = z.object({
  fullName: z.string().min(5, { message: "الاسم الكامل يجب أن يكون 5 أحرف على الأقل" }),
  mobileNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "رقم الموبايل غير صالح (مثال: 01234567890)" }),
  selectedPriestId: z.string().min(1, { message: "يجب اختيار أب الاعتراف" }), // Changed from affiliatedChurch
});

const availablePriests = [
  { id: 'priest_john', name: 'أبونا يوحنا' },
  { id: 'priest_peter', name: 'أبونا بطرس' },
  { id: 'priest_paul', name: 'أبونا بولس' },
  { id: 'priest_mark', name: 'أبونا مرقس' },
];

export default function RequestConfessionForm() {
  const { toast } = useToast();
  const form = useForm<ConfessionRequestFormInput>({
    resolver: zodResolver(confessionRequestSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      selectedPriestId: '',
    },
  });

  const onSubmit: SubmitHandler<ConfessionRequestFormInput> = (data) => {
    const selectedPriest = availablePriests.find(p => p.id === data.selectedPriestId);
    console.log("Confession Request Submitted:", { ...data, priestName: selectedPriest?.name });
    // In a real app, this data would be sent to a backend service
    // which would then make it available in the priest's panel.
    toast({
      title: "تم إرسال طلب الاعتراف بنجاح!",
      description: `شكرًا لك، ${data.fullName}. سيتم التواصل معك قريبًا لترتيب الموعد مع ${selectedPriest?.name}.`,
      variant: "default",
    });
    form.reset();
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
  };
  
  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ 
        opacity: 1, 
        x: 0, 
        transition: { delay: i * 0.1, type: "spring", stiffness: 120 } 
    }),
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center text-2xl">
            <Send className="me-3 h-7 w-7 text-primary" /> طلب موعد اعتراف
          </CardTitle>
          <CardDescription>
            الرجاء ملء البيانات التالية لطلب موعد اعتراف. سيتم مراجعة طلبك والتواصل معك في أقرب وقت ممكن.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 space-y-6">
              <motion.div custom={0} variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="me-2 h-4 w-4 text-muted-foreground" /> الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="ادخل اسمك ثلاثيًا" {...field} className="py-5 transition-all duration-300 focus:shadow-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div custom={1} variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Phone className="me-2 h-4 w-4 text-muted-foreground" /> رقم الموبايل</FormLabel>
                      <FormControl>
                        <Input dir="ltr" type="tel" placeholder="01XXXXXXXXX" {...field} className="py-5 transition-all duration-300 focus:shadow-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div custom={2} variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="selectedPriestId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><UserSquare className="me-2 h-4 w-4 text-muted-foreground" /> أب الاعتراف</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="py-5 transition-all duration-300 focus:shadow-md">
                            <SelectValue placeholder="اختر أب الاعتراف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availablePriests.map((priest) => (
                            <SelectItem key={priest.id} value={priest.id}>
                              {priest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <motion.div custom={3} variants={fieldVariants} className="w-full">
                <Button type="submit" size="lg" className="w-full transition-transform hover:scale-[1.02] active:scale-95" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="me-2 h-5 w-5 border-2 border-transparent border-t-current rounded-full"
                       />
                      جاري الإرسال...
                    </>
                  ) : (
                    <> <Send className="me-2 h-5 w-5" /> إرسال الطلب </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}

