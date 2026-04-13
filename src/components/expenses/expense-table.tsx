'use client';

import { useMemo } from 'react';
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
import { useApp } from '@/app/lib/store';
import { format, parseISO, getMonth } from 'date-fns';
import { Pencil, Trash2, Wallet, CalendarOff, Download } from 'lucide-react';
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
  monthFilter?: string;
}

const MONTHS_NAME = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function ExpenseTable({ monthFilter = 'all' }: ExpenseTableProps) {
  const { expenses, deleteExpense, businessName } = useApp();

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (monthFilter !== 'all') {
      const monthIndex = parseInt(monthFilter);
      filtered = filtered.filter((expense) => {
        const date = parseISO(expense.date);
        return getMonth(date) === monthIndex;
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, monthFilter]);
  
  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [filteredExpenses]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const monthLabel = monthFilter === 'all' ? 'All Months' : MONTHS_NAME[parseInt(monthFilter)];
    const primaryColor = [33, 53, 85]; // Branding color

    // Report Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(businessName.toUpperCase(), 105, 18, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('DAILY EXPENSE REPORT', 105, 26, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Period: ${monthLabel}`, 14, 40);
    doc.text(`Generated Date: ${format(new Date(), 'PPP p')}`, 14, 45);
    doc.text(`Total Monthly Expense: Rs ${totalExpense.toLocaleString()}`, 14, 50);

    // Expense Table
    autoTable(doc, {
      startY: 55,
      head: [['DATE', 'ITEM / DESCRIPTION', 'AMOUNT (RS)']],
      body: filteredExpenses.map(e => [
        format(parseISO(e.date), 'MMM dd, yyyy'),
        e.item,
        e.amount.toLocaleString()
      ]),
      foot: [[{ content: 'TOTAL MONTHLY EXPENDITURE', colSpan: 2, styles: { halign: 'right' } }, totalExpense.toLocaleString()]],
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

    doc.save(`${businessName.replace(/\s+/g, '_')}_Expenses_${monthLabel}.pdf`);
  };

  return (
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
                <TableHead className="font-bold w-[150px] py-4">Date</TableHead>
                <TableHead className="font-bold">Item/Description</TableHead>
                <TableHead className="font-bold text-right w-[150px]">Amount</TableHead>
                <TableHead className="font-bold text-right w-[100px]">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredExpenses.length === 0 ? (
                <TableRow>
                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <CalendarOff className="h-6 w-6 opacity-40" />
                        </div>
                        <div>
                          <p className="font-bold text-primary">No expenses found</p>
                          <p className="text-sm">Try adjusting your filters or adding a new record.</p>
                        </div>
                    </div>
                </TableCell>
                </TableRow>
            ) : (
                filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/10 transition-colors group">
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
                      <TableCell colSpan={2} className="text-right text-primary uppercase tracking-tight">Total Monthly Expenditure</TableCell>
                      <TableCell className="text-right font-black text-destructive text-lg">Rs {totalExpense.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                  </TableRow>
              </TableFooter>
            )}
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
