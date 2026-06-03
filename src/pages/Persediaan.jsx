import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Plus, Search, AlertTriangle, ArrowDown, ArrowUp, Sparkles } from "lucide-react";
import Modal from "../components/Modal";

export default function Persediaan() {
  const {
    items,
    inventoryTransactions,
    addStockAdjustment
  } = useContext(AppContext);

  const [subTab, setSubTab] = useState("stok");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  // Form State: Stock Adjustment
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [itemId, setItemId] = useState("");
  const [type, setType] = useState("Masuk"); // Masuk, Keluar
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "Semua" ? true : item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSubmitAdjustment = (e) => {
    e.preventDefault();
    if (!itemId) {
      setErrorMsg("Pilih barang yang ingin disesuaikan!");
      return;
    }
    if (!qty || Number(qty) <= 0) {
      setErrorMsg("Jumlah kuantitas penyesuaian harus lebih besar dari 0!");
      return;
    }

    const selectedItem = items.find(i => i.id === itemId);
    if (type === "Keluar" && selectedItem && selectedItem.stock < Number(qty)) {
      setErrorMsg(`Kuantitas keluar melebihi stok yang tersedia (${selectedItem.stock} ${selectedItem.unit})!`);
      return;
    }

    addStockAdjustment({
      itemId,
      date,
      type,
      qty,
      note
    });

    setItemId("");
    setQty("");
    setNote("");
    setErrorMsg("");
    setIsModalOpen(false);
  };

  const totalValue = items.reduce((sum, item) => sum + (item.stock * item.cost), 0);
  const totalItemsCount = items.length;
  const criticalItemsCount = items.filter(i => i.stock <= i.minStock).length;

  return (
    <div className="space-y-6 animate-fade-in p-6 min-h-screen">
      
      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">NILAI ASET PERSEDIAAN</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              Rp {totalValue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">METODE: RATA-RATA TERTIMBANG</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
            VAL
          </div>
        </div>

        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">ITEM TERDAFTAR</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              {totalItemsCount} Golongan
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
              BAHAN BAKU & BARANG JADI
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">
            QTY
          </div>
        </div>

        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block font-heading">ALERTI STOK LIMIT</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              {criticalItemsCount} Pos Kondisi
            </h3>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 uppercase">
              {criticalItemsCount > 0 && <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />} PERLU RESTOCK
            </span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            criticalItemsCount > 0 
              ? "bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400" 
              : "bg-slate-50 dark:bg-slate-800 text-slate-500"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-tabs header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 justify-between items-end flex-wrap gap-4">
        <div className="flex gap-2">
          {["stok", "kartu"].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-3 text-xs font-bold tracking-wider border-b-2 transition-all uppercase font-heading cursor-pointer ${
                subTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
              }`}
            >
              {tab === "stok" ? "Posisi Persediaan Stok" : "Kartu Stok (Log Mutasi)"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pb-2">
          <button
            onClick={() => {
              setErrorMsg("");
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-755 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Penyesuaian Stok
          </button>
        </div>
      </div>

      {/* Stock List Tab */}
      {subTab === "stok" && (
        <div className="space-y-4">
          
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Cari kode atau nama barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="fogo-input w-full pl-9 pr-4 py-2 text-xs font-sans"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="fogo-input px-4 py-2 text-xs font-sans"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Bahan Baku">Bahan Baku</option>
              <option value="Barang Jadi">Barang Jadi</option>
            </select>
          </div>

          <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="fogo-table">
                <thead>
                  <tr>
                    <th className="text-left">Kode</th>
                    <th className="text-left">Nama Barang Persediaan</th>
                    <th className="text-left">Kategori</th>
                    <th className="text-center w-28">Stok</th>
                    <th className="text-left w-28">Satuan</th>
                    <th className="text-right">Biaya Rata-Rata (Rp)</th>
                    <th className="text-right">Nilai Total (Rp)</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredItems.map((item) => {
                    const val = item.stock * item.cost;
                    const isCritical = item.stock <= item.minStock;

                    return (
                      <tr key={item.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${isCritical ? "bg-rose-500/[0.015]" : ""}`}>
                        <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400">{item.code}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{item.name}</td>
                        <td className="px-4 py-3 text-xs uppercase text-slate-500 dark:text-slate-400">{item.category}</td>
                        <td className={`px-4 py-3 text-center text-xs font-bold ${isCritical ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {item.stock}
                        </td>
                        <td className="px-4 py-3 text-xs uppercase text-slate-500">{item.unit}</td>
                        <td className="px-4 py-3 text-right text-xs">Rp {item.cost.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-xs font-bold text-slate-900 dark:text-white">Rp {val.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCritical
                              ? "bg-rose-55 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          }`}>
                            {isCritical ? "Stok Kritis" : "Stok Aman"}
                          </span>
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

      {/* Stock Cards Tab */}
      {subTab === "kartu" && (
        <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="fogo-table">
              <thead>
                <tr>
                  <th className="text-left">Tanggal Mutasi</th>
                  <th className="text-left w-40">Dokumen Rujukan</th>
                  <th className="text-left">Nama Barang</th>
                  <th className="text-left">Alasan & Catatan Aktivitas</th>
                  <th className="text-center w-28">Jenis</th>
                  <th className="text-center w-28">Kuantitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {inventoryTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs">{tx.date}</td>
                    <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{tx.reference}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{tx.itemName}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-500 dark:text-slate-400">{tx.note}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.type === "Masuk"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-455"
                      }`}>
                        {tx.type === "Masuk" ? (
                          <>
                            <ArrowDown className="w-3 h-3" /> MASUK
                          </>
                        ) : (
                          <>
                            <ArrowUp className="w-3 h-3" /> KELUAR
                          </>
                        )}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-center text-xs font-bold ${
                      tx.type === "Masuk" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-455"
                    }`}>
                      {tx.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Stock Adjustment */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="CATAT PENYESUAIAN MANUAL PERSESIAAN"
        size="md"
      >
        <form onSubmit={handleSubmitAdjustment} className="space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Tanggal</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider font-heading">Arah Penyesuaian</label>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              >
                <option value="Masuk">Masuk Penambahan (+)</option>
                <option value="Keluar">Keluar Pengurangan (-)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Pilih Barang</label>
            <select
              required
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            >
              <option value="">Pilih Barang...</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>
                  [{i.code}] {i.name.toUpperCase()} (Kini: {i.stock} {i.unit.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Kuantitas Unit</label>
            <input
              type="number"
              min={1}
              required
              placeholder="0"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Keterangan / Alasan Audit</label>
            <input
              type="text"
              required
              placeholder="Contoh: Hasil Stock Opname Bulanan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
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
              onClick={() => setIsModalOpen(false)}
              className="fogo-btn-secondary px-4 py-2 text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="fogo-btn-primary px-5 py-2 text-xs cursor-pointer"
            >
              Simpan Penyesuaian
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
