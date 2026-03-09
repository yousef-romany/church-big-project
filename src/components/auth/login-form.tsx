"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, Lock, LogIn, Building, UserSquare, UserCheck, Users, Footprints, CalendarCheck, Baby, Shield, AlertCircle, Facebook } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  title: string;
  description?: string;
  redirectPath: string;
  userRoleIconName?: 'Building' | 'UserSquare' | 'UserCheck' | 'Users' | 'Footprints' | 'CalendarCheck' | 'Baby' | 'Shield';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const fieldVariants = (delay: number) => ({
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay } },
});

export default function LoginForm({ title, description, redirectPath, userRoleIconName }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
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
        callbackUrl: redirectPath,
      });

      if (result?.error) {
        let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        if (result.error === 'CredentialsSignin') {
            errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        } else if (result.error.includes('Email not verified')) {
            errorMessage = 'الحساب غير مفعل. الرجاء مراجعة بريدك الإلكتروني لتفعيل الحساب.';
        } else if (result.error.includes('الحساب مقفل')) {
            // Account locked error - show the full message
            errorMessage = result.error;
        } else if (result.error.includes('تم تجاوز عدد المحاولات')) {
            // Account just locked
            errorMessage = result.error;
        }
        setError(errorMessage);
        toast({
          title: 'فشل تسجيل الدخول',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'تم تسجيل الدخول بنجاح!', description: `مرحبًا بك، جاري توجيهك...` });
        router.push(redirectPath);
      }
    } catch (err: any) {
        const errorMessage = err.message || 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          title: 'فشل تسجيل الدخول',
          description: errorMessage,
          variant: 'destructive',
        });
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    try {
      const result = await signIn('facebook', {
        redirect: false,
        callbackUrl: redirectPath,
      });

      if (result?.error) {
        setError('فشل تسجيل الدخول عبر فيسبوك. يرجى المحاولة مرة أخرى.');
        toast({
          title: 'فشل تسجيل الدخول',
          description: 'فشل تسجيل الدخول عبر فيسبوك. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'تم تسجيل الدخول بنجاح!', description: `مرحبًا بك، جاري توجيهك...` });
        router.push(redirectPath);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred with Facebook login.';
      setError(errorMessage);
      toast({
        title: 'فشل تسجيل الدخول',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const renderIcon = () => {
    if (!userRoleIconName) return null;
    const commonProps = { className: "mx-auto h-12 w-12 text-primary mb-3" };
    switch (userRoleIconName) {
      case 'Building': return <Building {...commonProps} />;
      case 'UserSquare': return <UserSquare {...commonProps} />;
      case 'UserCheck': return <UserCheck {...commonProps} />;
      case 'Users': return <Users {...commonProps} />;
      case 'Footprints': return <Footprints {...commonProps} />;
      case 'CalendarCheck': return <CalendarCheck {...commonProps} />;
      case 'Baby': return <Baby {...commonProps} />;
      case 'Shield': return <Shield {...commonProps} />;
      default: return null;
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-md">
      <Card className="shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-6">
          {renderIcon()}
          <CardTitle className="text-2xl md:text-3xl font-bold">{title}</CardTitle>
          {description && <CardDescription className="text-sm md:text-base mt-1">{description}</CardDescription>}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 p-6 md:p-8">
               {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <motion.div variants={fieldVariants(0.1)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-base">
                        <Mail className="me-2 h-5 w-5 text-muted-foreground" />
                        البريد الإلكتروني
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="example@email.com" 
                          {...field} 
                          className="h-12 text-base transition-shadow duration-300 focus:shadow-md" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={fieldVariants(0.2)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-base">
                        <Lock className="me-2 h-5 w-5 text-muted-foreground" />
                        كلمة المرور
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="********" 
                          {...field} 
                          className="h-12 text-base transition-shadow duration-300 focus:shadow-md" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={fieldVariants(0.3)} className="text-sm">
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                  هل نسيت كلمة المرور؟
                </Link>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 md:p-8 border-t">
              <motion.div variants={fieldVariants(0.4)} className="w-full">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold transition-transform hover:scale-105 active:scale-95" 
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                     <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="me-2 h-5 w-5 border-2 border-transparent border-t-primary-foreground rounded-full"
                       />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      <LogIn className="me-2 h-5 w-5" /> تسجيل الدخول
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div variants={fieldVariants(0.5)} className="w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 text-lg font-semibold transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2" 
                  onClick={handleFacebookSignIn}
                  size="lg"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                  تسجيل الدخول عبر فيسبوك
                </Button>
              </motion.div>
              <motion.div variants={fieldVariants(0.6)} className="text-sm text-center">
                ليس لديك حساب؟{' '}
                <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                  إنشاء حساب جديد
                </Link>
              </motion.div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
