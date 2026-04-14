'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/app/lib/store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, KeyRound, Eye, EyeOff, Building2, Type, User, MapPin, Phone, FileText, Mail, Info, Smartphone, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { 
    updateAdminPassword, 
    businessName, 
    businessShortName, 
    businessDescription,
    businessAddress,
    businessPhone,
    adminName, 
    recoveryEmail,
    recoveryPhone,
    isPhoneVerified,
    updateBusinessIdentity 
  } = useApp();
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
  const [tempDesc, setTempDesc] = useState(businessDescription);
  const [tempAddress, setTempAddress] = useState(businessAddress);
  const [tempPhone, setTempPhone] = useState(businessPhone);
  const [tempAdminName, setTempAdminName] = useState(adminName);
  const [tempRecoveryEmail, setTempRecoveryEmail] = useState(recoveryEmail);
  const [tempRecoveryPhone, setTempRecoveryPhone] = useState(recoveryPhone);

  // OTP Verification State
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setTempBusinessName(businessName);
    setTempShortName(businessShortName);
    setTempDesc(businessDescription);
    setTempAddress(businessAddress);
    setTempPhone(businessPhone);
    setTempAdminName(adminName);
    setTempRecoveryEmail(recoveryEmail);
    setTempRecoveryPhone(recoveryPhone);
  }, [businessName, businessShortName, businessDescription, businessAddress, businessPhone, adminName, recoveryEmail, recoveryPhone]);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempBusinessName.trim() || !tempShortName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Business name and logo initial cannot be empty.",
      });
      return;
    }
    updateBusinessIdentity({
      name: tempBusinessName,
      shortName: tempShortName,
      description: tempDesc,
      address: tempAddress,
      phone: tempPhone
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAdminName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Administrator name cannot be empty.",
      });
      return;
    }

    const phoneChanged = tempRecoveryPhone !== recoveryPhone;

    updateBusinessIdentity({ 
      admin: tempAdminName,
      recoveryEmail: tempRecoveryEmail,
      recoveryPhone: tempRecoveryPhone,
      isPhoneVerified: phoneChanged ? false : isPhoneVerified
    });
  };

  const handleStartVerification = () => {
    if (!tempRecoveryPhone.trim()) {
      toast({ variant: "destructive", title: "Missing Number", description: "Please enter a mobile number first." });
      return;
    }

    // Auto-save details if they've changed before verifying
    const detailsChanged = tempRecoveryPhone !== recoveryPhone || tempAdminName !== adminName || tempRecoveryEmail !== recoveryEmail;
    if (detailsChanged) {
      updateBusinessIdentity({ 
        admin: tempAdminName,
        recoveryEmail: tempRecoveryEmail,
        recoveryPhone: tempRecoveryPhone,
        isPhoneVerified: false 
      });
    }
    
    // Simulate sending OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOTP(code);
    setShowOTPDialog(true);
    
    toast({
      title: "OTP Triggered (Prototype)",
      description: `SMS simulation sent to ${tempRecoveryPhone}. Code: ${code}`,
    });
  };

  const handleConfirmOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      if (otpValue === sentOTP) {
        updateBusinessIdentity({ isPhoneVerified: true });
        setShowOTPDialog(false);
        setOtpValue('');
        toast({ title: "Mobile Verified", description: "Your recovery number has been successfully registered." });
      } else {
        toast({ variant: "destructive", title: "Invalid Code", description: "The OTP entered is incorrect. Please try again." });
      }
      setIsVerifying(false);
    }, 1500);
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
        <p className="text-muted-foreground mt-1 text-lg">Manage your business branding, recovery methods, and security preferences.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* Business Identity Item */}
        <AccordionItem value="business-identity" className="border rounded-xl bg-card shadow-sm px-6">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-4 text-left">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-lg text-primary leading-none mb-1">Business Identity & Slips</p>
                <p className="text-sm text-muted-foreground font-normal">Update the information that appears on your service delivery slips.</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-8">
            <form onSubmit={handleSaveBranding} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Full Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      className="pl-10 h-11"
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
                      className="pl-10 h-11"
                      maxLength={3}
                      value={tempShortName}
                      onChange={(e) => setTempShortName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDesc">Business Description (Slogan)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessDesc"
                    className="pl-10 h-11"
                    placeholder="e.g. Professional Beauty Care & Salon"
                    value={tempDesc}
                    onChange={(e) => setTempDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPhone">Contact Numbers</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessPhone"
                    className="pl-10 h-11"
                    placeholder="e.g. 7025 80 1010, 755 88 74175"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Physical Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="businessAddress"
                    className="pl-10 min-h-[80px]"
                    placeholder="Full business address for the billing slip footer"
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto px-8 h-11 bg-primary hover:bg-primary/90 shadow-sm font-semibold">
                Save Slip & Branding Changes
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Administrator Profile & Recovery Item */}
        <AccordionItem value="admin-profile" className="border rounded-xl bg-card shadow-sm px-6">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-4 text-left">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-lg text-primary leading-none mb-1">Profile & Recovery Methods</p>
                <p className="text-sm text-muted-foreground font-normal">Manage the administrative name and contact for identity recovery.</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-8">
            <div className="space-y-8 max-w-xl">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Administrator Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="adminName"
                      className="pl-10 h-11"
                      value={tempAdminName}
                      onChange={(e) => setTempAdminName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recoveryEmail">Recovery Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recoveryEmail"
                        type="email"
                        className="pl-10 h-11"
                        placeholder="soumya@example.com"
                        value={tempRecoveryEmail}
                        onChange={(e) => setTempRecoveryEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="recoveryPhone">Recovery Mobile</Label>
                      {isPhoneVerified ? (
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 h-5 px-1.5 flex gap-1 items-center">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 h-5 px-1.5 flex gap-1 items-center">
                          <AlertCircle className="h-3 w-3" />
                          Unverified
                        </Badge>
                      )}
                    </div>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recoveryPhone"
                        className="pl-10 h-11"
                        placeholder="7025801010"
                        value={tempRecoveryPhone}
                        onChange={(e) => setTempRecoveryPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" variant="outline" className="flex-1 h-11">
                    Update Profile Data
                  </Button>
                  {!isPhoneVerified && tempRecoveryPhone.trim().length >= 10 && (
                    <Button 
                      type="button" 
                      onClick={handleStartVerification} 
                      className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md font-bold"
                    >
                      {tempRecoveryPhone !== recoveryPhone ? "Save & Verify OTP" : "Verify Mobile Number (OTP)"}
                    </Button>
                  )}
                </div>
              </form>
              
              <Alert className="bg-blue-50/50 border-blue-100">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 text-xs font-bold">Security Simulation</AlertTitle>
                <AlertDescription className="text-blue-700 text-[11px] leading-relaxed">
                  In a production environment, clicking "Verify" would send a real SMS via Firebase Phone Auth or Twilio. 
                  For this prototype, the 6-digit code will appear in a notification and inside the verification screen.
                </AlertDescription>
              </Alert>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Security Item */}
        <AccordionItem value="security" className="border rounded-xl bg-card shadow-sm px-6">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-4 text-left">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-lg text-primary leading-none mb-1">Security & Password</p>
                <p className="text-sm text-muted-foreground font-normal">Change your secure administrative login credentials.</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-8">
            <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPass">Current Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPass"
                    type={showCurrent ? "text" : "password"}
                    className="pl-10 pr-10 h-11"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
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
                    className="pl-10 pr-10 h-11"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
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
                    className="pl-10 pr-10 h-11"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 shadow-sm font-semibold">
                Update Secure Password
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* OTP Verification Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Confirm Mobile Registration
            </DialogTitle>
            <DialogDescription>
              We've triggered a simulated verification code to <span className="font-bold text-foreground">{tempRecoveryPhone}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmOTP} className="space-y-6 pt-4">
            <div className="space-y-2 text-center">
              <Label htmlFor="otpInput" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Enter 6-Digit Code</Label>
              <Input
                id="otpInput"
                placeholder="000000"
                maxLength={6}
                className="text-center text-3xl h-16 font-black tracking-[0.5em] border-primary/20 focus:border-primary"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                required
              />
              
              <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 animate-pulse">
                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" /> 
                  Prototype Simulation Hint
                </p>
                <p className="text-lg font-black text-primary tracking-widest">
                  {sentOTP}
                </p>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isVerifying || otpValue.length !== 6}>
                {isVerifying ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Verify & Register
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
