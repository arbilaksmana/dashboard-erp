import React, { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Page imports
import Dashboard from "./pages/Dashboard";
import Akuntansi from "./pages/Akuntansi";
import KasBank from "./pages/KasBank";
import Penjualan from "./pages/Penjualan";
import Pembelian from "./pages/Pembelian";
import Persediaan from "./pages/Persediaan";
import Produksi from "./pages/Produksi";
import Pajak from "./pages/Pajak";
import Laporan from "./pages/Laporan";
import HakAkses from "./pages/HakAkses";

export default function App() {
  const { currentTab, theme } = useContext(AppContext);

  // Router matching
  const renderPage = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard />;
      case "akuntansi":
        return <Akuntansi />;
      case "kasbank":
        return <KasBank />;
      case "penjualan":
        return <Penjualan />;
      case "pembelian":
        return <Pembelian />;
      case "persediaan":
        return <Persediaan />;
      case "produksi":
        return <Produksi />;
      case "pajak":
        return <Pajak />;
      case "laporan":
        return <Laporan />;
      case "hakakses":
        return <HakAkses />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex ${
      theme === "dark" ? "bg-[#0b0f19] text-slate-300" : "bg-slate-100 text-slate-800"
    }`}>
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation header */}
        <Header />

        {/* Dynamic page container */}
        <main className="flex-grow overflow-y-auto max-h-[calc(100vh-4rem)]">
          {renderPage()}
        </main>
      </div>

    </div>
  );
}
