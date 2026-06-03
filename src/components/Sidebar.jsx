import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  LayoutDashboard,
  BookOpen,
  Wallet,
  ShoppingBag,
  ShoppingCart,
  Package,
  Factory,
  Percent,
  BarChart3,
  Users
} from "lucide-react";

export default function Sidebar() {
  const { currentTab, setCurrentTab, allowedTabs, activeUser, resetDemoData } = useContext(AppContext);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "akuntansi", label: "Accounting", icon: BookOpen },
    { id: "kasbank", label: "Cash & Bank", icon: Wallet },
    { id: "penjualan", label: "Sales & AR", icon: ShoppingBag },
    { id: "pembelian", label: "Purchase & AP", icon: ShoppingCart },
    { id: "persediaan", label: "Inventory", icon: Package },
    { id: "produksi", label: "Production", icon: Factory },
    { id: "pajak", label: "Tax", icon: Percent },
    { id: "laporan", label: "Financial Reports", icon: BarChart3 },
    { id: "hakakses", label: "Users & Access", icon: Users },
  ];

  const filteredMenu = menuItems.filter(item => allowedTabs.includes(item.id));

  return (
    <aside className="w-68 flex flex-col min-h-screen border-r border-[#e2e8f0] dark:border-[#222533] bg-white dark:bg-[#131722] text-[#475569] dark:text-[#94a3b8] transition-colors select-none">
      
      {/* Brand Section */}
      <div className="p-6 flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-[15px] font-black text-brand-navy dark:text-white tracking-tight font-heading leading-tight uppercase">
            Pilarindo
          </h2>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide block">
            ENTERPRISE CONSOLE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">Menu</div>
        {filteredMenu.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-semibold tracking-wide text-left transition-all duration-150 group cursor-pointer ${
                isActive
                  ? "bg-brand-blue text-white shadow-lg shadow-blue-500/15 font-bold"
                  : "hover:bg-slate-50 dark:hover:bg-[#1d2230] text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? "text-white" : "text-[#94a3b8] group-hover:text-brand-blue"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Demo Reset Section (FOGO bottom card style) */}
      <div className="p-4 space-y-3">
        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl shadow-lg shadow-blue-500/10 text-center relative overflow-hidden">
          {/* Subtle graphic curves */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
          
          <div className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">PILARINDO ERP</div>
          <p className="text-[11px] font-medium text-white leading-relaxed mt-1 mb-3.5 px-1">
            Simulasi database lokal berjalan aktif
          </p>
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin mereset seluruh data transaksi kembali ke saldo awal?")) {
                resetDemoData();
              }
            }}
            className="w-full py-2 bg-white hover:bg-slate-50 text-brand-blue text-[11px] font-bold rounded-xl shadow-sm transition-all duration-150 cursor-pointer"
          >
            Reset Data Demo
          </button>
        </div>

        {/* User profile capsule */}
        <div className="p-3 bg-slate-50 dark:bg-[#1c212e] rounded-2xl flex items-center gap-2.5 border border-slate-100 dark:border-transparent">
          <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center font-heading text-xs font-bold text-brand-blue shrink-0">
            {activeUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-brand-navy dark:text-white truncate">{activeUser.name}</div>
            <div className="text-[9px] text-slate-400 truncate uppercase tracking-wider">{activeUser.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
