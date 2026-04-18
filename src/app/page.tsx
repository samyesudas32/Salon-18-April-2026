'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { BookingForm } from '@/components/bookings/booking-form';
import { BookingTable } from '@/components/bookings/booking-table';
import { ServiceTab } from '@/components/clients/service-tab';
import { FinancialDashboard } from '@/components/reports/financial-dashboard';
import { DailyProfitOverview } from '@/components/dashboard/daily-profit-overview';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Plus, Settings2, Layout, Briefcase, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useApp } from '@/app/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { 
    showStats, 
    showRecentBookings, 
    showServiceSection, 
    showReports,
    showDailyProfit,
    toggleDashboardSection 
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-12">
      {/* Header section with action button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary tracking-tight">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 border-primary/20 text-primary hover:bg-primary/5 h-10 md:h-11 px-3 md:px-5">
                <Settings2 className="h-4 w-4 md:h-5 md:w-5" />
                Customize
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
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
                checked={showDailyProfit}
                onCheckedChange={() => toggleDashboardSection('dailyProfit')}
              >
                Daily Income Overview
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showRecentBookings}
                onCheckedChange={() => toggleDashboardSection('bookings')}
              >
                Show All Bookings
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showServiceSection}
                onCheckedChange={() => toggleDashboardSection('serviceSection')}
              >
                Service Section
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showReports}
                onCheckedChange={() => toggleDashboardSection('reports')}
              >
                Financial Reports
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <BookingForm trigger={
            <Button className="flex-1 sm:flex-none gap-2 shadow-lg shadow-primary/20 h-10 md:h-11 px-4 md:px-6">
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
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

      {/* Conditional Dashboard Sections */}
      <div className="space-y-6 md:space-y-8">
        {/* Daily Profit Overview Section */}
        {showDailyProfit && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-headline font-bold text-primary leading-tight">Daily Income</h2>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Today's financial breakdown</p>
                </div>
              </div>
            </div>
            <DailyProfitOverview />
          </div>
        )}

        {/* Service Section Summary */}
        {showServiceSection && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-headline font-bold text-primary leading-tight">Service Records</h2>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Manage delivery slips</p>
                </div>
              </div>
              <Link href="/service-delivery" className="text-xs md:text-sm font-bold text-accent flex items-center gap-1.5 hover:underline group">
                Full Area <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>
            <ServiceTab />
          </div>
        )}

        {/* Financial Reports Section */}
        {showReports && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileText className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-headline font-bold text-primary leading-tight">Financial Reports</h2>
                  <p className="text-[10px] md:text-sm text-muted-foreground">AI insights & statements</p>
                </div>
              </div>
              <Link href="/reports" className="text-xs md:text-sm font-bold text-accent flex items-center gap-1.5 hover:underline group">
                Full Center <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>
            <FinancialDashboard />
          </div>
        )}

        {/* All Bookings Section */}
        {showRecentBookings && (
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-card flex flex-row items-center justify-between border-b border-border/40 py-4 px-5 md:pb-6 md:px-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg md:text-xl font-headline font-bold text-primary leading-tight">All Bookings</CardTitle>
                  <CardDescription className="text-xs">Complete appointment log</CardDescription>
                </div>
              </div>
              <Link href="/bookings" className="text-xs md:text-sm font-bold text-accent flex items-center gap-1.5 hover:underline group">
                View All <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <BookingTable />
            </CardContent>
          </Card>
        )}
      </div>

      {!showStats && !showRecentBookings && !showServiceSection && !showReports && !showDailyProfit && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/20 rounded-3xl border border-dashed border-border/60 animate-in fade-in zoom-in duration-500 mx-2">
          <Layout className="h-12 w-12 opacity-20 mb-4" />
          <p className="text-lg font-medium">Dashboard is empty</p>
          <p className="text-sm">Use the Customize menu to add sections.</p>
        </div>
      )}
    </div>
  );
}
