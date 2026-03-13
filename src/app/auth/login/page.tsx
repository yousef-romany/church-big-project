'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import React from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().min(1, { message: 'كلمة المرور مطلوبة' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [error, setError] = React.useState<string | null>(searchParams.get('error'));
  const { toast } = useToast();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        } else if (result.error.includes('Email not verified')) {
            setError('الحساب غير مفعل. الرجاء مراجعة بريدك الإلكتروني لتفعيل الحساب.');
        }
        else {
            setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
        }
        toast({
          title: 'فشل تسجيل الدخول',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'تم تسجيل الدخول بنجاح!' });
        router.push(callbackUrl);
      }
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-md">
      <Card className="glass-panel border-white/40 dark:border-white/10 rounded-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <CardHeader className="text-center p-8 pb-6 relative z-10">
          <CardTitle className="text-3xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>مرحباً بك مجدداً! أدخل بياناتك للمتابعة.</CardDescription>
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-foreground/80"><Mail className="me-2 h-4 w-4" />البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" className="bg-background/40 backdrop-blur-sm border-white/20 dark:border-white/10 focus-visible:ring-primary/50" {...field} />
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
                    <FormLabel className="flex items-center text-foreground/80"><Lock className="me-2 h-4 w-4" />كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" className="bg-background/40 backdrop-blur-sm border-white/20 dark:border-white/10 focus-visible:ring-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-8 pt-0 relative z-10">
              <Button type="submit" className="w-full shadow-lg hover:shadow-primary/25 transition-all duration-300 group hover:-translate-y-1" disabled={isSubmitting}>
                {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                {!isSubmitting && <LogIn className="ms-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />}
              </Button>
              <div className="text-sm text-center">
                ليس لديك حساب؟{' '}
                <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                  إنشاء حساب جديد
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
