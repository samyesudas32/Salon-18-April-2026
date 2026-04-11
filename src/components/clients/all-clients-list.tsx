'use client';

import { useMemo } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Phone, Briefcase } from 'lucide-react';

export function AllClientsList() {
  const { bookings } = useApp();

  const allClients = useMemo(() => {
    const clientsMap = new Map<string, { name: string; phone: string; workTypes: Set<string> }>();
    bookings.forEach(booking => {
      if (!clientsMap.has(booking.clientName)) {
        clientsMap.set(booking.clientName, {
          name: booking.clientName,
          phone: booking.phoneNumber,
          workTypes: new Set(),
        });
      }
      clientsMap.get(booking.clientName)!.workTypes.add(booking.workType);
    });
    return Array.from(clientsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [bookings]);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>All Clients</CardTitle>
        <CardDescription>A complete list of every client you've worked with and their services.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Client Name</TableHead>
                <TableHead className="font-bold">Phone Number</TableHead>
                <TableHead className="font-bold">Service History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                allClients.map((client) => (
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
