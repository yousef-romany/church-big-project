'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type VerificationStatus = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [message, setMessage] = useState('جاري تفعيل حسابك...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('رابط التفعيل غير صالح أو مفقود.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        setMessage(data.message);

        if (!res.ok) {
          setStatus('error');
        } else {
          setStatus('success');
        }
      } catch (error) {
        setStatus('error');
        setMessage('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      }
    };

    verifyToken();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">{message}</p>
          </div>
        );
      case 'success':
        return (
          <Alert variant="default" className="bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">نجاح!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {message}
            </AlertDescription>
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link href="/auth/login">الذهاب لصفحة تسجيل الدخول</Link>
              </Button>
            </div>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ في التفعيل</AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">تفعيل الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
}