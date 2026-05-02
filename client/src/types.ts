export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  category: string;
  date: string;
};

export type Balance = {
  user: string;
  balance: number;
};

export type Trip = {
  id: string;
  title: string;
  description: string;
  members: string[];
  expenses: Expense[];
  balances: Balance[];
};