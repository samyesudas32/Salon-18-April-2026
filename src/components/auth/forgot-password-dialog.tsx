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
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  enteredAdminId: z.string().min(1, 'Admin ID is required.'),
});

interface ForgotPasswordDialogProps {
  children: React.ReactNode;
}

export function ForgotPasswordDialog({ children }: ForgotPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { adminId, recoveryEmail, generatePasswordResetToken } = useApp();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { enteredAdminId: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (values.enteredAdminId !== adminId) {
      toast({
        title: 'Recovery Information Sent',
        description: 'If a matching account exists, a recovery link has been sent to the registered email.',
      });
      setIsLoading(false);
      setOpen(false);
      return;
    }

    if (!recoveryEmail) {
      toast({
        variant: 'destructive',
        title: 'Recovery Email Not Set',
        description: 'Please contact support or set a recovery email in the application settings.',
      });
      setIsLoading(false);
      return;
    }

    const token = generatePasswordResetToken();

    if (token) {
      try {
        const response = await fetch('/api/send-reset-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: recoveryEmail, token, adminId }),
        });

        if (!response.ok) {
          throw new Error('Failed to send email.');
        }
        
        toast({
          title: 'Recovery Information Sent',
          description: `A recovery link has been sent to ${recoveryEmail}. Please check your inbox.`,
        });
        setOpen(false);

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not send recovery email. Please try again later.',
        });
      }
    }
    
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Recovery</DialogTitle>
          <DialogDescription>
            Enter your Admin ID to receive a recovery link at your registered email address.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="enteredAdminId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Admin ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Recovery Link
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
