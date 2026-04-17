'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Expense, ProductExpense, ServiceRecord } from './types';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export type DashboardSection = 'stats' | 'bookings' | 'completedHistory' | 'serviceSection' | 'expenses' | 'productExpenses' | 'reports' | 'dailyProfit';

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
  deleteServiceRecords: (ids: string[]) => void;
  // Client Management
  deleteClientByName: (name: string) => void;
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
  updateBusinessIdentity: (identity: {
    name?: string;
    shortName?: string;
    description?: string;
    address?: string;
    phone?: string;
    admin?: string;
    recoveryEmail?: string;
  }) => void;
  // Photo Upload
  uploadedPhoto: string | null;
  setUploadedPhoto: (photo: string | null) => void;
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
  adminId: string;
  login: (userId: string, pass: string) => boolean;
  logout: () => void;
  updateAdminCredentials: (creds: { currentPass: string; newId?: string; newPass?: string }) => { success: boolean; message: string };
  // Password Reset
  generatePasswordResetToken: () => string | null;
  verifyPasswordResetToken: (token: string) => boolean;
  resetPasswordWithToken: (token: string, newPass: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('Admin');
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
  const [recoveryEmail, setRecoveryEmail] = useState<string>('admin@example.com');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Password Reset State
  const [passwordResetToken, setPasswordResetToken] = useState<{ token: string; expires: number } | null>(null);

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
      const storedAdminId = localStorage.getItem('adminId');
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
      const storedResetToken = getSafeParsed('passwordResetToken');
      
      const storedBusinessName = localStorage.getItem('businessName');
      const storedBusinessShortName = localStorage.getItem('businessShortName');
      const storedBusinessDesc = localStorage.getItem('businessDescription');
      const storedBusinessAddr = localStorage.getItem('businessAddress');
      const storedBusinessPhone = localStorage.getItem('businessPhone');
      const storedAdminName = localStorage.getItem('adminName');
      const storedRecoveryEmail = localStorage.getItem('recoveryEmail');
      const storedUploadedPhoto = localStorage.getItem('uploadedPhoto');
      
      const storedShowStats = localStorage.getItem('showStats');
      const storedShowBookings = localStorage.getItem('showRecentBookings');
      const storedShowCompletedHistory = localStorage.getItem('showCompletedHistory');
      const storedShowServiceSection = localStorage.getItem('showServiceSection');
      const storedShowExpenses = localStorage.getItem('showExpenses');
      const storedShowProductExpenses = localStorage.getItem('showProductExpenses');
      const storedShowReports = localStorage.getItem('showReports');
      const storedShowDailyProfit = localStorage.getItem('showDailyProfit');
      
      if (storedStatus) setIsLoggedIn(true);
      if (storedAdminId) setAdminId(storedAdminId);
      if (storedPass) setAdminPassword(storedPass);
      if (storedBusinessName) setBusinessName(storedBusinessName);
      if (storedBusinessShortName) setBusinessShortName(storedBusinessShortName);
      if (storedBusinessDesc) setBusinessDescription(storedBusinessDesc);
      if (storedBusinessAddr) setBusinessAddress(storedBusinessAddr);
      if (storedBusinessPhone) setBusinessPhone(storedBusinessPhone);
      if (storedAdminName) setAdminName(storedAdminName);
      if (storedRecoveryEmail) setRecoveryEmail(storedRecoveryEmail);
      if (storedUploadedPhoto) setUploadedPhoto(storedUploadedPhoto);
      if (storedResetToken) setPasswordResetToken(storedResetToken);
      
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
        localStorage.setItem('adminId', adminId);
        localStorage.setItem('adminPassword', adminPassword);
        if (passwordResetToken) {
          localStorage.setItem('passwordResetToken', JSON.stringify(passwordResetToken));
        } else {
          localStorage.removeItem('passwordResetToken');
        }

        if (uploadedPhoto) {
          localStorage.setItem('uploadedPhoto', uploadedPhoto);
        } else {
          localStorage.removeItem('uploadedPhoto');
        }
        
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
  }, [bookings, serviceRecords, expenses, productExpenses, businessName, businessShortName, businessDescription, businessAddress, businessPhone, adminName, recoveryEmail, adminId, adminPassword, uploadedPhoto, passwordResetToken, showStats, showRecentBookings, showCompletedHistory, showServiceSection, showExpenses, showProductExpenses, showReports, showDailyProfit, isHydrated]);

  const login = (userId: string, pass: string) => {
    if (userId === adminId && pass === adminPassword) {
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

  const updateAdminCredentials = (creds: { currentPass: string; newId?: string; newPass?: string }) => {
    if (creds.currentPass !== adminPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    let message = '';
    let idUpdated = false;
    let passUpdated = false;

    if (creds.newId && creds.newId.trim() !== adminId) {
        if (creds.newId.trim().length < 4) {
            return { success: false, message: 'Admin ID must be at least 4 characters.' };
        }
        setAdminId(creds.newId.trim());
        idUpdated = true;
    }

    if (creds.newPass && creds.newPass !== adminPassword) {
        if (creds.newPass.length < 4) {
            return { success: false, message: 'New password must be at least 4 characters.' };
        }
        setAdminPassword(creds.newPass);
        passUpdated = true;
    }
    
    if (idUpdated && passUpdated) {
        message = 'Admin ID and password updated successfully.';
    } else if (idUpdated) {
        message = 'Admin ID updated successfully.';
    } else if (passUpdated) {
        message = 'Password updated successfully.';
    } else {
        return { success: true, message: 'No changes were made.' };
    }

    return { success: true, message: message };
  };

  const updateBusinessIdentity = (identity: {
    name?: string;
    shortName?: string;
    description?: string;
    address?: string;
    phone?: string;
    admin?: string;
    recoveryEmail?: string;
  }) => {
    if (identity.name !== undefined) setBusinessName(identity.name);
    if (identity.shortName !== undefined) setBusinessShortName(identity.shortName);
    if (identity.description !== undefined) setBusinessDescription(identity.description);
    if (identity.address !== undefined) setBusinessAddress(identity.address);
    if (identity.phone !== undefined) setBusinessPhone(identity.phone);
    if (identity.admin !== undefined) setAdminName(identity.admin);
    if (identity.recoveryEmail !== undefined) setRecoveryEmail(identity.recoveryEmail);
    
    toast({ title: "Profile Updated", description: "Business identity and recovery contact saved." });
  };
  
  const generatePasswordResetToken = () => {
    if (!recoveryEmail) {
      toast({ variant: 'destructive', title: 'Setup Required', description: 'Please set a recovery email in Settings first.' });
      return null;
    }
    const token = Math.random().toString(36).substring(2, 18);
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
    setPasswordResetToken({ token, expires });
    return token;
  };

  const verifyPasswordResetToken = (token: string) => {
    if (passwordResetToken && passwordResetToken.token === token && passwordResetToken.expires > Date.now()) {
      return true;
    }
    return false;
  };

  const resetPasswordWithToken = (token: string, newPass: string) => {
    if (verifyPasswordResetToken(token)) {
      if (newPass.length < 4) {
        return false;
      }
      setAdminPassword(newPass);
      setPasswordResetToken(null); // Invalidate token after use
      return true;
    }
    return false;
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
      bookingId: id, // Link for synchronized deletion
    });
    toast({ title: "Booking Saved", description: "Appointment and initial Service Record created." });
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    
    // SYNC: Update linked service record
    setServiceRecords((prev) => prev.map((r) => {
      if (r.bookingId === id) {
        return {
          ...r,
          clientName: updates.clientName ?? r.clientName,
          phoneNumber: updates.phoneNumber ?? r.phoneNumber,
          date: updates.date ?? r.date,
          time: updates.time ?? r.time,
          workType: updates.workType ?? r.workType,
          totalAmount: updates.totalAmount ?? r.totalAmount,
          advanceAmount: updates.advanceAmount ?? r.advanceAmount,
          balanceAmount: updates.balanceAmount ?? r.balanceAmount,
        };
      }
      return r;
    }));
    
    toast({ title: "Updated", description: "Booking details updated." });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    // Synchronized: Delete associated service record
    setServiceRecords((prev) => prev.filter((r) => r.bookingId !== id));
    toast({ title: "Deleted", description: "Booking and linked service record removed." });
  };

  const deleteBookings = (ids: string[]) => {
    setBookings((prev) => prev.filter((b) => !ids.includes(b.id)));
    // Synchronized: Delete associated service records
    setServiceRecords((prev) => prev.filter((r) => !r.bookingId || !ids.includes(r.bookingId)));
    toast({ title: "Bulk Delete Successful", description: `${ids.length} records removed.` });
  };

  const addServiceRecord = (newRecord: Omit<ServiceRecord, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setServiceRecords((prev) => [...prev, { ...newRecord, id }]);
  };

  const updateServiceRecord = (id: string, updates: Partial<ServiceRecord>) => {
    const currentRecord = serviceRecords.find(r => r.id === id);
    setServiceRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    
    // SYNC: Update linked booking if it exists
    if (currentRecord?.bookingId) {
      setBookings((prev) => prev.map((b) => {
        if (b.id === currentRecord.bookingId) {
          return {
            ...b,
            clientName: updates.clientName ?? b.clientName,
            phoneNumber: updates.phoneNumber ?? b.phoneNumber,
            date: updates.date ?? b.date,
            time: updates.time ?? b.time,
            workType: updates.workType ?? b.workType,
            totalAmount: updates.totalAmount ?? b.totalAmount,
            advanceAmount: updates.advanceAmount ?? b.advanceAmount,
            balanceAmount: updates.balanceAmount ?? b.balanceAmount,
          };
        }
        return b;
      }));
    }
    toast({ title: "Service Updated", description: "Service record and linked booking updated." });
  };

  const deleteServiceRecord = (id: string) => {
    const record = serviceRecords.find(r => r.id === id);
    setServiceRecords((prev) => prev.filter((r) => r.id !== id));
    // Synchronized: Delete associated booking if link exists
    if (record?.bookingId) {
      setBookings((prev) => prev.filter((b) => b.id !== record.bookingId));
    }
    toast({ title: "Service Deleted", description: "Service record and linked booking removed." });
  };

  const deleteServiceRecords = (ids: string[]) => {
    const recordsToDelete = serviceRecords.filter(r => ids.includes(r.id));
    const linkedBookingIds = recordsToDelete.map(r => r.bookingId).filter(Boolean) as string[];
    
    setServiceRecords((prev) => prev.filter((r) => !ids.includes(r.id)));
    // Synchronized: Delete associated bookings
    if (linkedBookingIds.length > 0) {
      setBookings((prev) => prev.filter((b) => !linkedBookingIds.includes(b.id)));
    }
    toast({ title: "Bulk Delete Successful", description: `${ids.length} service records removed.` });
  };

  const deleteClientByName = (name: string) => {
    setBookings((prev) => prev.filter(b => b.clientName !== name));
    setServiceRecords((prev) => prev.filter(r => r.clientName !== name));
    toast({ 
      title: "Client Removed", 
      description: `All records for ${name} have been wiped from the system.` 
    });
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
    toast({ title: "Bulk Delete Successful", description: `${ids.length} records removed.` });
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
    toast({ title: "Bulk Delete Successful", description: `${ids.length} records removed.` });
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
      serviceRecords, addServiceRecord, updateServiceRecord, deleteServiceRecord, deleteServiceRecords,
      deleteClientByName,
      expenses, addExpense, updateExpense, deleteExpense, deleteExpenses,
      productExpenses, addProductExpense, updateProductExpense, deleteProductExpense, deleteProductExpenses,
      businessName, businessShortName, businessDescription, businessAddress, businessPhone, adminName, recoveryEmail,
      updateBusinessIdentity,
      uploadedPhoto, setUploadedPhoto,
      showStats, showRecentBookings, showCompletedHistory, showServiceSection, showExpenses, showProductExpenses, showReports, showDailyProfit, toggleDashboardSection,
      isLoggedIn, adminId, login, logout, updateAdminCredentials,
      generatePasswordResetToken, verifyPasswordResetToken, resetPasswordWithToken,
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
