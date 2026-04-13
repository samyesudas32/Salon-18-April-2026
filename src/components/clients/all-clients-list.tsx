'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Phone, Briefcase, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AllClientsList() {
  const { bookings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredClients = useMemo(() => {
    return allClients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
  }, [allClients, searchTerm]);

  const exportToCSV = () => {
    const headers = ['Client Name', 'Phone Number', 'Service History'];
    const rows = filteredClients.map(client => [
      client.name,
      client.phone,
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
    link.setAttribute('download', `Salon_Clients_${new Date().toISOString().split('T')[0]}.csv`);
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
            <CardTitle>All Clients</CardTitle>
            <CardDescription>A complete list of every client you've worked with and their services.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients..." 
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
              <span className="hidden sm:inline">Export to Excel</span>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    {searchTerm ? "No matching clients found." : "No clients found."}
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
