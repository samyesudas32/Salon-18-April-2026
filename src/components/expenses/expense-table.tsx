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
import { format } from 'date-fns';
import { Pencil, Trash2, Wallet } from 'lucide-react';
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

export function ExpenseTable() {
  const { expenses, deleteExpense } = useApp();

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);
  
  const totalExpense = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [expenses]);

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-0">
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <Table>
            <TableHeader className="bg-muted/30">
            <TableRow>
                <TableHead className="font-bold w-[150px]">Date</TableHead>
                <TableHead className="font-bold">Item/Description</TableHead>
                <TableHead className="font-bold text-right w-[150px]">Amount</TableHead>
                <TableHead className="font-bold text-right w-[100px]">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {sortedExpenses.length === 0 ? (
                <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <Wallet className="h-8 w-8 opacity-20" />
                        <p>No expenses recorded yet.</p>
                    </div>
                </TableCell>
                </TableRow>
            ) : (
                sortedExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell className="font-medium">{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-muted-foreground">{expense.item}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-destructive">Rs {expense.amount.toFixed(2)}</TableCell>
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
            {sortedExpenses.length > 0 && (
              <TableFooter>
                  <TableRow className="bg-muted/40 font-bold">
                      <TableCell colSpan={2} className="text-right">Total Expenses</TableCell>
                      <TableCell className="text-right font-mono text-destructive">Rs {totalExpense.toFixed(2)}</TableCell>
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
