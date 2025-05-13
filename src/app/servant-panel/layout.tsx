
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ListChecks, History, Settings, Church, Search } from 'lucide-react';
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

const navItems = [
  { href: "/servant-panel/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/servant-panel/tasks", icon: ListChecks, label: "مهام الافتقاد" },
  { href: "/servant-panel/history", icon: History, label: "المهام المنجزة" },
];

export default function ServantPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="right" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/servant-panel/dashboard" className="flex items-center gap-2">
            <Church className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              لوحة الخادم
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
                    isActive={pathname === item.href || (item.href !== "/servant-panel/dashboard" && pathname.startsWith(item.href))}
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
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/servantavatar/40/40" alt="خادم" data-ai-hint="servant avatar" />
                    <AvatarFallback>خ</AvatarFallback>
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
