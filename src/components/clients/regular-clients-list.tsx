'use client';

import { useMemo } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Phone, Repeat, Briefcase } from 'lucide-react';

const REGULAR_CUSTOMER_THRESHOLD = 3; // Min bookings to be considered a regular

export function RegularClientsList() {
  const { bookings } = useApp();

  const regularClients = useMemo(() => {
    const clientsMap = new Map<string, { name: string; phone: string; bookingCount: number; workTypes: Set<string> }>();
    
    bookings.forEach(booking => {
      if (clientsMap.has(booking.clientName)) {
        const client = clientsMap.get(booking.clientName)!;
        client.bookingCount += 1;
        client.workTypes.add(booking.workType);
      } else {
        clientsMap.set(booking.clientName, {
          name: booking.clientName,
          phone: booking.phoneNumber,
          bookingCount: 1,
          workTypes: new Set([booking.workType]),
        });
      }
    });

    return Array.from(clientsMap.values()).filter(
      client => client.bookingCount >= REGULAR_CUSTOMER_THRESHOLD
    ).sort((a, b) => b.bookingCount - a.bookingCount);

  }, [bookings]);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Regular Customers</CardTitle>
        <CardDescription>
          Your most loyal clients with {REGULAR_CUSTOMER_THRESHOLD} or more bookings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Client Name</TableHead>
                <TableHead className="font-bold">Phone Number</TableHead>
                <TableHead className="font-bold">Service History</TableHead>
                <TableHead className="font-bold text-center">Total Bookings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regularClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No regular clients found yet.
                  </TableCell>
                </TableRow>
              ) : (
                regularClients.map((client) => (
                  <TableRow key={client.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        <span className="line-clamp-2">{Array.from(client.workTypes).join(', ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex items-center justify-center gap-2">
                        <Repeat className="h-4 w-4 text-primary" />
                        <span className="font-bold text-primary">{client.bookingCount}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
