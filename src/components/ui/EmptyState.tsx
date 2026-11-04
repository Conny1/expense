import React from "react";
import { FolderX } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-gray-200 bg-white ${className}`}>
      <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
        {icon || <FolderX className="h-6 w-6 stroke-[1.5]" />}
      </div>
      <h3 className="font-bold text-sm text-gray-900 tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-gray-500 max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
