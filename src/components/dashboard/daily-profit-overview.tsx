'use client';

import { useApp } from '@/app/lib/store';
import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowDownRight, Banknote, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DailyProfitOverview() {
  const { bookings, expenses, productExpenses } = useApp();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const metrics = useMemo(() => {
    if (!now) {
      return { revenue: 0, totalExpenses: 0, netProfit: 0 };
    }
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
      totalExpenses,
      netProfit,
    };
  }, [bookings, expenses, productExpenses, now]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Revenue Section */}
      <Card className="border-none shadow-sm bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-primary tracking-wider">Daily Income</CardTitle>
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
            <CardTitle className="text-sm font-bold text-destructive tracking-wider">Daily Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive opacity-70" />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="text-2xl font-black text-destructive">Rs {metrics.totalExpenses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Total business costs for today</p>
        </CardContent>
      </Card>

      {/* Net Profit Result */}
      <Card className={cn(
        "border-none shadow-lg transition-all",
        metrics.netProfit >= 0 ? "bg-emerald-600 text-white shadow-emerald-200" : "bg-destructive text-white shadow-destructive/20"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold tracking-wider text-white/90">Daily Balance</CardTitle>
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
