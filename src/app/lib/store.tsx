
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Expense, ProductExpense, ServiceRecord } from './types';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AppContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
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
  // Product Expense state
  productExpenses: ProductExpense[];
  addProductExpense: (expense: Omit<ProductExpense, 'id'>) => void;
  updateProductExpense: (id: string, expense: Partial<ProductExpense>) => void;
  deleteProductExpense: (id: string) => void;
  // Business Identity
  businessName: string;
  businessShortName: string;
  adminName: string;
  updateBusinessIdentity: (name: string, shortName: string, adminName: string) => void;
  // Auth state
  isLoggedIn: boolean;
  login: (userId: string, pass: string) => boolean;
  logout: () => void;
  updateAdminPassword: (current: string, next: string) => { success: boolean; message: string };
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
  const [adminName, setAdminName] = useState<string>('Soumya Yesudas');

  useEffect(() => {
    try {
      const storedStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
      const storedPass = localStorage.getItem('adminPassword');
      const storedBookings = localStorage.getItem('bookings');
      const storedServiceRecords = localStorage.getItem('serviceRecords');
      const storedExpenses = localStorage.getItem('expenses');
      const storedProductExpenses = localStorage.getItem('productExpenses');
      const storedBusinessName = localStorage.getItem('businessName');
      const storedBusinessShortName = localStorage.getItem('businessShortName');
      const storedAdminName = localStorage.getItem('adminName');
      
      if (storedStatus) setIsLoggedIn(true);
      if (storedPass) setAdminPassword(storedPass);
      if (storedBusinessName) setBusinessName(storedBusinessName);
      if (storedBusinessShortName) setBusinessShortName(storedBusinessShortName);
      if (storedAdminName) setAdminName(storedAdminName);

      if (storedBookings) setBookings(JSON.parse(storedBookings));
      if (storedServiceRecords) setServiceRecords(JSON.parse(storedServiceRecords));
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      if (storedProductExpenses) setProductExpenses(JSON.parse(storedProductExpenses));
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
        localStorage.setItem('adminName', adminName);
      } catch (e) {
        console.error("Failed to save state to localStorage", e);
      }
    }
  }, [bookings, serviceRecords, expenses, productExpenses, businessName, businessShortName, adminName, isHydrated]);

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

  const updateBusinessIdentity = (name: string, shortName: string, admin: string) => {
    setBusinessName(name);
    setBusinessShortName(shortName);
    setAdminName(admin);
    toast({ title: "Identity Updated", description: "Business branding and administrator details have been saved." });
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

  useEffect(() => {
    if (isHydrated && !isLoggedIn && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoggedIn, pathname, router, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg animate-bounce">{businessShortName}</div>
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
      bookings, addBooking, updateBooking, deleteBooking,
      serviceRecords, addServiceRecord, updateServiceRecord, deleteServiceRecord,
      expenses, addExpense, updateExpense, deleteExpense,
      productExpenses, addProductExpense, updateProductExpense, deleteProductExpense,
      businessName, businessShortName, adminName, updateBusinessIdentity,
      isLoggedIn, login, logout, updateAdminPassword
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
