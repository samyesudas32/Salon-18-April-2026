'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Phone, Repeat, Briefcase, Search, Download, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

const REGULAR_CUSTOMER_THRESHOLD = 3; // Min bookings to be considered a regular

export function RegularClientsList() {
  const { bookings, serviceRecords, deleteClientByName } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const regularClients = useMemo(() => {
    const clientsMap = new Map<string, { name: string; phone: string; bookingCount: number; workTypes: Set<string> }>();
    
    // Sync logic: Both sources contribute to loyalty status
    const allRecords = [...bookings, ...serviceRecords.filter(r => !r.bookingId)];

    allRecords.forEach(record => {
      const name = 'clientName' in record ? record.clientName : ''; // Should always be present
      if (!name) return;

      if (clientsMap.has(name)) {
        const client = clientsMap.get(name)!;
        client.bookingCount += 1;
        client.workTypes.add(record.workType);
      } else {
        clientsMap.set(name, {
          name,
          phone: record.phoneNumber,
          bookingCount: 1,
          workTypes: new Set([record.workType]),
        });
      }
    });

    return Array.from(clientsMap.values()).filter(
      client => client.bookingCount >= REGULAR_CUSTOMER_THRESHOLD
    ).sort((a, b) => b.bookingCount - a.bookingCount);

  }, [bookings, serviceRecords]);

  const filteredClients = useMemo(() => {
    return regularClients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
  }, [regularClients, searchTerm]);

  const exportToCSV = () => {
    const headers = ['Client Name', 'Phone Number', 'Total Bookings', 'Service History'];
    const rows = filteredClients.map(client => [
      client.name,
      client.phone,
      client.bookingCount.toString(),
      Array.from(client.workTypes).join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Regular_Clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Regular Customers</CardTitle>
            <CardDescription>
              Your most loyal clients with {REGULAR_CUSTOMER_THRESHOLD} or more visits.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search regulars..." 
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
              onClick={exportToCSV}
              disabled={filteredClients.length === 0}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Regulars</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Client Name</TableHead>
                <TableHead className="font-bold">Phone Number</TableHead>
                <TableHead className="font-bold">Service History</TableHead>
                <TableHead className="font-bold text-center">Total Visits</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {searchTerm ? "No matching regulars found." : "No regular clients found yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
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
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Regular Profile?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Removing <strong>{client.name}</strong> will also wipe their {client.bookingCount} historical records and all service slips.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteClientByName(client.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Wipe All Records
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
