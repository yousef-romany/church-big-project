
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ClipboardList, Church, BookOpenCheck, Plane, User as UserIcon } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import InstallPWAButton from '@/components/shared/InstallPWAButton';
import { usePathname } from 'next/navigation';
import { MakhdoumRoleProvider } from '@/contexts/MakhdoumRoleContext';

const navItems = [
  { href: "/makhdoum-panel/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/makhdoum-panel/tasks", icon: ClipboardList, label: "مهامي" },
  { href: "/public-panel/confession-request", icon: BookOpenCheck, label: "طلب اعتراف" },
  { href: "/public-panel/trips", icon: Plane, label: "الرحلات المتاحة" },
];

export default function RegularMakhdoumPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <MakhdoumRoleProvider>
      <SidebarProvider defaultOpen>
        <Sidebar side="right" collapsible="icon">
          <SidebarHeader className="p-4">
            <Link href="/makhdoum-panel/dashboard" className="flex items-center gap-2">
              <Church className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
                بوابة المخدوم
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <nav className="grid gap-1 px-2 group-[[data-collapsible=icon]]:hidden">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2 mt-auto">
              <ThemeToggle />
              <InstallPWAButton />
            </div>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </MakhdoumRoleProvider>
  );
}
