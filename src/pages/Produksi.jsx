import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Plus, Check, Play, AlertCircle, Factory } from "lucide-react";
import Modal from "../components/Modal";

export default function Produksi() {
  const {
    productionOrders,
    items,
    createProductionOrder,
    completeProductionOrder
  } = useContext(AppContext);

  const [subTab, setSubTab] = useState("orders");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // Form State: Create Production Order
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [targetItemId, setTargetItemId] = useState("");
  const [targetQty, setTargetQty] = useState(10);
  const [materials, setMaterials] = useState([]);
  const [hasSufficientStock, setHasSufficientStock] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State: Complete Order
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [producedQty, setProducedQty] = useState("");

  const finishedGoods = items.filter(i => i.category === "Barang Jadi");

  const bomFormulations = {
    "itm-5": [
      { itemId: "itm-1", name: "Besi Beton 10mm", ratio: 1, unit: "Batang" },
      { itemId: "itm-2", name: "Semen Portland 50kg", ratio: 2, unit: "Sak" },
      { itemId: "itm-3", name: "Pasir Beton", ratio: 0.2, unit: "M3" }
    ],
    "itm-6": [
      { itemId: "itm-2", name: "Semen Portland 50kg", ratio: 0.5, unit: "Sak" },
      { itemId: "itm-3", name: "Pasir Beton", ratio: 0.07, unit: "M3" }
    ]
  };

  useEffect(() => {
    if (targetItemId && targetQty > 0) {
      const formula = bomFormulations[targetItemId] || [];
      const updatedMaterials = formula.map(mat => {
        const dbItem = items.find(i => i.id === mat.itemId);
        const qtyRequired = Math.ceil(mat.ratio * targetQty);
        const availableStock = dbItem ? dbItem.stock : 0;
        return {
          ...mat,
          qtyRequired,
          qtyUsed: qtyRequired,
          availableStock,
          sufficient: availableStock >= qtyRequired
        };
      });
      setMaterials(updatedMaterials);

      const sufficient = updatedMaterials.every(m => m.sufficient);
      setHasSufficientStock(sufficient);
    } else {
      setMaterials([]);
      setHasSufficientStock(true);
    }
  }, [targetItemId, targetQty, items]);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!targetItemId) {
      setErrorMsg("Pilih produk jadi yang ingin diproduksi!");
      return;
    }
    if (Number(targetQty) <= 0) {
      setErrorMsg("Kuantitas target harus lebih besar dari 0!");
      return;
    }
    if (!hasSufficientStock) {
      setErrorMsg("Stok bahan baku tidak mencukupi untuk melakukan produksi!");
      return;
    }

    createProductionOrder({
      date,
      itemId: targetItemId,
      qtyTarget: targetQty,
      materials
    });

    setTargetItemId("");
    setTargetQty(10);
    setErrorMsg("");
    setIsCreateModalOpen(false);
  };

  const handleOpenCompleteModal = (order) => {
    setSelectedOrderId(order.id);
    setProducedQty(order.qtyTarget);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (Number(producedQty) <= 0) {
      setErrorMsg("Jumlah produk jadi yang dihasilkan harus lebih besar dari 0!");
      return;
    }

    completeProductionOrder(selectedOrderId, producedQty);
    
    setSelectedOrderId("");
    setProducedQty("");
    setErrorMsg("");
    setIsCompleteModalOpen(false);
  };

  const pendingOrders = productionOrders.filter(o => o.status === "Dalam Proses");
  const finishedOrders = productionOrders.filter(o => o.status === "Selesai");
  const totalCostInvested = finishedOrders.reduce((sum, o) => sum + (o.productionCost || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in p-6 min-h-screen">
      
      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">PERINTAH KERJA JALAN</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              {pendingOrders.length} Order WIP
            </h3>
            <span className="text-[10px] text-orange-605 dark:text-orange-400 font-bold uppercase block">Bahan Baku Terpotong</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-955/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Play className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">ORDER SELESAI PABRIK</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              {finishedOrders.length} Order OK
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">MASUK GUDANG BARANG JADI</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">TOTAL BIAYA MANUFAKTUR</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              Rp {totalCostInvested.toLocaleString()}
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">KAPITALISASI BARANG JADI</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-450 font-bold text-xs">
            VAL
          </div>
        </div>
      </div>

      {/* Sub-tabs header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 justify-between items-end flex-wrap gap-4">
        <div className="flex gap-2">
          {["orders", "bom"].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-3 text-xs font-bold tracking-wider border-b-2 transition-all uppercase font-heading cursor-pointer ${
                subTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
              }`}
            >
              {tab === "orders" ? "Daftar Perintah Kerja (WO)" : "BOM Formulasi Assembly"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pb-2">
          <button
            onClick={() => {
              setTargetItemId(finishedGoods[0]?.id || "");
              setTargetQty(10);
              setErrorMsg("");
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-755 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Rencana Produksi
          </button>
        </div>
      </div>

      {/* Work Orders Tab */}
      {subTab === "orders" && (
        <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="fogo-table">
              <thead>
                <tr>
                  <th className="text-left">No. Work Order</th>
                  <th className="text-left">Tanggal Order</th>
                  <th className="text-left">Produk Hasil Jadi</th>
                  <th className="text-center w-28">Target</th>
                  <th className="text-center w-28">Jadi</th>
                  <th className="text-right">Biaya Produksi (Rp)</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {productionOrders.map((order) => {
                  const isFinished = order.status === "Selesai";
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{order.orderNo}</td>
                      <td className="px-4 py-3 text-xs">{order.date}</td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-bold text-slate-800 dark:text-white uppercase">{order.itemName}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          Konsumsi: {order.materials.map(m => `${m.qtyUsed}${m.unit.substring(0,3).toUpperCase()} ${m.name}`).join(" | ")}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-xs">{order.qtyTarget} Pcs</td>
                      <td className="px-4 py-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {isFinished ? `${order.qtyProduced} Pcs` : "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-white">
                        {isFinished ? `Rp ${order.productionCost.toLocaleString()}` : `- (Est: Rp ${order.productionCost.toLocaleString()})`}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "Selesai"
                            ? "bg-emerald-55 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-750 dark:bg-amber-955/20 dark:text-amber-400 animate-pulse"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!isFinished ? (
                          <button
                            onClick={() => handleOpenCompleteModal(order)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Proses Selesai
                          </button>
                        ) : (
                          <div className="text-slate-400 dark:text-slate-500 text-[10px]">Tgl: {order.completedAt}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOM Formulations Tab */}
      {subTab === "bom" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-heading">Daftar Struktur Komposisi Material (BOM)</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Standar formula takaran pengeluaran bahan per satu unit produk jadi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {finishedGoods.map(fg => {
              const formula = bomFormulations[fg.id] || [];
              return (
                <div key={fg.id} className="fogo-card p-6 space-y-4 bg-white dark:bg-slate-900">
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase font-heading">{fg.name}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase mt-0.5">KODE FG: {fg.code} | HPP STOK: Rp {fg.cost.toLocaleString()}</p>
                    </div>
                    <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      1 Unit Target
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <h5 className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-bold tracking-wider font-heading">KOMPOSISI BAHAN BAKU:</h5>
                    <div className="divide-y divide-slate-100 dark:divide-slate-850">
                      {formula.map((mat, i) => (
                        <div key={i} className="py-2 flex justify-between text-xs">
                          <span className="text-slate-750 dark:text-slate-300 font-semibold">{mat.name}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{mat.ratio} {mat.unit.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create Work Order */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="BUAT PERINTAH KERJA MANUFAKTUR BARU"
        size="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-5 text-slate-700 dark:text-slate-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Tanggal Mulai Produksi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Pilih Produk Hasil Jadi</label>
              <select
                required
                value={targetItemId}
                onChange={(e) => setTargetItemId(e.target.value)}
                className="fogo-input w-full px-3 py-2 text-xs font-sans"
              >
                <option value="">Pilih...</option>
                {finishedGoods.map(fg => (
                  <option key={fg.id} value={fg.id}>{fg.name.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Jumlah Target Produksi (Pcs)</label>
            <input
              type="number"
              min={1}
              required
              value={targetQty}
              onChange={(e) => setTargetQty(Number(e.target.value))}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            />
          </div>

          {targetItemId && (
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 tracking-wider uppercase font-heading">
                Verifikasi Bahan Baku di Gudang (BOM Estimated)
              </h5>
              
              <div className="fogo-card overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                      <th className="p-3">Bahan Baku</th>
                      <th className="p-3 text-center">Dibutuhkan</th>
                      <th className="p-3 text-center">Stok Tersedia</th>
                      <th className="p-3 text-center">Kecukupan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {materials.map((mat, i) => (
                      <tr key={i} className={mat.sufficient ? "" : "bg-rose-500/[0.03] text-rose-600 dark:text-rose-400 font-semibold"}>
                        <td className="p-3 uppercase">{mat.name}</td>
                        <td className="p-3 text-center font-bold">{mat.qtyRequired} {mat.unit.toUpperCase()}</td>
                        <td className="p-3 text-center">{mat.availableStock} {mat.unit.toUpperCase()}</td>
                        <td className="p-3 text-center">
                          {mat.sufficient ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">CUKUP</span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 font-extrabold uppercase animate-pulse">KURANG!</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-xs text-red-650 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="fogo-btn-secondary px-4 py-2 text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!hasSufficientStock || !targetItemId}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                hasSufficientStock && targetItemId
                  ? "fogo-btn-primary cursor-pointer"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed"
              }`}
            >
              Mulai Produksi
            </button>
          </div>

        </form>
      </Modal>

      {/* Modal: Complete Production Order */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="KONFIRMASI BARANG JADI SIAP MASUK GUDANG"
        size="md"
      >
        <form onSubmit={handleCompleteOrder} className="space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Hasil Jadi Aktual (Pcs)</label>
            <input
              type="number"
              min={1}
              required
              value={producedQty}
              onChange={(e) => setProducedQty(e.target.value)}
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
              onClick={() => setIsCompleteModalOpen(false)}
              className="fogo-btn-secondary px-4 py-2 text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="fogo-btn-primary px-5 py-2 text-xs cursor-pointer"
            >
              Selesaikan
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
