'use client';

import { type LucideIcon, CalendarDays, CheckCircle, CalendarClock } from 'lucide-react';
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
  const { bookings } = useApp();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const stats = useMemo((): StatItem[] => {
    if (!now) {
      return [
        { label: "Today's Appointments", value: '...', icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'border-purple-100' },
        { label: "Today's Completed", value: '...', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100' },
        { label: "Month's Upcoming", value: '...', icon: CalendarClock, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
      ];
    }

    const todayStr = format(now, 'yyyy-MM-dd');
    const todaysCount = bookings.filter(b => b.date === todayStr).length;
    const todaysCompletedCount = bookings.filter(b => b.date === todayStr && b.status === 'completed').length;

    const thisMonthUpcomingCount = bookings.filter(b => {
      try {
        const bDate = parseISO(b.date);
        const isStatusUpcoming = b.status === 'upcoming' || b.status === 'pending';
        // Check if it's the same month and either today or in the future
        return isSameMonth(bDate, now) && (isAfter(bDate, now) || isSameDay(bDate, now)) && isStatusUpcoming;
      } catch (e) {
        return false;
      }
    }).length;

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
        label: "Month's Upcoming",
        value: thisMonthUpcomingCount,
        icon: CalendarClock,
        color: 'text-blue-600',
        bg: 'bg-blue-50/50',
        borderColor: 'border-blue-100/50',
      },
    ];
  }, [bookings, now]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
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
