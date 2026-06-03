// Initial Mock Database for ERP PT. Catur Reka Pilarindo

export const initialUsers = [
  { id: "usr-1", username: "admin", name: "Administrator", role: "Admin", active: true },
  { id: "usr-2", username: "keuangan", name: "Siti Rahma", role: "Staf Keuangan", active: true },
  { id: "usr-3", username: "gudang", name: "Budi Santoso", role: "Staf Gudang", active: true },
  { id: "usr-4", username: "produksi", name: "Joko Widodo", role: "Staf Produksi", active: true },
  { id: "usr-5", username: "manajer", name: "Heri Cahyono", role: "Manajemen", active: true },
];

export const initialAccounts = [
  // Aset (1000 - 1999)
  { code: "1101", name: "Kas Utama", category: "Aset Lancar", balance: 15000000 },
  { code: "1102", name: "Bank BCA", category: "Aset Lancar", balance: 125000000 },
  { code: "1103", name: "Piutang Usaha", category: "Aset Lancar", balance: 24000000 },
  { code: "1201", name: "Persediaan Bahan Baku", category: "Aset Lancar", balance: 25000000 },
  { code: "1202", name: "Persediaan Barang Jadi", category: "Aset Lancar", balance: 14000000 },
  { code: "1301", name: "PPN Masukan", category: "Aset Lancar", balance: 2200000 },
  { code: "1601", name: "Peralatan Pabrik", category: "Aset Tetap", balance: 75000000 },
  
  // Kewajiban (2000 - 2999)
  { code: "2101", name: "Hutang Usaha", category: "Kewajiban Jangka Pendek", balance: 18000000 },
  { code: "2201", name: "PPN Keluaran", category: "Kewajiban Jangka Pendek", balance: 3500000 },
  { code: "2202", name: "Hutang PPh 21", category: "Kewajiban Jangka Pendek", balance: 850000 },
  
  // Ekuitas (3000 - 3999)
  { code: "3101", name: "Modal Saham", category: "Ekuitas", balance: 200000000 },
  { code: "3201", name: "Saldo Laba", category: "Ekuitas", balance: 57850000 },
  
  // Pendapatan (4000 - 4999)
  { code: "4101", name: "Pendapatan Penjualan", category: "Pendapatan", balance: 45000000 },
  
  // Beban (5000 - 6999)
  { code: "5101", name: "Harga Pokok Penjualan (HPP)", category: "Beban Operasional", balance: 27000000 },
  { code: "6101", name: "Beban Gaji Karyawan", category: "Beban Operasional", balance: 9500000 },
  { code: "6102", name: "Beban Listrik, Air & Telepon", category: "Beban Operasional", balance: 1200000 },
  { code: "6201", name: "Beban Pajak Penghasilan", category: "Beban Pajak", balance: 1500000 },
];

export const initialItems = [
  // Bahan Baku
  { id: "itm-1", code: "RAW-001", name: "Besi Beton 10mm", category: "Bahan Baku", unit: "Batang", stock: 120, minStock: 30, cost: 85000 },
  { id: "itm-2", code: "RAW-002", name: "Semen Portland 50kg", category: "Bahan Baku", unit: "Sak", stock: 80, minStock: 20, cost: 65000 },
  { id: "itm-3", code: "RAW-003", name: "Pasir Beton", category: "Bahan Baku", unit: "M3", stock: 15, minStock: 5, cost: 220000 },
  { id: "itm-4", code: "RAW-004", name: "Kawat Ikat", category: "Bahan Baku", unit: "Kg", stock: 45, minStock: 10, cost: 25000 },
  
  // Barang Jadi
  { id: "itm-5", code: "FG-001", name: "Pilar Beton K-300", category: "Barang Jadi", unit: "Pcs", stock: 24, minStock: 10, cost: 350000, price: 550000 },
  { id: "itm-6", code: "FG-002", name: "Pagar Panel Beton", category: "Barang Jadi", unit: "Lembar", stock: 40, minStock: 15, cost: 180000, price: 290000 },
];

