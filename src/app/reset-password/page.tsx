'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/app/lib/store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck, ShieldX } from 'lucide-react';
import Link from 'next/link';

function PasswordResetComponent() {
  const { verifyPasswordResetToken, resetPasswordWithToken } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      const isValid = verifyPasswordResetToken(tokenFromUrl);
      setIsValidToken(isValid);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams, verifyPasswordResetToken]);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 4) {
      toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 4 characters.' });
      return;
    }

    const success = resetPasswordWithToken(token, newPassword);
    if (success) {
      toast({ title: 'Success', description: 'Your password has been reset. Please log in.' });
      router.push('/login');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to reset password. The link may have expired.' });
      setIsValidToken(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Verifying reset link...</p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <Card className="w-full max-w-md shadow-lg border-destructive/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground">
              <ShieldX className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Invalid or Expired Link</CardTitle>
          <CardDescription>This password reset link is no longer valid. Please request a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
        <CardDescription>Enter and confirm your new secure password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                className="pl-10 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="pl-10 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Set New Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Suspense fallback={<div>Loading...</div>}>
            <PasswordResetComponent />
        </Suspense>
    </div>
  );
}