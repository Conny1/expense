export const EXPENSE_CATEGORIES = [
  "Software and subscriptions",
  "Travel and transport",
  "Marketing",
  "Equipment",
  "Office and utilities",
  "Professional services",
  "Other",
] as const;

export const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 2,
});
