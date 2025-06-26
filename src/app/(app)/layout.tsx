
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Users, UserSquare, Megaphone, Church, Settings, Menu, Search, ArrowRightToLine, User as UserIcon } from 'lucide-react';
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

const navItems = [
  { href: "/dashboard", icon: Home, label: "الرئيسية" },
  { href: "/dashboard/priests", icon: UserSquare, label: "الكهنة" },
  { href: "/dashboard/families", icon: Users, label: "العائلات" },
  { href: "/dashboard/announcements", icon: Megaphone, label: "الإعلانات" },
  { href: "/dashboard/church-info", icon: Church, label: "بيانات الكنيسة" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="right" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Church className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              إدارة الكنيسة
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
                  >
                    <item.icon className="h-5 w-5 me-2" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
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
                <SidebarMenuButton asChild className="w-full justify-start" tooltip={{ children: "الملف الشخصي", side: "left" }}>
                    <Link href="/dashboard/profile">
                        <UserIcon className="h-5 w-5 me-2" />
                        <span className="group-data-[collapsible=icon]:hidden">الملف الشخصي</span>
                    </Link>
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
                    <AvatarImage src="https://picsum.photos/id/237/40/40" alt="مدير" data-ai-hint="user avatar" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard/profile">الملف الشخصي</Link></DropdownMenuItem>
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
