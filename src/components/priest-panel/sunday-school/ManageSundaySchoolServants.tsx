
"use client";
import type { SundaySchoolServant, ServingDay } from '@/types/sunday-school';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, UserCog, Users, CalendarDays as BirthDateIcon, Filter } from 'lucide-react';
import { DatePickerWithPresets } from '@/components/ui/DatePickerWithPresets';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  addSundaySchoolServant,
  getSundaySchoolServants,
  updateSundaySchoolServant,
  saveSundaySchoolServants, // For deleting
} from '@/lib/sunday-school-store';
import { format, parseISO, isValid } from 'date-fns';
import { arSA } from 'date-fns/locale';

const servingDaysOptions: { id: ServingDay; label: string }[] = [
  { id: 'Thursday', label: 'الخميس' },
  { id: 'Friday', label: 'الجمعة' },
];

const servantSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  contactNumber: z.string().optional(),
  birthDate: z.date().optional(),
  servingDays: z.array(z.enum(['Thursday', 'Friday'])).min(1, { message: "يجب اختيار يوم خدمة واحد على الأقل" }),
});

type ServantFormData = z.infer<typeof servantSchema>;

export default function ManageSundaySchoolServants() {
  const [servants, setServants] = useState<SundaySchoolServant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServant, setEditingServant] = useState<SundaySchoolServant | null>(null);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const { toast } = useToast();

  const form = useForm<ServantFormData>({
    resolver: zodResolver(servantSchema),
    defaultValues: { name: '', contactNumber: '', servingDays: [] },
  });

  useEffect(() => {
    setServants(getSundaySchoolServants());
  }, []);

  // Filter servants based on selected filters
  const filteredServants = servants.filter(servant => {
    const matchesDay = filterDay === 'all' || servant.servingDays.includes(filterDay as ServingDay);
    const matchesActive = filterClass === 'all' || 
                         (filterClass === 'active' && servant.isActive) || 
                         (filterClass === 'inactive' && !servant.isActive);
    return matchesDay && matchesActive;
  });

  const openModalForEdit = (servant: SundaySchoolServant) => {
    setEditingServant(servant);
    form.reset({
      name: servant.name,
      contactNumber: servant.contactNumber || '',
      servingDays: servant.servingDays,
      birthDate: servant.birthDate && isValid(parseISO(servant.birthDate)) ? parseISO(servant.birthDate) : undefined,
    });
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setEditingServant(null);
    form.reset({ name: '', contactNumber: '', servingDays: [], birthDate: undefined });
    setIsModalOpen(true);
  };

  const onSubmit: SubmitHandler<ServantFormData> = (data) => {
    const servantDataToSave = {
      ...data,
      birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
    };

    if (editingServant) {
      const updated = updateSundaySchoolServant({ ...editingServant, ...servantDataToSave });
      if (updated) {
        setServants(servants.map(s => s.id === updated.id ? updated : s));
        toast({ title: "تم تعديل الخادم بنجاح!" });
      }
    } else {
      const newServant = addSundaySchoolServant(servantDataToSave);
      setServants([...servants, newServant]);
      toast({ title: "تم إضافة الخادم بنجاح!" });
    }
    setIsModalOpen(false);
  };
  
  const handleDeleteServant = (servantId: string) => {
    // Basic confirmation, can be enhanced with AlertDialog
    if (confirm("هل أنت متأكد من حذف هذا الخادم؟ لا يمكن التراجع عن هذا الإجراء.")) {
      const updatedServants = servants.filter(s => s.id !== servantId);
      saveSundaySchoolServants(updatedServants); // This will overwrite the entire list
      setServants(updatedServants);
      toast({ title: "تم حذف الخادم.", variant: "destructive" });
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col items-start gap-4">
        <div className="flex flex-row justify-between items-center w-full">
          <div>
            <CardTitle className="flex items-center"><UserCog className="me-2 h-6 w-6 text-primary"/>إدارة خدام مدارس الأحد</CardTitle>
            <CardDescription>إضافة، تعديل، وعرض قائمة خدام مدارس الأحد.</CardDescription>
          </div>
          <Button onClick={openModalForAdd}><PlusCircle className="me-2 h-5 w-5" /> إضافة خادم جديد</Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">تصفية حسب:</span>
          </div>
          <Select value={filterDay} onValueChange={setFilterDay}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="اختر يوم الخدمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأيام</SelectItem>
              <SelectItem value="Thursday">الخميس</SelectItem>
              <SelectItem value="Friday">الجمعة</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الخدام</SelectItem>
              <SelectItem value="active">الخدام النشطون</SelectItem>
              <SelectItem value="inactive">الخدام غير النشطين</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredServants.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            {servants.length === 0 
              ? "لا يوجد خدام مضافون حاليًا." 
              : "لا توجد نتائج تطابق الفلتر المحدد."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>أيام الخدمة</TableHead>
                  <TableHead>تاريخ الميلاد</TableHead>
                  <TableHead>رقم الاتصال</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
               <TableBody>
                 {filteredServants.map((servant) => (
                   <TableRow key={servant.id} className={!servant.isActive ? "opacity-60" : ""}>
                     <TableCell className="font-medium">{servant.name}</TableCell>
                     <TableCell>{servant.servingDays.map(day => servingDaysOptions.find(opt => opt.id === day)?.label).join('، ')}</TableCell>
                     <TableCell>
                       {servant.birthDate && isValid(parseISO(servant.birthDate))
                         ? format(parseISO(servant.birthDate), 'd MMMM yyyy', { locale: arSA })
                         : '-'}
                     </TableCell>
                     <TableCell dir="ltr">{servant.contactNumber || '-'}</TableCell>
                     <TableCell>
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${servant.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                         {servant.isActive ? 'نشط' : 'غير نشط'}
                       </span>
                     </TableCell>
                     <TableCell className="text-left space-x-1 rtl:space-x-reverse">
                       <Button variant="ghost" size="icon" onClick={() => openModalForEdit(servant)} className="text-blue-500 hover:text-blue-700">
                         <Edit className="h-4 w-4" /> <span className="sr-only">تعديل</span>
                       </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteServant(servant.id)} className="text-red-500 hover:text-red-700">
                         <Trash2 className="h-4 w-4" /> <span className="sr-only">حذف</span>
                       </Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{editingServant ? 'تعديل بيانات الخادم' : 'إضافة خادم جديد'}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>اسم الخادم</FormLabel><FormControl><Input placeholder="الاسم ثلاثي" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField control={form.control} name="birthDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-1">تاريخ الميلاد (اختياري)</FormLabel>
                    <DatePickerWithPresets date={field.value} setDate={field.onChange} showPresets={false} />
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="contactNumber" render={({ field }) => (
                  <FormItem><FormLabel>رقم الاتصال (اختياري)</FormLabel><FormControl><Input dir="ltr" placeholder="01XXXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField
                  control={form.control}
                  name="servingDays"
                  render={() => (
                    <FormItem>
                      <FormLabel>أيام الخدمة (اختر يومًا واحدًا على الأقل)</FormLabel>
                      {servingDaysOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="servingDays"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 rtl:space-x-reverse space-y-0 my-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                 />
                 
                 {editingServant && (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/50">
                      <div className="space-y-0.5">
                        <FormLabel>حالة الخادم</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          هل هذا الخادم نشط حاليًا في الخدمة؟
                        </p>
                      </div>
                      <div>
                        <Checkbox
                          checked={editingServant.isActive}
                          onCheckedChange={(checked) => {
                            setEditingServant(prev => prev ? {...prev, isActive: Boolean(checked)} : null);
                          }}
                        />
                      </div>
                    </FormItem>
                  )}

                 <DialogFooter className="pt-4">
                   <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                   <Button type="submit">{editingServant ? 'حفظ التعديلات' : 'إضافة الخادم'}</Button>
                 </DialogFooter>
               </form>
             </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
