export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  categoryColor: string;
  expenseDate: string;
  notes?: string | null;
  paidBy: User;
  splits: ExpenseSplit[];
};

export type Balance = {
  user: User;
  balance: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type TripMember = {
  id: string;
  role: string;
  joinedAt: string;
  user: User;
};

export type ExpenseSplit = {
  id: string;
  amount: number;
  user: User;
};

export type Payment = {
  id: string;
  amount: number;
  note?: string | null;
  paidAt: string;
  from: User;
  to: User;
};

export type Settlement = {
  from: User;
  to: User;
  amount: number;
};

export type CategoryTotal = {
  name: string;
  color: string;
  total: number;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Trip = {
  id: string;
  title: string;
  description?: string | null;
  destination?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  members: TripMember[];
  expenses: Expense[];
  payments: Payment[];
  balances: Balance[];
  settlements: Settlement[];
  categoryTotals: CategoryTotal[];
  totalSpent: number;
};