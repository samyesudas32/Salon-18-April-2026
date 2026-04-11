'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarClock, 
  CalendarCheck, 
  Users, 
  FileText, 
  LogOut, 
  Settings,
  Shield,
  Wallet,
  ShoppingBag,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useApp } from '@/app/lib/store';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Upcoming', href: '/bookings/upcoming', icon: CalendarClock },
  { name: 'Completed', href: '/bookings/completed', icon: CalendarCheck },
  { name: 'All Bookings', href: '/bookings', icon: Calendar },
  { name: 'Service Delivery', href: '/service-delivery', icon: Briefcase },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Daily Expense', href: '/expenses', icon: Wallet },
  { name: 'Product Expenses', href: '/product-expenses', icon: ShoppingBag },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { logout, isLoggedIn } = useApp();

  if (!isLoggedIn || pathname === '/login') return null;

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            G
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">Salon of Guzellik</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 uppercase text-[10px] font-bold tracking-widest px-2 mb-2">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center gap-3 py-2.5">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <div className="px-2 py-4 mb-2 bg-muted/30 rounded-lg border border-border/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Administrator</span>
              <span className="text-[10px] text-muted-foreground">Local Session</span>
            </div>
          </div>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
              <span>Logout System</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
