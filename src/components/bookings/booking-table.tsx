
'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/app/lib/store';
import { format, parseISO, getMonth, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Pencil, Trash2, Phone, Clock, AlignLeft, CalendarOff } from 'lucide-react';
import { BookingForm } from './booking-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BookingTableProps {
  filterStatus?: 'upcoming' | 'completed' | 'all';
  monthFilter?: string; // "0" to "11" (Date.getMonth() index) or "all"
  startDate?: string;
  endDate?: string;
  sortOrder?: 'newest' | 'oldest' | 'completed-first' | 'upcoming-first';
  hideSchedule?: boolean;
}

export function BookingTable({ 
  filterStatus = 'all', 
  monthFilter = 'all',
  startDate,
  endDate,
  sortOrder = 'newest',
  hideSchedule = false
}: BookingTableProps) {
  const { bookings, deleteBooking } = useApp();

  const sortedBookings = useMemo(() => {
    // 1. Initial status filtering (Upcoming/Completed/All)
    let filtered = bookings.filter((booking) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'upcoming') return booking.status === 'upcoming' || booking.status === 'pending';
      return booking.status === filterStatus;
    });

    // 2. Month filtering
    if (monthFilter !== 'all') {
      const monthIndex = parseInt(monthFilter);
      filtered = filtered.filter((booking) => {
        const date = parseISO(booking.date);
        return getMonth(date) === monthIndex;
      });
    }

    // 3. Custom Date Range filtering
    if (startDate || endDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = parseISO(booking.date);
        const start = startDate ? startOfDay(parseISO(startDate)) : null;
        const end = endDate ? endOfDay(parseISO(endDate)) : null;

        if (start && end) {
          return isWithinInterval(bookingDate, { start, end });
        } else if (start) {
          return bookingDate >= start;
        } else if (end) {
          return bookingDate <= end;
        }
        return true;
      });
    }

    // 4. Sorting
    return filtered.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime() || 0;
      const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime() || 0;

      if (sortOrder === 'completed-first') {
        if (a.status === 'completed' && b.status !== 'completed') return -1;
        if (a.status !== 'completed' && b.status === 'completed') return 1;
      }

      if (sortOrder === 'upcoming-first') {
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
        if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
      }

      if (sortOrder === 'oldest') {
        return dateTimeA - dateTimeB;
      }

      // Default: Newest first
      return dateTimeB - dateTimeA;
    });
  }, [bookings, filterStatus, monthFilter, startDate, endDate, sortOrder]);

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="font-bold py-4">Client</TableHead>
            <TableHead className="font-bold">Work Type</TableHead>
            {!hideSchedule && <TableHead className="font-bold">Schedule</TableHead>}
            <TableHead className="font-bold text-right w-[110px]">Total</TableHead>
            <TableHead className="font-bold text-right w-[110px]">Balance</TableHead>
            <TableHead className="font-bold">General Notes</TableHead>
            <TableHead className="font-bold text-center">Status</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={hideSchedule ? 7 : 8} className="h-48 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <CalendarOff className="h-6 w-6 opacity-40" />
                  </div>
                  <div>
                    <p className="font-bold text-primary">No results found</p>
                    <p className="text-sm">Try adding a new booking to see your records.</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedBookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/20 transition-colors group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-primary">{booking.clientName}</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Phone className="h-3 w-3" />
                      {booking.phoneNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{booking.workType}</TableCell>
                {!hideSchedule && (
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{format(parseISO(booking.date), 'MMM dd, yyyy')}</span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {booking.time || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-right font-mono text-sm">
                  Rs {booking.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-bold text-orange-600 bg-orange-50/30">
                  Rs {booking.balanceAmount.toLocaleString()}
                </TableCell>
                <TableCell className="max-w-[250px]">
                  <div className="flex items-start gap-2">
                    <AlignLeft className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {booking.notes || 'No extra notes provided.'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={booking.status === 'completed' ? 'default' : 'secondary'}
                    className={cn(
                      "capitalize font-semibold",
                      booking.status === 'completed' ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : 
                      booking.status === 'upcoming' ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200" : 
                      "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                    )}
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookingForm 
                      booking={booking} 
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the booking for {booking.clientName}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBooking(booking.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
