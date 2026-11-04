import React, { useMemo, useState } from "react";
import { DollarSign, Download, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { EXPENSE_CATEGORIES, currencyFormatter } from "@/constants";
import {
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useDeleteExpenseReceiptMutation,
  useFindAndFilterExpensesQuery,
  useLazyGetExpenseReceiptUrlQuery,
  useUpdateExpenseMutation,
  useUploadExpenseReceiptMutation,
} from "@/redux/expenseApi";

const emptyForm = {
  title: "",
  amount: "",
  expense_date: new Date().toISOString().slice(0, 10),
  category: "",
  vendor: "",
  notes: "",
  project_id: "",
  receipt: null as File | null,
};

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [project, setProject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const [uploadReceipt] = useUploadExpenseReceiptMutation();
  const [deleteReceipt] = useDeleteExpenseReceiptMutation();
  const [triggerReceiptUrl] = useLazyGetExpenseReceiptUrlQuery();

  const filters = useMemo(
    () => ({
      sortBy: "expense_date:-1",
      limit: 10,
      page,
      search: search.trim(),
      match_values: {
        ...(category ? { category } : {}),
        ...(project ? { project_id: project } : {}),
        ...(startDate ? { start_date: startDate } : {}),
        ...(endDate ? { end_date: endDate } : {}),
      },
    }),
    [category, endDate, page, project, search, startDate],
  );

  const { data, isLoading, isError, refetch } = useFindAndFilterExpensesQuery(filters);
  const expenses = data?.data.results ?? [];
  const totals = data?.data.totalAmount ?? 0;
  const totalPages = data?.data.totalPages ?? 0;

  const handleOpenCreate = () => {
    setEditingExpenseId(null);
    setForm({ ...emptyForm, expense_date: new Date().toISOString().slice(0, 10) });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: any) => {
    setEditingExpenseId(expense._id);
    setForm({
      title: expense.title ?? "",
      amount: String(expense.amount ?? ""),
      expense_date: expense.expense_date
        ? new Date(expense.expense_date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      category: expense.category ?? "",
      vendor: expense.vendor ?? "",
      notes: expense.notes ?? "",
      project_id: expense.project_id ?? "",
      receipt: null,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.amount || Number(form.amount) <= 0) errors.amount = "Amount must be greater than zero.";
    if (!form.expense_date) errors.expense_date = "Expense date is required.";
    if (!form.category) errors.category = "Category is required.";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        expense_date: form.expense_date,
        category: form.category,
        vendor: form.vendor.trim(),
        notes: form.notes.trim(),
        project_id: form.project_id || null,
      };

      if (editingExpenseId) {
        const result = await updateExpense({ _id: editingExpenseId, ...payload }).unwrap();
        if (form.receipt) {
          await uploadReceipt({
            expenseId: result.data._id,
            file: form.receipt,
          }).unwrap();
        }
      } else {
        const result = await createExpense(payload).unwrap();
        if (form.receipt) {
          await uploadReceipt({
            expenseId: result.data._id,
            file: form.receipt,
          }).unwrap();
        }
      }

      setIsModalOpen(false);
      setForm({ ...emptyForm, expense_date: new Date().toISOString().slice(0, 10) });
      setFormErrors({});
      refetch();
    } catch (error) {
      console.error("Expense save failed", error);
      setFormErrors({ submit: "Could not save this expense. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;

    try {
      await deleteExpense(expenseId).unwrap();
      refetch();
    } catch (error) {
      console.error("Expense delete failed", error);
    }
  };

  const handleDownloadReceipt = async (expenseId: string) => {
    try {
      const result = await triggerReceiptUrl(expenseId).unwrap();
      window.open(result.data, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Receipt download failed", error);
    }
  };

  const handleDeleteReceipt = async (expenseId: string) => {
    const confirmed = window.confirm("Remove this receipt?");
    if (!confirmed) return;

    try {
      await deleteReceipt(expenseId).unwrap();
      refetch();
    } catch (error) {
      console.error("Receipt delete failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        Expenses could not be loaded. Check your connection and try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Expenses</h1>
          <p className="text-xs text-gray-500">Track business spending and link it to projects.</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add expense
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search title or vendor"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="w-full lg:w-52">
            <SearchableSelect
              label="Category"
              value={category}
              options={EXPENSE_CATEGORIES.map((item) => ({ value: item, label: item }))}
              onChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
              placeholder="All categories"
            />
          </div>
          <div className="w-full lg:w-52">
            <Input
              type="date"
              label="From"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full lg:w-52">
            <Input
              type="date"
              label="To"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>Filtered total</span>
          </div>
          <strong className="text-base font-black text-gray-900">
            {currencyFormatter.format(totals)}
          </strong>
        </div>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="Add your first expense to start tracking business spending."
          action={<Button onClick={handleOpenCreate}>Add expense</Button>}
        />
      ) : (
        <>
          <div className="hidden md:block rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <Table>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Vendor</Th>
                  <Th>Date</Th>
                  <Th className="text-right">Amount</Th>
                  <Th className="text-right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {expenses.map((expense: any) => (
                  <Tr key={expense._id}>
                    <Td className="font-semibold text-gray-900">{expense.title}</Td>
                    <Td>{expense.category}</Td>
                    <Td>{expense.vendor || "—"}</Td>
                    <Td>
                      {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : "—"}
                    </Td>
                    <Td className="text-right font-semibold text-gray-900">
                      {currencyFormatter.format(expense.amount)}
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {expense.receipt?.storage_key && (
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(expense._id)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-100"
                            title="Download receipt"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(expense)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-100"
                          title="Edit"
                        >
                          <PencilLine className="h-4 w-4" />
                        </button>
                        {expense.receipt?.storage_key && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReceipt(expense._id)}
                            className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                            title="Delete receipt"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {expenses.map((expense: any) => (
              <div key={expense._id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-gray-900">{expense.title}</div>
                    <div className="text-xs text-gray-500">{expense.category}</div>
                  </div>
                  <div className="text-right font-black text-gray-900">
                    {currencyFormatter.format(expense.amount)}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{expense.vendor || "No vendor"}</span>
                  <span>
                    {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  {expense.receipt?.storage_key && (
                    <button
                      type="button"
                      onClick={() => handleDownloadReceipt(expense._id)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Receipt
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(expense)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExpense(expense._id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-xs font-medium text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpenseId ? "Edit expense" : "Add expense"}
        description="Track a business expense and optional project link."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              error={formErrors.title}
              placeholder="Office lease"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                error={formErrors.amount}
                placeholder="0.00"
              />
              <Input
                label="Date"
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm((prev) => ({ ...prev, expense_date: e.target.value }))}
                error={formErrors.expense_date}
              />
            </div>
            <SearchableSelect
              label="Category"
              value={form.category}
              options={EXPENSE_CATEGORIES.map((item) => ({ value: item, label: item }))}
              onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              placeholder="Select category"
              error={formErrors.category}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Vendor"
                value={form.vendor}
                onChange={(e) => setForm((prev) => ({ ...prev, vendor: e.target.value }))}
                placeholder="Acme Inc"
              />
              <Input
                label="Project"
                value={form.project_id}
                onChange={(e) => setForm((prev) => ({ ...prev, project_id: e.target.value }))}
                placeholder="Optional project ID"
              />
            </div>
            <Input
              label="Notes"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Brief description"
            />
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3">
              <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase select-none">
                Receipt
              </label>
              <input
                type="file"
                className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    receipt: e.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>
            {formErrors.submit && (
              <p className="text-xs font-medium text-rose-600">{formErrors.submit}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={saving} disabled={saving}>
              {editingExpenseId ? "Save changes" : "Create expense"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
