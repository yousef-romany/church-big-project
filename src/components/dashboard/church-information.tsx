"use client";
import type { ChurchInformation as ChurchInfoType } from '@/types';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Edit3, Save, MapPin, Phone, Building } from 'lucide-react';

const churchInfoSchema = z.object({
  name: z.string().min(3, { message: 'اسم الكنيسة يجب أن يكون 3 أحرف على الأقل' }),
  address: z.string().min(10, { message: 'العنوان يجب أن يكون 10 أحرف على الأقل' }),
  contactNumber: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: 'رقم التواصل غير صالح' }),
});

type ChurchInfoFormData = z.infer<typeof churchInfoSchema>;

const initialChurchInfo: ChurchInfoType = {
  name: 'كنيسة السيدة العذراء مريم',
  address: '123 شارع الكنيسة، حي الزهور، القاهرة',
  contactNumber: '01234567890',
};

export default function ChurchInformation() {
  const [isEditing, setIsEditing] = useState(false);
  const [churchInfo, setChurchInfo] = useState<ChurchInfoType>(initialChurchInfo);
  const { toast } = useToast();

  const form = useForm<ChurchInfoFormData>({
    resolver: zodResolver(churchInfoSchema),
    values: churchInfo, // Use values to keep form in sync with state
  });
  
  // Sync form when churchInfo state changes (e.g., after saving)
  // or when toggling edit mode to reset to current non-edit values
  useState(() => {
    form.reset(churchInfo);
  }, [churchInfo, form]);


  const onSubmit: SubmitHandler<ChurchInfoFormData> = (data) => {
    setChurchInfo(data);
    setIsEditing(false);
    toast({
      title: "تم تحديث بيانات الكنيسة بنجاح!",
      variant: "default",
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      form.reset(churchInfo); // Reset form to current churchInfo if canceling edit
    } else {
      form.reset(churchInfo); // Ensure form has latest data when starting to edit
    }
    setIsEditing(!isEditing);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="text-2xl font-semibold mb-6">بيانات الكنيسة وإعداداتها</h2>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>معلومات الكنيسة</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleEditToggle}>
            {isEditing ? <Save className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
            <span className="sr-only">{isEditing ? "حفظ" : "تعديل"}</span>
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Building className="me-2 h-4 w-4 text-primary" /> اسم الكنيسة</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><MapPin className="me-2 h-4 w-4 text-primary" /> العنوان</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Phone className="me-2 h-4 w-4 text-primary" /> رقم التواصل</FormLabel>
                      <FormControl>
                        <Input {...field} dir="ltr" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleEditToggle}>إلغاء</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
                    </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <Building className="me-3 h-5 w-5 text-primary" />
                <div>
                  <Label className="text-xs text-muted-foreground">اسم الكنيسة</Label>
                  <p className="font-medium">{churchInfo.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="me-3 h-5 w-5 text-primary" />
                <div>
                  <Label className="text-xs text-muted-foreground">العنوان</Label>
                  <p className="font-medium">{churchInfo.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="me-3 h-5 w-5 text-primary" />
                <div>
                  <Label className="text-xs text-muted-foreground">رقم التواصل</Label>
                  <p className="font-medium" dir="ltr">{churchInfo.contactNumber}</p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 rounded-lg overflow-hidden border shadow-sm">
            <Image 
                src="https://picsum.photos/seed/churchmap/800/400" 
                alt="خريطة موقع الكنيسة" 
                width={800} 
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint="map church location"
            />
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}