export const initialCustomers = [
  { id: "cst-1", code: "CST-001", name: "PT. Pembangunan Jaya", email: "info@pembangunanjaya.com", phone: "021-5551234", address: "Jl. Jend. Sudirman Kav. 21, Jakarta" },
  { id: "cst-2", code: "CST-002", name: "CV. Reka Karya Mulia", email: "admin@rekakarya.co.id", phone: "0812-3456-7890", address: "Jl. Soekarno Hatta No. 45, Bandung" },
  { id: "cst-3", code: "CST-003", name: "Bapak Ahmad Subardjo", email: "ahmad.subardjo@gmail.com", phone: "0856-9988-7766", address: "Perum Permata Indah Blok C/12, Depok" },
];

export const initialSuppliers = [
  { id: "spl-1", code: "SPL-001", name: "PT. Krakatau Steel", email: "sales@krakatausteel.com", phone: "0254-392111", address: "Kawasan Industri Krakatau, Cilegon" },
  { id: "spl-2", code: "SPL-002", name: "PT. Semen Padang Tbk", email: "marketing@semenpadang.co.id", phone: "0751-815111", address: "Indarung, Padang, Sumatera Barat" },
  { id: "spl-3", code: "SPL-003", name: "Depo Pasir Merapi", email: "info@pasirmerapi.com", phone: "0811-2233-4455", address: "Jl. Kaliurang Km 15, Sleman, Yogyakarta" },
];

export const initialJournalEntries = [
  {
    id: "jr-1",
    date: "2026-05-15",
    reference: "KPT-001",
    description: "Penerimaan Setoran Modal Awal",
    status: "Posted",
    details: [
      { accountCode: "1102", accountName: "Bank BCA", debit: 200000000, credit: 0 },
      { accountCode: "3101", name: "Modal Saham", debit: 0, credit: 200000000 }
    ]
  },
  {
    id: "jr-2",
    date: "2026-05-18",
    reference: "INV-2026-001",
    description: "Penjualan 20 Pilar Beton ke PT. Pembangunan Jaya",
    status: "Posted",
    details: [
      { accountCode: "1103", accountName: "Piutang Usaha", debit: 11000000, credit: 0 },
      { accountCode: "4101", accountName: "Pendapatan Penjualan", debit: 0, credit: 10000000 },
      { accountCode: "2201", accountName: "PPN Keluaran", debit: 0, credit: 1000000 }
    ]
  },
  {
    id: "jr-3",
    date: "2026-05-18",
    reference: "HPP-001",
    description: "Pencatatan HPP Penjualan INV-2026-001",
    status: "Posted",
    details: [
      { accountCode: "5101", accountName: "Harga Pokok Penjualan (HPP)", debit: 7000000, credit: 0 },
      { accountCode: "1202", accountName: "Persediaan Barang Jadi", debit: 0, credit: 7000000 }
    ]
  },
  {
    id: "jr-4",
    date: "2026-05-20",
    reference: "PO-2026-001",
    description: "Pembelian Semen Portland dari PT. Semen Padang",
    status: "Posted",
    details: [
      { accountCode: "1201", accountName: "Persediaan Bahan Baku", debit: 5200000, credit: 0 },
      { accountCode: "1301", accountName: "PPN Masukan", debit: 520000, credit: 0 },
      { accountCode: "2101", accountName: "Hutang Usaha", debit: 0, credit: 5720000 }
    ]
  }
];

