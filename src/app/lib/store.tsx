'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Booking } from './types';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  // Auth state
  isLoggedIn: boolean;
  login: (userId: string, pass: string) => boolean;
  logout: () => void;
  updateAdminPassword: (current: string, next: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialData: Booking[] = [
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  // Auth state (Admin Login)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('Sam0438');
  const [isHydrated, setIsHydrated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(initialData);

  useEffect(() => {
    const storedStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
    const storedPass = localStorage.getItem('adminPassword');
    const storedBookings = localStorage.getItem('bookings');
    
    if (storedStatus) setIsLoggedIn(true);
    if (storedPass) setAdminPassword(storedPass);
    if (storedBookings) setBookings(JSON.parse(storedBookings));
    
    setIsHydrated(true);
  }, []);

  // Persist bookings to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings, isHydrated]);

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
