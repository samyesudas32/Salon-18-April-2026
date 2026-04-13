
'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, KeyRound, Eye, EyeOff, Building2, Type, User } from 'lucide-react';

export default function SettingsPage() {
  const { updateAdminPassword, businessName, businessShortName, adminName, updateBusinessIdentity } = useApp();
  const { toast } = useToast();
  
  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Identity State
  const [tempBusinessName, setTempBusinessName] = useState(businessName);
  const [tempShortName, setTempShortName] = useState(businessShortName);
  const [tempAdminName, setTempAdminName] = useState(adminName);

  useEffect(() => {
    setTempBusinessName(businessName);
    setTempShortName(businessShortName);
    setTempAdminName(adminName);
  }, [businessName, businessShortName, adminName]);

  const handleUpdateIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempBusinessName.trim() || !tempShortName.trim() || !tempAdminName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Business name, logo initial, and administrator name cannot be empty.",
      });
      return;
    }
    updateBusinessIdentity(tempBusinessName, tempShortName, tempAdminName);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "New password and confirmation do not match.",
      });
      return;
    }

    if (newPass.length < 4) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "New password must be at least 4 characters long.",
      });
      return;
    }

    const result = updateAdminPassword(currentPass, newPass);
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: result.message,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1 text-lg">Manage your business branding and security preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Branding Settings */}
        <Card className="border-none shadow-sm flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Business Identity</CardTitle>
            </div>
            <CardDescription>Update how your salon and profile appear on the site.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateIdentity} className="flex-1 flex flex-col">
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="businessName">Full Business Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    className="pl-10"
                    value={tempBusinessName}
                    onChange={(e) => setTempBusinessName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessShortName">Logo Initial (Max 3 chars)</Label>
                <div className="relative">
                  <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessShortName"
                    className="pl-10"
                    maxLength={3}
                    value={tempShortName}
                    onChange={(e) => setTempShortName(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 px-1">This letter appears in the sidebar and loading screen.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminName">Administrator Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminName"
                    className="pl-10"
                    value={tempAdminName}
                    onChange={(e) => setTempAdminName(e.target.value)}
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 px-1">This name appears in the top-right header.</p>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Save Branding & Profile
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Security Settings */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Security</CardTitle>
            </div>
            <CardDescription>Change your administrative password.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPass">Current Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPass"
                    type={showCurrent ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPass">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPass"
                    type={showNew ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPass">Confirm New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPass"
                    type={showConfirm ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Update Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
