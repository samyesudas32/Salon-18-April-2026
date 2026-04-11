'use client';

import { ProductExpenseTable } from '@/components/product-expenses/product-expense-table';
import { ProductExpenseForm } from '@/components/product-expenses/product-expense-form';

export default function ProductExpensesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Product Expenses</h2>
          <p className="text-muted-foreground mt-1">Track and manage your product-related expenses.</p>
        </div>
        <ProductExpenseForm />
      </div>
      
      <ProductExpenseTable />
    </div>
  );
}
