'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Clock, Search, Briefcase, Trash2, UserCheck, Hourglass, Phone, Printer } from 'lucide-react';
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
      format: [80, 150] // Receipt style format for 80mm printers
    });

    doc.setFontSize(14);
    doc.text('SALON OF GUZELLIK', 40, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Service Delivery Slip', 40, 22, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(10, 25, 70, 25);

    doc.setFontSize(9);
    doc.text(`Client: ${record.clientName}`, 10, 35);
    doc.text(`Phone: ${record.phoneNumber || 'N/A'}`, 10, 42);
    doc.text(`Date: ${format(new Date(record.date), 'MMM dd, yyyy')}`, 10, 49);
    doc.text(`Time: ${record.time}`, 10, 56);
    
    doc.line(10, 60, 70, 60);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Service: ${record.workType}`, 10, 68);
    doc.setFont('helvetica', 'normal');
    doc.text(`Staff: ${record.staffName || 'Not Assigned'}`, 10, 75);
    doc.text(`Duration: ${record.duration || 'N/A'}`, 10, 82);

    doc.line(10, 90, 70, 90);
    doc.setFontSize(8);
    doc.text('Thank you for choosing our service!', 40, 100, { align: 'center' });

    doc.save(`Service_Slip_${record.clientName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Service Section</CardTitle>
            <CardDescription>
              Manage independent delivery records. Changes here do not affect the original booking.
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
                <TableHead className="font-bold">Staff Name</TableHead>
                <TableHead className="font-bold">Duration</TableHead>
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
                        <span>{record.workType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{record.staffName || '---'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Hourglass className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{record.duration || '---'}</span>
                      </div>
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
