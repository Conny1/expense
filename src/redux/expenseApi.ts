import { createApi } from "@reduxjs/toolkit/query/react";
import type { ExpenseItem, FindAndFilterExpenses, Pagination } from "../types";
import { baseQueryWithReauth } from "./customBaseQuery";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Expenses", "Expense"],
  endpoints: (builder) => ({
    findAndFilterExpenses: builder.query<
      { status: number; data: { results: ExpenseItem[] } & Pagination },
      FindAndFilterExpenses
    >({
      query: (body) => ({
        url: "/admin/expense/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Expenses"],
    }),

    getExpenseById: builder.query<{ status: number; data: ExpenseItem }, string>({
      query: (expenseId) => ({
        url: `/admin/expense/${expenseId}`,
      }),
      providesTags: ["Expense"],
    }),

    createExpense: builder.mutation<{ status: number; data: ExpenseItem }, Partial<ExpenseItem>>({
      query: (body) => ({
        url: "/admin/expense",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Expenses"],
    }),

    updateExpense: builder.mutation<{ status: number; data: ExpenseItem }, Partial<ExpenseItem> & { _id: string }>({
      query: ({ _id, ...body }) => ({
        url: `/admin/expense/${_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Expenses", "Expense"],
    }),

    deleteExpense: builder.mutation<{ status: number; data: { message: string } }, string>({
      query: (expenseId) => ({
        url: `/admin/expense/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses", "Expense"],
    }),

    getExpenseReceiptUrl: builder.query<{ status: number; data: string }, string>({
      query: (expenseId) => ({
        url: `/admin/expense/${expenseId}/receipt`,
      }),
    }),

    uploadExpenseReceipt: builder.mutation<
      { status: number; data: ExpenseItem },
      { expenseId: string; file: File }
    >({
      query: ({ expenseId, file }) => {
        const body = new FormData();
        body.append("receipt", file);
        return {
          url: `/admin/expense/${expenseId}/receipt`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Expenses", "Expense"],
    }),

    deleteExpenseReceipt: builder.mutation<
      { status: number; data: ExpenseItem },
      string
    >({
      query: (expenseId) => ({
        url: `/admin/expense/${expenseId}/receipt`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses", "Expense"],
    }),
  }),
});

export const {
  useFindAndFilterExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useLazyGetExpenseReceiptUrlQuery,
  useUploadExpenseReceiptMutation,
  useDeleteExpenseReceiptMutation,
} = expenseApi;
