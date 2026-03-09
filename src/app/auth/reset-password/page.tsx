'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PasswordInputWithStrength from '@/components/auth/password-input-with-strength';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const token = searchParams.get('token');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { 
      password: '',
      confirmPassword: ''
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!token) {
      setError('رابط إعادة التعيين غير صالح أو مفقود.');
      setIsTokenValid(false);
      return;
    }

    // Validate token on component mount
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'رابط إعادة التعيين غير صالح.');
          setIsTokenValid(false);
        } else {
          setIsTokenValid(true);
        }
      } catch (err) {
        setError('حدث خطأ أثناء التحقق من الرابط.');
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    if (!token) {
      setError('رابط إعادة التعيين غير صالح.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred');
      }

      setSuccess(result.message);
      toast({
        title: 'تم إعادة تعيين كلمة المرور بنجاح!',
        description: 'سيتم توجيهك لصفحة تسجيل الدخول.',
      });
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'فشل إعادة تعيين كلمة المرور',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center p-6">
            <CardTitle className="text-3xl font-bold text-red-600">خطأ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <div className="text-sm text-center w-full">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                طلب رابط إعادة تعيين جديد
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-md">
      <Card className="shadow-2xl">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-3xl font-bold">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription>
            أدخل كلمة المرور الجديدة لحسابك
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 p-8">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>خطأ</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="default" className="bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>نجاح!</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Lock className="me-2 h-4 w-4" />
                      كلمة المرور الجديدة
                    </FormLabel>
                    <FormControl>
                      <PasswordInputWithStrength
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="********"
                        className={isLoading || !!success ? 'opacity-50 cursor-not-allowed' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Lock className="me-2 h-4 w-4" />
                      تأكيد كلمة المرور
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isLoading || !!success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-8 pt-0">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isLoading || !!success}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري إعادة التعيين...
                  </>
                ) : (
                  'إعادة تعيين كلمة المرور'
                )}
              </Button>
              <div className="text-sm text-center">
                <Link href="/auth/login" className="text-primary hover:underline">
                  العودة إلى تسجيل الدخول
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}