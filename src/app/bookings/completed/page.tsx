'use client';

import { BookingTable } from '@/components/bookings/booking-table';
import { BookingForm } from '@/components/bookings/booking-form';

export default function CompletedBookingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Completed History</h2>
          <p className="text-muted-foreground mt-1">Review all your successfully delivered services.</p>
        </div>
        <BookingForm />
      </div>

      <BookingTable filterStatus="completed" />
    </div>
  );
}
