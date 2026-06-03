import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Sun, Moon, Bell, ChevronDown, CheckCircle, AlertTriangle, Search } from "lucide-react";

export default function Header() {
  const {
    activeUser,
    changeRole,
    currentTab,
    theme,
    toggleTheme,
    items,
    users
  } = useContext(AppContext);

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles = {
    dashboard: "Overview Dashboard",
    akuntansi: "Accounting & Ledger",
    kasbank: "Cash & Bank Balance",
    penjualan: "Sales Invoices",
    pembelian: "Purchases & Accounts Payable",
    persediaan: "Inventory Management",
    produksi: "Production Workflow",
    pajak: "Tax Center",
    laporan: "Financial Reports",
    hakakses: "Security & Access Control"
  };

  const lowStockItems = items.filter(item => item.stock <= item.minStock);
  const notifications = lowStockItems.map(item => ({
    id: `notif-${item.id}`,
    type: "warning",
    message: `Stok ${item.name} menipis! Sisa ${item.stock} ${item.unit} (Min: ${item.minStock})`
  }));

  if (notifications.length === 0) {
    notifications.push({
      id: "notif-ok",
      type: "info",
      message: "Sistem berjalan normal. Tingkat stok aman."
    });
  }

  const getIndonesianDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('id-ID', options);
  };

  return (
    <header className="h-18 border-b border-[#e2e8f0] dark:border-[#222533] bg-white dark:bg-[#131722] px-6 flex items-center justify-between relative z-40 transition-colors">
      
      {/* Title */}
      <div>
        <h1 className="text-lg font-extrabold text-brand-navy dark:text-white tracking-tight font-heading m-0 p-0 leading-none">
          {tabTitles[currentTab] || "Sistem ERP"}
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 font-medium">
          {getIndonesianDate()}
        </p>
      </div>

      {/* Center Search Pill (FOGO style) */}
      <div className="hidden md:flex items-center relative w-72">
        <span className="absolute left-4 text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search here..."
          className="w-full bg-[#f8fafc] dark:bg-[#0b0f19] border border-slate-100 dark:border-[#222533] rounded-full pl-11 pr-4 py-2 text-xs text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue"
        />
      </div>

      {/* Action Bars */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-slate-50 dark:hover:bg-[#1c212e] text-slate-400 hover:text-[#0f172a] dark:hover:text-white transition-all cursor-pointer"
          title="Toggle Light/Dark Mode"
        >
          {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-blue-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
            }}
            className="p-2.5 rounded-full hover:bg-slate-50 dark:hover:bg-[#1c212e] text-slate-400 hover:text-[#0f172a] dark:hover:text-white transition-all relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 dark:border-[#222533] bg-white dark:bg-[#131722] p-4 shadow-xl animate-fade-in text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Notifikasi Gudang
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl flex items-start gap-2.5 text-xs ${
                      notif.type === "warning"
                        ? "bg-red-50 dark:bg-red-500/5 text-red-700 dark:text-red-300"
                        : "bg-slate-50 dark:bg-[#0b0f19] text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {notif.type === "warning" ? (
                      <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                    ) : (
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    )}
                    <span>{notif.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-[#222533] mx-1" />

        {/* User profile dropdown - FOGO style */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center font-heading text-xs font-bold text-brand-blue shrink-0">
              {activeUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-brand-navy dark:text-white leading-tight group-hover:text-brand-blue transition-colors">
                {activeUser.name}
              </div>
              <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{activeUser.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 dark:border-[#222533] bg-white dark:bg-[#131722] p-1.5 shadow-xl animate-fade-in text-left">
              <div className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 dark:border-[#222533] mb-1">
                Ganti Akun Demo
              </div>
              <div className="space-y-0.5">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      changeRole(u.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
                      activeUser.role === u.role
                        ? "bg-brand-blue text-white font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-[#1d2230] text-slate-600 dark:text-slate-400 hover:text-brand-navy dark:hover:text-white"
                    } ${!u.active ? "opacity-35 cursor-not-allowed" : ""}`}
                    disabled={!u.active}
                  >
                    <div>
                      <div className="font-bold">{u.name}</div>
                      <div className={`text-[9px] font-semibold uppercase mt-0.5 ${
                        activeUser.role === u.role ? "text-blue-200" : "text-slate-400"
                      }`}>{u.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
