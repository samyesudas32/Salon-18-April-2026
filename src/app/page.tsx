
'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { BookingForm } from '@/components/bookings/booking-form';
import { BookingTable } from '@/components/bookings/booking-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
      {/* Header section with action button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-3">
          <BookingForm trigger={
            <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6">
              <Plus className="h-5 w-5" />
              New Booking
            </Button>
          } />
        </div>
      </div>

      {/* Core Business Metrics */}
      <StatCards />

      {/* Main Content: Recent Activity */}
      <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-2xl">
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
    </div>
  );
}
