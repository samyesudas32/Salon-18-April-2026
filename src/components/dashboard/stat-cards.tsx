'use client';

import { Calendar, Clock, CheckCircle2, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/app/lib/store';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

const RsIcon = ({ className }: { className?: string }) => (
  <span className={cn("flex items-center justify-center font-bold text-sm leading-none", className)}>
    Rs
  </span>
);

export function StatCards() {
  const { bookings } = useApp();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set current date only on client side after hydration
    setNow(new Date());
  }, []);

  const stats = useMemo((): StatItem[] => {
    // Return empty stats until date is available to avoid hydration mismatch
    if (!now) {
      return [
        { label: 'Upcoming Appointments', value: '...', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Revenue', value: '...', icon: RsIcon, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Balance', value: '...', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Work Completed', value: '...', icon: CheckCircle2, color: 'text-sky-600', bg: 'bg-sky-50' },
      ];
    }

    const upcoming = bookings.filter(b => b.status === 'upcoming' || new Date(b.date) >= now).length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingBalance = bookings.reduce((sum, b) => sum + b.balanceAmount, 0);
    const completedCount = bookings.filter(b => b.status === 'completed').length;

    return [
      {
        label: 'Upcoming Appointments',
        value: upcoming,
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        label: 'Total Revenue',
        value: `Rs ${totalRevenue.toLocaleString()}`,
        icon: RsIcon,
        color: 'text-green-600',
        bg: 'bg-green-50',
      },
      {
        label: 'Pending Balance',
        value: `Rs ${pendingBalance.toLocaleString()}`,
        icon: Clock,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
      },
      {
        label: 'Work Completed',
        value: completedCount,
        icon: CheckCircle2,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
      },
    ];
  }, [bookings, now]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-primary">{stat.value}</h3>
              </div>
              <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
