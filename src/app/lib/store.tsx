'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Expense, ProductExpense, ServiceRecord } from './types';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export type DashboardSection = 'stats' | 'bookings' | 'completedHistory' | 'serviceSection' | 'expenses' | 'productExpenses' | 'reports' | 'dailyProfit';

interface ResetToken {
  token: string;
  expiry: number;
}

interface AppContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  deleteBookings: (ids: string[]) => void;
  // Service Record state
  serviceRecords: ServiceRecord[];
  addServiceRecord: (record: Omit<ServiceRecord, 'id'>) => void;
  updateServiceRecord: (id: string, record: Partial<ServiceRecord>) => void;
  deleteServiceRecord: (id: string) => void;
  // Expense state
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  deleteExpenses: (ids: string[]) => void;
  // Product Expense state
  productExpenses: ProductExpense[];
  addProductExpense: (expense: Omit<ProductExpense, 'id'>) => void;
  updateProductExpense: (id: string, expense: Partial<ProductExpense>) => void;
  deleteProductExpense: (id: string) => void;
  deleteProductExpenses: (ids: string[]) => void;
  // Business Identity
  businessName: string;
  businessShortName: string;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  adminName: string;
  recoveryEmail: string;
  recoveryPhone: string;
  isPhoneVerified: boolean;
  updateBusinessIdentity: (identity: {
    name?: string;
    shortName?: string;
    description?: string;
    address?: string;
    phone?: string;
    admin?: string;
    recoveryEmail?: string;
    recoveryPhone?: string;
    isPhoneVerified?: boolean;
  }) => void;
  // Dashboard Config
  showStats: boolean;
  showRecentBookings: boolean;
  showCompletedHistory: boolean;
  showServiceSection: boolean;
  showExpenses: boolean;
  showProductExpenses: boolean;
  showReports: boolean;
  showDailyProfit: boolean;
  toggleDashboardSection: (section: DashboardSection) => void;
  // Auth state
  isLoggedIn: boolean;
  login: (userId: string, pass: string) => boolean;
  logout: () => void;
  updateAdminPassword: (current: string, next: string) => { success: boolean; message: string };
  // Recovery Methods
  initiatePasswordReset: (email: string) => { success: boolean; token?: string; message: string };
  resetPasswordWithToken: (token: string, newPass: string) => { success: boolean; message: string };
  recoverUserId: (emailOrPhone: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('Sam0438');
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [productExpenses, setProductExpenses] = useState<ProductExpense[]>([]);

  // Business Identity State
  const [businessName, setBusinessName] = useState<string>('Salon of Guzellik');
  const [businessShortName, setBusinessShortName] = useState<string>('G');
  const [businessDescription, setBusinessDescription] = useState<string>('Professional Beauty Care & Salon');
  const [businessAddress, setBusinessAddress] = useState<string>('West of Iron Bridge, CCSB Rd, Alappuzha, Kerala');
  const [businessPhone, setBusinessPhone] = useState<string>('7025 80 1010, 755 88 74175');
  const [adminName, setAdminName] = useState<string>('Soumya Yesudas');
  const [recoveryEmail, setRecoveryEmail] = useState<string>('soumya@example.com');
  const [recoveryPhone, setRecoveryPhone] = useState<string>('7025801010');
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);

  // Recovery Simulation State (Simulating DB store for tokens)
  const [activeResetToken, setActiveResetToken] = useState<ResetToken | null>(null);

  // Dashboard Visibility State
  const [showStats, setShowStats] = useState<boolean>(true);
  const [showRecentBookings, setShowRecentBookings] = useState<boolean>(true);
  const [showCompletedHistory, setShowCompletedHistory] = useState<boolean>(false);
  const [showServiceSection, setShowServiceSection] = useState<boolean>(false);
  const [showExpenses, setShowExpenses] = useState<boolean>(false);
  const [showProductExpenses, setShowProductExpenses] = useState<boolean>(false);
  const [showReports, setShowReports] = useState<boolean>(false);
  const [showDailyProfit, setShowDailyProfit] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
      const storedPass = localStorage.getItem('adminPassword');
      
      const getSafeParsed = (key: string) => {
        try {
          const item = localStorage.getItem(key);
          if (!item || item === 'undefined' || item === 'null' || item.trim() === '') return null;
          const trimmed = item.trim();
          if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
          return JSON.parse(item);
        } catch (e) {
          console.warn(`SafeParse: Failed to parse key "${key}"`, e);
          return null;
        }
      };

      const storedBookings = getSafeParsed('bookings');
      const storedServiceRecords = getSafeParsed('serviceRecords');
      const storedExpenses = getSafeParsed('expenses');
      const storedProductExpenses = getSafeParsed('productExpenses');
      
      const storedBusinessName = localStorage.getItem('businessName');
      const storedBusinessShortName = localStorage.getItem('businessShortName');
      const storedBusinessDesc = localStorage.getItem('businessDescription');
      const storedBusinessAddr = localStorage.getItem('businessAddress');
      const storedBusinessPhone = localStorage.getItem('businessPhone');
      const storedAdminName = localStorage.getItem('adminName');
      const storedRecoveryEmail = localStorage.getItem('recoveryEmail');
      const storedRecoveryPhone = localStorage.getItem('recoveryPhone');
      const storedIsPhoneVerified = localStorage.getItem('isPhoneVerified');
      
      const storedShowStats = localStorage.getItem('showStats');
      const storedShowBookings = localStorage.getItem('showRecentBookings');
      const storedShowCompletedHistory = localStorage.getItem('showCompletedHistory');
      const storedShowServiceSection = localStorage.getItem('showServiceSection');
      const storedShowExpenses = localStorage.getItem('showExpenses');
      const storedShowProductExpenses = localStorage.getItem('showProductExpenses');
      const storedShowReports = localStorage.getItem('showReports');
      const storedShowDailyProfit = localStorage.getItem('showDailyProfit');
      
      if (storedStatus) setIsLoggedIn(true);
      if (storedPass) setAdminPassword(storedPass);
      if (storedBusinessName) setBusinessName(storedBusinessName);
      if (storedBusinessShortName) setBusinessShortName(storedBusinessShortName);
      if (storedBusinessDesc) setBusinessDescription(storedBusinessDesc);
      if (storedBusinessAddr) setBusinessAddress(storedBusinessAddr);
      if (storedBusinessPhone) setBusinessPhone(storedBusinessPhone);
      if (storedAdminName) setAdminName(storedAdminName);
      if (storedRecoveryEmail) setRecoveryEmail(storedRecoveryEmail);
      if (storedRecoveryPhone) setRecoveryPhone(storedRecoveryPhone);
      if (storedIsPhoneVerified !== null) setIsPhoneVerified(storedIsPhoneVerified === 'true');
      
      if (storedShowStats !== null) setShowStats(storedShowStats === 'true');
      if (storedShowBookings !== null) setShowRecentBookings(storedShowBookings === 'true');
      if (storedShowCompletedHistory !== null) setShowCompletedHistory(storedShowCompletedHistory === 'true');
      if (storedShowServiceSection !== null) setShowServiceSection(storedShowServiceSection === 'true');
      if (storedShowExpenses !== null) setShowExpenses(storedShowExpenses === 'true');
      if (storedShowProductExpenses !== null) setShowProductExpenses(storedShowProductExpenses === 'true');
      if (storedShowReports !== null) setShowReports(storedShowReports === 'true');
      if (storedShowDailyProfit !== null) setShowDailyProfit(storedShowDailyProfit === 'true');

      if (Array.isArray(storedBookings)) setBookings(storedBookings);
      if (Array.isArray(storedServiceRecords)) setServiceRecords(storedServiceRecords);
      if (Array.isArray(storedExpenses)) setExpenses(storedExpenses);
      if (Array.isArray(storedProductExpenses)) setProductExpenses(storedProductExpenses);
    } catch (e) {
      console.warn("Could not restore state from local storage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('bookings', JSON.stringify(bookings));
        localStorage.setItem('serviceRecords', JSON.stringify(serviceRecords));
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('productExpenses', JSON.stringify(productExpenses));
        localStorage.setItem('businessName', businessName);
        localStorage.setItem('businessShortName', businessShortName);
        localStorage.setItem('businessDescription', businessDescription);
        localStorage.setItem('businessAddress', businessAddress);
        localStorage.setItem('businessPhone', businessPhone);
        localStorage.setItem('adminName', adminName);
        localStorage.setItem('recoveryEmail', recoveryEmail);
        localStorage.setItem('recoveryPhone', recoveryPhone);
        localStorage.setItem('isPhoneVerified', String(isPhoneVerified));
        localStorage.setItem('adminPassword', adminPassword);
        
        localStorage.setItem('showStats', String(showStats));
        localStorage.setItem('showRecentBookings', String(showRecentBookings));
        localStorage.setItem('showCompletedHistory', String(showCompletedHistory));
        localStorage.setItem('showServiceSection', String(showServiceSection));
        localStorage.setItem('showExpenses', String(showExpenses));
        localStorage.setItem('showProductExpenses', String(showProductExpenses));
        localStorage.setItem('showReports', String(showReports));
        localStorage.setItem('showDailyProfit', String(showDailyProfit));
      } catch (e) {
        console.error("Failed to save state to localStorage", e);
      }
    }
  }, [bookings, serviceRecords, expenses, productExpenses, businessName, businessShortName, businessDescription, businessAddress, businessPhone, adminName, recoveryEmail, recoveryPhone, isPhoneVerified, adminPassword, showStats, showRecentBookings, showCompletedHistory, showServiceSection, showExpenses, showProductExpenses, showReports, showDailyProfit, isHydrated]);

  const login = (userId: string, pass: string) => {
    if (userId === 'Admin' && pass === adminPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/login');
  };

  const updateAdminPassword = (current: string, next: string) => {
    if (current !== adminPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    setAdminPassword(next);
    localStorage.setItem('adminPassword', next);
    return { success: true, message: 'Password updated successfully!' };
  };

  const initiatePasswordReset = (email: string) => {
    if (email.toLowerCase() !== recoveryEmail.toLowerCase()) {
      return { success: false, message: 'This email is not registered for recovery.' };
    }
    // Generate secure token (simulated)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiry = Date.now() + (15 * 60 * 1000); // 15 Minutes expiry
    
    setActiveResetToken({ token, expiry });
    
    // In a real app, you would send an email here.
    console.log(`[SIMULATION] Recovery Email Sent to ${email} with Link: http://localhost:9002/reset-password?token=${token}`);
    
    return { 
      success: true, 
      token, // We return token for the simulation/demo purpose
      message: 'A secure reset link has been sent to your email.' 
    };
  };

  const resetPasswordWithToken = (token: string, newPass: string) => {
    if (!activeResetToken || activeResetToken.token !== token) {
      return { success: false, message: 'Invalid or missing reset token.' };
    }
    if (Date.now() > activeResetToken.expiry) {
      setActiveResetToken(null);
      return { success: false, message: 'Reset token has expired (15 min limit).' };
    }

    setAdminPassword(newPass);
    localStorage.setItem('adminPassword', newPass);
    setActiveResetToken(null); // Invalidate token after use
    
    return { success: true, message: 'Password has been reset successfully. You can now log in.' };
  };

  const recoverUserId = (emailOrPhone: string) => {
    const val = emailOrPhone.toLowerCase().trim();
    if (val === recoveryEmail.toLowerCase() || val === recoveryPhone) {
      // In a real app, send ID to email/SMS
      return { success: true, message: 'Your Admin ID has been sent to your registered contact.' };
    }
    return { success: false, message: 'Contact information not found in our records.' };
  };

  const updateBusinessIdentity = (identity: {
    name?: string;
    shortName?: string;
    description?: string;
    address?: string;
    phone?: string;
    admin?: string;
    recoveryEmail?: string;
    recoveryPhone?: string;
    isPhoneVerified?: boolean;
  }) => {
    if (identity.name !== undefined) setBusinessName(identity.name);
    if (identity.shortName !== undefined) setBusinessShortName(identity.shortName);
    if (identity.description !== undefined) setBusinessDescription(identity.description);
    if (identity.address !== undefined) setBusinessAddress(identity.address);
    if (identity.phone !== undefined) setBusinessPhone(identity.phone);
    if (identity.admin !== undefined) setAdminName(identity.admin);
    if (identity.recoveryEmail !== undefined) setRecoveryEmail(identity.recoveryEmail);
    if (identity.recoveryPhone !== undefined) setRecoveryPhone(identity.recoveryPhone);
    if (identity.isPhoneVerified !== undefined) setIsPhoneVerified(identity.isPhoneVerified);
    
    toast({ title: "Profile Updated", description: "Identity and recovery settings saved." });
  };

  const toggleDashboardSection = (section: DashboardSection) => {
    let newState = false;
    switch(section) {
      case 'stats': setShowStats(!showStats); newState = !showStats; break;
      case 'bookings': setShowRecentBookings(!showRecentBookings); newState = !showRecentBookings; break;
      case 'completedHistory': setShowCompletedHistory(!showCompletedHistory); newState = !showCompletedHistory; break;
      case 'serviceSection': setShowServiceSection(!showServiceSection); newState = !showServiceSection; break;
      case 'expenses': setShowExpenses(!showExpenses); newState = !showExpenses; break;
      case 'productExpenses': setShowProductExpenses(!showProductExpenses); newState = !showProductExpenses; break;
      case 'reports': setShowReports(!showReports); newState = !showReports; break;
      case 'dailyProfit': setShowDailyProfit(!showDailyProfit); newState = !showDailyProfit; break;
    }
    
    const sectionName = section.replace(/([A-Z])/g, ' $1').toLowerCase();
    toast({ 
      title: "Dashboard Updated", 
      description: `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section ${newState ? 'added' : 'removed'}.` 
    });
  };

  const addBooking = (newBooking: Omit<Booking, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const booking = { ...newBooking, id };
    setBookings((prev) => [...prev, booking]);
    
    addServiceRecord({
      clientName: booking.clientName,
      phoneNumber: booking.phoneNumber,
      date: booking.date,
      time: booking.time,
      workType: booking.workType,
      duration: '',
      staffName: '',
      totalAmount: booking.totalAmount,
      advanceAmount: booking.advanceAmount,
      balanceAmount: booking.balanceAmount,
    });
    
    toast({ title: "Booking Saved", description: "Appointment and initial Service Record created." });
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    toast({ title: "Updated", description: "Booking details updated." });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast({ title: "Deleted", description: "Booking removed." });
  };

  const deleteBookings = (ids: string[]) => {
    setBookings((prev) => prev.filter((b) => !ids.includes(b.id)));
    toast({ 
      title: "Bulk Delete Successful", 
      description: `${ids.length} booking records have been permanently removed.` 
    });
  };

  const addServiceRecord = (newRecord: Omit<ServiceRecord, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setServiceRecords((prev) => [...prev, { ...newRecord, id }]);
  };

  const updateServiceRecord = (id: string, updates: Partial<ServiceRecord>) => {
    setServiceRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    toast({ title: "Service Updated", description: "Service record updated." });
  };

  const deleteServiceRecord = (id: string) => {
    setServiceRecords((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Service Deleted", description: "Service record removed." });
  };

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setExpenses((prev) => [{ ...newExpense, id }, ...prev]);
    toast({ title: "Expense Added", description: "The new expense has been recorded." });
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    toast({ title: "Expense Updated", description: "The expense details have been saved." });
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Expense Deleted", description: "The expense has been removed." });
  };

  const deleteExpenses = (ids: string[]) => {
    setExpenses((prev) => prev.filter((e) => !ids.includes(e.id)));
    toast({ 
      title: "Bulk Delete Successful", 
      description: `${ids.length} expense records have been permanently removed.` 
    });
  };

  const addProductExpense = (newExpense: Omit<ProductExpense, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setProductExpenses((prev) => [{ ...newExpense, id }, ...prev]);
    toast({ title: "Product Expense Added", description: "The new product expense has been recorded." });
  };

  const updateProductExpense = (id: string, updates: Partial<ProductExpense>) => {
    setProductExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    toast({ title: "Product Expense Updated", description: "The product expense details have been saved." });
  };

  const deleteProductExpense = (id: string) => {
    setProductExpenses((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Product Expense Deleted", description: "The product expense has been removed." });
  };

  const deleteProductExpenses = (ids: string[]) => {
    setProductExpenses((prev) => prev.filter((e) => !ids.includes(e.id)));
    toast({ 
      title: "Bulk Delete Successful", 
      description: `${ids.length} product purchase records have been permanently removed.` 
    });
  };

  useEffect(() => {
    if (isHydrated && !isLoggedIn && pathname !== '/login' && pathname !== '/reset-password') {
      router.push('/login');
    }
  }, [isLoggedIn, pathname, router, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg animate-bounce">
            {businessShortName}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm font-medium">Initializing {businessName}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ 
      bookings, addBooking, updateBooking, deleteBooking, deleteBookings,
      serviceRecords, addServiceRecord, updateServiceRecord, deleteServiceRecord,
      expenses, addExpense, updateExpense, deleteExpense, deleteExpenses,
      productExpenses, addProductExpense, updateProductExpense, deleteProductExpense, deleteProductExpenses,
      businessName, businessShortName, businessDescription, businessAddress, businessPhone, adminName, 
      recoveryEmail, recoveryPhone, isPhoneVerified, updateBusinessIdentity,
      showStats, showRecentBookings, showCompletedHistory, showServiceSection, showExpenses, showProductExpenses, showReports, showDailyProfit, toggleDashboardSection,
      isLoggedIn, login, logout, updateAdminPassword,
      initiatePasswordReset, resetPasswordWithToken, recoverUserId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
