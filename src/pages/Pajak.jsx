import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { CreditCard, Check, AlertCircle } from "lucide-react";
import Modal from "../components/Modal";

export default function Pajak() {
  const {
    taxTransactions,
    accounts,
    addTaxPayment
  } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaxId, setSelectedTaxId] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().substring(0, 10));
  const [paymentAccount, setPaymentAccount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const cashAccounts = accounts.filter(acc => ["1101", "1102"].includes(acc.code));

  const ppnKeluaran = taxTransactions
    .filter(t => t.taxType === "PPN Keluaran")
    .reduce((sum, t) => sum + t.taxAmount, 0);

  const ppnMasukan = taxTransactions
    .filter(t => t.taxType === "PPN Masukan")
    .reduce((sum, t) => sum + t.taxAmount, 0);

  const netPpn = ppnKeluaran - ppnMasukan;

  const totalPaidTax = taxTransactions
    .filter(t => t.status === "Sudah Dibayar")
    .reduce((sum, t) => sum + t.taxAmount, 0);

  const totalOutstandingTax = taxTransactions
    .filter(t => t.status === "Belum Bayar")
    .reduce((sum, t) => sum + t.taxAmount, 0);

  const handleOpenPayModal = (id) => {
    setSelectedTaxId(id);
    setPaymentAccount(cashAccounts[1]?.code || ""); // default BCA
    setIsModalOpen(true);
  };

  const handlePayTax = (e) => {
    e.preventDefault();
    const tx = taxTransactions.find(t => t.id === selectedTaxId);
    if (!tx) return;

    if (!paymentAccount) {
      setErrorMsg("Pilih kas/bank sumber dana!");
      return;
    }

    addTaxPayment({
      date: payDate,
      taxId: selectedTaxId,
      amount: tx.taxAmount,
      accountCode: paymentAccount
    });

    setErrorMsg("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 min-h-screen">
      
      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">NET PPN KURANG BAYAR</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              Rp {netPpn.toLocaleString()}
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">PPN KELUARAN - PPN MASUKAN</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-955/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
            TAX
          </div>
        </div>

        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">PAJAK BELUM DISELESAIKAN</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              Rp {totalOutstandingTax.toLocaleString()}
            </h3>
            <span className="text-[10px] text-orange-605 dark:text-orange-400 font-semibold uppercase block">
              HUTANG PAJAK BERJALAN
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-605 dark:text-orange-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="fogo-card p-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-heading">TOTAL PAJAK TERBAYAR</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-heading">
              Rp {totalPaidTax.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block uppercase">
              PAJAK SETOR KAS NEGARA
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tax Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="fogo-card p-6 flex flex-col justify-center space-y-1 bg-white dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block font-heading">TOTAL PPN MASUKAN (KREDIT PEMBELIAN)</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Rp {ppnMasukan.toLocaleString()}</div>
        </div>
        <div className="fogo-card p-6 flex flex-col justify-center space-y-1 bg-white dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block font-heading">TOTAL PPN KELUARAN (PUNGUTAN PENJUALAN)</span>
          <div className="text-lg font-bold text-blue-650 dark:text-blue-400">Rp {ppnKeluaran.toLocaleString()}</div>
        </div>
      </div>

      {/* Tax Transactions Ledger */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-heading">Daftar Transaksi Perpajakan</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Arsip transaksi perhitungan PPN Masukan & Keluaran sistem</p>
        </div>

        <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="fogo-table">
              <thead>
                <tr>
                  <th className="text-left">Tanggal</th>
                  <th className="text-left">Jenis Pajak</th>
                  <th className="text-left">Faktur Rujukan</th>
                  <th className="text-right">DPP Transaksi (Rp)</th>
                  <th className="text-right">Nilai Pajak (Rp)</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {taxTransactions.map((tx) => {
                  const isPaid = tx.status === "Sudah Dibayar" || tx.status === "Sudah Dikreditkan";
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-xs">{tx.date}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-850 dark:text-white uppercase">{tx.taxType}</td>
                      <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{tx.invoiceRef}</td>
                      <td className="px-4 py-3 text-right text-xs">Rp {tx.baseAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-xs font-bold text-slate-900 dark:text-white">Rp {tx.taxAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === "Sudah Dibayar" || tx.status === "Sudah Dikreditkan"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!isPaid ? (
                          <button
                            onClick={() => handleOpenPayModal(tx.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-755 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Setor Pajak
                          </button>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold">Matched</span>
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

      {/* Modal: Setor Pajak */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="KONFIRMASI PENYETORAN PAJAK MASUKAN/KELUARAN"
        size="md"
      >
        <form onSubmit={handlePayTax} className="space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Tanggal Penyetoran</label>
            <input
              type="date"
              required
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Kas / Bank Pembayar (Sumber Dana)</label>
            <select
              required
              value={paymentAccount}
              onChange={(e) => setPaymentAccount(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            >
              <option value="">Pilih...</option>
              {cashAccounts.map(acc => (
                <option key={acc.code} value={acc.code}>
                  [{acc.code}] {acc.name.toUpperCase()} - Rp {acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
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
              Setor Pajak
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
