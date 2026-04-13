
export interface Booking {
  id: string;
  clientName: string;
  phoneNumber: string;
  workType: string;
  date: string;
  time: string;
  advanceAmount: number;
  totalAmount: number;
  expenseAmount: number;
  notes: string;
  balanceAmount: number; // Calculated: total - advance - expense
  status: 'pending' | 'completed' | 'upcoming';
}

export interface ServiceRecord {
  id: string;
  clientName: string;
  phoneNumber: string;
  date: string;
  time: string;
  workType: string;
  duration: string;
  staffName: string;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
}

export interface FinancialReport {
  period: string;
  totalBookings: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export interface Expense {
  id: string;
  date: string;
  item: string;
  amount: number;
}

export interface ProductExpense {
  id: string;
  date: string;
  productDetails: string;
  amount: number;
}
