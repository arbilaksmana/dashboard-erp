import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Plus, Check, CreditCard, AlertCircle, Trash, BarChart2 } from "lucide-react";
import Modal from "../components/Modal";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function Pembelian() {
  const {
    suppliers,
    purchaseInvoices,
    items,
    accounts,
    createPurchaseInvoice,
    recordSupplierPayment
  } = useContext(AppContext);

  const [subTab, setSubTab] = useState("invoices");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Form State: Purchase Invoice
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().substring(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30*24*60*60*1000).toISOString().substring(0, 10));
  const [supplierId, setSupplierId] = useState("");
  const [payMethod, setPayMethod] = useState("Credit");
  const [invoiceItems, setInvoiceItems] = useState([{ itemId: "", qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0.11);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State: Record Payment
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const purchaseableItems = items.filter(i => i.category === "Bahan Baku");
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
        const selectedItem = purchaseableItems.find(i => i.id === value);
        copy[index].price = selectedItem ? selectedItem.cost : 0;
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
    if (!supplierId) {
      setErrorMsg("Harap pilih pemasok!");
      return;
    }
    if (invoiceItems.some(i => !i.itemId || i.qty <= 0 || i.price < 0)) {
      setErrorMsg("Harap pastikan semua item valid dengan jumlah di atas 0!");
      return;
    }

    createPurchaseInvoice({
      date: invoiceDate,
      dueDate,
      supplierId,
      itemsList: invoiceItems,
      taxRate,
      payMethod
    });

    setSupplierId("");
    setInvoiceItems([{ itemId: "", qty: 1, price: 0 }]);
    setErrorMsg("");
    setIsInvoiceModalOpen(false);
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const inv = purchaseInvoices.find(i => i.id === selectedInvoiceId);
    if (!inv) return;
    const unpaidAmt = inv.amount - (inv.paidAmount || 0);

    if (Number(paymentAmount) <= 0 || Number(paymentAmount) > unpaidAmt) {
      setErrorMsg(`Nominal harus di antara Rp 1 dan sisa hutang sebesar Rp ${unpaidAmt.toLocaleString()}`);
      return;
    }
    if (!paymentAccount) {
      setErrorMsg("Pilih kas/bank asal dana!");
      return;
    }

    recordSupplierPayment({
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
    const inv = purchaseInvoices.find(i => i.id === id);
    if (inv) {
      const remaining = inv.amount - (inv.paidAmount || 0);
      setPaymentAmount(remaining);
    }
    setPaymentAccount(cashAccounts[1]?.code || ""); // default BCA
    setIsPaymentModalOpen(true);
  };

  const totalOutstandingHutang = purchaseInvoices
    .filter(i => i.status !== "Lunas")
    .reduce((sum, i) => sum + (i.amount - (i.paidAmount || 0)), 0);

  const getMonthlyPurchaseChartData = () => {
    const grouped = {};
    purchaseInvoices.forEach(inv => {
      const dateStr = inv.date;
      if (!grouped[dateStr]) {
        grouped[dateStr] = { date: dateStr, Pembelian: 0 };
      }
      grouped[dateStr].Pembelian += inv.amount;
    });
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  };
  const monthlyPurchaseChartData = getMonthlyPurchaseChartData();

  const getItemPurchaseReportData = () => {
    const report = {};
    purchaseInvoices.forEach(inv => {
      inv.items.forEach(it => {
        const itemObj = items.find(i => i.id === it.itemId);
        const name = itemObj ? itemObj.name : it.itemId;
        if (!report[it.itemId]) {
          report[it.itemId] = { id: it.itemId, name, qtyBought: 0, cost: 0 };
        }
        report[it.itemId].qtyBought += it.qty;
        report[it.itemId].cost += it.qty * it.price;
      });
    });
    return Object.values(report);
  };
  const itemPurchaseReportList = getItemPurchaseReportData();

  const subtotalSum = calculateSubtotal();
  const taxSum = Math.round(subtotalSum * taxRate);
  const totalSum = subtotalSum + taxSum;

  return (
    <div className="space-y-6 animate-fade-in p-6 min-h-screen">
      
      {/* Sub-tabs header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 justify-between items-end flex-wrap gap-4">
        <div className="flex gap-2">
          {["invoices", "pemasok", "report"].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-3 text-xs font-bold tracking-wider border-b-2 transition-all uppercase font-heading cursor-pointer ${
                subTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
              }`}
            >
              {tab === "invoices" && "Tagihan Pembelian (PO)"}
              {tab === "pemasok" && "Daftar Pemasok (Supplier)"}
              {tab === "report" && "Laporan Pembelian"}
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
            <Plus className="w-3.5 h-3.5" /> Input Pembelian Baru
          </button>
        </div>
      </div>

      {/* Invoice list Tab */}
      {subTab === "invoices" && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">TOTAL HUTANG DAGANG</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  Rp {totalOutstandingHutang.toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-455">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">TAGIHAN LUNAS</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  {purchaseInvoices.filter(i => i.status === "Lunas").length} PO
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-450">
                <Check className="w-5 h-5" />
              </div>
            </div>
            <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block font-heading">TAGIHAN BELUM LUNAS</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  {purchaseInvoices.filter(i => i.status !== "Lunas").length} Invoice
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-605 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="fogo-table">
                <thead>
                  <tr>
                    <th className="text-left">No. Invoice PO</th>
                    <th className="text-left">Tanggal / Jatuh Tempo</th>
                    <th className="text-left">Nama Supplier</th>
                    <th className="text-right">Nilai Beli (Rp)</th>
                    <th className="text-right">Sisa Hutang (Rp)</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {purchaseInvoices.map((inv) => {
                    const unpaidAmt = inv.amount - (inv.paidAmount || 0);
                    const isOverdue = new Date(inv.dueDate) < new Date() && inv.status !== "Lunas";

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                          <div>{inv.invoiceNo}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal uppercase mt-0.5">PO: {inv.poNo}</div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <div className="text-slate-800 dark:text-white font-semibold">{inv.date}</div>
                          <div className={`text-[10px] mt-0.5 ${isOverdue ? "text-rose-600 dark:text-rose-455 font-extrabold animate-pulse" : "text-slate-400 dark:text-slate-500"}`}>
                            J.T: {inv.dueDate} {isOverdue && "(OVERDUE)"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{inv.supplierName}</td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-white">Rp {inv.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-slate-400 dark:text-slate-550">Rp {unpaidAmt.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "Lunas"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
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
                              Bayar Hutang
                            </button>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-550 text-[10px] uppercase font-semibold">Lunas</span>
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

      {/* Pemasok Tab */}
      {subTab === "pemasok" && (
        <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="fogo-table">
              <thead>
                <tr>
                  <th className="text-left">Kode</th>
                  <th className="text-left">Nama Supplier</th>
                  <th className="text-left">E-mail</th>
                  <th className="text-left">No. Telp</th>
                  <th className="text-left">Alamat Kantor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400">{s.code}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{s.name}</td>
                    <td className="px-4 py-3 text-xs font-medium">{s.email}</td>
                    <td className="px-4 py-3 text-xs font-medium">{s.phone}</td>
                    <td className="px-4 py-3 text-xs uppercase text-slate-500 dark:text-slate-450">{s.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Laporan Pembelian Tab */}
      {subTab === "report" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">TOTAL PEMBELIAN</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
                  Rp {purchaseInvoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
            
            <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">PEMBELIAN TUNAI (CASH)</span>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
                  Rp {purchaseInvoices.filter(i => i.payMethod === "Cash").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
            </div>

            <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">PEMBELIAN KREDIT (AP)</span>
                <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 font-heading">
                  Rp {purchaseInvoices.filter(i => i.payMethod === "Credit").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Purchase / AP trend chart */}
          <div className="fogo-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
                Tren Biaya Pembelian Bulanan/Harian
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Nilai total PO tagihan pembelian bahan baku</p>
            </div>
            <div className="h-64 w-full">
              {monthlyPurchaseChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Belum ada data pembelian bahan baku tercatat.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPurchaseChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                    <Bar dataKey="Pembelian" fill="#ec4899" radius={[4, 4, 0, 0]} name="Nilai Pembelian" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Purchases by Item Table */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase font-heading">Statistik Pembelian per Bahan Baku</h4>
              <p className="text-[10px] text-slate-400">Rangkuman kuantitas dibeli dan pengeluaran masing-masing bahan baku</p>
            </div>
            <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="fogo-table">
                  <thead>
                    <tr>
                      <th className="text-left">Kode Item</th>
                      <th className="text-left">Nama Bahan Baku</th>
                      <th className="text-center w-36">Total Dibeli</th>
                      <th className="text-right w-52">Total Nilai Pembelian (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {itemPurchaseReportList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                          Belum ada item dibeli.
                        </td>
                      </tr>
                    ) : (
                      itemPurchaseReportList.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{row.id}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{row.name}</td>
                          <td className="px-4 py-3 text-center text-xs font-semibold">{row.qtyBought} unit</td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-slate-900 dark:text-white">Rp {row.cost.toLocaleString()}</td>
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

      {/* Modal: Create Purchase Invoice */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="BUAT NOTA PEMBELIAN BARU"
        size="lg"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Pilih Pemasok (Supplier)</label>
              <select
                required
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              >
                <option value="">Pilih...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
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
              <span className="text-[10px] font-bold text-slate-800 dark:text-white tracking-wider uppercase font-heading">Pos Bahan Baku Yang Dibeli</span>
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
                    <option value="">Pilih Bahan Baku...</option>
                    {purchaseableItems.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.name.toUpperCase()} (Kini: {i.stock} {i.unit.toUpperCase()})
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
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs flex justify-between font-sans">
            <div className="space-y-1 text-slate-500 dark:text-slate-400">
              <div>Subtotal: <span className="font-semibold text-slate-800 dark:text-white">Rp {subtotalSum.toLocaleString()}</span></div>
              <div>PPN Masukan (11%): <span className="font-semibold text-slate-800 dark:text-white">Rp {taxSum.toLocaleString()}</span></div>
            </div>
            <div className="text-right flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase tracking-wider font-bold block">Total Tagihan Pembelian</span>
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
              Simpan Nota Tagihan
            </button>
          </div>

        </form>
      </Modal>

      {/* Record Payment */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="KONFIRMASI BAYAR TAGIHAN SUPPLIER (KAS KELUAR)"
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
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Rekening Kas / Bank (Sumber Dana)</label>
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
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Nominal Pengeluaran Dana (Rp)</label>
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
