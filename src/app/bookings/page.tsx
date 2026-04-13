'use client';

import { useState } from 'react';
import { BookingTable } from '@/components/bookings/booking-table';
import { BookingForm } from '@/components/bookings/booking-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortAsc, Search } from 'lucide-react';

const MONTHS = [
  { value: 'all', label: 'All Months' },
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export default function AllBookingsPage() {
  const [monthFilter, setMonthFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'completed-first' | 'upcoming-first'>('newest');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">All Bookings</h2>
          <p className="text-muted-foreground mt-1">Full detailed list of all your service appointments.</p>
        </div>
        <div className="flex items-center gap-3">
          <BookingForm />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card p-4 rounded-xl border border-border/40 shadow-sm">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
            <Search className="h-3 w-3" />
            Search By Month
          </label>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-full bg-background border-border/60">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
            <SortAsc className="h-3 w-3" />
            Sort Preference
          </label>
          <Select 
            value={sortOrder} 
            onValueChange={(val: any) => setSortOrder(val)}
          >
            <SelectTrigger className="w-full bg-background border-border/60">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="completed-first">Completed First</SelectItem>
              <SelectItem value="upcoming-first">Upcoming First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BookingTable 
        filterStatus="all" 
        monthFilter={monthFilter}
        sortOrder={sortOrder}
      />
    </div>
  );
}
