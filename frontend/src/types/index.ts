export interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
}

export interface Category {
    _id: string;
    name: string;
    type: "income" | "expense" | "any";
}

export interface Transaction {
    _id?: string;
    user?: string;
    type: "income" | "expense";
    category: string | Category;
    amount: number;
    date: string;
    description?: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TransactionsResponse {
    transactions: Transaction[];
    pagination: Pagination;
}

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    token: string;
}

export interface Budget {
  _id: string;
  user: string;
  category?: string;
  title: string;
  amount: number;
  period: "monthly" | "weekly";
  startDate: string; // or Date if you're parsing it into Date
  endDate: string;   // or Date
  alertSent: boolean;
  totalAmount: number;
  budgetItems?: BudgetItem[]; // optional if not populated
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  _id: string;
  user: string;
  category?: string;
  amount: number;
  itemName: string;
  budgetID: string;
}
