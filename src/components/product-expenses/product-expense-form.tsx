'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, CalendarIcon, ShoppingBag, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/app/lib/store';
import { ProductExpense } from '@/app/lib/types';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  productDetails: z.string().min(2, 'Product details are required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
});

interface ProductExpenseFormProps {
  expense?: ProductExpense;
  trigger?: React.ReactNode;
}

export function ProductExpenseForm({ expense, trigger }: ProductExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const { addProductExpense, updateProductExpense } = useApp();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: expense?.date || new Date().toISOString().split('T')[0],
      productDetails: expense?.productDetails || '',
      amount: expense?.amount || 0,
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        date: expense.date,
        productDetails: expense.productDetails,
        amount: expense.amount,
      });
    } else {
      form.reset({
        date: new Date().toISOString().split('T')[0],
        productDetails: '',
        amount: 0,
      });
    }
  }, [expense, form, open]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (expense) {
      updateProductExpense(expense.id, values);
    } else {
      addProductExpense(values);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-md">
            <Plus className="h-4 w-4" />
            Add Product Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
            {expense ? 'Update Product Expense' : 'New Product Expense'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input type="date" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Details</FormLabel>
                  <FormControl>
                     <div className="relative">
                        <ShoppingBag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea placeholder="e.g., Shampoo, Styling Gel" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="number" step="0.01" placeholder="0.00" className="pl-9 font-bold" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary">
                {expense ? 'Save Changes' : 'Add Expense'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
