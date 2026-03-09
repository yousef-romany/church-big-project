"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  UserCheck,
  Users2,
  Megaphone,
  BarChart3,
  FileText
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const navigationItems = [
  {
    title: 'نظرة عامة',
    href: '/admin',
    icon: Home
  },
  {
    title: 'معلومات الكنيسة',
    href: '/admin/church-information',
    icon: Building
  },
  {
    title: 'إدارة المستخدمين',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'إدارة الكهنة',
    href: '/admin/priests',
    icon: UserCheck
  },
  {
    title: 'قاعدة بيانات العائلات',
    href: '/admin/families',
    icon: Users2
  },
  {
    title: 'الإعلانات',
    href: '/admin/announcements',
    icon: Megaphone
  },
  {
    title: 'الفعاليات والأنشطة',
    href: '/admin/events',
    icon: Calendar
  },
  {
    title: 'التقارير والتحليلات',
    href: '/admin/reports',
    icon: BarChart3
  },
  {
    title: 'إدارة المحتوى',
    href: '/admin/content',
    icon: FileText
  },
  {
    title: 'التحكم الإداري',
    href: '/admin/settings',
    icon: Settings
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    toast({
      title: 'تم تسجيل الخروج',
      description: 'لقد تم تسجيل خروجك بنجاح.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">لوحة التحكم</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="ml-3 h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              
              <Link href="/admin" className="flex items-center">
                <Building className="h-8 w-8 text-primary ml-2" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">لوحة تحكم الإدارة</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                مرحباً، {session?.user?.name}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                aria-label="تسجيل الخروج"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <nav className="mt-5 flex-1 px-2 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <item.icon className="ml-3 h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}