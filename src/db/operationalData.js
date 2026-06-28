// Data operasional PT Catur Reka Pilarindo periode Okt-Des 2025.
// Extracted from journal entries (Excel + PDF) — data terbatas karena sumber utama
// adalah data akuntansi, bukan data transaksional detail.

export const initialCustomers = [
  { id: "cst-real-1", code: "CST-001", name: "Yayasan Pendidikan Pelita (YPP)", email: "ypp@pelita.education", phone: "-", address: "Jakarta" },
];

export const initialSuppliers = [
  { id: "spl-real-1", code: "SPL-001", name: "Supplier Kabel NYMHY", email: "-", phone: "-", address: "-" },
  { id: "spl-real-2", code: "SPL-002", name: "Supplier Panel Charger", email: "-", phone: "-", address: "-" },
];

export const initialItems = [
  { id: "itm-real-1", code: "FG-001", name: "Lampu LIMAR", category: "Barang Jadi", unit: "Unit", stock: 0, minStock: 10, cost: 400000, price: 1424489 },
  { id: "itm-real-2", code: "FG-002", name: "Panel Charger", category: "Barang Jadi", unit: "Unit", stock: 0, minStock: 5, cost: 8750000, price: 0 },
  { id: "itm-real-3", code: "RAW-001", name: "Kabel NYMHY @25 M", category: "Bahan Baku", unit: "Roll", stock: 0, minStock: 50, cost: 82500, price: 0 },
];

export const initialSalesInvoices = [
  {
    id: "inv-s-real-1",
    invoiceNo: "INV-2025-001",
    date: "2025-12-06",
    dueDate: "2026-01-06",
    customerId: "cst-real-1",
    customerName: "Yayasan Pendidikan Pelita (YPP)",
    amount: 460680000,
    taxAmount: 41880000,
    subtotal: 418800000,
    status: "Lunas",
    paidAmount: 460680000,
    items: [
      { itemId: "itm-real-1", name: "Lampu LIMAR", qty: 294, price: 1424489.79, total: 418800000 },
    ],
  },
];

export const initialPurchaseInvoices = [
  {
    id: "inv-p-real-1",
    invoiceNo: "PINV-2025-001",
    poNo: "PO-2025-001",
    date: "2025-11-04",
    dueDate: "2025-12-04",
    supplierId: "spl-real-1",
    supplierName: "Supplier Kabel NYMHY",
    amount: 49500000,
    taxAmount: 0,
    subtotal: 49500000,
    status: "Lunas",
    items: [{ itemId: "itm-real-3", name: "Kabel NYMHY @25 M", qty: 600, price: 82500, total: 49500000 }],
  },
  {
    id: "inv-p-real-2",
    invoiceNo: "PINV-2025-002",
    poNo: "PO-2025-002",
    date: "2025-12-07",
    dueDate: "2026-01-07",
    supplierId: "spl-real-2",
    supplierName: "Supplier Panel Charger",
    amount: 52500000,
    taxAmount: 0,
    subtotal: 52500000,
    status: "Lunas",
    items: [{ itemId: "itm-real-2", name: "Panel Charger", qty: 6, price: 8750000, total: 52500000 }],
  },
];

export const initialInventoryTransactions = [
  { id: "tx-i-real-1", date: "2025-10-01", type: "Masuk", itemId: "itm-real-1", itemName: "Lampu LIMAR", qty: 294, reference: "Stok Awal", note: "Persediaan awal barang dagang" },
  { id: "tx-i-real-2", date: "2025-11-04", type: "Masuk", itemId: "itm-real-3", itemName: "Kabel NYMHY @25 M", qty: 600, reference: "PINV-2025-001", note: "Pembelian kabel NYMHY" },
  { id: "tx-i-real-3", date: "2025-12-06", type: "Keluar", itemId: "itm-real-1", itemName: "Lampu LIMAR", qty: 294, reference: "INV-2025-001", note: "Penjualan ke YPP" },
  { id: "tx-i-real-4", date: "2025-12-07", type: "Masuk", itemId: "itm-real-2", itemName: "Panel Charger", qty: 6, reference: "PINV-2025-002", note: "Pembelian panel charger untuk YPP" },
];

