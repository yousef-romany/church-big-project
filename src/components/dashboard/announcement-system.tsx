"use client";
import type { Announcement } from '@/types';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale'; // For Arabic locale in date-fns

const announcementSchema = z.object({
  title: z.string().min(5, { message: 'العنوان يجب أن يكون 5 أحرف على الأقل' }),
  content: z.string().min(10, { message: 'المحتوى يجب أن يكون 10 أحرف على الأقل' }),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

const cardVariants = {
  initial: { opacity: 0, scale: 0.9, x: -50 }, // Slide from right in RTL, so x is negative
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 0.9, x: 50 },
};

export default function AnnouncementSystem() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', title: 'اجتماعخدام الأحد القادم', content: 'نود تذكيركم باجتماع الخدام يوم الأحد القادم الساعة ٥ مساءً بقاعة الكنيسة.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '2', title: 'بدء التسجيل في مدارس الأحد', content: 'تم فتح باب التسجيل في فصول مدارس الأحد للعام الجديد. يرجى التوجه لمكتب الخدمة للتسجيل.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  ]);
  const { toast } = useToast();

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: '', content: '' },
  });

  const onSubmit: SubmitHandler<AnnouncementFormData> = (data) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      createdAt: new Date(),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    form.reset();
    toast({
      title: "تم نشر الإعلان بنجاح!",
      description: `الإعلان "${data.title}" أصبح ظاهرًا الآن.`,
      variant: "default",
    });
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-6">نظام الإعلانات</h2>
      
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>نشر إعلان جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الإعلان</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: اجتماع هام للشباب" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>محتوى الإعلان</FormLabel>
                    <FormControl>
                      <Textarea placeholder="اكتب تفاصيل الإعلان هنا..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "جاري النشر..." : "نشر الإعلان"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">آخر الإعلانات</h3>
        {announcements.length === 0 && <p className="text-muted-foreground">لا توجد إعلانات حاليًا.</p>}
        <div className="space-y-4">
          <AnimatePresence>
            {announcements.map(announcement => (
              <motion.div
                key={announcement.id}
                layout
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{announcement.title}</CardTitle>
                    <CardDescription>
                      نُشر {formatDistanceToNow(announcement.createdAt, { addSuffix: true, locale: ar })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{announcement.content}</p>
                  </CardContent>
                   <CardFooter>
                    <Button variant="outline" size="sm">تعديل</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 ms-2">حذف</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}