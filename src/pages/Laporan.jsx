import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { FileText, Download, Printer, CheckCircle, Calendar } from "lucide-react";

export default function Laporan() {
  const {
    accounts,
    cashBankTransactions
  } = useContext(AppContext);

  const [reportType, setReportType] = useState("labarugi");
  const [period, setPeriod] = useState("Mei - Juni 2026");
  const [downloading, setDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleDownload = (format) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setToastMessage(`Laporan berhasil diekspor ke format ${format}! File disimpan di folder Unduhan.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const getLabaRugi = () => {
    const pendapatan = accounts.find(a => a.code === "4101")?.balance || 0;
    const hpp = accounts.find(a => a.code === "5101")?.balance || 0;
    const gaji = accounts.find(a => a.code === "6101")?.balance || 0;
    const listrik = accounts.find(a => a.code === "6102")?.balance || 0;
    const bebanPajak = accounts.find(a => a.code === "6201")?.balance || 0;

    const labaKotor = pendapatan - hpp;
    const totalBebanOperasional = gaji + listrik;
    const labaBersihSebelumPajak = labaKotor - totalBebanOperasional;
    const labaBersih = labaBersihSebelumPajak - bebanPajak;

    return {
      pendapatan,
      hpp,
      labaKotor,
      gaji,
      listrik,
      totalBebanOperasional,
      labaBersihSebelumPajak,
      bebanPajak,
      labaBersih
    };
  };

  const lr = getLabaRugi();

  const getNeraca = () => {
    const kas = accounts.find(a => a.code === "1101")?.balance || 0;
    const bank = accounts.find(a => a.code === "1102")?.balance || 0;
    const piutang = accounts.find(a => a.code === "1103")?.balance || 0;
    const rawMaterial = accounts.find(a => a.code === "1201")?.balance || 0;
    const finishedGoods = accounts.find(a => a.code === "1202")?.balance || 0;
    const ppnMasukan = accounts.find(a => a.code === "1301")?.balance || 0;
    const peralatan = accounts.find(a => a.code === "1601")?.balance || 0;

    const totalAset = kas + bank + piutang + rawMaterial + finishedGoods + ppnMasukan + peralatan;

    const hutang = accounts.find(a => a.code === "2101")?.balance || 0;
    const ppnKeluaran = accounts.find(a => a.code === "2201")?.balance || 0;
    const pph21 = accounts.find(a => a.code === "2202")?.balance || 0;

    const totalKewajiban = hutang + ppnKeluaran + pph21;

    const modal = accounts.find(a => a.code === "3101")?.balance || 0;
    const saldoLaba = accounts.find(a => a.code === "3201")?.balance || 0;
    const totalEkuitas = modal + saldoLaba + lr.labaBersih;

    const totalPasiva = totalKewajiban + totalEkuitas;

    return {
      kas, bank, piutang, rawMaterial, finishedGoods, ppnMasukan, peralatan, totalAset,
      hutang, ppnKeluaran, pph21, totalKewajiban,
      modal, saldoLaba, totalEkuitas, totalPasiva
    };
  };

  const neraca = getNeraca();

  const getArusKas = () => {
    let opsMasuk = 0;
    let opsKeluar = 0;
    let finMasuk = 0;
    let finKeluar = 0;

    cashBankTransactions.forEach(t => {
      if (t.type === "Masuk") {
        if (t.category === "Pelunasan Piutang" || t.category === "Pendapatan Lain") {
          opsMasuk += t.amount;
        } else if (t.category === "Investasi Modal") {
          finMasuk += t.amount;
        }
      } else if (t.type === "Keluar") {
        if (t.category === "Pelunasan Hutang" || t.category === "Beban Operasional" || t.category === "Beban Gaji") {
          opsKeluar += t.amount;
        } else if (t.category === "Beban Pajak") {
          finKeluar += t.amount;
        }
      }
    });

    const netOps = opsMasuk - opsKeluar;
    const netFin = finMasuk - finKeluar;
    const netChange = netOps + netFin;
    const endingCash = neraca.kas + neraca.bank;
    const startingCash = endingCash - netChange;

    return {
      opsMasuk,
      opsKeluar,
      netOps,
      finMasuk,
      finKeluar,
      netFin,
      netChange,
      startingCash,
      endingCash
    };
  };

  const cf = getArusKas();

  return (
    <div className="space-y-6 animate-fade-in p-6 min-h-screen">
      
      {/* Search Filter Header */}
      <div className="fogo-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase font-heading tracking-wider">Periode Tahun Buku</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="fogo-input px-3.5 py-1.5 text-xs font-sans mt-0.5"
            >
              <option value="Mei - Juni 2026">Mei - Juni 2026 (SEM-I)</option>
              <option value="Semua">Tahun Anggaran 2026</option>
            </select>
          </div>
        </div>

        {/* Exporter triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload("PDF")}
            disabled={downloading}
            className="fogo-btn-secondary px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {downloading ? "Mengekspor..." : "Unduh PDF"}
          </button>
          <button
            onClick={() => handleDownload("Excel")}
            disabled={downloading}
            className="fogo-btn-primary px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" /> {downloading ? "Mengunduh..." : "Cetak Excel"}
          </button>
        </div>
      </div>

      {/* Selector tab list */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {["labarugi", "neraca", "aruskas"].map(tab => (
          <button
            key={tab}
            onClick={() => setReportType(tab)}
            className={`px-4 py-3 text-xs font-bold tracking-wider border-b-2 transition-all uppercase font-heading cursor-pointer ${
              reportType === tab
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
            }`}
          >
            {tab === "labarugi" && "Laporan Laba Rugi"}
            {tab === "neraca" && "Laporan Neraca"}
            {tab === "aruskas" && "Arus Kas (Direct)"}
          </button>
        ))}
      </div>

      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold font-heading uppercase">{toastMessage}</span>
        </div>
      )}

      {/* Render selected reports */}
      <div className="fogo-card p-6 md:p-8 space-y-6 max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        
        {/* Report Header Logo */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white font-heading tracking-wider uppercase">
              PT. CATUR REKA PILARINDO
            </h2>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono tracking-wider uppercase mt-0.5">
              {reportType === "labarugi" && "LAPORAN LABA RUGI KOMPREHENSIF"}
              {reportType === "neraca" && "LAPORAN POSISI KEUANGAN (NERACA)"}
              {reportType === "aruskas" && "LAPORAN ARUS KAS METODE LANGSUNG"}
            </p>
          </div>
          <div className="text-right text-xs">
            <div className="text-[10px] text-slate-400 dark:text-slate-550 uppercase tracking-wider">Tahun Anggaran:</div>
            <div className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">{period}</div>
          </div>
        </div>

        {/* 1. Laba Rugi Render */}
        {reportType === "labarugi" && (
          <div className="space-y-5 text-xs font-sans">
            {/* Pendapatan */}
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white uppercase font-heading text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">PENDAPATAN PENJUALAN</h4>
              <div className="flex justify-between py-1.5 text-slate-600 dark:text-slate-350">
                <span className="font-semibold uppercase">Pendapatan Operasional Barang Jadi</span>
                <span className="font-bold text-slate-850 dark:text-white">Rp {lr.pendapatan.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                <span>TOTAL PENDAPATAN OPERASIONAL</span>
                <span>Rp {lr.pendapatan.toLocaleString()}</span>
              </div>
            </div>

            {/* HPP */}
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white uppercase font-heading text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">HARGA POKOK PENJUALAN (HPP)</h4>
              <div className="flex justify-between py-1.5 text-rose-600 dark:text-rose-400">
                <span className="font-semibold uppercase">Beban Harga Pokok Penjualan</span>
                <span>(Rp {lr.hpp.toLocaleString()})</span>
              </div>
              <div className="flex justify-between border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                <span>TOTAL HARGA POKOK PENJUALAN</span>
                <span>(Rp {lr.hpp.toLocaleString()})</span>
              </div>
            </div>

            {/* Laba Kotor */}
            <div className="flex justify-between bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl font-bold text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-800">
              <span className="font-heading text-[10px] tracking-wider uppercase">LABA KOTOR (GROSS PROFIT)</span>
              <span className="text-base font-bold">Rp {lr.labaKotor.toLocaleString()}</span>
            </div>

            {/* Beban Operasional */}
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white uppercase font-heading text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">BEBAN OPERASIONAL</h4>
              <div className="flex justify-between py-1.5 text-slate-650 dark:text-slate-350">
                <span className="font-semibold uppercase">Beban Gaji Karyawan</span>
                <span className="font-semibold text-slate-850 dark:text-white">Rp {lr.gaji.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-650 dark:text-slate-350">
                <span className="font-semibold uppercase">Beban Listrik, Air & Telepon</span>
                <span className="font-semibold text-slate-850 dark:text-white">Rp {lr.listrik.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                <span>TOTAL BIAYA OPERASIONAL</span>
                <span>(Rp {lr.totalBebanOperasional.toLocaleString()})</span>
              </div>
            </div>

            {/* Laba Bersih sebelum Pajak */}
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-2 font-bold text-slate-800 dark:text-slate-200">
              <span>LABA BERSIH SEBELUM PERPAJAKAN</span>
              <span>Rp {lr.labaBersihSebelumPajak.toLocaleString()}</span>
            </div>

            {/* Beban Pajak */}
            <div className="flex justify-between py-1.5 text-rose-600 dark:text-rose-400">
              <span className="font-semibold uppercase">Beban Pajak Penghasilan (PPh Badan)</span>
              <span>(Rp {lr.bebanPajak.toLocaleString()})</span>
            </div>

            {/* Laba Bersih */}
            <div className="flex justify-between bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <span className="font-heading text-xs tracking-wider uppercase font-black">LABA BERSIH BERJALAN (NET PROFIT)</span>
              <span className="text-lg font-bold">Rp {lr.labaBersih.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* 2. Neraca Render (Double block layout) */}
        {reportType === "neraca" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
            
            {/* Assets (Kiri) */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white border border-slate-100 dark:border-slate-800 pb-2 pt-2 text-center uppercase tracking-wider bg-slate-50 dark:bg-slate-950/40 rounded-xl font-heading text-[10px]">AKTIVA (ASET)</h4>
              
              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider text-[9px] font-sans">Aset Lancar</h5>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Kas Utama</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.kas.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Bank BCA</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.bank.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Piutang Usaha</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.piutang.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Persediaan Bahan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.rawMaterial.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Persediaan Jadi</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.finishedGoods.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">PPN Masukan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.ppnMasukan.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider text-[9px] font-sans">Aset Tetap</h5>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Peralatan Pabrik</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.peralatan.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl font-bold text-emerald-600 dark:text-emerald-450 border border-slate-100 dark:border-slate-800">
                <span className="font-heading tracking-wider uppercase text-[10px]">TOTAL AKTIVA</span>
                <span className="font-bold">Rp {neraca.totalAset.toLocaleString()}</span>
              </div>
            </div>

            {/* Liabilities & Equity (Kanan) */}
            <div className="space-y-6">
              
              {/* Kewajiban */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white border border-slate-100 dark:border-slate-800 pb-2 pt-2 text-center uppercase tracking-wider bg-slate-50 dark:bg-slate-950/40 rounded-xl font-heading text-[10px]">PASIVA (KEWAJIBAN & EKUITAS)</h4>
                
                <div className="space-y-1.5">
                  <h5 className="font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider text-[9px] font-sans">Kewajiban Jangka Pendek</h5>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                    <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Hutang Usaha</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.hutang.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                    <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">PPN Keluaran</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.ppnKeluaran.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                    <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Hutang PPh 21</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.pph21.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 py-1.5 font-bold text-slate-700 dark:text-slate-300">
                    <span className="uppercase">Total Kewajiban</span>
                    <span>Rp {neraca.totalKewajiban.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Ekuitas */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider text-[9px] font-sans">Ekuitas Modal</h5>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Modal Setor Saham</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.modal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1">
                  <span className="font-semibold uppercase text-slate-500 dark:text-slate-400">Laba Ditahan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {neraca.saldoLaba.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 py-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="font-semibold uppercase">Laba Tahun Berjalan</span>
                  <span>Rp {lr.labaBersih.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 py-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <span className="uppercase">Total Ekuitas</span>
                  <span>Rp {neraca.totalEkuitas.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between bg-blue-50 dark:bg-blue-950/30 p-3.5 rounded-xl font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                <span className="font-heading tracking-wider uppercase text-[10px]">TOTAL PASIVA</span>
                <span className="font-bold">Rp {neraca.totalPasiva.toLocaleString()}</span>
              </div>
            </div>

          </div>
        )}

        {/* 3. Arus Kas Render */}
        {reportType === "aruskas" && (
          <div className="space-y-5 text-xs font-sans">
            {/* Operasional */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-white uppercase font-heading text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">A. ARUS KAS DARI AKTIVITAS OPERASIONAL</h4>
              <div className="flex justify-between py-1 text-slate-655 dark:text-slate-350">
                <span className="font-semibold uppercase text-slate-500">Penerimaan Pelunasan Faktur Pelanggan</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Rp {cf.opsMasuk.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-600 dark:text-rose-400">
                <span className="font-semibold uppercase">Pengeluaran Kas ke Pemasok, Karyawan & Ops</span>
                <span className="font-bold">(Rp {cf.opsKeluar.toLocaleString()})</span>
              </div>
              <div className="flex justify-between border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                <span>Arus Kas Bersih dari Aktivitas Operasional</span>
                <span>Rp {cf.netOps.toLocaleString()}</span>
              </div>
            </div>

            {/* Pendanaan */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-white uppercase font-heading text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">B. ARUS KAS DARI AKTIVITAS PENDANAAN</h4>
              <div className="flex justify-between py-1 text-slate-655 dark:text-slate-350">
                <span className="font-semibold uppercase text-slate-500">Penyetoran Modal Saham Awal</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Rp {cf.finMasuk.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-600 dark:text-rose-400">
                <span className="font-semibold uppercase">Penyetoran Pajak (PPN/PPh)</span>
                <span className="font-bold">(Rp {cf.finKeluar.toLocaleString()})</span>
              </div>
              <div className="flex justify-between border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                <span>Arus Kas Bersih dari Aktivitas Pendanaan</span>
                <span>Rp {cf.netFin.toLocaleString()}</span>
              </div>
            </div>

            {/* Net Change */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between py-1.5 font-bold text-slate-800 dark:text-slate-200">
                <span>Kenaikan (Penurunan) Kas Bersih Periode</span>
                <span className={cf.netChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-605 dark:text-rose-400"}>
                  Rp {cf.netChange.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-500">
                <span>Saldo Kas Awal Periode</span>
                <span>Rp {cf.startingCash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-blue-55/60 dark:bg-blue-950/30 p-4 rounded-2xl font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                <span className="font-heading text-xs tracking-wider uppercase font-black">SALDO KAS & BANK AKHIR PERIODE</span>
                <span className="text-base font-bold">Rp {cf.endingCash.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
