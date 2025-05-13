
"use client";

import Link from 'next/link';
import { Church, Building, UserSquare, Users, UserCheck, LogIn, Menu, Twitter, Facebook, Instagram, Youtube, ScrollText, Megaphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import InstallPWAButton from '@/components/shared/InstallPWAButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';

const MotionLink = motion(Link);
const MotionButton = motion(Button);

const navLinks = [
  { href: '#hero', label: 'الرئيسية' },
  { href: '#services', label: 'خدماتنا' },
  { href: '#user-types', label: 'بوابات الدخول' },
  { href: '#contact', label: 'تواصل معنا' },
];

const userSections = [
  {
    title: 'بوابة إدارة الكنيسة',
    description: 'أدوات شاملة لإدارة شؤون الكنيسة، الإعلانات، والبيانات العامة بكفاءة وسهولة.',
    iconName: 'Building',
    href: '/auth/admin/login', 
    animation: { type: 'slide', direction: 'top' },
    delay: 0.2,
    color: 'text-blue-500', // Kept for icon, consider using primary theme color
    bg: 'bg-blue-500/10', // Kept for icon background
    buttonText: 'دخول الإدارة',
  },
  {
    title: 'بوابة الكهنة',
    description: 'متابعة خدمة الافتقاد، تنظيم مواعيد الاعترافات، وإدارة بيانات الأسر المخدومة.',
    iconName: 'UserSquare',
    href: '/auth/priest/login', 
    animation: { type: 'bounce' },
    delay: 0.4,
    color: 'text-green-500', // Kept for icon
    bg: 'bg-green-500/10', // Kept for icon background
    buttonText: 'دخول الكهنة',

  },
  {
    title: 'بوابة الخدام',
    description: 'استلام مهام الافتقاد، تسجيل الزيارات، وتقديم تقارير الخدمة بشكل مبسط.',
    iconName: 'Users',
    href: '/auth/servant/login', 
    animation: { type: 'fadeScale' },
    delay: 0.6,
    color: 'text-purple-500', // Kept for icon
    bg: 'bg-purple-500/10', // Kept for icon background
    buttonText: 'دخول الخدام',
  },
  {
    title: 'بوابة المخدومين',
    description: 'طلب مواعيد الاعتراف، الاطلاع على تعليمات الكنيسة، والمشاركة في الأنشطة الروحية.',
    iconName: 'UserCheck',
    href: '/auth/public/login', 
    animation: { type: 'slide', direction: 'bottom' },
    delay: 0.8,
    color: 'text-yellow-500', // Kept for icon
    bg: 'bg-yellow-500/10', // Kept for icon background
    buttonText: 'دخول المخدومين',
  },
];

const iconComponents: { [key: string]: React.ElementType } = {
  Building,
  UserSquare,
  Users,
  UserCheck,
  Megaphone,
  ScrollText,
};


const sectionAnimationVariants = {
  slide_top: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  bounce: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 120, damping: 10 }
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  slide_bottom: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};


