import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Plus, Trash, AlertCircle, Check } from "lucide-react";
import Modal from "../components/Modal";

export default function Akuntansi() {
  const {
    accounts,
    journalEntries,
    addJournalEntry
  } = useContext(AppContext);

  const [subTab, setSubTab] = useState("jurnal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [journalFilter, setJournalFilter] = useState("all"); // "all", "general", "adjusting"

  // Form State for New Journal Entry
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [details, setDetails] = useState([
    { accountCode: "", debit: 0, credit: 0 },
    { accountCode: "", debit: 0, credit: 0 }
  ]);
  const [errorMsg, setErrorMsg] = useState("");

  // General Ledger state
  const [selectedAccCode, setSelectedAccCode] = useState(accounts[0]?.code || "");

  const handleAddDetailRow = () => {
    setDetails(prev => [...prev, { accountCode: "", debit: 0, credit: 0 }]);
  };

  const handleRemoveDetailRow = (index) => {
    if (details.length <= 2) return;
    setDetails(prev => prev.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index, field, value) => {
    setDetails(prev => {
      const copy = [...prev];
      if (field === "accountCode") {
        copy[index].accountCode = value;
      } else {
        copy[index][field] = Number(value);
      }
      return copy;
    });
  };

  const totalDebit = details.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredit = details.reduce((sum, item) => sum + (item.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleSubmitJournal = (e) => {
    e.preventDefault();
    if (!isBalanced) {
      setErrorMsg("Total Debit dan Total Kredit harus seimbang!");
      return;
    }
    if (!reference || !description) {
      setErrorMsg("Referensi dan Deskripsi transaksi wajib diisi!");
      return;
    }
    if (details.some(d => !d.accountCode)) {
      setErrorMsg("Semua baris jurnal harus memiliki akun yang valid!");
      return;
    }

    try {
      addJournalEntry(date, reference, description, details, isAdjusting);
      setDate(new Date().toISOString().substring(0, 10));
      setReference("");
      setDescription("");
      setIsAdjusting(false);
      setDetails([
        { accountCode: "", debit: 0, credit: 0 },
        { accountCode: "", debit: 0, credit: 0 }
      ]);
      setErrorMsg("");
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const getBukuBesarData = () => {
    const selectedAcc = accounts.find(a => a.code === selectedAccCode);
    const firstChar = selectedAccCode.charAt(0);
    const isAssetOrExpense = ["1", "5", "6"].includes(firstChar);

    const ledgerRows = [];
    let balance = 0;

    const sortedJournals = [...journalEntries].reverse();

    sortedJournals.forEach(jr => {
      jr.details.forEach(det => {
        if (det.accountCode === selectedAccCode) {
          if (isAssetOrExpense) {
            balance += (det.debit - det.credit);
          } else {
            balance += (det.credit - det.debit);
          }
          ledgerRows.push({
            date: jr.date,
            reference: jr.reference,
            description: jr.description,
            debit: det.debit,
            credit: det.credit,
            balance
          });
        }
      });
    });

    return {
      account: selectedAcc,
      rows: ledgerRows
    };
  };

  const { account: activeLedgerAccount, rows: ledgerRows } = getBukuBesarData();

  const getTrialBalanceData = () => {
    const balanceMap = {};
    accounts.forEach(acc => {
      balanceMap[acc.code] = { name: acc.name, code: acc.code, debitSum: 0, creditSum: 0 };
    });

    journalEntries.forEach(jr => {
      jr.details.forEach(det => {
        if (balanceMap[det.accountCode]) {
          balanceMap[det.accountCode].debitSum += det.debit;
          balanceMap[det.accountCode].creditSum += det.credit;
        }
      });
    });

    let totalTBdebit = 0;
    let totalTBcredit = 0;

    const list = Object.values(balanceMap).map(acc => {
      const firstChar = acc.code.charAt(0);
      const isAssetOrExpense = ["1", "5", "6"].includes(firstChar);
      let debit = 0;
      let credit = 0;

      if (isAssetOrExpense) {
        const net = acc.debitSum - acc.creditSum;
        if (net >= 0) debit = net;
        else credit = Math.abs(net);
      } else {
        const net = acc.creditSum - acc.debitSum;
        if (net >= 0) credit = net;
        else debit = Math.abs(net);
      }

      totalTBdebit += debit;
      totalTBcredit += credit;

      return {
        ...acc,
        debit,
        credit
      };
    }).filter(acc => acc.debit > 0 || acc.credit > 0);

    return { list, totalTBdebit, totalTBcredit };
  };

  const { list: tbList, totalTBdebit, totalTBcredit } = getTrialBalanceData();

  return (
    <div className="space-y-6 animate-fade-in p-6">
      
      {/* Sub-tabs header */}
      <div className="flex border-b border-slate-100 dark:border-[#222533] justify-between items-center flex-wrap gap-4">
        <div className="flex space-x-1">
          {["jurnal", "bukubesar", "trialbalance", "coa"].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-5 py-3 text-xs font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
                subTab === tab
                  ? "border-brand-blue text-brand-blue font-extrabold"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              {tab === "jurnal" && "Jurnal"}
              {tab === "bukubesar" && "General Ledger"}
              {tab === "trialbalance" && "Neraca Saldo"}
              {tab === "coa" && "Daftar Akun (COA)"}
            </button>
          ))}
        </div>

        <div className="pb-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer"
          >
            + New Journal Entry
          </button>
        </div>
      </div>

      {/* Jurnal Umum Tab */}
      {subTab === "jurnal" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Daftar Buku Jurnal</h3>
              <p className="text-[10px] text-slate-400 font-medium">Buku pencatatan jurnal transaksi harian</p>
            </div>
            
            {/* Filter buttons */}
            <div className="flex bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-100 dark:border-[#222533] max-w-max">
              {[
                { id: "all", label: "Semua" },
                { id: "general", label: "Jurnal Umum" },
                { id: "adjusting", label: "Jurnal Penyesuaian" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setJournalFilter(f.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    journalFilter === f.id
                      ? "bg-brand-blue text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="fogo-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-400 font-semibold border-b border-slate-100 dark:border-[#222533]">
                  <tr>
                    <th className="p-4 w-32">Tanggal</th>
                    <th className="p-4 w-48">Referensi</th>
                    <th className="p-4">Deskripsi / Rekening Akun</th>
                    <th className="p-4 text-right w-44">Debet (Rp)</th>
                    <th className="p-4 text-right w-44">Kredit (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-[#222533]/30">
                  {journalEntries
                    .filter(entry => {
                      if (journalFilter === "general") return !entry.isAdjusting;
                      if (journalFilter === "adjusting") return entry.isAdjusting;
                      return true;
                    })
                    .map(entry => (
                      <React.Fragment key={entry.id}>
                        {/* Master Row */}
                        <tr className="bg-slate-50/50 dark:bg-slate-900/10 font-bold text-brand-navy dark:text-slate-200">
                          <td className="p-4 font-mono">{entry.date}</td>
                          <td className="p-4 font-mono text-brand-blue flex items-center gap-1.5">
                            {entry.reference}
                            {entry.isAdjusting && (
                              <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-500 text-[8px] font-black rounded-md tracking-wider">
                                ADJUSTING
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-heading text-xs" colSpan={3}>{entry.description}</td>
                        </tr>
                        {/* Details Rows */}
                        {entry.details.map((detail, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                            <td className="p-2"></td>
                            <td className="p-2"></td>
                            <td className="p-3 pl-8 flex items-center gap-1.5">
                              <span className="text-slate-400">[{detail.accountCode}]</span>
                              <span className={`font-sans font-semibold ${detail.credit > 0 ? "pl-8 text-slate-500 italic" : "text-brand-navy dark:text-white"}`}>{detail.accountName}</span>
                            </td>
                            <td className="p-3 text-right font-semibold">
                              {detail.debit > 0 ? detail.debit.toLocaleString() : "-"}
                            </td>
                            <td className="p-3 text-right font-semibold">
                              {detail.credit > 0 ? detail.credit.toLocaleString() : "-"}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Buku Besar Tab */}
      {subTab === "bukubesar" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Ledger Pembantu</h3>
              <p className="text-[10px] text-slate-400 font-medium">Mutasi debit/kredit per pos rekening</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">PILIH REKENING:</span>
              <select
                value={selectedAccCode}
                onChange={(e) => setSelectedAccCode(e.target.value)}
                className="fogo-input px-3.5 py-1.5 text-xs font-bold text-[#0f172a]"
              >
                {accounts.map(acc => (
                  <option key={acc.code} value={acc.code}>
                    [{acc.code}] {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="fogo-card p-5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nama Rekening</span>
              <h4 className="text-sm font-bold text-brand-navy dark:text-white font-sans">{activeLedgerAccount?.name}</h4>
            </div>
            <div className="fogo-card p-5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Akun</span>
              <h4 className="text-sm font-bold text-brand-navy dark:text-white font-sans">{activeLedgerAccount?.category}</h4>
            </div>
            <div className="fogo-card p-5 space-y-1 border-l-4 border-brand-blue">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Saldo Terkini</span>
              <h4 className="text-base font-black text-brand-blue font-mono">
                Rp {activeLedgerAccount?.balance.toLocaleString()}
              </h4>
            </div>
          </div>

          <div className="fogo-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-400 font-semibold border-b border-slate-100 dark:border-[#222533]">
                <tr>
                  <th className="p-4 w-32">Tanggal</th>
                  <th className="p-4 w-36">No. Ref</th>
                  <th className="p-4">Keterangan</th>
                  <th className="p-4 text-right w-36">Debet (Rp)</th>
                  <th className="p-4 text-right w-36">Kredit (Rp)</th>
                  <th className="p-4 text-right w-40">Saldo (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-[#222533]/30 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {ledgerRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                      Belum ada mutasi tercatat pada akun ini.
                    </td>
                  </tr>
                ) : (
                  ledgerRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/5">
                      <td className="p-4">{row.date}</td>
                      <td className="p-4 text-brand-blue font-bold">{row.reference}</td>
                      <td className="p-4 font-sans text-brand-navy dark:text-white font-semibold">{row.description}</td>
                      <td className="p-4 text-right">{row.debit > 0 ? row.debit.toLocaleString() : "-"}</td>
                      <td className="p-4 text-right">{row.credit > 0 ? row.credit.toLocaleString() : "-"}</td>
                      <td className="p-4 text-right font-black text-brand-blue">Rp {row.balance.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trial Balance Tab */}
      {subTab === "trialbalance" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Neraca Saldo (Trial Balance)</h3>
            <p className="text-[10px] text-slate-400 font-medium">Buku saldo akhir penutupan debet & kredit</p>
          </div>

          <div className="fogo-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-400 font-semibold border-b border-slate-100 dark:border-[#222533]">
                <tr>
                  <th className="p-4 w-36">Kode Akun</th>
                  <th className="p-4">Nama Rekening Perkiraan</th>
                  <th className="p-4 text-right w-44">Debet (Rp)</th>
                  <th className="p-4 text-right w-44">Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-[#222533]/30 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {tbList.map(acc => (
                  <tr key={acc.code} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/5">
                    <td className="p-4 font-bold text-brand-blue">{acc.code}</td>
                    <td className="p-4 font-sans font-bold text-brand-navy dark:text-white">{acc.name}</td>
                    <td className="p-4 text-right">{acc.debit > 0 ? acc.debit.toLocaleString() : "-"}</td>
                    <td className="p-4 text-right">{acc.credit > 0 ? acc.credit.toLocaleString() : "-"}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-[#f8fafc] dark:bg-[#0b0f19]/60 font-bold text-brand-navy dark:text-white border-t border-slate-100 dark:border-[#222533]">
                  <td className="p-4 font-heading text-xs uppercase text-center" colSpan={2}>Jumlah Neraca Saldo</td>
                  <td className="p-4 text-right font-mono font-black text-brand-blue">
                    Rp {totalTBdebit.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono font-black text-brand-blue">
                    Rp {totalTBcredit.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Balanced Status Panel */}
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
            Math.abs(totalTBdebit - totalTBcredit) < 0.01
              ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-400"
          }`}>
            <span className="text-xs font-bold flex items-center gap-1.5 uppercase">
              {Math.abs(totalTBdebit - totalTBcredit) < 0.01
                ? "✓ Neraca Seimbang (Balanced) - Pembukuan beroperasi normal."
                : "⚠ Jurnal belum seimbang. Mohon periksa kembali detail debit/kredit."}
            </span>
          </div>
        </div>
      )}

      {/* Chart of Accounts Tab */}
      {subTab === "coa" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-brand-navy dark:text-white font-heading">Daftar Akun (Chart of Accounts)</h3>
            <p className="text-[10px] text-slate-400 font-medium">Klasifikasi perkiraan pembukuan PT. Catur Reka Pilarindo</p>
          </div>

          <div className="fogo-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-400 font-semibold border-b border-slate-100 dark:border-[#222533]">
                  <tr>
                    <th className="p-4 w-32">Kode Akun</th>
                    <th className="p-4">Nama Rekening Perkiraan</th>
                    <th className="p-4 w-48">Kategori Perkiraan</th>
                    <th className="p-4 text-right w-48">Saldo Terkini (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-[#222533]/30 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  {accounts.map(acc => {
                    return (
                      <tr key={acc.code} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/5">
                        <td className="p-4 font-bold text-brand-blue">{acc.code}</td>
                        <td className="p-4 font-sans font-bold text-brand-navy dark:text-white">{acc.name}</td>
                        <td className="p-4 font-sans text-slate-400">{acc.category}</td>
                        <td className="p-4 text-right font-black text-brand-navy dark:text-white">
                          Rp {acc.balance.toLocaleString()}
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

      {/* Modal: Input Jurnal Umum Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Input Jurnal Transaksi Baru"
        size="lg"
      >
        <form onSubmit={handleSubmitJournal} className="space-y-5 text-slate-600 dark:text-slate-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full fogo-input px-3.5 py-2.5 text-xs font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">No. Referensi Dokumen</label>
              <input
                type="text"
                required
                placeholder="CONTOH: JR-001, OPR-10"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                className="w-full fogo-input px-3.5 py-2.5 text-xs font-semibold uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Keterangan Deskripsi Jurnal</label>
            <input
              type="text"
              required
              placeholder="CONTOH: BIAYA OPERASIONAL INTERNET BULAN MEI"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full fogo-input px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>

          <div className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              id="isAdjustingCheckbox"
              checked={isAdjusting}
              onChange={(e) => setIsAdjusting(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isAdjustingCheckbox" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              Tandai sebagai Jurnal Penyesuaian (Adjusting Entry)
            </label>
          </div>

          {/* Double Entry Lines */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#222533] pb-2">
              <span className="text-xs font-bold text-brand-navy dark:text-white uppercase tracking-wider">Baris Akun Pembukuan</span>
              <button
                type="button"
                onClick={handleAddDetailRow}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-brand-blue text-[10px] font-bold rounded-xl border border-slate-100 dark:border-transparent transition-all cursor-pointer"
              >
                + Tambah Akun
              </button>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {details.map((row, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    required
                    value={row.accountCode}
                    onChange={(e) => handleDetailChange(index, "accountCode", e.target.value)}
                    className="flex-1 fogo-input px-3 py-2 text-xs font-bold text-[#0f172a]"
                  >
                    <option value="">Pilih Pos Akun...</option>
                    {accounts.map(a => (
                      <option key={a.code} value={a.code}>
                        [{a.code}] {a.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={0}
                    placeholder="Debet"
                    value={row.debit || ""}
                    onChange={(e) => handleDetailChange(index, "debit", e.target.value)}
                    className="w-28 fogo-input px-3 py-2 text-xs font-mono text-right"
                    disabled={row.credit > 0}
                  />

                  <input
                    type="number"
                    min={0}
                    placeholder="Kredit"
                    value={row.credit || ""}
                    onChange={(e) => handleDetailChange(index, "credit", e.target.value)}
                    className="w-28 fogo-input px-3 py-2 text-xs font-mono text-right"
                    disabled={row.debit > 0}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveDetailRow(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    disabled={details.length <= 2}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Panel */}
          <div className="p-4 bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-[#222533] rounded-2xl text-xs flex justify-between font-mono font-bold">
            <div className="space-y-1 text-slate-400">
              <div>Total Debet: <span className="text-brand-navy dark:text-white">Rp {totalDebit.toLocaleString()}</span></div>
              <div>Total Kredit: <span className="text-brand-navy dark:text-white">Rp {totalCredit.toLocaleString()}</span></div>
            </div>
            <div className="text-right flex flex-col justify-center">
              {isBalanced ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 uppercase">
                  ✓ Balance (Seimbang)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5 uppercase animate-pulse">
                  ⚠ Unbalanced
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 text-xs text-red-600 dark:text-red-300 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4.5 py-2.5 fogo-btn-secondary text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isBalanced}
              className={`px-5 py-2.5 text-xs ${
                isBalanced
                  ? "fogo-btn-primary cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Posting Jurnal
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
