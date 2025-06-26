
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendLinkRequest } from '@/lib/parent-child-link-store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Send } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const linkSchema = z.object({
  qrCode: z.string().min(1, "الرجاء إدخال كود الابن."),
});

type LinkFormData = z.infer<typeof linkSchema>;

export default function LinkChildForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // In a real app, this would come from the logged-in user context
  const MOCK_PARENT_USER = { id: 'parent1_mock_id', name: 'ولي الأمر: مايكل سمير' };

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: { qrCode: '' },
  });

  const onSubmit: SubmitHandler<LinkFormData> = (data) => {
    setIsLoading(true);
    const result = sendLinkRequest(MOCK_PARENT_USER, data.qrCode);
    
    toast({
      title: result.success ? 'تم إرسال الطلب' : 'حدث خطأ',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      form.reset();
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
            <CardTitle>إرسال طلب ربط</CardTitle>
            <CardDescription>أدخل الكود الموجود في QR Code الخاص بحساب ابنك.</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="qrCode"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>كود الابن</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: SS-CHILD-001" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <Alert className="mt-4">
                        <AlertTitle>من أين أحصل على الكود؟</AlertTitle>
                        <AlertDescription>
                            يمكنك الحصول على كود الـ QR من داخل حساب ابنك في التطبيق.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Send className="me-2 h-4 w-4" />}
                        {isLoading ? 'جاري الإرسال...' : 'إرسال طلب الربط'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