export const initialCashBankTransactions = [
  { id: "cb-1", date: "2026-05-15", type: "Masuk", accountCode: "1102", amount: 200000000, category: "Investasi Modal", description: "Setoran modal pemilik awal", reference: "KPT-001" },
  { id: "cb-2", date: "2026-05-22", type: "Keluar", accountCode: "1101", amount: 1200000, category: "Beban Operasional", description: "Pembayaran tagihan listrik & internet kantor Mei", reference: "OPR-01" },
  { id: "cb-3", date: "2026-05-25", type: "Masuk", accountCode: "1102", amount: 11000000, category: "Pelunasan Piutang", description: "Pelunasan Invoice INV-2026-001 oleh PT. Pembangunan Jaya", reference: "OR-001" },
  { id: "cb-4", date: "2026-05-28", type: "Keluar", accountCode: "1102", amount: 5720000, category: "Pelunasan Hutang", description: "Pelunasan Tagihan PO-2026-001 ke PT. Semen Padang", reference: "OP-001" },
  { id: "cb-5", date: "2026-05-30", type: "Transfer", fromAccountCode: "1102", toAccountCode: "1101", amount: 5000000, description: "Pengisian Kas Kecil Utama", reference: "TRF-001" }
];

export const initialSalesInvoices = [
  { id: "inv-s1", invoiceNo: "INV-2026-001", date: "2026-05-18", dueDate: "2026-06-18", customerId: "cst-1", customerName: "PT. Pembangunan Jaya", amount: 11000000, taxAmount: 1000000, subtotal: 10000000, status: "Lunas", items: [{ itemId: "itm-5", name: "Pilar Beton K-300", qty: 20, price: 500000, total: 10000000 }] },
  { id: "inv-s2", invoiceNo: "INV-2026-002", date: "2026-05-28", dueDate: "2026-06-28", customerId: "cst-2", customerName: "CV. Reka Karya Mulia", amount: 12876000, taxAmount: 1176000, subtotal: 11700000, status: "Belum Dibayar", items: [
    { itemId: "itm-5", name: "Pilar Beton K-300", qty: 10, price: 550000, total: 5500000 },
    { itemId: "itm-6", name: "Pagar Panel Beton", qty: 20, price: 310000, total: 6200000 }
  ] },
  { id: "inv-s3", invoiceNo: "INV-2026-06-01", date: "2026-06-01", dueDate: "2026-07-01", customerId: "cst-3", customerName: "Bapak Ahmad Subardjo", amount: 1100000, taxAmount: 100000, subtotal: 1000000, status: "Sebagian", paidAmount: 500000, items: [{ itemId: "itm-5", name: "Pilar Beton K-300", qty: 2, price: 500000, total: 1000000 }] }
];

export const initialPurchaseInvoices = [
  { id: "inv-p1", invoiceNo: "PINV-2026-001", poNo: "PO-2026-001", date: "2026-05-20", dueDate: "2026-06-20", supplierId: "spl-2", supplierName: "PT. Semen Padang Tbk", amount: 5720000, taxAmount: 520000, subtotal: 5200000, status: "Lunas", items: [{ itemId: "itm-2", name: "Semen Portland 50kg", qty: 80, price: 65000, total: 5200000 }] },
  { id: "inv-p2", invoiceNo: "PINV-2026-002", poNo: "PO-2026-002", date: "2026-05-26", dueDate: "2026-06-26", supplierId: "spl-1", supplierName: "PT. Krakatau Steel", email: "sales@krakatausteel.com", amount: 11322000, taxAmount: 1022000, subtotal: 10300000, status: "Belum Dibayar", items: [
    { itemId: "itm-1", code: "RAW-001", name: "Besi Beton 10mm", qty: 100, price: 85000, total: 8500000 },
    { itemId: "itm-4", code: "RAW-004", name: "Kawat Ikat", qty: 72, price: 25000, total: 1800000 }
  ] },
  { id: "inv-p3", invoiceNo: "PINV-2026-06-01", poNo: "PO-2026-003", date: "2026-06-01", dueDate: "2026-07-01", supplierId: "spl-3", supplierName: "Depo Pasir Merapi", amount: 2420000, taxAmount: 220000, subtotal: 2200000, status: "Belum Dibayar", items: [{ itemId: "itm-3", name: "Pasir Beton", qty: 10, price: 220000, total: 2200000 }] }
];

