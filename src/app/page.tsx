
'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { BookingForm } from '@/components/bookings/booking-form';
import { BookingTable } from '@/components/bookings/booking-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Plus, Settings2, Layout } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useApp } from '@/app/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { showStats, showRecentBookings, toggleDashboardSection } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
      {/* Header section with action button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5 h-11 px-5">
                <Settings2 className="h-5 w-5" />
                Customize
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Display Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStats}
                onCheckedChange={() => toggleDashboardSection('stats')}
              >
                Business Metrics
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showRecentBookings}
                onCheckedChange={() => toggleDashboardSection('bookings')}
              >
                Recent Bookings
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <BookingForm trigger={
            <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6">
              <Plus className="h-5 w-5" />
              New Booking
            </Button>
          } />
        </div>
      </div>

      {/* Core Business Metrics */}
      {showStats && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <StatCards />
        </div>
      )}

      {/* Main Content: Recent Activity */}
      {showRecentBookings && (
        <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-card flex flex-row items-center justify-between border-b border-border/40 pb-6">
            <div>
              <CardTitle className="text-xl font-headline font-bold text-primary">Recent Bookings</CardTitle>
              <CardDescription>The latest appointments scheduled in your system</CardDescription>
            </div>
            <Link href="/bookings" className="text-sm font-bold text-accent flex items-center gap-1.5 hover:underline group">
              View All <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <BookingTable />
          </CardContent>
        </Card>
      )}

      {!showStats && !showRecentBookings && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/20 rounded-3xl border border-dashed border-border/60 animate-in fade-in zoom-in duration-500">
          <Layout className="h-12 w-12 opacity-20 mb-4" />
          <p className="text-lg font-medium">Dashboard is empty</p>
          <p className="text-sm">Use the Customize menu to add sections back to your view.</p>
        </div>
      )}
    </div>
  );
}
