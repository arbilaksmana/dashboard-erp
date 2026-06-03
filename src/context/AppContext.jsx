import React, { createContext, useState, useEffect } from "react";
import {
  initialUsers,
  initialAccounts,
  initialItems,
  initialCustomers,
  initialSuppliers,
  initialJournalEntries,
  initialCashBankTransactions,
  initialSalesInvoices,
  initialPurchaseInvoices,
  initialInventoryTransactions,
  initialProductionOrders,
  initialTaxTransactions,
  initialActivityLogs
} from "../db/mockDb";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial states from localStorage if available, else load mockDb defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("erp_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });
  
  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem("erp_active_user");
    return saved ? JSON.parse(saved) : initialUsers[0]; // Admin by default
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("erp_accounts");
    return saved ? JSON.parse(saved) : initialAccounts;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("erp_items");
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("erp_customers");
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem("erp_suppliers");
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem("erp_journal_entries");
    return saved ? JSON.parse(saved) : initialJournalEntries;
  });

  const [cashBankTransactions, setCashBankTransactions] = useState(() => {
    const saved = localStorage.getItem("erp_cash_bank_transactions");
    return saved ? JSON.parse(saved) : initialCashBankTransactions;
  });

  const [salesInvoices, setSalesInvoices] = useState(() => {
    const saved = localStorage.getItem("erp_sales_invoices");
    return saved ? JSON.parse(saved) : initialSalesInvoices;
  });

  const [purchaseInvoices, setPurchaseInvoices] = useState(() => {
    const saved = localStorage.getItem("erp_purchase_invoices");
    return saved ? JSON.parse(saved) : initialPurchaseInvoices;
  });

  const [inventoryTransactions, setInventoryTransactions] = useState(() => {
    const saved = localStorage.getItem("erp_inventory_transactions");
    return saved ? JSON.parse(saved) : initialInventoryTransactions;
  });

  const [productionOrders, setProductionOrders] = useState(() => {
    const saved = localStorage.getItem("erp_production_orders");
    return saved ? JSON.parse(saved) : initialProductionOrders;
  });

  const [taxTransactions, setTaxTransactions] = useState(() => {
    const saved = localStorage.getItem("erp_tax_transactions");
    return saved ? JSON.parse(saved) : initialTaxTransactions;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem("erp_activity_logs");
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  const [currentTab, setCurrentTab] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("erp_theme");
    return saved ? saved : "dark";
  });

  // Persist states to localStorage when they change
  useEffect(() => {
    localStorage.setItem("erp_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("erp_active_user", JSON.stringify(activeUser));
  }, [activeUser]);
  useEffect(() => {
    localStorage.setItem("erp_accounts", JSON.stringify(accounts));
  }, [accounts]);
  useEffect(() => {
    localStorage.setItem("erp_items", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("erp_customers", JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem("erp_suppliers", JSON.stringify(suppliers));
  }, [suppliers]);
  useEffect(() => {
    localStorage.setItem("erp_journal_entries", JSON.stringify(journalEntries));
  }, [journalEntries]);
  useEffect(() => {
    localStorage.setItem("erp_cash_bank_transactions", JSON.stringify(cashBankTransactions));
  }, [cashBankTransactions]);
  useEffect(() => {
    localStorage.setItem("erp_sales_invoices", JSON.stringify(salesInvoices));
  }, [salesInvoices]);
  useEffect(() => {
    localStorage.setItem("erp_purchase_invoices", JSON.stringify(purchaseInvoices));
  }, [purchaseInvoices]);
  useEffect(() => {
    localStorage.setItem("erp_inventory_transactions", JSON.stringify(inventoryTransactions));
  }, [inventoryTransactions]);
  useEffect(() => {
    localStorage.setItem("erp_production_orders", JSON.stringify(productionOrders));
  }, [productionOrders]);
  useEffect(() => {
    localStorage.setItem("erp_tax_transactions", JSON.stringify(taxTransactions));
  }, [taxTransactions]);
  useEffect(() => {
    localStorage.setItem("erp_activity_logs", JSON.stringify(activityLogs));
  }, [activityLogs]);
  useEffect(() => {
    localStorage.setItem("erp_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "#0b0f19";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#f9fafb";
    }
  }, [theme]);

  // Role switching configuration
  const menuByRole = {
    "Admin": ["dashboard", "akuntansi", "kasbank", "penjualan", "pembelian", "persediaan", "produksi", "pajak", "laporan", "hakakses"],
    "Staf Keuangan": ["dashboard", "akuntansi", "kasbank", "penjualan", "pembelian", "pajak", "laporan"],
    "Staf Gudang": ["dashboard", "persediaan"],
    "Staf Produksi": ["dashboard", "produksi", "persediaan"],
    "Manajemen": ["dashboard", "laporan"]
  };

  const changeRole = (roleName) => {
    const targetUser = users.find(u => u.role === roleName && u.active);
    if (targetUser) {
      setActiveUser(targetUser);
      logAction("Ganti Peran", `Berhasil beralih ke peran ${roleName} (${targetUser.name})`);
      // Redirect to dashboard if new role doesn't have access to current tab
      if (!menuByRole[roleName].includes(currentTab)) {
        setCurrentTab("dashboard");
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const logAction = (action, detail) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: activeUser.id,
      username: activeUser.username,
      action,
      detail
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Helper: Update account balances in Chart of Accounts (COA)
  const updateAccountBalance = (accountCode, amount, entryType) => {
    // entryType is 'debit' or 'credit'
    // Depending on standard account type, adding debit/credit increases or decreases balance
    // 1xxx (Aset) & 5xxx/6xxx (Beban): Debit increases (+), Credit decreases (-)
    // 2xxx (Kewajiban) & 3xxx (Ekuitas) & 4xxx (Pendapatan): Credit increases (+), Debit decreases (-)
    setAccounts(prevAccounts => {
      return prevAccounts.map(acc => {
        if (acc.code === accountCode) {
          const firstChar = acc.code.charAt(0);
          const isAssetOrExpense = ["1", "5", "6"].includes(firstChar);
          let balanceDiff = 0;
          if (entryType === "debit") {
            balanceDiff = isAssetOrExpense ? amount : -amount;
          } else {
            balanceDiff = isAssetOrExpense ? -amount : amount;
          }
          return { ...acc, balance: acc.balance + balanceDiff };
        }
        return acc;
      });
    });
  };

  // 1. Add Journal Entry (Double-Entry Bookkeeping)
  const addJournalEntry = (date, reference, description, details) => {
    const totalDebit = details.reduce((sum, item) => sum + Number(item.debit), 0);
    const totalCredit = details.reduce((sum, item) => sum + Number(item.credit), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error("Debit dan Kredit harus seimbang (balance)!");
    }

    const newEntry = {
      id: `jr-${Date.now()}`,
      date,
      reference,
      description,
      status: "Posted",
      details: details.map(d => ({
        accountCode: d.accountCode,
        accountName: accounts.find(a => a.code === d.accountCode)?.name || "",
        debit: Number(d.debit),
        credit: Number(d.credit)
      }))
    };

    setJournalEntries(prev => [newEntry, ...prev]);

    // Update individual account balances
    details.forEach(item => {
      if (item.debit > 0) {
        updateAccountBalance(item.accountCode, Number(item.debit), "debit");
      }
      if (item.credit > 0) {
        updateAccountBalance(item.accountCode, Number(item.credit), "credit");
      }
    });

    logAction("Tambah Jurnal", `Posting jurnal ${reference} - ${description}`);
  };

  // 2. Add Cash and Bank Transaction
  const addCashTransaction = ({ date, type, accountCode, amount, category, description, reference, toAccountCode = "" }) => {
    const newTx = {
      id: `cb-${Date.now()}`,
      date,
      type,
      accountCode,
      amount: Number(amount),
      category,
      description,
      reference,
      fromAccountCode: type === "Transfer" ? accountCode : undefined,
      toAccountCode: type === "Transfer" ? toAccountCode : undefined
    };

    setCashBankTransactions(prev => [newTx, ...prev]);

    if (type === "Masuk") {
      // Debit: Kas/Bank (increase)
      updateAccountBalance(accountCode, Number(amount), "debit");
      
      // Auto Journal Entry
      // Setup counter account mapping based on category for simplicity
      let counterAccount = "3201"; // Saldo Laba
      if (category === "Investasi Modal") counterAccount = "3101"; // Modal
      if (category === "Pelunasan Piutang") counterAccount = "1103"; // Piutang Usaha
      if (category === "Pendapatan Lain") counterAccount = "4101"; // Pendapatan
      
      const details = [
        { accountCode: accountCode, debit: Number(amount), credit: 0 },
        { accountCode: counterAccount, debit: 0, credit: Number(amount) }
      ];
      
      const newJrEntry = {
        id: `jr-${Date.now()}-auto`,
        date,
        reference,
        description: `Auto-KasMasuk: ${description}`,
        status: "Posted",
        details: details.map(d => ({
          accountCode: d.accountCode,
          accountName: accounts.find(a => a.code === d.accountCode)?.name || "",
          debit: d.debit,
          credit: d.credit
        }))
      };
      setJournalEntries(prev => [newJrEntry, ...prev]);
      updateAccountBalance(counterAccount, Number(amount), "credit");

    } else if (type === "Keluar") {
      // Credit: Kas/Bank (decrease)
      updateAccountBalance(accountCode, Number(amount), "credit");

      // Auto Journal Entry
      let counterAccount = "6102"; // Beban Listrik, Air & Telepon
      if (category === "Beban Gaji") counterAccount = "6101";
      if (category === "Pelunasan Hutang") counterAccount = "2101";
      if (category === "Pembelian Perlengkapan") counterAccount = "1201";
      if (category === "Beban Pajak") counterAccount = "6201";

      const details = [
        { accountCode: counterAccount, debit: Number(amount), credit: 0 },
        { accountCode: accountCode, debit: 0, credit: Number(amount) }
      ];

      const newJrEntry = {
        id: `jr-${Date.now()}-auto`,
        date,
        reference,
        description: `Auto-KasKeluar: ${description}`,
        status: "Posted",
        details: details.map(d => ({
          accountCode: d.accountCode,
          accountName: accounts.find(a => a.code === d.accountCode)?.name || "",
          debit: d.debit,
          credit: d.credit
        }))
      };
      setJournalEntries(prev => [newJrEntry, ...prev]);
      updateAccountBalance(counterAccount, Number(amount), "debit");

    } else if (type === "Transfer") {
      // Outflow from source account (Credit)
      updateAccountBalance(accountCode, Number(amount), "credit");
      // Inflow to destination account (Debit)
      updateAccountBalance(toAccountCode, Number(amount), "debit");

      // Auto Journal Entry
      const details = [
        { accountCode: toAccountCode, debit: Number(amount), credit: 0 },
        { accountCode: accountCode, debit: 0, credit: Number(amount) }
      ];

      const newJrEntry = {
        id: `jr-${Date.now()}-auto`,
        date,
        reference,
        description: `Transfer Kas: dari ${accounts.find(a => a.code === accountCode)?.name} ke ${accounts.find(a => a.code === toAccountCode)?.name}`,
        status: "Posted",
        details: details.map(d => ({
          accountCode: d.accountCode,
          accountName: accounts.find(a => a.code === d.accountCode)?.name || "",
          debit: d.debit,
          credit: d.credit
        }))
      };
      setJournalEntries(prev => [newJrEntry, ...prev]);
    }

    logAction("Tambah Transaksi Kas", `${type} senilai Rp ${Number(amount).toLocaleString()} melalui ${accounts.find(a => a.code === accountCode)?.name}`);
  };

  // 3. Create Sales Invoice (Penjualan)
  const createSalesInvoice = ({ date, dueDate, customerId, itemsList, taxRate = 0.11, payMethod = "Credit" }) => {
    const customer = customers.find(c => c.id === customerId);
    
    let subtotal = 0;
    const invoiceItems = itemsList.map(item => {
      const dbItem = items.find(i => i.id === item.itemId);
      const total = item.qty * item.price;
      subtotal += total;
      return {
        itemId: item.itemId,
        name: dbItem?.name || "",
        qty: Number(item.qty),
        price: Number(item.price),
        total
      };
    });

    const taxAmount = Math.round(subtotal * taxRate);
    const amount = subtotal + taxAmount;
    const invoiceNo = `INV-${Date.now().toString().substring(6)}`;

    // Stock adjustments: decrease quantities
    invoiceItems.forEach(item => {
      setItems(prevItems => {
        return prevItems.map(i => {
          if (i.id === item.itemId) {
            const newStock = i.stock - item.qty;
            return { ...i, stock: newStock };
          }
          return i;
        });
      });

      // Log inventory transaction
      const invTx = {
        id: `tx-${Date.now()}-${item.itemId}`,
        date,
        type: "Keluar",
        itemId: item.itemId,
        itemName: item.name,
        qty: item.qty,
        reference: invoiceNo,
        note: `Penjualan ke ${customer?.name}`
      };
      setInventoryTransactions(prev => [invTx, ...prev]);
    });

    const status = payMethod === "Cash" ? "Lunas" : "Belum Dibayar";
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo,
      date,
      dueDate,
      customerId,
      customerName: customer?.name || "",
      amount,
      taxAmount,
      subtotal,
      status,
      items: invoiceItems,
      paidAmount: payMethod === "Cash" ? amount : 0
    };

    setSalesInvoices(prev => [newInvoice, ...prev]);

    // Tax logging
    if (taxAmount > 0) {
      const taxTx = {
        id: `tax-${Date.now()}`,
        date,
        taxType: "PPN Keluaran",
        invoiceRef: invoiceNo,
        baseAmount: subtotal,
        taxRate,
        taxAmount,
        status: "Belum Bayar"
      };
      setTaxTransactions(prev => [taxTx, ...prev]);
    }

    // Bookkeeping journal entries
    // Case 1: Cash sale
    // Debit Bank BCA / Kas Utama (Asset +) - 1102
    // Credit Pendapatan Penjualan (Revenue +) - 4101
    // Credit PPN Keluaran (Liability +) - 2201
    // Case 2: Credit sale
    // Debit Piutang Usaha (Asset +) - 1103
    // Credit Pendapatan Penjualan (Revenue +) - 4101
    // Credit PPN Keluaran (Liability +) - 2201
    const debitAccount = payMethod === "Cash" ? "1102" : "1103"; // BCA or Piutang
    const journalDetails = [
      { accountCode: debitAccount, debit: amount, credit: 0 },
      { accountCode: "4101", debit: 0, credit: subtotal }
    ];
    if (taxAmount > 0) {
      journalDetails.push({ accountCode: "2201", debit: 0, credit: taxAmount });
    }

    addJournalEntry(date, invoiceNo, `Penjualan barang ke ${customer?.name}`, journalDetails);

    // Calculate dynamic HPP (Cost of Goods Sold)
    let totalHppCost = 0;
    invoiceItems.forEach(item => {
      const dbItem = items.find(i => i.id === item.itemId);
      const costPerUnit = dbItem?.cost || 0;
      totalHppCost += item.qty * costPerUnit;
    });

    if (totalHppCost > 0) {
      // Debit HPP (Beban +) - 5101
      // Credit Persediaan Barang Jadi (Asset -) - 1202
      const hppDetails = [
        { accountCode: "5101", debit: totalHppCost, credit: 0 },
        { accountCode: "1202", debit: 0, credit: totalHppCost }
      ];
      // Post HPP Jurnal
      addJournalEntry(date, `HPP-${invoiceNo.substring(4)}`, `Pencatatan HPP Penjualan ${invoiceNo}`, hppDetails);
    }

    // Cash Book entry if paid in cash
    if (payMethod === "Cash") {
      const cashTx = {
        id: `cb-${Date.now()}`,
        date,
        type: "Masuk",
        accountCode: "1102", // BCA
        amount,
        category: "Pelunasan Piutang",
        description: `Penjualan tunai invoice ${invoiceNo} ke ${customer?.name}`,
        reference: invoiceNo
      };
      setCashBankTransactions(prev => [cashTx, ...prev]);
    }

    logAction("Buat Invoice Penjualan", `Invoice ${invoiceNo} senilai Rp ${amount.toLocaleString()} untuk ${customer?.name}`);
  };

  // 4. Record Customer Payment (Pelunasan Piutang)
  const recordCustomerPayment = ({ invoiceId, date, accountCode, amount }) => {
    const paymentAmount = Number(amount);
    let invoiceName = "";
    
    setSalesInvoices(prev => {
      return prev.map(inv => {
        if (inv.id === invoiceId) {
          invoiceName = inv.invoiceNo;
          const currentPaid = (inv.paidAmount || 0) + paymentAmount;
          const status = currentPaid >= inv.amount ? "Lunas" : "Sebagian";
          return { ...inv, paidAmount: currentPaid, status };
        }
        return inv;
      });
    });

    // Debit Kas/Bank (increase) - accountCode
    updateAccountBalance(accountCode, paymentAmount, "debit");
    // Credit Piutang Usaha (decrease) - 1103
    updateAccountBalance("1103", paymentAmount, "credit");

    // Add cash transaction entry
    const newTx = {
      id: `cb-${Date.now()}`,
      date,
      type: "Masuk",
      accountCode,
      amount: paymentAmount,
      category: "Pelunasan Piutang",
      description: `Penerimaan pelunasan invoice ${invoiceName}`,
      reference: `PAY-${Date.now().toString().substring(8)}`
    };
    setCashBankTransactions(prev => [newTx, ...prev]);

    // Add journal entry
    const journalDetails = [
      { accountCode, debit: paymentAmount, credit: 0 },
      { accountCode: "1103", debit: 0, credit: paymentAmount }
    ];
    addJournalEntry(date, newTx.reference, `Penerimaan pelunasan piutang ${invoiceName}`, journalDetails);

    logAction("Terima Pembayaran", `Pelunasan Piutang ${invoiceName} senilai Rp ${paymentAmount.toLocaleString()}`);
  };

  // 5. Create Purchase Invoice (Pembelian & Hutang)
  const createPurchaseInvoice = ({ date, dueDate, supplierId, itemsList, taxRate = 0.11, payMethod = "Credit" }) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    
    let subtotal = 0;
    const invoiceItems = itemsList.map(item => {
      const dbItem = items.find(i => i.id === item.itemId);
      const total = item.qty * item.price;
      subtotal += total;
      return {
        itemId: item.itemId,
        name: dbItem?.name || "",
        qty: Number(item.qty),
        price: Number(item.price),
        total
      };
    });

    const taxAmount = Math.round(subtotal * taxRate);
    const amount = subtotal + taxAmount;
    const poNo = `PO-${Date.now().toString().substring(6)}`;
    const invoiceNo = `PINV-${Date.now().toString().substring(6)}`;

    // Stock adjustments: increase quantities of purchased raw materials/items
    invoiceItems.forEach(item => {
      setItems(prevItems => {
        return prevItems.map(i => {
          if (i.id === item.itemId) {
            const newStock = i.stock + item.qty;
            // Recalculate average cost for persediaan (weighted average)
            const oldTotalCost = i.stock * i.cost;
            const newTotalCost = oldTotalCost + (item.qty * item.price);
            const newCost = newStock > 0 ? Math.round(newTotalCost / newStock) : i.cost;
            return { ...i, stock: newStock, cost: newCost };
          }
          return i;
        });
      });

      // Log inventory transaction
      const invTx = {
        id: `tx-${Date.now()}-${item.itemId}`,
        date,
        type: "Masuk",
        itemId: item.itemId,
        itemName: item.name,
        qty: item.qty,
        reference: invoiceNo,
        note: `Pembelian dari ${supplier?.name}`
      };
      setInventoryTransactions(prev => [invTx, ...prev]);
    });

    const status = payMethod === "Cash" ? "Lunas" : "Belum Dibayar";
    const newInvoice = {
      id: `pinv-${Date.now()}`,
      invoiceNo,
      poNo,
      date,
      dueDate,
      supplierId,
      supplierName: supplier?.name || "",
      amount,
      taxAmount,
      subtotal,
      status,
      items: invoiceItems,
      paidAmount: payMethod === "Cash" ? amount : 0
    };

    setPurchaseInvoices(prev => [newInvoice, ...prev]);

    // Tax logging
    if (taxAmount > 0) {
      const taxTx = {
        id: `tax-${Date.now()}`,
        date,
        taxType: "PPN Masukan",
        invoiceRef: invoiceNo,
        baseAmount: subtotal,
        taxRate,
        taxAmount,
        status: "Sudah Dikreditkan"
      };
      setTaxTransactions(prev => [taxTx, ...prev]);
    }

    // Journal Entry
    // Debit Persediaan Bahan Baku (Asset +) - 1201 (Assuming buying raw materials mostly)
    // Debit PPN Masukan (Asset +) - 1301
    // Credit Hutang Usaha (Liability +) - 2101 (or 1102 Bank BCA if cash)
    const creditAccount = payMethod === "Cash" ? "1102" : "2101"; // BCA or Hutang
    const journalDetails = [
      { accountCode: "1201", debit: subtotal, credit: 0 }
    ];
    if (taxAmount > 0) {
      journalDetails.push({ accountCode: "1301", debit: taxAmount, credit: 0 });
    }
    journalDetails.push({ accountCode: creditAccount, debit: 0, credit: amount });

    addJournalEntry(date, invoiceNo, `Pembelian bahan baku dari ${supplier?.name}`, journalDetails);

    // Cash Book entry if paid in cash
    if (payMethod === "Cash") {
      const cashTx = {
        id: `cb-${Date.now()}`,
        date,
        type: "Keluar",
        accountCode: "1102", // BCA
        amount,
        category: "Pelunasan Hutang",
        description: `Pembelian tunai invoice ${invoiceNo} ke ${supplier?.name}`,
        reference: invoiceNo
      };
      setCashBankTransactions(prev => [cashTx, ...prev]);
    }

    logAction("Buat Invoice Pembelian", `Tagihan ${invoiceNo} senilai Rp ${amount.toLocaleString()} dari ${supplier?.name}`);
  };

  // 6. Record Supplier Payment (Pembayaran Hutang)
  const recordSupplierPayment = ({ invoiceId, date, accountCode, amount }) => {
    const paymentAmount = Number(amount);
    let invoiceName = "";
    
    setPurchaseInvoices(prev => {
      return prev.map(inv => {
        if (inv.id === invoiceId) {
          invoiceName = inv.invoiceNo;
          const currentPaid = (inv.paidAmount || 0) + paymentAmount;
          const status = currentPaid >= inv.amount ? "Lunas" : "Sebagian";
          return { ...inv, paidAmount: currentPaid, status };
        }
        return inv;
      });
    });

    // Debit Hutang Usaha (decrease) - 2101
    updateAccountBalance("2101", paymentAmount, "debit");
    // Credit Kas/Bank (decrease) - accountCode
    updateAccountBalance(accountCode, paymentAmount, "credit");

    // Add cash transaction entry
    const newTx = {
      id: `cb-${Date.now()}`,
      date,
      type: "Keluar",
      accountCode,
      amount: paymentAmount,
      category: "Pelunasan Hutang",
      description: `Pembayaran hutang invoice ${invoiceName}`,
      reference: `PAY-${Date.now().toString().substring(8)}`
    };
    setCashBankTransactions(prev => [newTx, ...prev]);

    // Add journal entry
    const journalDetails = [
      { accountCode: "2101", debit: paymentAmount, credit: 0 },
      { accountCode, debit: 0, credit: paymentAmount }
    ];
    addJournalEntry(date, newTx.reference, `Pembayaran hutang kepada supplier atas ${invoiceName}`, journalDetails);

    logAction("Bayar Tagihan", `Pelunasan Hutang ${invoiceName} senilai Rp ${paymentAmount.toLocaleString()}`);
  };

  // 7. Create Production Order (Perintah Kerja)
  const createProductionOrder = ({ date, itemId, qtyTarget, materials }) => {
    const targetItem = items.find(i => i.id === itemId);
    const orderNo = `WO-${Date.now().toString().substring(7)}`;

    // Deduct stock of raw materials
    materials.forEach(mat => {
      setItems(prevItems => {
        return prevItems.map(i => {
          if (i.id === mat.itemId) {
            return { ...i, stock: i.stock - Number(mat.qtyUsed) };
          }
          return i;
        });
      });

      // Log inventory transaction
      const invTx = {
        id: `tx-${Date.now()}-${mat.itemId}`,
        date,
        type: "Keluar",
        itemId: mat.itemId,
        itemName: mat.name,
        qty: Number(mat.qtyUsed),
        reference: orderNo,
        note: `Bahan Baku Produksi ${orderNo}`
      };
      setInventoryTransactions(prev => [invTx, ...prev]);
    });

    // Calculate material cost
    let totalMaterialCost = 0;
    materials.forEach(mat => {
      const dbItem = items.find(i => i.id === mat.itemId);
      const costPerUnit = dbItem?.cost || 0;
      totalMaterialCost += Number(mat.qtyUsed) * costPerUnit;
    });

    // Journal Entry for materials consumption:
    // Debit: Persediaan Barang Dalam Proses (or simplify and do it at completion)
    // Credit: Persediaan Bahan Baku (Asset -) - 1201
    // For simplicity, we credit Persediaan Bahan Baku by totalMaterialCost, 
    // and wait for completeProductionOrder to debit Persediaan Barang Jadi and credit WIP/Material.
    const details = [
      // Track as production cost
      { accountCode: "1201", debit: 0, credit: totalMaterialCost }
    ];
    // In our simplified COA, we will temporarily debit WIP / Laba Rugi / or handle at completion.
    // Let's create an asset account (WIP or just book it directly when finished). We will do a direct transfer:
    // When order is finished, we Debit Persediaan Barang Jadi (1202) and Credit Persediaan Bahan Baku (1201).
    // During work in progress, we can park it, or we do the journal when completed. Let's do the journal at completion.

    const newOrder = {
      id: `po-${Date.now()}`,
      orderNo,
      date,
      itemId,
      itemName: targetItem?.name || "",
      qtyTarget: Number(qtyTarget),
      qtyProduced: 0,
      status: "Dalam Proses",
      materials: materials.map(m => ({
        itemId: m.itemId,
        name: m.name,
        qtyRequired: Number(m.qtyRequired),
        qtyUsed: Number(m.qtyUsed),
        unit: m.unit
      })),
      productionCost: totalMaterialCost,
      completedAt: null
    };

    setProductionOrders(prev => [newOrder, ...prev]);
    logAction("Buat Perintah Produksi", `Work Order ${orderNo} untuk memproduksi ${qtyTarget} unit ${targetItem?.name}`);
  };

  // 8. Complete Production Order (Selesai Produksi)
  const completeProductionOrder = (orderId, qtyProduced) => {
    let completedOrder = null;
    const compQty = Number(qtyProduced);

    setProductionOrders(prev => {
      return prev.map(order => {
        if (order.id === orderId) {
          completedOrder = {
            ...order,
            status: "Selesai",
            qtyProduced: compQty,
            completedAt: new Date().toISOString().substring(0, 10)
          };
          return completedOrder;
        }
        return order;
      });
    });

    if (completedOrder) {
      // Increase finished goods stock
      setItems(prevItems => {
        return prevItems.map(i => {
          if (i.id === completedOrder.itemId) {
            const newStock = i.stock + compQty;
            // Update cost of finished goods based on production cost
            const oldTotalCost = i.stock * i.cost;
            const newTotalCost = oldTotalCost + completedOrder.productionCost;
            const newCost = newStock > 0 ? Math.round(newTotalCost / newStock) : i.cost;
            return { ...i, stock: newStock, cost: newCost };
          }
          return i;
        });
      });

      // Log inventory transaction (Masuk)
      const invTx = {
        id: `tx-${Date.now()}-${completedOrder.itemId}`,
        date: completedOrder.completedAt,
        type: "Masuk",
        itemId: completedOrder.itemId,
        itemName: completedOrder.itemName,
        qty: compQty,
        reference: completedOrder.orderNo,
        note: `Penerimaan Barang Jadi Hasil Produksi ${completedOrder.orderNo}`
      };
      setInventoryTransactions(prev => [invTx, ...prev]);

      // Journal entry at completion:
      // Debit Persediaan Barang Jadi (Asset +) - 1202
      // Credit Persediaan Bahan Baku (Asset -) - 1201 (already consumed during order creation)
      const journalDetails = [
        { accountCode: "1202", debit: completedOrder.productionCost, credit: 0 },
        { accountCode: "1201", debit: 0, credit: completedOrder.productionCost }
      ];

      addJournalEntry(
        completedOrder.completedAt,
        completedOrder.orderNo,
        `Pencatatan produksi barang jadi ${completedOrder.itemName} - ${completedOrder.orderNo}`,
        journalDetails
      );

      logAction("Selesaikan Produksi", `Work Order ${completedOrder.orderNo} selesai, masuk gudang sebanyak ${compQty} unit`);
    }
  };

  // 9. Stock Adjustment (Penyesuaian Stok)
  const addStockAdjustment = ({ itemId, date, type, qty, note }) => {
    const item = items.find(i => i.id === itemId);
    const amountQty = Number(qty);
    const costValue = item?.cost || 0;
    const totalCost = amountQty * costValue;

    setItems(prevItems => {
      return prevItems.map(i => {
        if (i.id === itemId) {
          const delta = type === "Masuk" ? amountQty : -amountQty;
          return { ...i, stock: i.stock + delta };
        }
        return i;
      });
    });

    const txNo = `ADJ-${Date.now().toString().substring(8)}`;
    // Log inventory transaction
    const invTx = {
      id: `tx-${Date.now()}-${itemId}`,
      date,
      type,
      itemId,
      itemName: item?.name || "",
      qty: amountQty,
      reference: txNo,
      note: `Penyesuaian: ${note}`
    };
    setInventoryTransactions(prev => [invTx, ...prev]);

    // Bookkeeping journal:
    // If Masuk: Debit Persediaan Bahan/Barang Jadi (Asset +), Credit Saldo Laba/Lainnya (Equity +)
    // If Keluar: Debit Selisih Persediaan (Beban +), Credit Persediaan (Asset -)
    const itemCode = item.category === "Bahan Baku" ? "1201" : "1202";
    let journalDetails = [];
    if (type === "Masuk") {
      journalDetails = [
        { accountCode: itemCode, debit: totalCost, credit: 0 },
        { accountCode: "3201", debit: 0, credit: totalCost } // Adjusting into retained earnings
      ];
    } else {
      journalDetails = [
        { accountCode: "5101", debit: totalCost, credit: 0 }, // Charge to COGS
        { accountCode: itemCode, debit: 0, credit: totalCost }
      ];
    }

    addJournalEntry(date, txNo, `Penyesuaian stok ${item?.name}: ${note}`, journalDetails);
    logAction("Penyesuaian Stok", `Stok ${item?.name} disesuaikan (${type}) sebanyak ${amountQty} ${item?.unit}`);
  };

  // 10. Record Tax Payment
  const addTaxPayment = ({ date, taxId, amount, accountCode }) => {
    const payAmount = Number(amount);
    let taxType = "";
    let ref = "";

    setTaxTransactions(prev => {
      return prev.map(t => {
        if (t.id === taxId) {
          taxType = t.taxType;
          ref = t.invoiceRef;
          return { ...t, status: "Sudah Dibayar" };
        }
        return t;
      });
    });

    // Debit Hutang Pajak / PPN Keluaran (Liability -) - 2201
    // Credit Kas/Bank (Asset -) - accountCode
    // If PPN Masukan, it's normally an asset. For PPN Keluaran, it's a liability (2201)
    const debitAccount = taxType === "PPN Keluaran" ? "2201" : "1301";
    updateAccountBalance(debitAccount, payAmount, "debit");
    updateAccountBalance(accountCode, payAmount, "credit");

    // Add cash transaction entry
    const newTx = {
      id: `cb-${Date.now()}`,
      date,
      type: "Keluar",
      accountCode,
      amount: payAmount,
      category: "Beban Pajak",
      description: `Pembayaran ${taxType} atas invoice ${ref}`,
      reference: `TAX-PAY-${Date.now().toString().substring(8)}`
    };
    setCashBankTransactions(prev => [newTx, ...prev]);

    // Add journal entry
    const journalDetails = [
      { accountCode: debitAccount, debit: payAmount, credit: 0 },
      { accountCode, debit: 0, credit: payAmount }
    ];
    addJournalEntry(date, newTx.reference, `Pembayaran ${taxType} invoice ${ref}`, journalDetails);

    logAction("Bayar Pajak", `Pembayaran ${taxType} senilai Rp ${payAmount.toLocaleString()} via ${accounts.find(a => a.code === accountCode)?.name}`);
  };

  // 11. Manage Users
  const addUser = ({ username, name, role }) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      username: username.toLowerCase().replace(/\s+/g, ""),
      name,
      role,
      active: true
    };
    setUsers(prev => [...prev, newUser]);
    logAction("Tambah Pengguna", `Membuat user baru ${username} dengan peran ${role}`);
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => {
      return prev.map(u => {
        if (u.id === userId) {
          const newStatus = !u.active;
          logAction("Edit Pengguna", `Mengubah status user ${u.username} menjadi ${newStatus ? 'Aktif' : 'Non-aktif'}`);
          return { ...u, active: newStatus };
        }
        return u;
      });
    });
  };

  // Reset demo data to defaults
  const resetDemoData = () => {
    localStorage.removeItem("erp_users");
    localStorage.removeItem("erp_active_user");
    localStorage.removeItem("erp_accounts");
    localStorage.removeItem("erp_items");
    localStorage.removeItem("erp_customers");
    localStorage.removeItem("erp_suppliers");
    localStorage.removeItem("erp_journal_entries");
    localStorage.removeItem("erp_cash_bank_transactions");
    localStorage.removeItem("erp_sales_invoices");
    localStorage.removeItem("erp_purchase_invoices");
    localStorage.removeItem("erp_inventory_transactions");
    localStorage.removeItem("erp_production_orders");
    localStorage.removeItem("erp_tax_transactions");
    localStorage.removeItem("erp_activity_logs");
    
    setUsers(initialUsers);
    setActiveUser(initialUsers[0]);
    setAccounts(initialAccounts);
    setItems(initialItems);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setJournalEntries(initialJournalEntries);
    setCashBankTransactions(initialCashBankTransactions);
    setSalesInvoices(initialSalesInvoices);
    setPurchaseInvoices(initialPurchaseInvoices);
    setInventoryTransactions(initialInventoryTransactions);
    setProductionOrders(initialProductionOrders);
    setTaxTransactions(initialTaxTransactions);
    setActivityLogs(initialActivityLogs);
    setCurrentTab("dashboard");
    logAction("Reset Sistem", "Seluruh data transaksi dan stok di-reset ke saldo awal");
  };

  return (
    <AppContext.Provider
      value={{
        users,
        activeUser,
        accounts,
        items,
        customers,
        suppliers,
        journalEntries,
        cashBankTransactions,
        salesInvoices,
        purchaseInvoices,
        inventoryTransactions,
        productionOrders,
        taxTransactions,
        activityLogs,
        currentTab,
        theme,
        
        // Allowed tabs according to active user role
        allowedTabs: menuByRole[activeUser.role] || ["dashboard"],
        
        // Setters & Actions
        setCurrentTab,
        changeRole,
        toggleTheme,
        addJournalEntry,
        addCashTransaction,
        createSalesInvoice,
        recordCustomerPayment,
        createPurchaseInvoice,
        recordSupplierPayment,
        createProductionOrder,
        completeProductionOrder,
        addStockAdjustment,
        addTaxPayment,
        addUser,
        toggleUserStatus,
        resetDemoData,
        logAction
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
