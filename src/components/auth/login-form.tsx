
"use client";

import type { LucideIcon } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  title: string;
  description?: string;
  redirectPath: string;
  userRoleIcon?: LucideIcon;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const fieldVariants = (delay: number) => ({
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay } },
});

export default function LoginForm({ title, description, redirectPath, userRoleIcon: UserRoleIcon }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    // Simulate login
    console.log("Login attempt:", data);
    toast({
      title: "تم تسجيل الدخول بنجاح!",
      description: `مرحبًا بك، جاري توجيهك...`,
    });
    router.push(redirectPath);
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-md">
      <Card className="shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-6">
          {UserRoleIcon && <UserRoleIcon className="mx-auto h-12 w-12 text-primary mb-3" />}
          <CardTitle className="text-2xl md:text-3xl font-bold">{title}</CardTitle>
          {description && <CardDescription className="text-sm md:text-base mt-1">{description}</CardDescription>}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 p-6 md:p-8">
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
                <Link href="#" className="text-primary hover:underline">
                  هل نسيت كلمة المرور؟
                </Link>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 md:p-8 border-t">
              <motion.div variants={fieldVariants(0.4)} className="w-full">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold transition-transform hover:scale-105 active:scale-95" 
                  disabled={form.formState.isSubmitting}
                  size="lg"
                >
                  {form.formState.isSubmitting ? (
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
              <motion.div variants={fieldVariants(0.5)} className="text-sm text-center">
                ليس لديك حساب؟{' '}
                <Link href="#" className="font-semibold text-primary hover:underline">
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
