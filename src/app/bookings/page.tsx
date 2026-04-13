
'use client';

import { BookingTable } from '@/components/bookings/booking-table';
import { BookingForm } from '@/components/bookings/booking-form';

export default function AllBookingsPage() {
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

      <BookingTable filterStatus="all" />
    </div>
  );
}
