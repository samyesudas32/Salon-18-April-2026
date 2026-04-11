'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Booking, Expense } from './types';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  // Expense state
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  // Auth state
  isLoggedIn: boolean;
  login: (userId: string, pass: string) => boolean;
  logout: () => void;
  updateAdminPassword: (current: string, next: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialBookings: Booking[] = [
  {
    id: '1',
    clientName: 'Acme Corp',
    phoneNumber: '+91 98765 43210',
    workType: 'Software Consulting',
    date: '2024-06-15',
    time: '10:00',
    advanceAmount: 500,
    totalAmount: 2000,
    expenseAmount: 200,
    notes: 'Initial strategy phase.',
    balanceAmount: 1300,
    status: 'upcoming',
  },
];

const initialExpenses: Expense[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        item: 'Office Supplies (e.g., paper, pens)',
        amount: 150.00,
    },
    {
        id: '2',
        date: new Date().toISOString().split('T')[0],
        item: 'Lunch with a client',
        amount: 85.50,
    }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  // Auth state (Admin Login)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('Sam0438');
  const [isHydrated, setIsHydrated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const storedStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
    const storedPass = localStorage.getItem('adminPassword');
    const storedBookings = localStorage.getItem('bookings');
    const storedExpenses = localStorage.getItem('expenses');
    
    if (storedStatus) setIsLoggedIn(true);
    if (storedPass) setAdminPassword(storedPass);

    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      setBookings(initialBookings);
    }
    
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      setExpenses(initialExpenses);
    }
    
    setIsHydrated(true);
  }, []);

  // Persist bookings to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings, isHydrated]);

  // Persist expenses to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, isHydrated]);

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

  const addBooking = (newBooking: Omit<Booking, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setBookings((prev) => [...prev, { ...newBooking, id: id as string }]);
    toast({ title: "Booking Saved", description: "The new appointment has been registered." });
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    toast({ title: "Updated", description: "Booking details have been saved." });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast({ title: "Deleted", description: "Booking removed successfully." });
  };

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setExpenses((prev) => [{ ...newExpense, id }, ...prev]);
    toast({ title: "Expense Added", description: "The new expense has been recorded." });
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    toast({ title: "Expense Updated", description: "The expense details have been saved." });
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Expense Deleted", description: "The expense has been removed." });
  };

  // Auth Protection Logic
  useEffect(() => {
    if (isHydrated) {
      if (!isLoggedIn && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isLoggedIn, pathname, router, isHydrated]);

  if (!isHydrated) return null;

  return (
    <AppContext.Provider value={{ 
      bookings, 
      addBooking, 
      updateBooking, 
      deleteBooking,
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      isLoggedIn,
      login,
      logout,
      updateAdminPassword
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
