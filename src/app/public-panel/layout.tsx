
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Church, ArrowRightToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import InstallPWAButton from '@/components/shared/InstallPWAButton';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Church className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">منصة الكنيسة</span>
          </Link>
          <div className="flex items-center gap-2">
            <InstallPWAButton />
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowRightToLine className="me-2 h-4 w-4" />
                العودة للرئيسية
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/20">
        {children}
      </main>
    </div>
  );
}
