
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookUser, Footprints, UsersRound, SendHorizonal, Settings, Church, Search, ArrowRightToLine } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import InstallPWAButton from '@/components/shared/InstallPWAButton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react'; // تمت الإضافة
import { requestNotificationPermission, setupOnMessageListener, isFCMSupported } from '@/lib/firebase/messagingService'; // تمت الإضافة
import { useToast } from '@/hooks/use-toast'; // تمت الإضافة
import DevotionalMessageDisplay from '@/components/priest-panel/DevotionalMessageDisplay';


const navItems = [
  { href: "/priest-panel/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/priest-panel/confessions", icon: BookUser, label: "سكرتارية الاعتراف" },
  { href: "/priest-panel/visitations", icon: Footprints, label: "خدمة الافتقاد" },
  { href: "/priest-panel/families/add", icon: UsersRound, label: "إضافة أسرة" },
  { href: "/priest-panel/send-servant", icon: SendHorizonal, label: "إرسال خادم" },
];

export default function PriestPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast(); // تمت الإضافة

  useEffect(() => {
    // تأكد من أن الكود يعمل فقط في المتصفح وأن FCM مدعوم ومُعد بشكل صحيح
    if (typeof window !== 'undefined' && isFCMSupported()) {
      requestNotificationPermission().then(token => {
        if (token) {
          console.log("FCM Token obtained in layout:", token);
          // TODO: قم بإرسال هذا التوكن إلى خادمك وربطه بالكاهن الحالي
          // مثال: sendTokenToServer(token);
        } else {
          console.log("Failed to get FCM token or permission denied.");
        }
      }).catch(error => {
        console.error("Error requesting notification permission:", error);
      });

      const handleIncomingMessage = (payload: any) => {
        console.log('Foreground message received in layout:', payload);
        if (payload.notification) {
          toast({
            title: payload.notification.title || "إشعار جديد",
            description: payload.notification.body || "لديك رسالة جديدة.",
            duration: 10000, // عرض الإشعار لمدة أطول
          });
        }
      };
      
      // إعداد مستمع الرسائل واستلام دالة إلغاء الاشتراك
      const unsubscribe = setupOnMessageListener(handleIncomingMessage);

      // دالة التنظيف لإلغاء الاشتراك عند تفكيك المكون
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } else if (typeof window !== 'undefined') { // إذا كان في المتصفح ولكن FCM غير مدعوم
        console.log("Firebase Cloud Messaging is not supported in this browser or not configured properly.");
        // يمكنك هنا عرض رسالة للمستخدم إذا كانت الإعدادات غير مكتملة
        if (firebaseConfig.messagingSenderId === "YOUR_MESSAGING_SENDER_ID" || firebaseConfig.apiKey === "YOUR_API_KEY") {
            console.warn("Firebase configuration is incomplete. Please check firebaseConfig.ts");
        }
    }
  }, [toast]); // toast الآن جزء من الـ dependencies

  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="right" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/priest-panel/dashboard" className="flex items-center gap-2">
            <Church className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              لوحة الكاهن
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    className="w-full justify-start"
                    tooltip={{ children: item.label, side: "left" }}
                    isActive={pathname === item.href || (item.href !== "/priest-panel/dashboard" && pathname.startsWith(item.href))}
                  >
                    <item.icon className="h-5 w-5 me-2" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 space-y-2">
           <DevotionalMessageDisplay />
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start" tooltip={{ children: "العودة للرئيسية", side: "left" }} asChild>
                   <Link href="/">
                    <ArrowRightToLine className="h-5 w-5 me-2" />
                    <span className="group-data-[collapsible=icon]:hidden">العودة للرئيسية</span>
                   </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start" tooltip={{ children: "الإعدادات", side: "left" }}>
                    <Settings className="h-5 w-5 me-2" />
                    <span className="group-data-[collapsible=icon]:hidden">الإعدادات</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="md:hidden">
                 <SidebarTrigger />
            </div>
          <div className="flex-1">
            {/* Optional: Breadcrumbs or page title can go here */}
          </div>
          <div className="flex items-center gap-4">
            <form className="hidden md:flex ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="بحث..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
                />
              </div>
            </form>
            <InstallPWAButton />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/priestavatar/40/40" alt="كاهن" data-ai-hint="priest avatar" />
                    <AvatarFallback>ك</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                <DropdownMenuItem>الدعم</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-6 bg-muted/40 dark:bg-background/40 overflow-y-auto">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Make sure firebaseConfig is imported if used directly here, or rely on isFCMSupported
import { firebaseConfig } from '@/lib/firebase/firebaseConfig';
