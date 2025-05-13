
'use client';

import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        window.location.reload();
      };
      window.addEventListener('online', handleOnline);
      return () => {
        window.removeEventListener('online', handleOnline);
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground p-6 text-center">
      <WifiOff className="h-24 w-24 text-primary mb-8 animate-pulse" />
      <h1 className="text-4xl font-bold mb-4">أنت غير متصل بالإنترنت</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        يبدو أنك فقدت الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
      </p>
      <Button onClick={handleRetry} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
        إعادة المحاولة
      </Button>
      <p className="text-sm text-muted-foreground mt-8">
        إذا كنت قد قمت بتثبيت التطبيق، فقد تتمكن من الوصول إلى بعض المحتوى الذي تم تخزينه مؤقتًا.
      </p>
    </div>
  );
}
