'use client';

import { useState, useMemo } from 'react';
import { Search, User, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/app/lib/store';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
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

export function ClientHistory() {
  const { bookings, serviceRecords, deleteClientByName } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const clients = useMemo(() => {
    // Sync Logic: Combine Bookings and independent Service Records
    const combinedRecords = [
      ...bookings, 
      ...serviceRecords.filter(r => !r.bookingId)
    ];
    
    const uniqueNames = Array.from(new Set(combinedRecords.map(r => r.clientName)));
    
    return uniqueNames.map(name => {
      const clientRecords = combinedRecords.filter(r => r.clientName === name);
      
      const totalSpend = clientRecords.reduce((s, r) => s + r.totalAmount, 0);
      const pendingBalance = clientRecords.reduce((s, r) => s + r.balanceAmount, 0);
      
      return {
        name,
        bookingCount: clientRecords.length,
        totalSpend,
        pendingBalance,
        lastBooking: clientRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0],
        history: clientRecords,
      };
    });
  }, [bookings, serviceRecords]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search client by name..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredClients.map((client) => (
          <Card key={client.name} className="border-none shadow-sm relative group overflow-hidden">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Client History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete <strong>{client.name}</strong>? This will permanently remove their profile and all {client.bookingCount} past entries from every dashboard view.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Client</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteClientByName(client.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Profile
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline font-bold text-primary">{client.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{client.bookingCount} total visits</p>
                  </div>
                </div>
                <div className="pr-10 sm:pr-0">
                  <Badge variant={client.pendingBalance > 0 ? "outline" : "default"} className={client.pendingBalance > 0 ? "text-orange-600 border-orange-200" : "bg-green-100 text-green-700"}>
                    {client.pendingBalance > 0 ? `Rs ${client.pendingBalance} Due` : 'Paid'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Revenue</p>
                    <p className="text-lg font-bold text-primary">Rs {client.totalSpend.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Last Visit</p>
                    <p className="text-sm font-medium">{format(new Date(client.lastBooking.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    Visit History
                  </h4>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {client.history.map((h) => (
                      <div key={h.id} className="text-xs flex items-center justify-between p-2 rounded bg-muted/30">
                        <span>{h.workType} ({format(new Date(h.date), 'MM/dd')})</span>
                        <span className="font-bold">Rs {h.totalAmount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
