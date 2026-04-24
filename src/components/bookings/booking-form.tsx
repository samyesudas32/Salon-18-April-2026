
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Calculator, CalendarIcon, Phone, User, Briefcase, IndianRupee, AlignLeft, Clock, MessageSquare } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/app/lib/store';
import { Booking } from '@/app/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  clientName: z.string().min(2, 'Name is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  workType: z.string().min(2, 'Work type is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  advanceAmount: z.coerce.number().min(0),
  totalAmount: z.coerce.number().min(0),
  expenseAmount: z.coerce.number().min(0),
  balanceAmount: z.coerce.number(),
  notes: z.string().optional(),
  status: z.enum(['upcoming', 'completed', 'pending']),
  sendSMS: z.boolean().default(false),
});

interface BookingFormProps {
  booking?: Booking;
  trigger?: React.ReactNode;
}

export function BookingForm({ booking, trigger }: BookingFormProps) {
  const [open, setOpen] = useState(false);
  const { addBooking, updateBooking } = useApp();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: booking?.clientName || '',
      phoneNumber: booking?.phoneNumber || '',
      workType: booking?.workType || '',
      date: booking?.date || new Date().toISOString().split('T')[0],
      time: booking?.time || '12:00',
      advanceAmount: booking?.advanceAmount || 0,
      totalAmount: booking?.totalAmount || 0,
      expenseAmount: booking?.expenseAmount || 0,
      balanceAmount: booking?.balanceAmount || 0,
      notes: booking?.notes || '',
      status: booking?.status || 'upcoming',
      sendSMS: false,
    },
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        clientName: booking.clientName,
        phoneNumber: booking.phoneNumber,
        workType: booking.workType,
        date: booking.date,
        time: booking.time,
        advanceAmount: booking.advanceAmount,
        totalAmount: booking.totalAmount,
        expenseAmount: booking.expenseAmount,
        balanceAmount: booking.balanceAmount,
        notes: booking.notes,
        status: booking.status,
        sendSMS: false,
      });
    }
  }, [booking, form, open]);

  const handleAutoSum = () => {
    const total = form.getValues('totalAmount');
    const advance = form.getValues('advanceAmount');
    const expense = form.getValues('expenseAmount');
    form.setValue('balanceAmount', total - advance - expense);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { sendSMS, ...bookingData } = values;
    if (booking) {
      updateBooking(booking.id, {
        ...bookingData,
        notes: values.notes || '',
      });
    } else {
      addBooking({
        ...bookingData,
        notes: values.notes || '',
      }, sendSMS);
      form.reset();
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-md">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
            {booking ? 'Update Booking' : 'New Service Booking'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {/* Section 1: Client Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Client Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="John Doe" className="pl-9" {...field} />
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
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="+91 00000 00000" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Section 2: Work Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5" />
                Service Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service / Work Type</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="e.g. Haircut, Consulting" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Date</FormLabel>
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Section 3: Financials & Notes */}
            <div className="space-y-6 bg-muted/20 p-4 rounded-lg border border-border/40">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Payment Summary
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Total Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rs</span>
                            <Input type="number" className="pl-9 font-bold" {...field} />
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
                        <FormLabel className="font-bold text-green-700">Advance Paid</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rs</span>
                            <Input type="number" className="pl-9 text-green-700 font-bold" {...field} />
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
                        <FormLabel className="flex items-center justify-between font-bold text-orange-700">
                          Balance Due
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-primary hover:bg-primary/10"
                                  onClick={handleAutoSum}
                                >
                                  <Calculator className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Calculate (Total - Advance - Expense)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rs</span>
                            <Input type="number" className="pl-9 font-black text-orange-700 bg-orange-50/50" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <FormField
                    control={form.control}
                    name="expenseAmount"
                    render={({ field }) => (
                      <FormItem className="max-w-[200px]">
                        <FormLabel>Additional Expense</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rs</span>
                            <Input type="number" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="opacity-20" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <AlignLeft className="h-3.5 w-3.5" />
                  Additional Notes
                </h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter long notes, specific requirements, or extra service details here..." 
                          className="min-h-[120px] resize-none focus:ring-primary/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!booking && (
                <>
                  <Separator className="opacity-20" />
                  <FormField
                    control={form.control}
                    name="sendSMS"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-primary/5">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 text-primary font-bold">
                            <MessageSquare className="h-4 w-4" />
                            Send SMS Confirmation
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Trigger an automated MSG91 notification to the client.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="px-6">Cancel</Button>
              <Button type="submit" className="bg-primary px-8 shadow-sm">
                {booking ? 'Update Record' : 'Create Booking'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
