import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Plus, Check, Search, ToggleLeft, ToggleRight } from "lucide-react";
import Modal from "../components/Modal";

export default function HakAkses() {
  const {
    users,
    activityLogs,
    addUser,
    toggleUserStatus
  } = useContext(AppContext);

  const [subTab, setSubTab] = useState("users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchLogQuery, setSearchLogQuery] = useState("");

  // Form State: Add User
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Staf Keuangan");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!username || !name) {
      setErrorMsg("Nama pengguna dan nama lengkap wajib diisi!");
      return;
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setErrorMsg("Username sudah digunakan!");
      return;
    }

    addUser({ username, name, role });
    setUsername("");
    setName("");
    setErrorMsg("");
    setIsModalOpen(false);
  };

  const permissionsMatrix = [
    { roleName: "Admin", access: { dashboard: true, akuntansi: true, kasbank: true, penjualan: true, pembelian: true, persediaan: true, produksi: true, pajak: true, laporan: true, hakakses: true } },
    { roleName: "Staf Keuangan", access: { dashboard: true, akuntansi: true, kasbank: true, penjualan: true, pembelian: true, persediaan: false, produksi: false, pajak: true, laporan: true, hakakses: false } },
    { roleName: "Staf Gudang", access: { dashboard: true, akuntansi: false, kasbank: false, penjualan: false, pembelian: false, persediaan: true, produksi: false, pajak: false, laporan: false, hakakses: false } },
    { roleName: "Staf Produksi", access: { dashboard: true, akuntansi: false, kasbank: false, penjualan: false, pembelian: false, persediaan: true, produksi: true, pajak: false, laporan: false, hakakses: false } },
    { roleName: "Manajemen", access: { dashboard: true, akuntansi: false, kasbank: false, penjualan: false, pembelian: false, persediaan: false, produksi: false, pajak: false, laporan: true, hakakses: false } }
  ];

  const modulesList = [
    { key: "dashboard", label: "DASHBOARD" },
    { key: "akuntansi", label: "AKUNTANSI" },
    { key: "kasbank", label: "KAS BANK" },
    { key: "penjualan", label: "PENJUALAN" },
    { key: "pembelian", label: "PEMBELIAN" },
    { key: "persediaan", label: "PERSEDIAAN" },
    { key: "produksi", label: "PRODUKSI" },
    { key: "pajak", label: "PERPAJAKAN" },
    { key: "laporan", label: "LAPORAN" },
    { key: "hakakses", label: "HAK AKSES" }
  ];

  const filteredLogs = activityLogs.filter(log => {
    return log.username.toLowerCase().includes(searchLogQuery.toLowerCase()) || 
           log.action.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
           log.detail.toLowerCase().includes(searchLogQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in p-6 min-h-screen">
      
      {/* Sub-tabs header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 justify-between items-end flex-wrap gap-4">
        <div className="flex gap-2">
          {["users", "permissions", "logs"].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-3 text-xs font-bold tracking-wider border-b-2 transition-all uppercase font-heading cursor-pointer ${
                subTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
              }`}
            >
              {tab === "users" && "Pengguna Sistem"}
              {tab === "permissions" && "Matriks Hak Akses"}
              {tab === "logs" && "Log Audit Audit Trail"}
            </button>
          ))}
        </div>

        {subTab === "users" && (
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => {
                setErrorMsg("");
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-755 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Pengguna Baru
          </button>
          </div>
        )}
      </div>

      {/* 1. Users registry Tab */}
      {subTab === "users" && (
        <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="fogo-table">
              <thead>
                <tr>
                  <th className="text-left w-28">ID User</th>
                  <th className="text-left w-36">Username</th>
                  <th className="text-left">Nama Lengkap Pengguna</th>
                  <th className="text-left w-44">Peran Wewenang</th>
                  <th className="text-center w-28">Status</th>
                  <th className="text-center w-36">Kontrol Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${!u.active ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400">{u.id}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{u.username}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-white uppercase">{u.name}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                      }`}>
                        {u.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`p-1.5 border transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold uppercase rounded-lg ${
                          u.active
                            ? "border-orange-200 dark:border-orange-900/50 bg-orange-50/50 hover:bg-orange-600 text-orange-655 hover:text-white"
                            : "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 hover:bg-emerald-600 text-emerald-600 hover:text-white"
                        }`}
                      >
                        {u.active ? (
                          <>
                            <ToggleRight className="w-4 h-4" /> Nonaktifkan
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" /> Aktifkan
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Matriks Hak Akses Tab */}
      {subTab === "permissions" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-heading">Matriks Hak Akses Per Modul</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Konfigurasi hak akses tampilan menu sidebar untuk setiap jabatan peran</p>
          </div>

          <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="fogo-table">
                <thead>
                  <tr>
                    <th className="text-left">Peran (Role)</th>
                    {modulesList.map(mod => (
                      <th key={mod.key} className="text-center text-[10px]">{mod.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {permissionsMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-slate-850 dark:text-white uppercase bg-slate-50/30 dark:bg-slate-950/10">{row.roleName}</td>
                      {modulesList.map(mod => {
                        const hasAccess = row.access[mod.key];
                        return (
                          <td key={mod.key} className="px-3 py-3 text-center">
                            {hasAccess ? (
                              <Check className="w-4 h-4 text-blue-650 dark:text-blue-400 mx-auto" />
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700 font-bold">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Audit Logs Tab */}
      {subTab === "logs" && (
        <div className="space-y-4">
          {/* Search Log Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari kata kunci dalam log audit (username, aktivitas, deskripsi)..."
              value={searchLogQuery}
              onChange={(e) => setSearchLogQuery(e.target.value)}
              className="fogo-input w-full pl-9 pr-4 py-2 text-xs font-sans"
            />
          </div>

          <div className="fogo-card overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="fogo-table">
                <thead>
                  <tr>
                    <th className="text-left w-40">Timestamp</th>
                    <th className="text-left w-32">User</th>
                    <th className="text-left w-36">Aktivitas</th>
                    <th className="text-left">Rincian Log Audit Trail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 font-medium">{log.timestamp}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-850 dark:text-white uppercase">{log.username}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-955/35 text-blue-700 dark:text-blue-400 font-bold uppercase">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-500 dark:text-slate-400">{log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="DAFTARKAN PENGGUNA SISTEM BARU"
        size="md"
      >
        <form onSubmit={handleSubmitUser} className="space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Username (Satu Kata)</label>
            <input
              type="text"
              required
              placeholder="Contoh: budisantoso"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Nama Lengkap Pengguna</label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso, ST"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">Peran Jabatan (Role)</label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="fogo-input w-full px-3 py-2 text-xs font-sans"
            >
              <option value="Staf Keuangan">STAF KEUANGAN</option>
              <option value="Staf Gudang">STAF GUDANG</option>
              <option value="Staf Produksi">STAF PRODUKSI</option>
              <option value="Manajemen">MANAJEMEN</option>
              <option value="Admin">ADMINISTRATOR</option>
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
              Buat Akun
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
