'use client';

import { useState, useEffect, Suspense } from 'react';
import { useApp } from '@/app/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const { toast } = useToast();
  const { resetPasswordWithToken } = useApp();

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Missing reset token. Please request a new one.",
      });
      router.push('/login');
    }
  }, [token, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast({ variant: "destructive", title: "Validation Error", description: "Passwords do not match." });
      return;
    }

    if (newPass.length < 4) {
      toast({ variant: "destructive", title: "Weak Password", description: "Password must be at least 4 characters long." });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API/Hashing delay
    setTimeout(() => {
      const res = resetPasswordWithToken(token || '', newPass);
      if (res.success) {
        toast({ title: "Success", description: res.message });
        router.push('/login');
      } else {
        toast({ variant: "destructive", title: "Reset Failed", description: res.message });
      }
      setIsProcessing(false);
    }, 1200);
  };

  if (!token) return null;

  return (
    <Card className="w-full max-w-md shadow-2xl border-border/40 animate-in fade-in zoom-in duration-500 overflow-hidden">
      <div className="h-2 bg-primary w-full" />
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create New Password</CardTitle>
        <CardDescription>Enter your new secure administrative credentials.</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPass">New Password</Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPass"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 h-11"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPass">Confirm Password</Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPass"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-muted-foreground"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-bold mt-2" disabled={isProcessing}>
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update & Invalidate Token
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="justify-center border-t border-border/40 bg-muted/20 py-4">
        <button 
          onClick={() => router.push('/login')}
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </button>
      </CardFooter>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
