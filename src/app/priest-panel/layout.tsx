
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookUser, Footprints, UsersRound, SendHorizonal, Settings, Church, Search, ArrowRightToLine, ClipboardList, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import DevotionalMessageDisplay from '@/components/priest-panel/DevotionalMessageDisplay';

// Define navigation structure for accordion
const groupedNavItems = [
  {
    isGroup: false,
    href: "/priest-panel/dashboard",
    icon: LayoutDashboard,
    label: "لوحة التحكم"
  },
  {
    groupTitle: "إدارة الاعترافات",
    icon: BookUser,
    defaultOpen: true, // To have this accordion open by default
    items: [
      { href: "/priest-panel/confessions", icon: ClipboardList, label: "جدول المواعيد والسكرتارية" },
    ]
  },
  {
    groupTitle: "خدمات الرعية",
    icon: UsersRound, // Using a general icon for the group
    items: [
      { href: "/priest-panel/visitations", icon: Footprints, label: "خدمة الافتقاد" },
      { href: "/priest-panel/families/add", icon: UsersRound, label: "إضافة أسرة" },
      { href: "/priest-panel/send-servant", icon: SendHorizonal, label: "إرسال خادم" },
    ]
  },
];


export default function PriestPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
 
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
          <Accordion type="multiple" defaultValue={groupedNavItems.filter(g => g.isGroup && g.defaultOpen).map(g => g.groupTitle)} className="w-full">
            {groupedNavItems.map((groupOrItem, index) => {
              if (groupOrItem.isGroup === false && groupOrItem.href) { // Direct link
                return (
                  <SidebarMenuItem key={groupOrItem.label}>
                    <Link href={groupOrItem.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        className="w-full justify-start"
                        tooltip={{ children: groupOrItem.label, side: "left" }}
                        isActive={pathname === groupOrItem.href || (groupOrItem.href !== "/priest-panel/dashboard" && pathname.startsWith(groupOrItem.href))}
                      >
                        <groupOrItem.icon className="h-5 w-5 me-2" />
                        <span className="group-data-[collapsible=icon]:hidden">{groupOrItem.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              }
              
              // Accordion Group
              const GroupIcon = groupOrItem.icon;
              return (
                <AccordionItem value={groupOrItem.groupTitle || `group-${index}`} key={groupOrItem.groupTitle || `group-${index}`} className="border-none">
                  <AccordionTrigger 
                    className="p-0 hover:no-underline group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:hover:bg-sidebar-accent group-data-[collapsible=icon]:aria-expanded:bg-sidebar-accent"
                    asChild
                  >
                     <SidebarMenuButton
                        className="w-full justify-start group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                        tooltip={{ children: groupOrItem.groupTitle, side: "left" }}
                        // An accordion group itself isn't "active" like a link, but its children can be
                        // To show some indication if a child is active, we might need more complex logic or styling
                      >
                        <GroupIcon className="h-5 w-5 group-data-[collapsible=icon]:m-0 md:me-2" />
                        <span className="group-data-[collapsible=icon]:hidden">{groupOrItem.groupTitle}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ms-auto group-data-[state=open]:rotate-180" />
                      </SidebarMenuButton>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu className="ps-3 pt-1 border-s-2 border-primary/20 ms-3">
                      {groupOrItem.items && groupOrItem.items.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <Link href={item.href} legacyBehavior passHref>
                            <SidebarMenuButton
                              className="w-full justify-start"
                              tooltip={{ children: item.label, side: "left" }}
                              isActive={pathname === item.href || pathname.startsWith(item.href)}
                            >
                              <item.icon className="h-4 w-4 me-2" />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
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
    
