import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navItems = [{ title: "Expenses", url: "/" }];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50/50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
        <div className="flex items-center px-4 h-14 lg:px-6">
          <div className="flex items-center gap-2.5 mr-8">
            <div className="flex items-center justify-center w-8 h-8 text-sm font-black text-white bg-gray-900 rounded-lg select-none shrink-0">
              <ReceiptText className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black leading-tight text-gray-900">Expenses</h2>
              <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">Modulor Workspace</p>
            </div>
          </div>
          <nav className="items-center hidden gap-1 lg:flex">
            {navItems.map((item) => (
              <Link key={item.title} to={item.url} className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-lg ${location.pathname === item.url ? "bg-gray-900/5 text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-300 hover:text-gray-900"}`}>
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
          <div className="flex-1" />
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        {mobileOpen && (
          <nav className="z-50 px-4 py-2 space-y-1 bg-white border-t border-gray-200 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.title} to={item.url} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${location.pathname === item.url ? "bg-gray-900/5 text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1 w-full p-4 mx-auto overflow-auto sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
