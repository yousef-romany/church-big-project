
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Church, Home, Send, ScrollText, ArrowRightToLine } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: "/public/request-confession", icon: Send, label: "طلب اعتراف" },
  { href: "/public/instructions", icon: ScrollText, label: "تعليمات الكنيسة" },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.header 
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/public/instructions" className="flex items-center gap-2" aria-label="الصفحة الرئيسية للخدمات العامة">
            <Church className="h-7 w-7 text-primary" />
            <span className="font-semibold text-lg hidden sm:inline">خدمات المخدومين</span>
          </Link>
          
          <nav className="flex items-center gap-2 sm:gap-4">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} legacyBehavior passHref>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </motion.a>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
             <Link href="/" legacyBehavior passHref>
               <Button variant="outline" size="sm">
                 <ArrowRightToLine className="me-1.5 h-4 w-4" /> الرئيسية
               </Button>
            </Link>
            <Link href="/dashboard" legacyBehavior passHref>
               <Button variant="ghost" size="sm">لوحة التحكم</Button>
            </Link>
          </div>
        </div>
      </motion.header>
      <main className="flex-1 container max-w-screen-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
       <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-6 border-t"
      >
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} كنيسة السيدة العذراء مريم. جميع الحقوق محفوظة.
        </div>
      </motion.footer>
    </div>
  );
}

// Helper cn function (can be in lib/utils)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

