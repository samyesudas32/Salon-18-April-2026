'use client';

import { useState } from 'react';
import { ProductExpenseTable } from '@/components/product-expenses/product-expense-table';
import { ProductExpenseForm } from '@/components/product-expenses/product-expense-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Calendar, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startOfMonth, endOfMonth, format } from 'date-fns';

const MONTHS = [
  { value: 'custom', label: 'Custom Range' },
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

export default function ProductExpensesPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthFilter, setMonthFilter] = useState('custom');

  const handleMonthChange = (value: string) => {
    setMonthFilter(value);
    if (value === 'custom') {
      setStartDate('');
      setEndDate('');
    } else {
      const year = new Date().getFullYear();
      const monthDate = new Date(year, parseInt(value), 1);
      setStartDate(format(startOfMonth(monthDate), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(monthDate), 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Product Expenses</h2>
          <p className="text-muted-foreground mt-1 text-lg">Manage your inventory costs with easy monthly and custom date filtering.</p>
        </div>
        <div className="flex items-center gap-3">
          <ProductExpenseForm />
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm">
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Search className="h-3 w-3" />
              Quick Month Filter
            </Label>
            <Select value={monthFilter} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[180px] bg-background">
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

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              From Date
            </Label>
            <Input 
              type="date" 
              className="w-[180px] bg-background" 
              value={startDate} 
              onChange={(e) => {
                setStartDate(e.target.value);
                setMonthFilter('custom');
              }} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              To Date
            </Label>
            <Input 
              type="date" 
              className="w-[180px] bg-background" 
              value={endDate} 
              onChange={(e) => {
                setEndDate(e.target.value);
                setMonthFilter('custom');
              }} 
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-primary mb-1"
            onClick={() => { 
              setStartDate(''); 
              setEndDate(''); 
              setMonthFilter('custom');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      <ProductExpenseTable startDate={startDate} endDate={endDate} />
    </div>
  );
}
