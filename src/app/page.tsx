'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { BookingForm } from '@/components/bookings/booking-form';
import { BookingTable } from '@/components/bookings/booking-table';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { ProductExpenseTable } from '@/components/product-expenses/product-expense-table';
import { ServiceTab } from '@/components/clients/service-tab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Plus, Settings2, Layout, Briefcase, Wallet, ShoppingBag } from 'lucide-react';
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
    showExpenses, 
    showProductExpenses, 
    toggleDashboardSection 
  } = useApp();

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
                checked={showRecentBookings}
                onCheckedChange={() => toggleDashboardSection('bookings')}
              >
                All Recent Bookings
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">
                From Main Menu
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showServiceSection}
                onCheckedChange={() => toggleDashboardSection('serviceSection')}
              >
                Service Section
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showExpenses}
                onCheckedChange={() => toggleDashboardSection('expenses')}
              >
                Daily Expenses
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showProductExpenses}
                onCheckedChange={() => toggleDashboardSection('productExpenses')}
              >
                Product Expenses
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

      {/* Conditional Dashboard Sections */}
      <div className="space-y-8">
        {/* Service Section Summary */}
        {showServiceSection && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-headline font-bold text-primary">Service Delivery History</h2>
                  <p className="text-sm text-muted-foreground">Manage recent delivery records and slips</p>
                </div>
              </div>
              <Link href="/service-delivery" className="text-sm font-bold text-accent flex items-center gap-1.5 hover:underline group">
                Full Service Area <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <ServiceTab />
          </div>
        )}

        {/* Recent Bookings Section */}
        {showRecentBookings && (
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-card flex flex-row items-center justify-between border-b border-border/40 pb-6">
              <div>
                <CardTitle className="text-xl font-headline font-bold text-primary">Recent Bookings</CardTitle>
                <CardDescription>The latest entries in your booking history</CardDescription>
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

        {/* Daily Expenses Section */}
        {showExpenses && (
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-card flex flex-row items-center justify-between border-b border-border/40 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-headline font-bold text-primary">Recent Daily Expenses</CardTitle>
                  <CardDescription>Summary of your latest operational costs</CardDescription>
                </div>
              </div>
              <Link href="/expenses" className="text-sm font-bold text-accent flex items-center gap-1.5 hover:underline group">
                Manage Expenses <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <ExpenseTable />
            </CardContent>
          </Card>
        )}

        {/* Product Expenses Section */}
        {showProductExpenses && (
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-card flex flex-row items-center justify-between border-b border-border/40 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-headline font-bold text-primary">Product Purchase Log</CardTitle>
                  <CardDescription>Tracking your latest inventory and stock expenses</CardDescription>
                </div>
              </div>
              <Link href="/product-expenses" className="text-sm font-bold text-accent flex items-center gap-1.5 hover:underline group">
                Full Log <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <ProductExpenseTable />
            </CardContent>
          </Card>
        )}
      </div>

      {!showStats && !showRecentBookings && !showServiceSection && !showExpenses && !showProductExpenses && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/20 rounded-3xl border border-dashed border-border/60 animate-in fade-in zoom-in duration-500">
          <Layout className="h-12 w-12 opacity-20 mb-4" />
          <p className="text-lg font-medium">Dashboard is empty</p>
          <p className="text-sm">Use the Customize menu to add sections back to your view.</p>
        </div>
      )}
    </div>
  );
}