export const initialInventoryTransactions = [
  { id: "tx-i1", date: "2026-05-15", type: "Masuk", itemId: "itm-1", itemName: "Besi Beton 10mm", qty: 100, reference: "Stok Awal", note: "Saldo Awal Pembukuan" },
  { id: "tx-i2", date: "2026-05-15", type: "Masuk", itemId: "itm-5", itemName: "Pilar Beton K-300", qty: 30, reference: "Stok Awal", note: "Saldo Awal Pembukuan" },
  { id: "tx-i3", date: "2026-05-18", type: "Keluar", itemId: "itm-5", itemName: "Pilar Beton K-300", qty: 20, reference: "INV-2026-001", note: "Penjualan ke PT. Pembangunan Jaya" },
  { id: "tx-i4", date: "2026-05-20", type: "Masuk", itemId: "itm-2", itemName: "Semen Portland 50kg", qty: 80, reference: "PINV-2026-001", note: "Pembelian dari PT. Semen Padang" }
];

export const initialProductionOrders = [
  {
    id: "po-1",
    orderNo: "WO-2026-001",
    date: "2026-05-24",
    itemId: "itm-5",
    itemName: "Pilar Beton K-300",
    qtyTarget: 15,
    qtyProduced: 15,
    status: "Selesai",
    materials: [
      { itemId: "itm-1", name: "Besi Beton 10mm", qtyRequired: 15, qtyUsed: 15, unit: "Batang" },
      { itemId: "itm-2", name: "Semen Portland 50kg", qtyRequired: 30, qtyUsed: 30, unit: "Sak" },
      { itemId: "itm-3", name: "Pasir Beton", qtyRequired: 3, qtyUsed: 3, unit: "M3" }
    ],
    productionCost: 5250000, // 15 pcs * cost (cost is tracked)
    completedAt: "2026-05-27"
  },
  {
    id: "po-2",
    orderNo: "WO-2026-002",
    date: "2026-06-02",
    itemId: "itm-6",
    itemName: "Pagar Panel Beton",
    qtyTarget: 30,
    qtyProduced: 0,
    status: "Dalam Proses",
    materials: [
      { itemId: "itm-2", name: "Semen Portland 50kg", qtyRequired: 15, qtyUsed: 15, unit: "Sak" },
      { itemId: "itm-3", name: "Pasir Beton", qtyRequired: 2, qtyUsed: 2, unit: "M3" }
    ],
    productionCost: 0,
    completedAt: null
  }
];

export const initialTaxTransactions = [
  { id: "tx-t1", date: "2026-05-18", taxType: "PPN Keluaran", invoiceRef: "INV-2026-001", baseAmount: 10000000, taxRate: 0.10, taxAmount: 1000000, status: "Belum Bayar" },
  { id: "tx-t2", date: "2026-05-20", taxType: "PPN Masukan", invoiceRef: "PINV-2026-001", baseAmount: 5200000, taxRate: 0.10, taxAmount: 520000, status: "Sudah Dikreditkan" },
  { id: "tx-t3", date: "2026-05-28", taxType: "PPN Keluaran", invoiceRef: "INV-2026-002", baseAmount: 11700000, taxRate: 0.10, taxAmount: 1176000, status: "Belum Bayar" }
];

export const initialActivityLogs = [
  { id: "log-1", timestamp: "2026-06-03 08:30:15", userId: "usr-1", username: "admin", action: "Login", detail: "Berhasil masuk ke sistem sebagai Admin" },
  { id: "log-2", timestamp: "2026-06-03 09:12:04", userId: "usr-2", username: "keuangan", action: "Tambah Jurnal", detail: "Membuat jurnal transaksi kas keluar referensi OPR-01" },
  { id: "log-3", timestamp: "2026-06-03 10:45:30", userId: "usr-3", username: "gudang", action: "Stok Masuk", detail: "Menerima barang masuk untuk Besi Beton 10mm sebanyak 100 Batang" },
  { id: "log-4", timestamp: "2026-06-03 11:15:00", userId: "usr-4", username: "produksi", action: "Tambah Perintah Kerja", detail: "Membuat work order WO-2026-002 untuk produk Pagar Panel Beton" }
];
