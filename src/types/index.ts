export type ExpenseCategory =
  | "Software and subscriptions"
  | "Travel and transport"
  | "Marketing"
  | "Equipment"
  | "Office and utilities"
  | "Professional services"
  | "Other";

export interface ExpenseItem {
  _id: string;
  workspace_id: string;
  user_id: string | null;
  title: string;
  amount: number;
  expense_date: string;
  category: ExpenseCategory;
  vendor: string;
  notes: string;
  project_id: string | null;
  receipt: {
    storage_key: string;
    name: string;
    size: number;
  } | null;
  is_deleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  project?: { _id: string; name: string };
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  totalAmount?: number;
}

export interface FindAndFilterExpenses {
  sortBy: string;
  limit: number;
  page: number;
  search: string;
  match_values: Record<string, string | number | boolean | null>;
}
