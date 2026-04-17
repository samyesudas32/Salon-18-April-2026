'use client';

import { type LucideIcon, CalendarDays, CheckCircle, CalendarClock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/app/lib/store';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format, isSameMonth, parseISO, isAfter, isSameDay } from 'date-fns';

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  borderColor: string;
}

export function StatCards() {
  const { bookings, expenses, productExpenses } = useApp();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const stats = useMemo((): StatItem[] => {
    if (!now) {
      return [
        { label: "Today’s Bookings", value: '...', icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'border-purple-100' },
        { label: "Today's Completed", value: '...', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100' },
        { label: "Upcoming Booking", value: '...', icon: CalendarClock, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
        { label: "Monthly Income Overview", value: '...', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', borderColor: 'border-orange-100' },
      ];
    }

    const todayStr = format(now, 'yyyy-MM-dd');
    const todaysCount = bookings.filter(b => b.date === todayStr).length;
    const todaysCompletedCount = bookings.filter(b => b.date === todayStr && b.status === 'completed').length;

    const thisMonthUpcomingCount = bookings.filter(b => {
      try {
        const bDate = parseISO(b.date);
        const isStatusUpcoming = b.status === 'upcoming' || b.status === 'pending';
        return isSameMonth(bDate, now) && (isAfter(bDate, now) || isSameDay(bDate, now)) && isStatusUpcoming;
      } catch (e) {
        return false;
      }
    }).length;

    // Monthly Profit Calculation
    const thisMonthBookings = bookings.filter(b => {
      try {
        return isSameMonth(parseISO(b.date), now);
      } catch (e) {
        return false;
      }
    });
    
    // Only include COMPLETED bookings in Revenue and Booking Expenses
    const completedMonthBookings = thisMonthBookings.filter(b => b.status === 'completed');
    
    const thisMonthRevenue = completedMonthBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const thisMonthBookingExpenses = completedMonthBookings.reduce((sum, b) => sum + b.expenseAmount, 0);
    
    const thisMonthDailyExpenses = expenses.filter(e => {
      try {
        return isSameMonth(parseISO(e.date), now);
      } catch (e) {
        return false;
      }
    }).reduce((sum, e) => sum + e.amount, 0);

    const thisMonthProductExpenses = productExpenses.filter(pe => {
      try {
        return isSameMonth(parseISO(pe.date), now);
      } catch (e) {
        return false;
      }
    }).reduce((sum, pe) => sum + pe.amount, 0);
    
    const totalProfit = thisMonthRevenue - thisMonthBookingExpenses - thisMonthDailyExpenses - thisMonthProductExpenses;

    return [
      {
        label: "Today’s Bookings",
        value: todaysCount,
        icon: CalendarDays,
        color: 'text-purple-600',
        bg: 'bg-purple-50/50',
        borderColor: 'border-purple-100/50',
      },
      {
        label: "Today's Completed",
        value: todaysCompletedCount,
        icon: CheckCircle,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50/50',
        borderColor: 'border-emerald-100/50',
      },
      {
        label: "Upcoming Booking",
        value: thisMonthUpcomingCount,
        icon: CalendarClock,
        color: 'text-blue-600',
        bg: 'bg-blue-50/50',
        borderColor: 'border-blue-100/50',
      },
      {
        label: "Monthly Income Overview",
        value: `Rs ${totalProfit.toLocaleString()}`,
        icon: TrendingUp,
        color: 'text-orange-600',
        bg: 'bg-orange-50/50',
        borderColor: 'border-orange-100/50',
      },
    ];
  }, [bookings, expenses, productExpenses, now]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={cn("border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden", stat.borderColor)}>
          <CardContent className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <p className="text-sm font-semibold text-muted-foreground leading-snug">{stat.label}</p>
                <h3 className="text-3xl font-black text-primary tracking-tight">{stat.value}</h3>
              </div>
              <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110 flex items-center justify-center shrink-0 shadow-sm", stat.bg, stat.color)}>
                <stat.icon className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
