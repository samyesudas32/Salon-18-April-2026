'use client';

import { Calendar, Clock, CheckCircle2, type LucideIcon, TrendingUp, CalendarDays, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/app/lib/store';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  borderColor: string;
}

export function StatCards() {
  const { bookings } = useApp();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const stats = useMemo((): StatItem[] => {
    if (!now) {
      return [
        { label: "Today's Total", value: '...', icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'border-purple-100' },
        { label: "Today's Completed", value: '...', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100' },
        { label: 'Upcoming', value: '...', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
        { label: 'Total Revenue', value: '...', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-green-100' },
        { label: 'Due Balance', value: '...', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', borderColor: 'border-orange-100' },
        { label: 'Total Delivered', value: '...', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50', borderColor: 'border-indigo-100' },
      ];
    }

    const todayStr = format(now, 'yyyy-MM-dd');
    const todaysCount = bookings.filter(b => b.date === todayStr).length;
    const todaysCompletedCount = bookings.filter(b => b.date === todayStr && b.status === 'completed').length;
    const upcoming = bookings.filter(b => b.status === 'upcoming' || (b.status === 'pending' && new Date(b.date) >= now)).length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingBalance = bookings.reduce((sum, b) => sum + b.balanceAmount, 0);
    const totalCompletedCount = bookings.filter(b => b.status === 'completed').length;

    return [
      {
        label: "Today's Appointments",
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
        label: 'Upcoming Appointments',
        value: upcoming,
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-50/50',
        borderColor: 'border-blue-100/50',
      },
      {
        label: 'Total Expected Revenue',
        value: `Rs ${totalRevenue.toLocaleString()}`,
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-50/50',
        borderColor: 'border-green-100/50',
      },
      {
        label: 'Total Pending Balance',
        value: `Rs ${pendingBalance.toLocaleString()}`,
        icon: Clock,
        color: 'text-orange-600',
        bg: 'bg-orange-50/50',
        borderColor: 'border-orange-100/50',
      },
      {
        label: 'Total Services Delivered',
        value: totalCompletedCount,
        icon: CheckCircle2,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50/50',
        borderColor: 'border-indigo-100/50',
      },
    ];
  }, [bookings, now]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label} className={cn("border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden", stat.borderColor)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-black text-primary tracking-tight">{stat.value}</h3>
              </div>
              <div className={cn("p-2.5 rounded-xl transition-all group-hover:scale-110 flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
