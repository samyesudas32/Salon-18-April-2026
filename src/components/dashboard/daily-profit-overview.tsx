'use client';

import { useApp } from '@/app/lib/store';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay, parseISO } from 'date-fns';
import { ArrowDownRight, ArrowUpRight, Banknote, ShoppingBag, Wallet, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DailyProfitOverview() {
  const { bookings, expenses, productExpenses } = useApp();

  const metrics = useMemo(() => {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    const todaysCompletedBookings = bookings.filter(b => b.date === todayStr && b.status === 'completed');
    const todaysDailyExpenses = expenses.filter(e => e.date === todayStr);
    const todaysProductExpenses = productExpenses.filter(pe => pe.date === todayStr);

    const revenue = todaysCompletedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const bookingExpenses = todaysCompletedBookings.reduce((sum, b) => sum + b.expenseAmount, 0);
    const dailyCosts = todaysDailyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const productCosts = todaysProductExpenses.reduce((sum, pe) => sum + pe.amount, 0);

    const totalExpenses = bookingExpenses + dailyCosts + productCosts;
    const netProfit = revenue - totalExpenses;

    return {
      revenue,
      bookingExpenses,
      dailyCosts,
      productCosts,
      totalExpenses,
      netProfit,
    };
  }, [bookings, expenses, productExpenses]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Revenue Section */}
      <Card className="border-none shadow-sm bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">Today's Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-primary opacity-70" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-primary">Rs {metrics.revenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Realized from completed services</p>
        </CardContent>
      </Card>

      {/* Expenses Breakdown */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-destructive uppercase tracking-wider">Daily Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive opacity-70" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-black text-destructive">Rs {metrics.totalExpenses.toLocaleString()}</div>
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40">
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Banknote className="h-2 w-2" /> Service
              </p>
              <p className="text-[11px] font-bold">Rs {metrics.bookingExpenses}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Wallet className="h-2 w-2" /> Daily
              </p>
              <p className="text-[11px] font-bold">Rs {metrics.dailyCosts}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <ShoppingBag className="h-2 w-2" /> Stock
              </p>
              <p className="text-[11px] font-bold">Rs {metrics.productCosts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Profit Result */}
      <Card className={cn(
        "border-none shadow-lg transition-all",
        metrics.netProfit >= 0 ? "bg-emerald-600 text-white shadow-emerald-200" : "bg-destructive text-white shadow-destructive/20"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-white/90">Net Daily Profit</CardTitle>
            {metrics.netProfit >= 0 ? <TrendingUp className="h-4 w-4 text-white" /> : <ArrowDownRight className="h-4 w-4 text-white" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black">Rs {metrics.netProfit.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", metrics.netProfit >= 0 ? "bg-white" : "bg-white/50")} />
            <p className="text-xs font-medium text-white/80">
              {metrics.netProfit >= 0 ? "You're operating in profit today!" : "Expenses currently exceed revenue."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}