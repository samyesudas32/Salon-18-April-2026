
'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { BookingForm } from '@/components/bookings/booking-form';
import { BookingTable } from '@/components/bookings/booking-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, ArrowUpRight, Plus, Wallet, ShoppingBag, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useApp } from '@/app/lib/store';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ProductExpenseForm } from '@/components/product-expenses/product-expense-form';

export default function DashboardPage() {
  const { adminName } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">
            Hello, {adminName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's a snapshot of your salon's performance today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BookingForm trigger={
            <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6">
              <Plus className="h-5 w-5" />
              New Booking
            </Button>
          } />
        </div>
      </div>

      {/* Quick Action Hub */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Quick Tasks</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BookingForm trigger={
            <Button variant="outline" className="h-20 flex-col gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
              <Calendar className="h-6 w-6" />
              <span className="text-xs font-bold">New Booking</span>
            </Button>
          } />
          <ExpenseForm trigger={
            <Button variant="outline" className="h-20 flex-col gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
              <Wallet className="h-6 w-6" />
              <span className="text-xs font-bold">Daily Expense</span>
            </Button>
          } />
          <ProductExpenseForm trigger={
            <Button variant="outline" className="h-20 flex-col gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xs font-bold">Product Stock</span>
            </Button>
          } />
          <Button variant="outline" asChild className="h-20 flex-col gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
            <Link href="/clients">
              <Users className="h-6 w-6" />
              <span className="text-xs font-bold">Manage Clients</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* Core Business Metrics */}
      <StatCards />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-primary/5 overflow-hidden rounded-2xl">
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

        {/* AI Sidebar & Reports */}
        <div className="space-y-8">
          <Card className="border-none shadow-xl shadow-accent/5 flex flex-col rounded-2xl bg-gradient-to-br from-accent/10 via-background to-background">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Business Guard
              </CardTitle>
              <CardDescription>Automated monthly performance audits</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
                <FileTextIcon className="h-8 w-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-primary text-lg">Smart Reports</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your monthly financial statements and AI-driven growth tips are ready for review.
                </p>
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 mt-2 font-bold shadow-md shadow-primary/20">
                <Link href="/reports">
                  Open Reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-primary/5 rounded-2xl p-6 bg-primary text-primary-foreground relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <Calendar className="h-24 w-24" />
            </div>
            <h4 className="font-bold text-lg mb-2">Service Delivery</h4>
            <p className="text-xs text-primary-foreground/80 mb-6 leading-relaxed">
              Generate professional slips for delivered services and manage total charges independently.
            </p>
            <Button asChild variant="secondary" size="sm" className="font-bold bg-white text-primary hover:bg-white/90">
              <Link href="/service-delivery">
                Go to Service Section
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);
