import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Factory,
  CheckCircle,
  Clock,
  MoreVertical
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";

export default function Dashboard() {
  const {
    salesInvoices,
    accounts,
    productionOrders,
    items,
    cashBankTransactions,
    setCurrentTab
  } = useContext(AppContext);

  // 1. Calculate KPI Metrics
  const totalSalesVal = salesInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  
  const cashBalance = (accounts.find(a => a.code === "1101")?.balance || 0) + 
                      (accounts.find(a => a.code === "1102")?.balance || 0);

  const piutangBalance = accounts.find(a => a.code === "1103")?.balance || 0;
  const hutangBalance = accounts.find(a => a.code === "2101")?.balance || 0;
  
  // Expenses = HPP + Beban + Purchases paid
  const hppVal = accounts.find(a => a.code === "5101")?.balance || 0;
  const bebanGaji = accounts.find(a => a.code === "6101")?.balance || 0;
  const bebanListrik = accounts.find(a => a.code === "6102")?.balance || 0;
  const totalExpensesVal = hppVal + bebanGaji + bebanListrik;

  // Laba Bersih
  const netProfit = totalSalesVal - totalExpensesVal;

  // 2. Data for Sales Trend Chart (FOGO style double wavy AreaChart)
  const salesMonthlyData = [
    { name: "Jan", Revenue: 12000000, Expenses: 8000000 },
    { name: "Feb", Revenue: 18500000, Expenses: 11000000 },
    { name: "Mar", Revenue: 24000000, Expenses: 14000000 },
    { name: "Apr", Revenue: 15000000, Expenses: 9000000 },
    { name: "Mei", Revenue: 24976000, Expenses: 15300000 },
    { name: "Jun", Revenue: totalSalesVal - 24976000 > 0 ? totalSalesVal - 24976000 : 1100000, Expenses: totalExpensesVal - 15300000 > 0 ? totalExpensesVal - 15300000 : 600000 }
  ];

  // 3. Profit and Loss Stacked Bar Chart data
  const profitLossData = [
    { name: "Jan", Profit: 4000, Loss: 2000 },
    { name: "Feb", Profit: 5500, Loss: 2500 },
    { name: "Mar", Profit: 7000, Loss: 3000 },
    { name: "Apr", Profit: 4500, Loss: 1800 },
    { name: "May", Profit: 8000, Loss: 3200 },
    { name: "Jun", Profit: netProfit/1000000 > 0 ? Math.round(netProfit/1000000) : 4000, Loss: totalExpensesVal/1000000 > 0 ? Math.round(totalExpensesVal/1000000) : 1800 }
  ];

  // Active production orders (representing FOGO "Today's Appointment" style)
  const activeOrders = productionOrders.slice(0, 5);

  // Invoices list (representing FOGO "Client Transactions Table")
  const recentInvoices = salesInvoices.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in p-6">
      
      {/* KPI Cards & Bar Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: 4 KPI Cards (Span 2) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: Total Revenue (FOGO Blue style) */}
          <div className="fogo-card-blue p-6 flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">Total Revenue</span>
                <h3 className="text-2xl font-extrabold text-white mt-1.5 font-heading">
                  Rp {totalSalesVal.toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="trend-pill-green text-[9px] bg-white/20 text-white font-bold">
                ↑ 12.5% This month
              </span>
            </div>
          </div>

          {/* Card 2: Total Expenses (FOGO White style) */}
          <div className="fogo-card p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Expenses</span>
                <h3 className="text-2xl font-extrabold text-brand-navy dark:text-white mt-1.5 font-heading">
                  Rp {totalExpensesVal.toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-brand-blue">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="trend-pill-red">
                ↓ 4.8% This month
              </span>
            </div>
          </div>

          {/* Card 3: Net Profit */}
          <div className="fogo-card p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Net Profit</span>
                <h3 className="text-2xl font-extrabold text-brand-navy dark:text-white mt-1.5 font-heading">
                  Rp {netProfit.toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-brand-blue">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="trend-pill-green">
                ↑ 7.2% This month
              </span>
            </div>
          </div>

          {/* Card 4: Cash Balance */}
          <div className="fogo-card p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cash Balance</span>
                <h3 className="text-2xl font-extrabold text-brand-navy dark:text-white mt-1.5 font-heading">
                  Rp {cashBalance.toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-brand-blue">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="trend-pill-green">
                ↑ 2.1% This month
              </span>
            </div>
          </div>

        </div>

        {/* Right: Profit and Loss Bar Chart (FOGO style) */}
        <div className="fogo-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Profit and Loss</h3>
              <p className="text-[10px] text-slate-400 font-medium">Bulan berjalan</p>
            </div>
            <button className="text-slate-400 hover:text-brand-navy dark:hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-48 w-full mt-4 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitLossData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `${val}J`} />
                <Bar dataKey="Profit" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Loss" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              <span>Profit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-navy" />
              <span>Loss</span>
            </div>
          </div>
        </div>

      </div>

      {/* Over Time Revenue Chart & Appointment List Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue and Expenses Over Time (Span 2) */}
        <div className="fogo-card p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Revenue and Expenses Over Time</h3>
              <p className="text-[10px] text-slate-400 font-medium">Laba operasional vs pengeluaran kotor</p>
            </div>
            <select className="bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-[#222533] rounded-lg px-2 py-1 text-[10px] font-semibold text-slate-500 focus:outline-none">
              <option>This Month</option>
              <option>This Week</option>
            </select>
          </div>

          <div className="h-60 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesMonthlyData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000000}JT`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff" }}
                  formatter={(val) => [`Rp ${val.toLocaleString()}`]}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Expenses" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Orders / WIP List (FOGO "Today's Appointment" style) */}
        <div className="fogo-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-[#222533] pb-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Today's Work Orders</h3>
              <p className="text-[10px] text-slate-400 font-medium">Daftar order manufaktur aktif</p>
            </div>
            <button className="text-slate-400 hover:text-brand-navy dark:hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-60 pr-1">
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No active production orders today.
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-brand-blue shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-navy dark:text-white">{order.orderNo}</div>
                      <div className="text-[9px] text-slate-400 font-medium mt-0.5">{order.itemName}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentTab("produksi")}
                    className="px-3 py-1 bg-white hover:bg-slate-50 dark:bg-slate-800 text-brand-blue text-[10px] font-bold rounded-lg border border-slate-100 dark:border-transparent transition-all cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Client Transactions Table (Bottom Row) */}
      <div className="fogo-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Client Transactions Table</h3>
            <p className="text-[10px] text-slate-400 font-medium">Daftar faktur transaksi penjualan terakhir</p>
          </div>
          <button
            onClick={() => setCurrentTab("penjualan")}
            className="px-3.5 py-1.5 bg-white hover:bg-[#f8fafc] text-brand-blue text-[11px] font-bold rounded-xl border border-[#e2e8f0] transition-all cursor-pointer"
          >
            View Details
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#222533] text-slate-400">
                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider">ID No</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider">Client Name</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider">Date</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider">Transaction type</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-right">Amount</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-[#222533]/40 text-slate-600 dark:text-slate-300 font-medium">
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                  <td className="py-3.5 text-brand-blue font-bold font-mono">#{inv.invoiceNo.substring(4, 8)}</td>
                  <td className="py-3.5 font-bold text-brand-navy dark:text-slate-100">{inv.customerName}</td>
                  <td className="py-3.5 text-slate-400 font-mono text-[11px]">{inv.date}</td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      inv.status === "Lunas"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-500/5 dark:text-amber-400"
                    }`}>
                      {inv.status === "Lunas" ? "Payment" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-brand-navy dark:text-slate-100">Rp {inv.amount.toLocaleString()}</td>
                  <td className="py-3.5 text-center text-slate-400 hover:text-brand-navy cursor-pointer">
                    <MoreVertical className="w-4 h-4 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
