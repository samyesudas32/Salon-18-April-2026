'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from '@/app/lib/store';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Pencil, Trash2, Wallet, CalendarOff, Download, AlertTriangle } from 'lucide-react';
import { ExpenseForm } from './expense-form';
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
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExpenseTableProps {
  startDate?: string;
  endDate?: string;
}

export function ExpenseTable({ startDate, endDate }: ExpenseTableProps) {
  const { expenses, deleteExpense, deleteExpenses, businessName } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (startDate || endDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = parseISO(expense.date);
        const start = startDate ? startOfDay(parseISO(startDate)) : null;
        const end = endDate ? endOfDay(parseISO(endDate)) : null;

        if (start && end) {
          return isWithinInterval(expenseDate, { start, end });
        } else if (start) {
          return expenseDate >= start;
        } else if (end) {
          return expenseDate <= end;
        }
        return true;
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, startDate, endDate]);
  
  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [filteredExpenses]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredExpenses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredExpenses.map(e => e.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    deleteExpenses(selectedIds);
    setSelectedIds([]);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const periodLabel = startDate && endDate 
      ? `From ${format(parseISO(startDate), 'PP')} to ${format(parseISO(endDate), 'PP')}`
      : startDate ? `Since ${format(parseISO(startDate), 'PP')}`
      : endDate ? `Until ${format(parseISO(endDate), 'PP')}`
      : 'All Records';
      
    const primaryColor = [33, 53, 85];

    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(businessName.toUpperCase(), 105, 18, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('DAILY EXPENDITURE REPORT', 105, 26, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Period: ${periodLabel}`, 14, 40);
    doc.text(`Generated Date: ${format(new Date(), 'PPP p')}`, 14, 45);
    doc.text(`Total Expenditure: Rs ${totalExpense.toLocaleString()}`, 14, 50);

    autoTable(doc, {
      startY: 55,
      head: [['DATE', 'ITEM / DESCRIPTION', 'AMOUNT (RS)']],
      body: filteredExpenses.map(e => [
        format(parseISO(e.date), 'MMM dd, yyyy'),
        e.item,
        e.amount.toLocaleString()
      ]),
      foot: [[{ content: 'TOTAL EXPENDITURE', colSpan: 2, styles: { halign: 'right' } }, totalExpense.toLocaleString()]],
      theme: 'striped',
      headStyles: { 
        fillColor: primaryColor, 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: primaryColor,
        fontStyle: 'bold',
        fontSize: 11
      },
      styles: {
        fontSize: 9,
        cellPadding: 4
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(`${businessName.replace(/\s+/g, '_')}_Expenses.pdf`);
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-destructive">{selectedIds.length} Expenses Selected</p>
              <p className="text-xs text-muted-foreground">Confirm to permanently remove these records.</p>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2 shadow-lg shadow-destructive/20">
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bulk Delete Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you absolutely sure you want to delete {selectedIds.length} selected expense records? This action is permanent.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Card className="border-none shadow-sm overflow-hidden rounded-xl">
        <div className="flex items-center justify-between p-5 bg-card border-b border-border/40">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-primary">Expense Records</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5 h-9"
            onClick={handleDownloadPDF}
            disabled={filteredExpenses.length === 0}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-hidden">
          <Table>
              <TableHeader className="bg-muted/30">
              <TableRow>
                  <TableHead className="w-[50px] px-4">
                    <Checkbox 
                      checked={filteredExpenses.length > 0 && selectedIds.length === filteredExpenses.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-bold w-[150px] py-4">Date</TableHead>
                  <TableHead className="font-bold">Item/Description</TableHead>
                  <TableHead className="font-bold text-right w-[150px]">Amount</TableHead>
                  <TableHead className="font-bold text-right w-[100px]">Actions</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
              {filteredExpenses.length === 0 ? (
                  <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <CalendarOff className="h-6 w-6 opacity-40" />
                          </div>
                          <div>
                            <p className="font-bold text-primary">No expenses found</p>
                            <p className="text-sm">Try adjusting your date range or adding a new record.</p>
                          </div>
                      </div>
                  </TableCell>
                  </TableRow>
              ) : (
                  filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-muted/10 transition-colors group">
                      <TableCell className="px-4">
                        <Checkbox 
                          checked={selectedIds.includes(expense.id)}
                          onCheckedChange={() => toggleSelectOne(expense.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{format(parseISO(expense.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.item}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-destructive">Rs {expense.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExpenseForm
                          expense={expense}
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
                                  This will permanently delete the expense record. This action cannot be undone.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteExpense(expense.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
              {filteredExpenses.length > 0 && (
                <TableFooter>
                    <TableRow className="bg-muted/40 font-bold border-t-2">
                        <TableCell colSpan={3} className="text-right text-primary uppercase tracking-tight">Total Period Expenditure</TableCell>
                        <TableCell className="text-right font-black text-destructive text-lg">Rs {totalExpense.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
              )}
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}