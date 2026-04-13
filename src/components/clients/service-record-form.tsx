'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, User, Briefcase, Clock, CalendarIcon, UserCheck, Hourglass, Phone, IndianRupee, CreditCard, Calculator } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useApp } from '@/app/lib/store';
import { ServiceRecord } from '@/app/lib/types';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  clientName: z.string().min(2, 'Name is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  workType: z.string().min(2, 'Service type is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  durationValue: z.string().optional(),
  durationUnit: z.string().default('minutes'),
  staffName: z.string().optional(),
  totalAmount: z.coerce.number().min(0),
  advanceAmount: z.coerce.number().min(0),
  balanceAmount: z.coerce.number(),
});

interface ServiceRecordFormProps {
  record: ServiceRecord;
  trigger?: React.ReactNode;
}

export function ServiceRecordForm({ record, trigger }: ServiceRecordFormProps) {
  const [open, setOpen] = useState(false);
  const { updateServiceRecord } = useApp();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: record.clientName,
      phoneNumber: record.phoneNumber || '',
      workType: record.workType,
      date: record.date,
      time: record.time,
      durationValue: record.duration?.split(' ')[0] || '',
      durationUnit: record.duration?.split(' ')[1] || 'minutes',
      staffName: record.staffName || '',
      totalAmount: record.totalAmount || 0,
      advanceAmount: record.advanceAmount || 0,
      balanceAmount: record.balanceAmount || 0,
    },
  });

  useEffect(() => {
    if (open) {
      const parts = record.duration?.split(' ') || [];
      form.reset({
        clientName: record.clientName,
        phoneNumber: record.phoneNumber || '',
        workType: record.workType,
        date: record.date,
        time: record.time,
        durationValue: parts[0] || '',
        durationUnit: parts[1] || 'minutes',
        staffName: record.staffName || '',
        totalAmount: record.totalAmount || 0,
        advanceAmount: record.advanceAmount || 0,
        balanceAmount: record.balanceAmount || 0,
      });
    }
  }, [record, form, open]);

  const handleAutoSum = () => {
    const total = form.getValues('totalAmount');
    const advance = form.getValues('advanceAmount');
    form.setValue('balanceAmount', total - advance);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const duration = values.durationValue ? `${values.durationValue} ${values.durationUnit}` : '';
    
    // Create updates object excluding UI-only fields
    const { durationValue, durationUnit, ...rest } = values;
    
    updateServiceRecord(record.id, {
      ...rest,
      duration,
      staffName: values.staffName || '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
            <EditIcon className="h-6 w-6" />
            Edit Service Delivery Record
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            {/* Section 1: Client & Schedule */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Client & Appointment
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9 h-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9 h-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input type="date" className="pl-9 h-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="pl-9 h-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 2: Service Delivery Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5" />
                Delivery Details
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="workType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Provided</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9 h-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="staffName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attending Staff</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Staff Name" className="pl-9 h-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col space-y-2 max-w-[200px]">
                  <FormLabel>Duration</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="durationValue"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="relative">
                              <Hourglass className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="number" placeholder="0" className="pl-9 h-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="durationUnit"
                      render={({ field }) => (
                        <FormItem className="w-[105px]">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hrs">Hrs</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 3: Financial Summary */}
            <div className="space-y-4 bg-muted/30 p-5 rounded-xl border border-border/60 shadow-inner">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Financial Summary (Slip Details)
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase">Total Charge</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rs</span>
                          <Input type="number" className="pl-9 h-10 font-bold" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advanceAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase">Advance Paid</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rs</span>
                          <Input type="number" className="pl-9 h-10 text-green-700" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="balanceAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase">
                        Balance
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 text-primary"
                                onClick={handleAutoSum}
                              >
                                <Calculator className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Calculate (Total - Advance)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rs</span>
                          <Input type="number" className="pl-9 h-10 font-black text-orange-700" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="px-6">Cancel</Button>
              <Button type="submit" className="bg-primary px-8">Save Slip Data</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Local helper component for the edit icon
const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6-6Z"/><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);
