'use client';

import { useState } from 'react';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { ExpenseForm } from '@/components/expenses/expense-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';

const MONTHS = [
  { value: 'all', label: 'All Months' },
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export default function ExpensesPage() {
  const [monthFilter, setMonthFilter] = useState('all');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Daily Expenses</h2>
          <p className="text-muted-foreground mt-1">Track and manage your daily business expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExpenseForm />
        </div>
      </div>

      <div className="max-w-xs space-y-2 bg-card p-4 rounded-xl border border-border/40 shadow-sm">
        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
          <Search className="h-3 w-3" />
          Filter By Month
        </label>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-full bg-background border-border/60">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <ExpenseTable monthFilter={monthFilter} />
    </div>
  );
}
