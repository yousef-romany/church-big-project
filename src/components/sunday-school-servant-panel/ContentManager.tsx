"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

import type { WeeklyContent, ContentType } from '@/types/content';
import { getContent, addContent, deleteContent, updateContent } from '@/lib/content-store';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit, BookOpen, HelpCircle, Star, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


const contentSchema = z.object({
  type: z.enum(['verse', 'question'], { required_error: "يجب اختيار نوع المحتوى" }),
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  content: z.string().min(10, "المحتوى قصير جدًا"),
  points: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
  options: z.array(z.object({ value: z.string().min(1, "الخيار لا يمكن أن يكون فارغًا") })).optional(),
  correctAnswer: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentSchema>;

export default function ContentManager() {
  const [contentItems, setContentItems] = useState<WeeklyContent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const MOCK_SERVANT_ID = 'servant1_ss_mock_id'; // In a real app, from auth context

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: 'verse',
      title: '',
      content: '',
      points: 10,
      options: [{ value: '' }, { value: '' }],
      correctAnswer: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options"
  });

  const contentType = form.watch('type');

  useEffect(() => {
    setContentItems(getContent());
  }, []);

  const onSubmit: SubmitHandler<ContentFormData> = (data) => {
    setIsSubmitting(true);
    
    const newContentData = {
      type: data.type,
      title: data.title,
      content: data.content,
      points: data.points,
      options: data.type === 'question' ? data.options?.map(o => o.value) : undefined,
      correctAnswer: data.type === 'question' ? data.correctAnswer : undefined,
      createdBy: MOCK_SERVANT_ID,
      isActive: true,
    };

    const newContent = addContent(newContentData);
    setContentItems(prev => [newContent, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    
    toast({
      title: "تم إضافة المحتوى بنجاح!",
      description: `تم نشر "${data.title}".`,
    });
    
    form.reset();
    setIsSubmitting(false);
  };
  
  const handleDelete = (id: string, title: string) => {
      if (confirm(`هل أنت متأكد من حذف "${title}"؟`)) {
          deleteContent(id);
          setContentItems(prev => prev.filter(item => item.id !== id));
          toast({ title: `تم حذف "${title}"`, variant: "destructive"});
      }
  }

  const toggleActiveStatus = (item: WeeklyContent) => {
      const updatedItem = { ...item, isActive: !item.isActive };
      updateContent(updatedItem);
      setContentItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));
      toast({ title: `تم ${updatedItem.isActive ? 'تفعيل' : 'إلغاء تفعيل'} "${item.title}"`});
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><PlusCircle className="me-2 h-6 w-6" /> إضافة محتوى جديد</CardTitle>
          <CardDescription>أضف آية للحفظ أو سؤال أسبوعي لتشجيع تفاعل الأبناء وكسب النقاط.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>نوع المحتوى</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="verse"><BookOpen className="inline me-2 h-4 w-4"/> آية للحفظ</SelectItem>
                      <SelectItem value="question"><HelpCircle className="inline me-2 h-4 w-4"/> سؤال الأسبوع</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>العنوان</FormLabel><FormControl><Input placeholder={contentType === 'verse' ? 'مثال: آية عن المحبة' : 'مثال: سؤال عن سفر يونان'} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="points" render={({ field }) => (
                  <FormItem><FormLabel>النقاط</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

               <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem><FormLabel>{contentType === 'verse' ? 'نص الآية والشاهد' : 'نص السؤال'}</FormLabel><FormControl><Textarea placeholder={contentType === 'verse' ? '"الله محبة" (1 يوحنا 4: 8)' : 'من هو النبي الذي ابتلعه الحوت؟'} rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <AnimatePresence>
                {contentType === 'question' && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t"
                    >
                        <h4 className="font-semibold text-primary">خيارات السؤال (متعدد الاختيارات)</h4>
                        {fields.map((field, index) => (
                             <div key={field.id} className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name={`options.${index}.value`}
                                    render={({ field: f }) => (
                                        <FormItem className="flex-grow"><FormControl><Input placeholder={`الخيار #${index + 1}`} {...f} /></FormControl><FormMessage /></FormItem>
                                    )}
                                />
                                {fields.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                            </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}><PlusCircle className="me-2 h-4 w-4"/> إضافة خيار</Button>

                         <FormField control={form.control} name="correctAnswer" render={({ field }) => (
                            <FormItem><FormLabel>الإجابة الصحيحة</FormLabel><FormControl><Input placeholder="اكتب نص الإجابة الصحيحة بالضبط كما في الخيارات" {...field} /></FormControl><FormMessage /></FormItem>
                         )} />
                    </motion.div>
                )}
                </AnimatePresence>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="me-2 h-4 w-4 animate-spin"/> : <PlusCircle className="me-2 h-4 w-4"/>}
                  {isSubmitting ? "جاري الإضافة..." : "إضافة المحتوى"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-2xl font-semibold mb-4">المحتوى المضاف</h3>
        <div className="space-y-4">
          <AnimatePresence>
            {contentItems.length > 0 ? contentItems.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="hover:bg-muted/50 transition-colors">
                   <CardHeader className="flex flex-row justify-between items-start">
                     <div>
                       <CardTitle className="flex items-center gap-2">
                          {item.type === 'verse' ? <BookOpen className="h-5 w-5 text-primary"/> : <HelpCircle className="h-5 w-5 text-primary" />}
                          {item.title}
                       </CardTitle>
                       <CardDescription className="mt-2">
                          أُضيف في: {format(new Date(item.createdAt), 'd MMMM yyyy', { locale: arSA })}
                       </CardDescription>
                     </div>
                     <div className="flex items-center gap-2">
                         <Badge variant={item.isActive ? "default" : "secondary"}>
                           {item.isActive ? "فعّال" : "غير فعّال"}
                         </Badge>
                         <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.title)}>
                           <Trash2 className="h-4 w-4 text-destructive" />
                         </Button>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-foreground/90 whitespace-pre-line bg-muted/30 p-3 rounded-md">{item.content}</p>
                     {item.type === 'question' && item.options && (
                         <div className="mt-2 text-sm">
                             <p className="font-semibold">الخيارات: {item.options.join(', ')}</p>
                             <p className="font-semibold text-green-600">الإجابة الصحيحة: {item.correctAnswer}</p>
                         </div>
                     )}
                   </CardContent>
                   <CardFooter className="justify-between">
                     <div className="flex items-center font-semibold text-yellow-600">
                        <Star className="me-1 h-4 w-4" /> {item.points} نقطة
                     </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`switch-${item.id}`} className="text-sm">{item.isActive ? 'إلغاء تفعيل' : 'تفعيل'}</Label>
                        <Switch id={`switch-${item.id}`} checked={item.isActive} onCheckedChange={() => toggleActiveStatus(item)} />
                      </div>
                   </CardFooter>
                </Card>
              </motion.div>
            )) : <p className="text-center text-muted-foreground py-4">لم يتم إضافة أي محتوى بعد.</p>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
