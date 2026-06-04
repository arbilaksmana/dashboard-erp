import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Plus, Check, Search, CreditCard, Users, FileText, AlertCircle, ShoppingBag, Trash, BarChart2 } from "lucide-react";
import Modal from "../components/Modal";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function Penjualan() {
  const {
    customers,
    salesInvoices,
    items,
    accounts,
    createSalesInvoice,
    recordCustomerPayment
  } = useContext(AppContext);

  const [subTab, setSubTab] = useState("invoices");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Form State: Sales Invoice
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().substring(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30*24*60*60*1000).toISOString().substring(0, 10));
  const [customerId, setCustomerId] = useState("");
  const [payMethod, setPayMethod] = useState("Credit");
  const [invoiceItems, setInvoiceItems] = useState([{ itemId: "", qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0.11);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State: Receive Payment
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const sellableItems = items.filter(i => i.category === "Barang Jadi");
  const cashAccounts = accounts.filter(acc => ["1101", "1102"].includes(acc.code));

  const handleAddItemRow = () => {
    setInvoiceItems(prev => [...prev, { itemId: "", qty: 1, price: 0 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (invoiceItems.length <= 1) return;
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setInvoiceItems(prev => {
      const copy = [...prev];
      if (field === "itemId") {
        copy[index].itemId = value;
        const selectedItem = sellableItems.find(i => i.id === value);
        copy[index].price = selectedItem ? selectedItem.price : 0;
      } else if (field === "qty") {
        copy[index].qty = Number(value);
      } else if (field === "price") {
        copy[index].price = Number(value);
      }
      return copy;
    });
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!customerId) {
      setErrorMsg("Harap pilih pelanggan!");
      return;
    }
    if (invoiceItems.some(i => !i.itemId || i.qty <= 0 || i.price < 0)) {
      setErrorMsg("Harap pastikan semua item valid dengan jumlah di atas 0!");
      return;
    }

    let stockViolation = false;
    let violatedItemName = "";
    invoiceItems.forEach(item => {
      const dbItem = items.find(i => i.id === item.itemId);
      if (dbItem && dbItem.stock < item.qty) {
        stockViolation = true;
        violatedItemName = dbItem.name;
      }
    });

    if (stockViolation) {
      setErrorMsg(`Stok tidak mencukupi untuk item: ${violatedItemName}!`);
      return;
    }

    createSalesInvoice({
      date: invoiceDate,
      dueDate,
      customerId,
      itemsList: invoiceItems,
      taxRate,
      payMethod
    });

    setCustomerId("");
    setInvoiceItems([{ itemId: "", qty: 1, price: 0 }]);
    setErrorMsg("");
    setIsInvoiceModalOpen(false);
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const inv = salesInvoices.find(i => i.id === selectedInvoiceId);
    if (!inv) return;
    const unpaidAmt = inv.amount - (inv.paidAmount || 0);

    if (Number(paymentAmount) <= 0 || Number(paymentAmount) > unpaidAmt) {
      setErrorMsg(`Nominal harus di antara Rp 1 dan sisa piutang sebesar Rp ${unpaidAmt.toLocaleString()}`);
      return;
    }
    if (!paymentAccount) {
      setErrorMsg("Pilih kas/bank tujuan transfer!");
      return;
    }

    recordCustomerPayment({
      invoiceId: selectedInvoiceId,
      date: paymentDate,
      accountCode: paymentAccount,
      amount: paymentAmount
    });

    setSelectedInvoiceId("");
    setPaymentAmount("");
    setErrorMsg("");
    setIsPaymentModalOpen(false);
  };

  const handleInvoiceSelectForPayment = (id) => {
    setSelectedInvoiceId(id);
    const inv = salesInvoices.find(i => i.id === id);
    if (inv) {
      const remaining = inv.amount - (inv.paidAmount || 0);
      setPaymentAmount(remaining);
    }
    setPaymentAccount(cashAccounts[1]?.code || ""); // default BCA
    setIsPaymentModalOpen(true);
  };

  const getAgingReceivables = () => {
    const agingData = customers.map(c => {
      const outstandingInvoices = salesInvoices.filter(i => i.customerId === c.id && i.status !== "Lunas");
      
      let lancar = 0;
      let bucket1 = 0;
      let bucket2 = 0;
      let bucket3 = 0;
      let bucket4 = 0;

      outstandingInvoices.forEach(inv => {
        const remaining = inv.amount - (inv.paidAmount || 0);
        const dateDiffDays = Math.floor((new Date() - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));

        if (dateDiffDays <= 0) {
          lancar += remaining;
        } else if (dateDiffDays <= 30) {
          bucket1 += remaining;
        } else if (dateDiffDays <= 60) {
          bucket2 += remaining;
        } else if (dateDiffDays <= 90) {
          bucket3 += remaining;
        } else {
          bucket4 += remaining;
        }
      });

      const totalOutstanding = lancar + bucket1 + bucket2 + bucket3 + bucket4;

      return {
        customerName: c.name,
        customerCode: c.code,
        lancar,
        bucket1,
        bucket2,
        bucket3,
        bucket4,
        total: totalOutstanding
      };
    }).filter(row => row.total > 0);

    return agingData;
  };

  const agingList = getAgingReceivables();

  const subtotalSum = calculateSubtotal();
  const taxSum = Math.round(subtotalSum * taxRate);
  const totalSum = subtotalSum + taxSum;

  const totalOutstandingPiutang = salesInvoices
    .filter(i => i.status !== "Lunas")
    .reduce((sum, i) => sum + (i.amount - (i.paidAmount || 0)), 0);

  const getMonthlySalesChartData = () => {
    const grouped = {};
    salesInvoices.forEach(inv => {
      const dateStr = inv.date;
      if (!grouped[dateStr]) {
        grouped[dateStr] = { date: dateStr, Penjualan: 0 };
      }
      grouped[dateStr].Penjualan += inv.amount;
    });
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  };
  const monthlySalesChartData = getMonthlySalesChartData();

  const getItemReportData = () => {
    const report = {};
    salesInvoices.forEach(inv => {
      inv.items.forEach(it => {
        const itemObj = items.find(i => i.id === it.itemId);
        const name = itemObj ? itemObj.name : it.itemId;
        if (!report[it.itemId]) {
          report[it.itemId] = { id: it.itemId, name, qtySold: 0, revenue: 0 };
        }
        report[it.itemId].qtySold += it.qty;
        report[it.itemId].revenue += it.qty * it.price;
      });
    });
    return Object.values(report);
  };
  const itemReportList = getItemReportData();

  return (
    <div className="space-y-6 animate-fade-in p-6 min-h-screen">
      
      {/* Sub-tabs header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 justify-between items-end flex-wrap gap-4">
        <div className="flex gap-2">
          {["invoices", "pelanggan", "aging", "report"].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-3 text-xs font-bold tracking-wider border-b-2 transition-all uppercase font-heading cursor-pointer ${
                subTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
              }`}
            >
              {tab === "invoices" && "Faktur Penjualan"}
              {tab === "pelanggan" && "Daftar Pelanggan"}
              {tab === "aging" && "Aging Piutang (AR)"}
              {tab === "report" && "Laporan Penjualan"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pb-2">
          <button
            onClick={() => {
              setErrorMsg("");
              setIsInvoiceModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-755 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Invoice Baru
          </button>
        </div>
      </div>

      {/* Invoice list Tab */}
      {subTab === "invoices" && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">PIUTANG BERJALAN</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  Rp {totalOutstandingPiutang.toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">FAKTUR LUNAS</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  {salesInvoices.filter(i => i.status === "Lunas").length} Invoice
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
            </div>
            <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">TERTUNDA / OVERDUE</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  {salesInvoices.filter(i => i.status !== "Lunas" && new Date(i.dueDate) < new Date()).length} Invoice
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="fogo-table">
                <thead>
                  <tr>
                    <th className="text-left">No. Invoice</th>
                    <th className="text-left">Tanggal / Jatuh Tempo</th>
                    <th className="text-left">Nama Pelanggan</th>
                    <th className="text-right">Nilai Tagihan (Rp)</th>
                    <th className="text-right">Sisa Piutang (Rp)</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {salesInvoices.map((inv) => {
                    const unpaidAmt = inv.amount - (inv.paidAmount || 0);
                    const isOverdue = new Date(inv.dueDate) < new Date() && inv.status !== "Lunas";

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{inv.invoiceNo}</td>
                        <td className="px-4 py-3 text-xs">
                          <div className="text-slate-800 dark:text-white font-semibold">{inv.date}</div>
                          <div className={`text-[10px] mt-0.5 ${isOverdue ? "text-rose-600 dark:text-rose-400 font-extrabold animate-pulse" : "text-slate-400 dark:text-slate-500"}`}>
                            J.T: {inv.dueDate} {isOverdue && "(OVERDUE)"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{inv.customerName}</td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-white">Rp {inv.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-slate-400 dark:text-slate-500">Rp {unpaidAmt.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "Lunas"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : inv.status === "Sebagian"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {inv.status !== "Lunas" ? (
                            <button
                              onClick={() => handleInvoiceSelectForPayment(inv.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Pelunasan
                            </button>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold">Lunas</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pelanggan Tab */}
      {subTab === "pelanggan" && (
        <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="fogo-table">
              <thead>
                <tr>
                  <th className="text-left">Kode</th>
                  <th className="text-left">Nama Pelanggan</th>
                  <th className="text-left">E-mail</th>
                  <th className="text-left">No. Telp</th>
                  <th className="text-left">Alamat Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400">{c.code}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{c.name}</td>
                    <td className="px-4 py-3 text-xs font-medium">{c.email}</td>
                    <td className="px-4 py-3 text-xs font-medium">{c.phone}</td>
                    <td className="px-4 py-3 text-xs uppercase text-slate-500 dark:text-slate-400">{c.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Piutang Aging Tab */}
      {subTab === "aging" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-heading">Jadwal Umur Piutang (AR Aging)</h3>
            <p className="text-xs text-slate-400 dark:text-slate-555">Diperhitungkan berdasarkan selisih hari jatuh tempo faktur kredit</p>
          </div>

          <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="fogo-table">
                <thead>
                  <tr>
                    <th className="text-left">Nama Pelanggan</th>
                    <th className="text-right">Lancar (Rp)</th>
                    <th className="text-right">1-30 Hari (Rp)</th>
                    <th className="text-right">31-60 Hari (Rp)</th>
                    <th className="text-right">61-90 Hari (Rp)</th>
                    <th className="text-right">&gt;90 Hari (Rp)</th>
                    <th className="text-right">Total Outstanding (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {agingList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                        Tidak ada piutang outstanding jatuh tempo.
                      </td>
                    </tr>
                  ) : (
                    agingList.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{row.customerName}</td>
                        <td className="px-4 py-3 text-right text-xs">{row.lancar > 0 ? row.lancar.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right text-xs text-amber-600 dark:text-amber-400 font-medium">{row.bucket1 > 0 ? row.bucket1.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right text-xs text-amber-700 dark:text-amber-500 font-medium">{row.bucket2 > 0 ? row.bucket2.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right text-xs text-orange-600 dark:text-orange-400 font-medium">{row.bucket3 > 0 ? row.bucket3.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right text-xs text-rose-600 dark:text-rose-455 font-bold">{row.bucket4 > 0 ? row.bucket4.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right text-xs font-bold text-blue-600 dark:text-blue-400">Rp {row.total.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Penjualan Tab */}
      {subTab === "report" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">TOTAL PENJUALAN</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  Rp {salesInvoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
            
            <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">PENJUALAN TUNAI (CASH)</span>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
                  Rp {salesInvoices.filter(i => i.payMethod === "Cash").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
            </div>

            <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">PENJUALAN KREDIT (AR)</span>
                <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 font-heading">
                  Rp {salesInvoices.filter(i => i.payMethod === "Credit").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Monthly Sales Trend Chart */}
          <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
                Tren Omset Penjualan Bulanan/Harian
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Nilai total faktur penjualan yang diterbitkan</p>
            </div>
            <div className="h-64 w-full">
              {monthlySalesChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Belum ada data penjualan tercatat.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis 
                      tick={{ fill: '#94a3b8', fontSize: 10 }} 
                      axisLine={false} 
                      tickLine={false} 
                      width={75}
                      tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toLocaleString('id-ID')}JT` : val.toLocaleString('id-ID')}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b0f19",
                        borderColor: "#1e293b",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "11px"
                      }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="Penjualan" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Nilai Penjualan" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Sales by Item Table */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase font-heading">Statistik Penjualan per Barang Jadi</h4>
              <p className="text-[10px] text-slate-400">Rangkuman kuantitas terjual dan nilai omset masing-masing item barang</p>
            </div>
            <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="fogo-table">
                  <thead>
                    <tr>
                      <th className="text-left">Kode Item</th>
                      <th className="text-left">Nama Barang Jadi</th>
                      <th className="text-center w-36">Total Terjual</th>
                      <th className="text-right w-52">Total Kontribusi Omset (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {itemReportList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                          Belum ada item terjual.
                        </td>
                      </tr>
                    ) : (
                      itemReportList.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{row.id}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{row.name}</td>
                          <td className="px-4 py-3 text-center text-xs font-semibold">{row.qtySold} unit</td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-slate-900 dark:text-white">Rp {row.revenue.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Sales Invoice */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="BUAT FAKTUR PENJUALAN BARU"
        size="lg"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Pilih Pelanggan</label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              >
                <option value="">Pilih...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Metode Bayar</label>
              <select
                required
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              >
                <option value="Credit">Kredit (Jatuh Tempo 30 Hari)</option>
                <option value="Cash">Tunai (Setoran BCA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Tanggal Faktur</label>
              <input
                type="date"
                required
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Jatuh Tempo</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
                disabled={payMethod === "Cash"}
              />
            </div>
          </div>

          {/* Item Lists */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-slate-800 dark:text-white tracking-wider uppercase font-heading">Pos Barang Jadi Yang Dijual</span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="px-3 py-1.5 bg-slate-850 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                + Tambah Baris
              </button>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {invoiceItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <select
                    required
                    value={item.itemId}
                    onChange={(e) => handleItemChange(idx, "itemId", e.target.value)}
                    className="flex-1 fogo-input px-3 py-2 text-xs font-sans"
                  >
                    <option value="">Pilih Barang Jadi...</option>
                    {sellableItems.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.name.toUpperCase()} (Stok: {i.stock} {i.unit.toUpperCase()})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                    className="w-20 fogo-input px-3 py-2 text-xs font-sans text-center"
                  />

                  <input
                    type="number"
                    min={0}
                    required
                    placeholder="Harga"
                    value={item.price || ""}
                    onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                    className="w-28 fogo-input px-3 py-2 text-xs font-sans text-right"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    className="p-2 border border-rose-100 dark:border-rose-900/50 bg-rose-50/50 hover:bg-rose-600 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:text-white transition-all rounded-lg cursor-pointer"
                    disabled={invoiceItems.length <= 1}
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-855 rounded-2xl text-xs flex justify-between font-sans">
            <div className="space-y-1 text-slate-500 dark:text-slate-400">
              <div>Subtotal: <span className="font-semibold text-slate-800 dark:text-white">Rp {subtotalSum.toLocaleString()}</span></div>
              <div>PPN Keluaran (11%): <span className="font-semibold text-slate-800 dark:text-white">Rp {taxSum.toLocaleString()}</span></div>
            </div>
            <div className="text-right flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase tracking-wider font-bold block">Total Faktur Penjualan</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Rp {totalSum.toLocaleString()}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-xs text-red-650 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="fogo-btn-secondary px-4 py-2 text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="fogo-btn-primary px-5 py-2 text-xs cursor-pointer"
            >
              Simpan & Cetak Invoice
            </button>
          </div>

        </form>
      </Modal>

      {/* Modal: Record Payment */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="KONFIRMASI TERIMA SETORAN PIUTANG PELANGGAN"
        size="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Tanggal Pembayaran</label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Akun Kas / Bank Tujuan Setoran</label>
            <select
              required
              value={paymentAccount}
              onChange={(e) => setPaymentAccount(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            >
              <option value="">Pilih Kas/Bank...</option>
              {cashAccounts.map(acc => (
                <option key={acc.code} value={acc.code}>
                  [{acc.code}] {acc.name.toUpperCase()} - Rp {acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Nominal Pembayaran Masuk (Rp)</label>
            <input
              type="number"
              min={1}
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans text-right"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-xs text-red-650 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="fogo-btn-secondary px-4 py-2 text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="fogo-btn-primary px-5 py-2 text-xs cursor-pointer"
            >
              Konfirmasi Pelunasan
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
