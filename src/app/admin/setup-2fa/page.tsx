'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, Loader2, Copy, Check } from 'lucide-react';

export default function TwoFactorSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'setup' | 'verify' | 'success'>('setup');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    // Check if 2FA is already enabled
    const checkTwoFactorStatus = async () => {
      try {
        const response = await fetch('/api/auth/2fa/status');
        const data = await response.json();
        
        if (data.enabled) {
          router.push('/admin/settings');
        }
      } catch (error) {
        console.error('Error checking 2FA status:', error);
      }
    };

    checkTwoFactorStatus();
  }, [status, session, router]);

  const setupTwoFactor = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/setup');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup 2FA');
      }
      
      setSecret(data.secret);
      setQrCodeUrl(data.qrCode);
      setBackupCodes(data.backupCodes);
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'خطأ',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: verificationCode,
          secret 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid code');
      }
      
      setStep('success');
      toast({
        title: 'نجاح!',
        description: 'تم تفعيل المصادقة الثنائية بنجاح.',
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/settings');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'خطأ',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'secret' | 'codes') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'secret') {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedCodes(true);
        setTimeout(() => setCopiedCodes(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">إعداد المصادقة الثنائية</CardTitle>
            <CardDescription>
              قم بتأمين حسابك باستخدام تطبيق المصادقة الثنائية مثل Google Authenticator أو Authy
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'setup' && (
              <div className="space-y-4">
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>ملاحظات هامة</AlertTitle>
                  <AlertDescription>
                    • سيطلب منك إدخال رمز من تطبيق المصادقة في كل مرة تقوم بتسجيل الدخول<br />
                    • تأكد من حفظ رموز النسخ الاحتياطي في مكان آمن<br />
                    • يمكن استخدام هذه الرموز مرة واحدة فقط
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={setupTwoFactor} 
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإعداد...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      بدء إعداد المصادقة الثنائية
                    </>
                  )}
                </Button>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr">1. امسح رمز QR</Label>
                    {qrCodeUrl && (
                      <div className="flex justify-center mt-2 p-4 bg-white rounded-lg">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code for 2FA" 
                          className="w-48 h-48"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="secret">2. أو أدخل المفتاح يدوياً</Label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        value={secret} 
                        readOnly 
                        className="font-mono"
                      />
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(secret, 'secret')}
                      >
                        {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="code">3. أدخل الرمز المكون من 6 أرقام</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="text-center text-lg tracking-widest mt-2"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <details className="cursor-pointer">
                    <summary className="font-semibold mb-2">عرض رموز النسخ الاحتياطي</summary>
                    <Alert className="mt-2">
                      <AlertTitle>رموز النسخ الاحتياطي</AlertTitle>
                      <AlertDescription className="space-y-1">
                        <p>احفظ هذه الرموز في مكان آمن. يمكن استخدامها مرة واحدة فقط:</p>
                        <div className="flex gap-2 mt-2">
                          <Input 
                            value={backupCodes.join(', ')} 
                            readOnly 
                            className="font-mono text-sm"
                          />
                          <Button 
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(backupCodes.join(', '), 'codes')}
                          >
                            {copiedCodes ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </details>
                </div>

                <Button 
                  onClick={verifyTwoFactor} 
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    'تفعيل المصادقة الثنائية'
                  )}
                </Button>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4">
                <Alert className="bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">نجاح!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    تم تفعيل المصادقة الثنائية بنجاح. سيتم توجيهك إلى صفحة الإعدادات...
                  </AlertDescription>
                </Alert>
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}