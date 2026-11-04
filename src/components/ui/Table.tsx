import React from "react";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className = "", children, ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full text-left border-collapse text-sm ${className}`} {...props}>{children}</table>
  </div>
);

export const Thead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = "", children, ...props }) => (
  <thead className={`border-b border-gray-200 bg-gray-50/75 ${className}`} {...props}>{children}</thead>
);

export const Tbody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = "", children, ...props }) => (
  <tbody className={`divide-y divide-gray-100 ${className}`} {...props}>{children}</tbody>
);

export const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className = "", children, ...props }) => (
  <tr className={`transition-colors hover:bg-gray-50/80 group ${className}`} {...props}>{children}</tr>
);

export const Th: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = "", children, ...props }) => (
  <th className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none whitespace-nowrap ${className}`} {...props}>{children}</th>
);

export const Td: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = "", children, ...props }) => (
  <td className={`px-4 py-3.5 text-xs text-gray-700 align-middle ${className}`} {...props}>{children}</td>
);
