
'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { BookingForm } from '@/components/bookings/booking-form';
import { BookingTable } from '@/components/bookings/booking-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Business Dashboard</h2>
          <p className="text-muted-foreground mt-1 text-lg">Welcome back. Here's what's happening today.</p>
        </div>
        <BookingForm />
      </div>

      {/* Top Stat Cards as requested: Quick look at how many appointments are upcoming */}
      <StatCards />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-card flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline font-bold text-primary">Recent Bookings</CardTitle>
              <CardDescription>Overview of your latest client requests and status</CardDescription>
            </div>
            <Link href="/bookings" className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <BookingTable />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold text-primary">Business Insights</CardTitle>
            <CardDescription>Automated monthly reports</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-secondary/30 rounded-b-xl">
            <Calendar className="h-12 w-12 text-primary/20 mb-4" />
            <h4 className="font-bold text-primary">Monthly Performance</h4>
            <p className="text-sm text-muted-foreground mt-2 px-4">
              Detailed financial statements and AI-driven growth tips are available in the reports section.
            </p>
            <Link href="/reports" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Go to Reports
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
