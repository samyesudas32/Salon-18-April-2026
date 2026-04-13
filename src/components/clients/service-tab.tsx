'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Search, Briefcase, Trash2, Hourglass, Phone, Printer } from 'lucide-react';
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

    const primaryColor = [33, 53, 85]; // Dark Blue

    // 1. Header with branding
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]); 
    doc.rect(0, 0, 148, 40, 'F'); // Increased height slightly
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24); // Increased from 20
    doc.text('SALON OF GUZELLIK', 74, 18, { align: 'center' });
    
    doc.setFontSize(11); // Increased from 9
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Beauty Care & Salon', 74, 25, { align: 'center' });
    
    doc.setFillColor(255, 255, 255, 0.2);
    doc.rect(34, 29, 80, 7, 'F'); // Adjusted box
    doc.setFontSize(12); // Increased from 10
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE DELIVERY SLIP', 74, 34, { align: 'center' });

    // 2. Info Grid Layout
    let currentY = 50; // Adjusted starting Y
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10); // Increased from 8
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT DETAILS', 15, currentY);
    doc.text('APPOINTMENT INFO', 85, currentY);

    doc.setDrawColor(230, 230, 230);
    doc.line(15, currentY + 2, 133, currentY + 2);

    currentY += 10;

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(11); // Increased from 10
    doc.setFont('helvetica', 'bold');
    doc.text(record.clientName, 15, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(record.phoneNumber || 'No Phone provided', 15, currentY + 6);
    
    doc.setFont('helvetica', 'bold');
    doc.text(format(new Date(record.date), 'MMM dd, yyyy'), 85, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Time: ${record.time}`, 85, currentY + 6);

    currentY += 18;

    // 3. Service Table
    autoTable(doc, {
      startY: currentY,
      head: [['SERVICE DESCRIPTION', 'STAFF', 'DURATION']],
      body: [
        [record.workType, record.staffName || 'N/A', record.duration || '---']
      ],
      margin: { left: 15, right: 15 },
      styles: { 
        fontSize: 10, // Increased from 9
        cellPadding: 5,
        valign: 'middle',
        lineColor: [240, 240, 240],
        lineWidth: 0.1,
      },
      headStyles: { 
        fillColor: primaryColor, 
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      }
    });

    // 4. Financial Summary (Only Total Charge as requested)
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    const boxWidth = 80; // Slightly wider
    const startX = 133 - boxWidth;

    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.8);
    doc.line(startX, finalY, 133, finalY); // Top emphasis line
    
    doc.setFontSize(13); // Increased from 11
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    doc.text('TOTAL SERVICE CHARGE', startX, finalY + 10);
    doc.text(`Rs ${record.totalAmount?.toLocaleString() || '0'}`, 133, finalY + 10, { align: 'right' });

    doc.line(startX, finalY + 15, 133, finalY + 15); // Bottom emphasis line

    // 5. Footer with Address and Phone
    const footerY = 175; // Adjusted slightly up to fit bigger text
    doc.setTextColor(60, 60, 60); // Darker for better visibility
    doc.setFontSize(10); // Significantly increased from 7.5
    doc.setFont('helvetica', 'normal');
    
    const addressLine1 = "West of Iron Bridge, CCSB Rd, near Merino Fabrics,";
    const addressLine2 = "Kodiveedu, Alappuzha, Kerala 688001";
    const phoneLine = "Ph: 7025 80 1010, 755 88 74175";
    
    doc.text(addressLine1, 74, footerY, { align: 'center' });
    doc.text(addressLine2, 74, footerY + 4.5, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.text(phoneLine, 74, footerY + 10, { align: 'center' });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12); // Increased from 8.5
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for visiting Salon of Guzellik!', 74, footerY + 20, { align: 'center' });
    
    doc.setFontSize(7); // Slightly bigger ref ID
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref ID: ${record.id.toUpperCase()}`, 74, footerY + 26, { align: 'center' });

    doc.save(`Service_Slip_${record.clientName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-card pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-headline font-bold text-primary">Service Section</CardTitle>
              <CardDescription>
                Manage delivery records and print professional slips with total charges.
              </CardDescription>
            </div>
          </div>
          <div className="relative w-full max-sm:max-w-full max-w-sm">
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
                <TableHead className="font-bold text-right px-6">Total Charge</TableHead>
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
                    <TableCell className="text-right px-6">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-primary">Rs {record.totalAmount?.toLocaleString() || '0'}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Total</span>
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
                                <span className="text-xs text-muted-foreground italic">Note: The original booking remains unaffected.</span>
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
