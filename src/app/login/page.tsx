'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/app/lib/store';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';
import { ForgotPasswordDialog } from '@/components/auth/forgot-password-dialog';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoggedIn } = useApp();
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
              <Label htmlFor="userId">Admin ID</Label>
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
              <Label htmlFor="password">Password</Label>
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

            <div className="text-right -mt-2">
              <ForgotPasswordDialog>
                <Button type="button" variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                  Forgot User ID or Password?
                </Button>
              </ForgotPasswordDialog>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/10 transition-all active:scale-[0.98] mt-4">
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
    </div>
  );
}
