'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Clock, Search, Briefcase, Trash2, UserCheck, Hourglass, Phone, Printer, IndianRupee, FileText } from 'lucide-react';
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
      format: 'a5' 
    });

    // Header with primary color background
    doc.setFillColor(33, 53, 85); 
    doc.rect(0, 0, 148, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SALON OF GUZELLIK', 74, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Care & Beauty Services', 74, 25, { align: 'center' });
    doc.text('SERVICE DELIVERY SLIP', 74, 32, { align: 'center' });

    // Client & Appointment Info
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

    // Service Description Table
    autoTable(doc, {
      startY: 75,
      head: [['SERVICE DESCRIPTION', 'ATTENDING STAFF', 'DURATION']],
      body: [
        [record.workType, record.staffName || '---', record.duration || '---']
      ],
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [33, 53, 85], textColor: [255, 255, 255] },
    });

    // Professional Bill Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(80, finalY, 133, finalY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Service Charge:', 85, finalY + 8);
    doc.text(`Rs ${record.totalAmount?.toLocaleString() || '0'}`, 133, finalY + 8, { align: 'right' });
    
    doc.text('Advance Amount Paid:', 85, finalY + 15);
    doc.text(`Rs ${record.advanceAmount?.toLocaleString() || '0'}`, 133, finalY + 15, { align: 'right' });
    
    doc.line(80, finalY + 18, 133, finalY + 18);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 100, 0); 
    doc.text('BALANCE PAYABLE:', 85, finalY + 25);
    doc.text(`Rs ${record.balanceAmount?.toLocaleString() || '0'}`, 133, finalY + 25, { align: 'right' });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing Salon of Guzellik!', 74, 125, { align: 'center' });
    doc.text('This is a computer-generated delivery slip.', 74, 130, { align: 'center' });

    doc.save(`Service_Slip_${record.clientName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-card pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-headline font-bold text-primary">Service Section</CardTitle>
              <CardDescription>
                Manage delivery records and print professional slips independently.
              </CardDescription>
            </div>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by client, service, or staff..." 
              className="pl-9 h-10 border-muted-foreground/20 focus:border-primary/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-none border-t border-border/40">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold py-4">Client Information</TableHead>
                <TableHead className="font-bold">Schedule</TableHead>
                <TableHead className="font-bold">Service Details</TableHead>
                <TableHead className="font-bold">Attending Staff</TableHead>
                <TableHead className="font-bold text-right">Balance Due</TableHead>
                <TableHead className="font-bold text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Briefcase className="h-10 w-10 opacity-20" />
                      <p className="text-sm font-medium">
                        {searchTerm ? "No matching records found." : "No service records available yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/10 transition-colors group border-b border-border/30">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">{record.clientName}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Phone className="h-3 w-3" />
                          {record.phoneNumber || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{format(new Date(record.date), 'MMM dd, yyyy')}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {record.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{record.workType}</span>
                        {record.duration && (
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Hourglass className="h-3 w-3" />
                            {record.duration}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.staffName ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                            {record.staffName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm">{record.staffName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Not Assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-orange-600">Rs {record.balanceAmount?.toLocaleString() || '0'}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Pending</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20"
                          onClick={() => handlePrint(record)}
                          title="Print Delivery Slip"
                        >
                          <Printer className="h-4.5 w-4.5" />
                        </Button>

                        <ServiceRecordForm record={record} />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20" title="Cancel Delivery">
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5 text-destructive" />
                                Cancel Service Record?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the service delivery record for <strong>{record.clientName}</strong>. 
                                <br/><br/>
                                <span className="text-xs text-muted-foreground italic">Note: The original booking scheduled for {format(new Date(record.date), 'MMM dd')} will remain unaffected.</span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Go Back</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteServiceRecord(record.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Yes, Cancel Record
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