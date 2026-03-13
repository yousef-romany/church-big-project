"use client";

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

function TwoFactorLoginContent({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/login-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'فشل التحقق من الرمز');
      }
      
      toast({
        title: 'نجاح!',
        description: 'تم تسجيل الدخول بنجاح',
      });
      
      setTimeout(() => {
        router.push(callbackUrl);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التحقق');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-3xl font-bold">التحقق الثنائي</CardTitle>
          <CardDescription>
            أدخل الرمز المرسل إلى هاتفك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">الرمز</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="أدخل الرمز المكون من 6 خانات"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={isSubmitting}
                  className="text-center text-lg tracking-widest"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || code.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  تحقق
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <Link 
              href="/auth/login" 
              className="text-sm text-primary hover:underline flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TwoFactorLoginSearchParams() {
  const router = useRouter();
  
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <TwoFactorSearchHelper />
    </Suspense>
  );
}

function TwoFactorSearchHelper() {
  return (
    <TwoFactorLoginContent callbackUrl={'/admin'} />
  );
}

export default function TwoFactorLoginPage() {
  return <TwoFactorLoginSearchParams />;
}