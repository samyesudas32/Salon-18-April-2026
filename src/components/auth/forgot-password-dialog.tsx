'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/app/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, Phone, ShieldQuestion } from 'lucide-react';

const formSchema = z.object({
  contact: z.string().min(3, 'Please enter a valid email or phone number.'),
});

interface ForgotPasswordDialogProps {
  children: React.ReactNode;
}

export function ForgotPasswordDialog({ children }: ForgotPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { adminId, recoveryEmail, adminPhone, generatePasswordResetToken, triggerSMS } = useApp();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { contact: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const input = values.contact.trim().toLowerCase();
    const cleanAdminPhone = adminPhone.replace(/\D/g, '');
    const cleanInputPhone = input.replace(/\D/g, '');

    // Common response for security
    const showAmbiguousSuccess = () => {
      toast({
        title: 'Recovery Request Received',
        description: 'If the information matches our records, a reset link will be sent shortly.',
      });
      setOpen(false);
    };

    const token = generatePasswordResetToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    // Path 1: Email Recovery
    if (input === recoveryEmail?.toLowerCase()) {
      try {
        const response = await fetch('/api/send-reset-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: recoveryEmail, token, adminId }),
        });

        if (!response.ok) throw new Error();
        showAmbiguousSuccess();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to send recovery email.' });
      }
    } 
    // Path 2: Phone Recovery (SMS)
    else if (cleanInputPhone.length >= 10 && cleanInputPhone === cleanAdminPhone) {
      try {
        const success = await triggerSMS(adminPhone, {
          name: 'Administrator',
          service: 'Account Recovery',
          date: 'Secure Link',
          time: resetLink, // We use the time variable slot for the link in the template for now
        });

        if (!success) throw new Error();
        showAmbiguousSuccess();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to send recovery SMS.' });
      }
    }
    // Path 3: No Match
    else {
      // Still show success to prevent account harvesting
      setTimeout(() => {
        showAmbiguousSuccess();
      }, 1000);
    }
    
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ShieldQuestion className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-headline font-bold">Account Recovery</DialogTitle>
          </div>
          <DialogDescription>
            Enter your registered recovery email or phone number to receive a secure reset link.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Recovery Contact</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-3 top-3 flex items-center gap-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs">/</span>
                        <Phone className="h-4 w-4" />
                      </div>
                      <Input 
                        placeholder="email@example.com or +91..." 
                        className="pl-16 h-11" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Note: For SMS recovery, ensure your phone number matches exactly what is stored in your Admin Profile settings.
                </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full h-11 font-bold shadow-lg shadow-primary/10">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Send Recovery Information'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
