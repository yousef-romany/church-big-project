'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, CheckCircle, AlertCircle, Facebook } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PasswordInputWithStrength from '@/components/auth/password-input-with-strength';


const registerSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred');
      }

      setSuccess(result.message);
      toast({
        title: 'تم إنشاء الحساب بنجاح!',
        description: 'سيتم توجيهك لصفحة تسجيل الدخول.',
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'فشل إنشاء الحساب',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleFacebookSignUp = async () => {
    setError(null);
    try {
      const result = await signIn('facebook', {
        redirect: false,
        callbackUrl: '/auth/select-role',
      });

      if (result?.error) {
        setError('فشل التسجيل عبر فيسبوك. يرجى المحاولة مرة أخرى.');
        toast({
          title: 'فشل التسجيل',
          description: 'فشل التسجيل عبر فيسبوك. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'تم التسجيل بنجاح!', description: `جاري توجيهك لإكمال بياناتك...` });
        router.push('/auth/select-role');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred with Facebook sign up.';
      setError(errorMessage);
      toast({
        title: 'فشل التسجيل',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-md">
      <Card className="shadow-2xl">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-3xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription>انضم إلينا. أدخل بياناتك لإنشاء حساب.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 p-8">
               {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="default" className="bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">نجاح!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
                </Alert>
              )}
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><User className="me-2 h-4 w-4" />الاسم الكامل</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="اسمك"
                        {...field}
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Mail className="me-2 h-4 w-4" />البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Lock className="me-2 h-4 w-4" />كلمة المرور</FormLabel>
                    <FormControl>
                      <PasswordInputWithStrength
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="********"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-8 pt-0">
              <Button type="submit" className="w-full" disabled={isSubmitting || !!success}>
                {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleFacebookSignUp}
                disabled={!!success}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                التسجيل عبر فيسبوك
              </Button>
              <div className="text-sm text-center">
                لديك حساب بالفعل؟{' '}
                <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                  تسجيل الدخول
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
