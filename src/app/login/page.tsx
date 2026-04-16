'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/app/lib/store';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Eye, EyeOff, LogIn, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from '@/app/actions/email-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Recovery State
  const [showRecoverPass, setShowRecoverPass] = useState(false);
  const [showRecoverUser, setShowRecoverUser] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { login, isLoggedIn, initiatePasswordReset, recoverUserId, businessName } = useApp();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(userId, password);
    if (success) {
      toast({
        title: "Access Granted",
        description: "Welcome to the Administrative Dashboard.",
      });
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please check your User ID and Password.",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // 1. Generate token and validate email in client store
    const res = initiatePasswordReset(recoveryInput);
    
    if (res.success && res.token) {
      // 2. Trigger SMTP Server Action
      try {
        const emailRes = await sendPasswordResetEmail({
          email: recoveryInput,
          token: res.token,
          businessName: businessName
        });

        if (emailRes.success) {
          toast({
            title: "Recovery Sent",
            description: emailRes.message,
          });
          setShowRecoverPass(false);
          setRecoveryInput('');
        } else {
          toast({
            variant: "destructive",
            title: "Email Error",
            description: emailRes.message,
          });
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "System Error",
          description: "Could not connect to the email server.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: res.message,
      });
    }
    
    setIsProcessing(false);
  };

  const handleForgotUserId = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      const res = recoverUserId(recoveryInput);
      if (res.success) {
        toast({
          title: "User ID Sent",
          description: res.message,
        });
        setShowRecoverUser(false);
        setRecoveryInput('');
      } else {
        toast({
          variant: "destructive",
          title: "Not Found",
          description: res.message,
        });
      }
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <Card className="w-full max-w-md shadow-2xl border-border/40 animate-in fade-in zoom-in duration-500 overflow-hidden">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 duration-300">
              <LogIn className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-headline tracking-tight">Admin Portal</CardTitle>
          <CardDescription className="text-base">Sign in to manage your service business</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="userId">Admin ID</Label>
                <button 
                  type="button" 
                  onClick={() => setShowRecoverUser(true)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot ID?
                </button>
              </div>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter User ID"
                  className="pl-10 h-11 border-border/60 focus:border-primary/50 transition-all"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button 
                  type="button" 
                  onClick={() => setShowRecoverPass(true)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border-border/60 focus:border-primary/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/10 transition-all active:scale-[0.98] mt-2">
              Login to System
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t border-border/40 bg-muted/20 py-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Secure Connection Established
          </p>
        </CardFooter>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showRecoverPass} onOpenChange={setShowRecoverPass}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Reset Admin Password
            </DialogTitle>
            <DialogDescription>
              Enter your registered recovery email to receive a secure reset link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="recoveryEmail">Registered Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recoveryEmail"
                  type="email"
                  placeholder="e.g. soumya@example.com"
                  className="pl-10 h-11"
                  value={recoveryInput}
                  onChange={(e) => setRecoveryInput(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" className="w-full h-11" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Email...
                  </>
                ) : "Send Recovery Email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot User ID Dialog */}
      <Dialog open={showRecoverUser} onOpenChange={setShowRecoverUser}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Recover Admin User ID
            </DialogTitle>
            <DialogDescription>
              Enter your registered recovery email to retrieve your ID.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotUserId} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="userIdContact">Registered Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userIdContact"
                  type="email"
                  placeholder="e.g. soumya@example.com"
                  className="pl-10 h-11"
                  value={recoveryInput}
                  onChange={(e) => setRecoveryInput(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" className="w-full h-11" disabled={isProcessing}>
                {isProcessing ? "Verifying..." : "Send User ID"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
