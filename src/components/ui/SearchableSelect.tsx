import React, { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface SearchableSelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  icon?: ReactNode;
  maxHeight?: string;
  disabled?: boolean;
  footer?: ReactNode;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, value, onChange, onBlur, placeholder = "Select an option...", searchPlaceholder = "Type to search...", error, icon, maxHeight = "max-h-60", disabled = false, footer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery("");
          onBlur?.();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (isOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [isOpen]);

  const filteredOptions = options.filter((opt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return opt.label.toLowerCase().includes(q) || (opt.subLabel && opt.subLabel.toLowerCase().includes(q));
  });

  const handleSelect = (optValue: string) => {
    onChange?.(value === optValue ? "" : optValue);
    setIsOpen(false);
    setSearchQuery("");
    onBlur?.();
  };

  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
      {label && <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase select-none">{label}</label>}
      <div className="relative">
        <button type="button" disabled={disabled} onClick={() => !disabled && setIsOpen(!isOpen)} className={`w-full flex items-center justify-between text-left rounded-xl border text-sm font-medium bg-gray-50/50 px-3.5 py-2.5 transition-all focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${isOpen ? "border-black ring-2 ring-black/5 bg-white shadow-sm" : error ? "border-rose-300 text-rose-900 bg-rose-50/20" : "border-gray-200 text-gray-900 hover:border-gray-300"}`}>
          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
            {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
            {selectedOption ? (
              <div className="truncate">
                <span className="font-semibold text-gray-900">{selectedOption.label}</span>
                {selectedOption.subLabel && <span className="ml-2 text-xs text-gray-500">{selectedOption.subLabel}</span>}
              </div>
            ) : (
              <span className="text-gray-400 font-normal truncate">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {selectedOption && !disabled && (
              <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onChange?.(""); onBlur?.(); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange?.(""); onBlur?.(); } }} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors" title="Clear selection">
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full rounded-2xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="p-2 border-b border-gray-100">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={searchPlaceholder} className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2 text-gray-400 hover:text-gray-600"><X className="h-3 w-3" /></button>}
              </div>
            </div>
            <div className={`overflow-y-auto ${maxHeight} p-1 space-y-0.5`}>
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400 font-medium">No results found</div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button key={opt.value} type="button" onClick={() => handleSelect(opt.value)} className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isSelected ? "bg-gray-900 text-white font-semibold" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}>
                      <div className="truncate pr-2">
                        <p className={isSelected ? "text-white" : "text-gray-900"}>{opt.label}</p>
                        {opt.subLabel && <p className={`text-[10px] ${isSelected ? "text-gray-300" : "text-gray-400"}`}>{opt.subLabel}</p>}
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-white" />}
                    </button>
                  );
                })
              )}
            </div>
            {footer && <div className="border-t border-gray-100 p-2 bg-gray-50/50">{footer}</div>}
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
    </div>
  );
};