export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background text-foreground flex flex-col" suppressHydrationWarning>
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg"
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="الشعار والعودة للرئيسية">
            <Church className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold tracking-tight">منصة الكنيسة</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <MotionLink 
                key={link.label} 
                href={link.href} 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </MotionLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <InstallPWAButton />
            <ThemeToggle />
            <Button asChild variant="default" className="hidden md:flex group">
              <Link href="/auth/admin/login"> 
                <LogIn className="me-2 h-4 w-4 group-hover:animate-pulse" /> تسجيل الدخول
              </Link>
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">فتح القائمة</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background p-6">
                <div className="flex flex-col space-y-6">
                    <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                        <Church className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">منصة الكنيسة</span>
                    </Link>
                    {navLinks.map((link) => (
                    <Link 
                        key={link.label} 
                        href={link.href} 
                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                    ))}
                    <Button asChild variant="default" size="lg" className="mt-4" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/auth/admin/login"> 
                            <LogIn className="me-2 h-5 w-5" /> تسجيل الدخول
                        </Link>
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-grow">
        <motion.section 
          id="hero"
          className="relative py-20 md:py-32 bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/seed/churchbg/1600/900')" }}
          data-ai-hint="church interior congregation"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            >
                <Church className="mx-auto h-20 w-20 text-primary mb-6" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
            >
              منصة الكنيسة الموحدة
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300"
            >
              مكان واحد يجمع الكنيسة، الكاهن، الخدام، والمخدومين لخدمة روحية متكاملة ومنظمة.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "backOut" }} 
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
              <MotionButton 
                size="lg" 
                asChild 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="#services">اكتشف المزيد</Link>
              </MotionButton>
              <MotionButton 
                size="lg" 
                variant="outline" 
                asChild 
                className="bg-background/20 hover:bg-background/30 text-white border-white/50 hover:border-white shadow-lg"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="#user-types">بوابات الدخول</Link>
              </MotionButton>
            </motion.div>
          </div>
        </motion.section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary">خدماتنا المتكاملة</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                نوفر مجموعة من الأدوات الرقمية المصممة خصيصًا لتسهيل وتنظيم الخدمة الكنسية بجميع جوانبها.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "إدارة الرعية", description: "تنظيم بيانات الأسر والخدام، وتتبع الأنشطة والفعاليات الكنسية.", iconName: "Users" },
                { title: "التواصل الفعال", description: "نظام إعلانات متقدم، وتسهيل التواصل بين جميع أفراد الكنيسة.", iconName: "Megaphone" },
                { title: "الخدمة الروحية", description: "تسهيل طلب الاعترافات، ونشر التعليمات الروحية الهامة.", iconName: "ScrollText" }
              ].map((service, index) => {
                const IconComponent = iconComponents[service.iconName];
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0px 8px 25px -5px hsla(var(--primary), 0.15), 0px 5px 15px -6px hsla(var(--primary), 0.1)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-card rounded-xl shadow-lg text-center"
                >
                  {IconComponent && <IconComponent className="h-10 w-10 text-primary mb-4 mx-auto" />}
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </motion.div>
              )})}
            </div>
          </div>
        </section>


        {/* User Type Sections */}
        <section id="user-types" className="py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary">بوابات الدخول المخصصة</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                لكل فئة واجهة مصممة لتلبية احتياجاتها الخاصة وتسهيل مهامها.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {userSections.map((section) => {
                const animationProps = section.animation.type === 'slide' 
                  ? sectionAnimationVariants[`slide_${section.animation.direction as 'top' | 'bottom'}`]
                  : sectionAnimationVariants[section.animation.type as 'bounce' | 'fadeScale'];
                const IconComponent = iconComponents[section.iconName];
                
                return (
                  <motion.div
                    key={section.title}
                    initial={animationProps.initial}
                    whileInView={animationProps.animate}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...animationProps.transition, delay: section.delay }}
                    className={`flex flex-col rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${section.bg} border border-transparent hover:border-primary/30`}
                  >
                    <div className="p-8 flex flex-col items-center text-center flex-grow bg-card">
                      <div className={`p-4 rounded-full ${section.bg} mb-6 inline-block`}>
                        {IconComponent && <IconComponent className={`h-12 w-12 ${section.color}`} />}
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-foreground">{section.title}</h3>
                      <p className="text-muted-foreground text-sm mb-6 flex-grow">{section.description}</p>
                      <Button asChild variant="default" size="lg" className="w-full mt-auto group transform hover:scale-105 transition-transform duration-300">
                        <Link href={section.href}>
                           {section.buttonText} <LogIn className="ms-2 h-4 w-4 group-hover:animate-pulse" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer 
        id="contact"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeIn" }}
        className="bg-card-foreground text-primary-foreground border-t border-border/20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Church className="h-8 w-8" />
                <h3 className="text-xl font-semibold">منصة الكنيسة</h3>
              </div>
              <p className="text-sm text-primary-foreground/80">
                نعمل على تقريب المسافات وتسهيل الخدمة باستخدام أحدث التقنيات.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.slice(1).map(link => (
                     <li key={link.label}><Link href={link.href} className="hover:text-primary-foreground/70 transition-colors">{link.label}</Link></li>
                ))}
                <li><Link href="#" className="hover:text-primary-foreground/70 transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="#" className="hover:text-primary-foreground/70 transition-colors">شروط الاستخدام</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <p className="text-sm text-primary-foreground/80 mb-2">info@churchplatform.example</p>
              <p className="text-sm text-primary-foreground/80 mb-4">+1234567890</p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <Link href="#" aria-label="Facebook" className="text-primary-foreground/80 hover:text-white transition-colors"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" aria-label="Twitter" className="text-primary-foreground/80 hover:text-white transition-colors"><Twitter className="h-6 w-6" /></Link>
                <Link href="#" aria-label="Instagram" className="text-primary-foreground/80 hover:text-white transition-colors"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" aria-label="YouTube" className="text-primary-foreground/80 hover:text-white transition-colors"><Youtube className="h-6 w-6" /></Link>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70">
            <p>&copy; {new Date().getFullYear()} منصة الكنيسة. جميع الحقوق محفوظة.</p>
            <p className="mt-1">تصميم وتطوير بحب لخدمة الكنيسة.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
