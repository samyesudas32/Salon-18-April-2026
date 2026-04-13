
'use client';

import { useState } from 'react';
import { BookingTable } from '@/components/bookings/booking-table';
import { BookingForm } from '@/components/bookings/booking-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Calendar, Search } from 'lucide-react';

export default function CompletedBookingsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Completed History</h2>
          <p className="text-muted-foreground mt-1">Review and manage all your successfully delivered services.</p>
        </div>
        <BookingForm />
      </div>

      <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm">
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              From Date
            </Label>
            <Input 
              type="date" 
              className="w-[180px] bg-background" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              To Date
            </Label>
            <Input 
              type="date" 
              className="w-[180px] bg-background" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-primary mb-1"
            onClick={() => { 
              setStartDate(''); 
              setEndDate(''); 
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <BookingTable 
        filterStatus="completed" 
        hideSchedule={true} 
        startDate={startDate} 
        endDate={endDate} 
      />
    </div>
  );
}
