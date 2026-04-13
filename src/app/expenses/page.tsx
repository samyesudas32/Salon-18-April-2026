'use client';

import { useState } from 'react';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from 'lucide-react';

export default function ExpensesPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

      <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm">
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              From Date
            </Label>
            <Input 
              type="date" 
              className="w-[180px]" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              To Date
            </Label>
            <Input 
              type="date" 
              className="w-[180px]" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => { setStartDate(''); setEndDate(''); }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      <ExpenseTable startDate={startDate} endDate={endDate} />
    </div>
  );
}

import { Button } from '@/components/ui/button';
