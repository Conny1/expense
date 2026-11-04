import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, rightElement, className = "", id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-gray-600 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3.5 pointer-events-none text-gray-400 flex items-center justify-center">{icon}</div>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full rounded-xl border text-sm font-medium bg-gray-50/50 transition-colors placeholder:text-gray-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${icon ? "pl-10" : "px-3.5"} ${rightElement ? "pr-10" : "px-3.5"} py-2.5 ${error ? "border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/20" : "border-gray-200 text-gray-900 focus:border-black focus:ring-2 focus:ring-black/5 hover:border-gray-300"} ${className}`}
            {...props}
          />
          {rightElement && <div className="absolute right-3 flex items-center text-gray-400">{rightElement}</div>}
        </div>
        {error && <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
