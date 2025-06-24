
"use client";
import type { PriestPanelFamily, FamilyMember } from '@/types/priest-panel';
import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, Users, MapPin, Phone, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { getGeoLocation } from '@/lib/geo-utils';

const familyMemberSchema = z.object({
  id: z.string().optional(), // For existing members during edit, or default for new ones
  name: z.string().min(2, { message: "الاسم قصير جدًا" }),
  age: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ invalid_type_error: "العمر يجب أن يكون رقمًا" }).min(0, { message: "العمر غير صالح" }).max(120, { message: "العمر غير صالح" })
  ),
  gender: z.enum(['ذكر', 'أنثى', ''], { required_error: "يجب اختيار النوع" }),
  educationLevel: z.string().optional(),
});

const addFamilySchema = z.object({
  fatherName: z.string().min(3, { message: "اسم الأب يجب أن يكون 3 أحرف على الأقل" }),
  motherName: z.string().min(3, { message: "اسم الأم يجب أن يكون 3 أحرف على الأقل" }),
  phoneNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "رقم الموبايل غير صالح" }),
  address: z.string().min(10, { message: "العنوان يجب أن يكون 10 أحرف على الأقل" }),
  region: z.string().min(2, { message: "المنطقة قصيرة جدًا"}).optional(),
  latitude: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ invalid_type_error: "خط العرض يجب أن يكون رقمًا" }).optional()
  ),
  longitude: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ invalid_type_error: "خط الطول يجب أن يكون رقمًا" }).optional()
  ),
  members: z.array(familyMemberSchema).optional(),
  notes: z.string().optional(),
});

type AddFamilyFormData = z.infer<typeof addFamilySchema>;

const sectionVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: "easeInOut" } },
};

export default function AddFamilyForm() {
  const { toast } = useToast();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  const form = useForm<AddFamilyFormData>({
    resolver: zodResolver(addFamilySchema),
    defaultValues: {
      fatherName: '',
      motherName: '',
      phoneNumber: '',
      address: '',
      region: '',
      latitude: undefined,
      longitude: undefined,
      members: [],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onSubmit: SubmitHandler<AddFamilyFormData> = (data) => {
    console.log(data); // In a real app, send this to the backend
    toast({
      title: "تم إضافة الأسرة بنجاح!",
      description: `أسرة ${data.fatherName} أُضيفت للنظام.`,
    });
    form.reset(); // Reset form after submission
  };

  const handleFetchLocation = async () => {
    setIsFetchingLocation(true);
    try {
        const { latitude, longitude } = await getGeoLocation();
        form.setValue('latitude', parseFloat(latitude.toFixed(6)));
        form.setValue('longitude', parseFloat(longitude.toFixed(6)));
        toast({
            title: "تم تحديد الموقع بنجاح!",
            description: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        });
    } catch (error) {
        toast({
            title: "فشل تحديد الموقع",
            description: (error as Error).message || "يرجى التأكد من تفعيل خدمات الموقع.",
            variant: "destructive",
        });
    } finally {
        setIsFetchingLocation(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center"><Users className="me-2 h-6 w-6 text-primary" /> بيانات الأسرة الأساسية</CardTitle>
              <CardDescription>الرجاء إدخال معلومات رب الأسرة والأم.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fatherName" render={({ field }) => (
                  <FormItem><FormLabel>اسم الأب</FormLabel><FormControl><Input placeholder="مثال: يوسف حنا" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="motherName" render={({ field }) => (
                  <FormItem><FormLabel>اسم الأم</FormLabel><FormControl><Input placeholder="مثال: مريم فؤاد" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center"><Phone className="me-2 h-4 w-4 text-muted-foreground" /> رقم الموبايل</FormLabel><FormControl><Input dir="ltr" placeholder="01XXXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <motion.section variants={sectionVariants} initial="hidden" animate="visible">
            <Card className="shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center"><UserPlus className="me-2 h-6 w-6 text-primary" /> أفراد الأسرة (الأولاد وغيرهم)</CardTitle>
                <CardDescription>أضف تفاصيل أفراد الأسرة الآخرين.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {fields.map((field, index) => (
                  <motion.div 
                    key={field.id} 
                    className="p-4 border rounded-lg space-y-3 relative bg-background shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1}}
                  >
                    <h4 className="font-semibold text-md text-primary">فرد #{index + 1}</h4>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 start-2 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" /><span className="sr-only">حذف الفرد</span>
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name={`members.${index}.name`} render={({ field: f }) => (
                        <FormItem><FormLabel>الاسم</FormLabel><FormControl><Input placeholder="اسم الفرد" {...f} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.age`} render={({ field: f }) => (
                        <FormItem><FormLabel>العمر</FormLabel><FormControl><Input type="number" placeholder="العمر بالسنوات" {...f} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField control={form.control} name={`members.${index}.gender`} render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>النوع</FormLabel>
                          <Select onValueChange={f.onChange} defaultValue={f.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="ذكر">ذكر</SelectItem>
                              <SelectItem value="أنثى">أنثى</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.educationLevel`} render={({ field: f }) => (
                        <FormItem><FormLabel>المرحلة التعليمية/المهنة</FormLabel><FormControl><Input placeholder="مثال: ثالثة إعدادي، مهندس، ..." {...f} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </motion.div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ id: Date.now().toString(), name: '', age: '', gender: '', educationLevel: '' })} className="w-full transition-transform hover:scale-105">
                  <PlusCircle className="me-2 h-5 w-5" /> إضافة فرد جديد
                </Button>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section variants={sectionVariants} initial="hidden" animate="visible" transition={{delay:0.2}}>
            <Card className="shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center"><MapPin className="me-2 h-6 w-6 text-primary" /> العنوان والموقع الجغرافي</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>العنوان التفصيلي</FormLabel><FormControl><Textarea placeholder="مثال: 15 شارع النيل، بجوار صيدلية العزبي، الدور الثالث شقة 5" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="region" render={({ field }) => (
                  <FormItem><FormLabel>المنطقة/الحي</FormLabel><FormControl><Input placeholder="مثال: شبرا، المعادي، ..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="latitude" render={({ field }) => (
                            <FormItem><FormLabel>خط العرض (Latitude)</FormLabel><FormControl><Input type="number" step="any" placeholder="يتم تحديده تلقائيًا" {...field} readOnly className="bg-background" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="longitude" render={({ field }) => (
                            <FormItem><FormLabel>خط الطول (Longitude)</FormLabel><FormControl><Input type="number" step="any" placeholder="يتم تحديده تلقائيًا" {...field} readOnly className="bg-background" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <Button type="button" variant="outline" onClick={handleFetchLocation} disabled={isFetchingLocation} className="w-full">
                        {isFetchingLocation ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <MapPin className="me-2 h-4 w-4" />}
                        {isFetchingLocation ? 'جاري تحديد الموقع...' : 'تحديد الموقع الحالي للجهاز'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">ملاحظة: هذا الخيار يسجل موقعك الحالي كموقع للأسرة. للدقة، استخدم هذا الخيار أثناء تواجدك في منزل الأسرة.</p>
                </div>
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>ملاحظات إضافية</FormLabel><FormControl><Textarea placeholder="أي تفاصيل أخرى عن الأسرة ( اختيارية )..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </motion.section>

          <motion.div className="flex justify-end pt-4" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
            <Button type="submit" size="lg" className="min-w-[150px] transition-transform hover:scale-105" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "جاري الإضافة..." : "إضافة الأسرة"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
