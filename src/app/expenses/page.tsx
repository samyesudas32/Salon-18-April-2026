'use client';

import { ExpenseTable } from '@/components/expenses/expense-table';
import { ExpenseForm } from '@/components/expenses/expense-form';

export default function ExpensesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Daily Expenses</h2>
          <p className="text-muted-foreground mt-1">Track and manage your daily business expenses.</p>
        </div>
        <ExpenseForm />
      </div>
      
      <ExpenseTable />
    </div>
  );
}
