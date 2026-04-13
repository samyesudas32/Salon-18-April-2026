
'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Clock, Search, Briefcase, Trash2, UserCheck, Hourglass, Phone, Printer, IndianRupee } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ServiceRecordForm } from './service-record-form';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function ServiceTab() {
  const { serviceRecords, deleteServiceRecord } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = useMemo(() => {
    return serviceRecords
      .filter(record => 
        record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.phoneNumber && record.phoneNumber.includes(searchTerm)) ||
        (record.staffName && record.staffName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [serviceRecords, searchTerm]);

  const handlePrint = (record: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5' // A5 is professional and common for service slips
    });

    // Header
    doc.setFillColor(33, 53, 85); // Primary color
    doc.rect(0, 0, 148, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SALON OF GUZELLIK', 74, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Care & Beauty Services', 74, 25, { align: 'center' });
    doc.text('Service Delivery Slip', 74, 32, { align: 'center' });

    // Client & Date Info
    doc.setTextColor(33, 53, 85);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT DETAILS', 15, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Name: ${record.clientName}`, 15, 57);
    doc.text(`Phone: ${record.phoneNumber || 'N/A'}`, 15, 64);
    
    doc.setFont('helvetica', 'bold');
    doc.text('APPOINTMENT', 90, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${format(new Date(record.date), 'MMM dd, yyyy')}`, 90, 57);
    doc.text(`Time: ${record.time}`, 90, 64);

    // Service Table
    autoTable(doc, {
      startY: 75,
      head: [['SERVICE DESCRIPTION', 'STAFF', 'DURATION']],
      body: [
        [record.workType, record.staffName || '---', record.duration || '---']
      ],
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [33, 53, 85], textColor: [255, 255, 255] },
    });

    // Financial Section (The "Bill Section")
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(80, finalY, 133, finalY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Amount:', 85, finalY + 8);
    doc.text(`Rs ${record.totalAmount?.toLocaleString() || '0'}`, 133, finalY + 8, { align: 'right' });
    
    doc.text('Advance Paid:', 85, finalY + 15);
    doc.text(`Rs ${record.advanceAmount?.toLocaleString() || '0'}`, 133, finalY + 15, { align: 'right' });
    
    doc.line(80, finalY + 18, 133, finalY + 18);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 100, 0); // Orange color for balance
    doc.text('BALANCE DUE:', 85, finalY + 25);
    doc.text(`Rs ${record.balanceAmount?.toLocaleString() || '0'}`, 133, finalY + 25, { align: 'right' });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing Salon of Guzellik!', 74, 195, { align: 'center' });
    doc.text('Please keep this slip for your records.', 74, 200, { align: 'center' });

    doc.save(`Service_Slip_${record.clientName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Service Section</CardTitle>
            <CardDescription>
              Manage independent delivery records and billing. Changes here do not affect original bookings.
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search records or staff..." 
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold">Client Name</TableHead>
                <TableHead className="font-bold">Phone</TableHead>
                <TableHead className="font-bold">Appt. Time</TableHead>
                <TableHead className="font-bold">Service</TableHead>
                <TableHead className="font-bold">Staff</TableHead>
                <TableHead className="font-bold text-right">Balance</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {searchTerm ? "No matching records found." : "No service delivery records found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/10 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-primary">{record.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{record.phoneNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{format(new Date(record.date), 'MMM dd, yyyy')}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {record.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{record.workType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{record.staffName || '---'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-600">
                      Rs {record.balanceAmount?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => handlePrint(record)}
                          title="Print Slip"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>

                        <ServiceRecordForm record={record} />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Cancel Record">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Independent Record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the service record for {record.clientName} from this section. The original booking remains intact.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Record</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteServiceRecord(record.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Cancel Record
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
      </CardContent>
    </Card>
  );
}
