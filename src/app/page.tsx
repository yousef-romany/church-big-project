
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a public-facing page by default.
    // Admin/Priest/Servant panels can be accessed via direct URLs or logins (not implemented).
    router.replace('/public/instructions'); 
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="sr-only">جاري التحميل...</p>
    </div>
  );
}
