(() => {
  if (window.accountingLedgerCoreReady) return;
  window.accountingLedgerCoreReady = true;

  const copy = (ru, et, key) => translateCopy(ru, key || et);
  Object.assign(ruTexts, { ledgerOpeningBalancesTitle: "Начальные остатки", ledgerOpeningBalancesDate: "Дата начала учёта", ledgerOpeningBalancesDebit: "Дебет", ledgerOpeningBalancesCredit: "Кредит", ledgerOpeningBalancesSave: "Сохранить остатки", ledgerOpeningBalancesUnbalanced: "Итог дебета и кредита начальных остатков должен совпадать.", ledgerOpeningBalancesSaved: "Начальные остатки сохранены.", ledgerLocalDataWarning: "Бухгалтерские данные сохранены на этом устройстве. Примените миграцию для облачной синхронизации.", ledgerTurnoverKnownOpening: "Алгсальдо рассчитано по введённым остаткам и проводкам до периода.", ledgerTurnoverUnknownOpening: "Начальные остатки не введены. Обороты показаны, сальдо до начала периода не рассчитано.", accountPlanSaveError: "Не удалось сохранить Kontoplaan.", expenseViewOnlyHint: "Расходы из счетов поставщиков изменяются через Ostuarve." });
  Object.assign(etTexts, { ledgerOpeningBalancesTitle: "Algsaldod", ledgerOpeningBalancesDate: "Arvestuse alguskuupäev", ledgerOpeningBalancesDebit: "Deebet", ledgerOpeningBalancesCredit: "Kreedit", ledgerOpeningBalancesSave: "Salvesta algsaldod", ledgerOpeningBalancesUnbalanced: "Algsaldode deebet ja kreedit peavad võrduma.", ledgerOpeningBalancesSaved: "Algsaldod salvestati.", ledgerLocalDataWarning: "Raamatupidamisandmed salvestati sellesse seadmesse. Pilvesünkroonimiseks rakendage migratsioon.", ledgerTurnoverKnownOpening: "Algsaldo põhineb sisestatud algsaldodel ja varasematel kannetel.", ledgerTurnoverUnknownOpening: "Algsaldosid pole sisestatud. Käibed on näha, perioodieelse saldo arvutamiseks pole lähteandmeid.", accountPlanSaveError: "Kontoplaani ei saanud salvestada.", expenseViewOnlyHint: "Arvetest tulenevaid kulusid muuda Ostuarve kaudu." });
  Object.assign(ruTexts, { expenseAsPurchaseInvoice: "Новые расходы создаются как Ostuarve с категорией Kulu.", expensePurchaseAction: "Добавить как Ostuarve", quickContactsAction: "Справка" });
  Object.assign(etTexts, { expenseAsPurchaseInvoice: "Uued kulud lisatakse Ostuarvena, liigitusega Kulu.", expensePurchaseAction: "Lisa Ostuarvena", quickContactsAction: "Abi" });
  const accountByCode = () => new Map(getLedgerAccounts().map(account => [String(account.code), account]));
  const accountFor = code => accountByCode().get(String(code || ""));
  const validAccount = (code, fallback, requiredType = "") => {
    const account = accountFor(code);
    return account && (!requiredType || account.type === requiredType) ? String(code) : fallback;
  };
  const roundMoney = value => Math.round((Number(value) || 0) * 100) / 100;
  const isDate = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  const normalizedDate = value => String(value || "").slice(0, 10);
  const cashAccountFor = item => item?.paymentMethod === "cash" || item?.payment_method === "cash" || item?.method === "cash" || item?.cashRegister ? "1100" : "1000";
  const descriptionFor = item => String(item?.description || item?.note || item?.category || "").trim();
  const objectFor = item => String(item?.objectName || item?.object || item?.project || "").trim();
  const amountForLine = item => roundMoney((Number(item.quantity) || 0) * (Number(item.price) || 0) * (1 - Math.min(100, Math.max(0, Number(item.discountPercent) || 0)) / 100) * (1 + Math.max(0, Number(item.taxRate) || 0) / 100));

  const makeLine = (common, accountCode, debit, credit, extra = {}) => {
    const code = String(accountCode || "");
    return { ...common, ...extra, accountCode: code, account: accountFor(code)?.label || code, debit: roundMoney(debit), credit: roundMoney(credit) };
  };
  const addVoucher = (entries, common, lines) => {
    const validLines = lines.filter(line => line.accountCode && (Number(line.debit) > 0 || Number(line.credit) > 0));
    const debit = roundMoney(validLines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0));
    const credit = roundMoney(validLines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0));
    if (!isDate(common.date) || debit <= 0 || debit !== credit) return;
    validLines.forEach((line, index) => entries.push({ ...common, ...line, id: common.id, lineNumber: index + 1 }));
  };
  const voucherCommon = (id, sourceType, source, date, documentNumber, description, object = "") => ({
    id, sourceType, date: normalizedDate(date), documentNumber: String(documentNumber || ""),
    sourceDocument: String(documentNumber || ""), description: String(description || ""), object: String(object || ""),
    party: String(source?.party || source?.supplier || source?.counterparty || source?.recipient || source?.client?.name || source?.supplierName || ""),
    currency: String(source?.currency || "EUR").toUpperCase(), enteredAt: source?.enteredAt || source?.createdAt || source?.created_at || "",
    enteredBy: source?.enteredBy || source?.createdBy || source?.createdByEmail || source?.author || source?.authorEmail || ""
  });

  const salesVoucher = (entries, invoice) => {
    if (["draft", "void"].includes(invoice.status)) return;
    const total = roundMoney(invoice.total);
    if (total <= 0 || !isDate(invoice.date)) return;
    const id = `sales-invoice-${invoice.id || invoice.number}`;
    const common = voucherCommon(id, "salesInvoice", invoice, invoice.date, invoice.number || invoice.invoiceNumber, invoice.note || "", invoice.objectName || invoice.object);
    const revenueLines = [];
    let lineTotal = 0;
    for (const item of (invoice.items || []).filter(line => line && !line.isTextLine)) {
      const amount = amountForLine(item);
      if (!amount) continue;
      const code = validAccount(item.accountCode, "3000", "income");
      revenueLines.push(makeLine(common, code, 0, amount, { description: item.description || common.description, object: item.objectName || common.object }));
      lineTotal += amount;
    }
    const revenueAccount = validAccount(invoice.accountCode, "3000", "income");
    const difference = roundMoney(total - lineTotal);
    if (!revenueLines.length) revenueLines.push(makeLine(common, revenueAccount, 0, total));
    else if (difference !== 0) revenueLines.push(makeLine(common, revenueAccount, 0, difference));
    addVoucher(entries, common, [makeLine(common, "1200", total, 0), ...revenueLines]);
  };

  const supplierInvoiceVoucher = (entries, invoice) => {
    if (["draft", "void"].includes(invoice.status)) return;
    const total = roundMoney(invoice.amount);
    if (total <= 0 || !isDate(invoice.date)) return;
    const id = `supplier-invoice-${invoice.id}`;
    const common = voucherCommon(id, "supplierInvoice", invoice, invoice.date, invoice.invoiceNumber, invoice.description || invoice.note || invoice.supplierName, invoice.objectName);
    const defaultCostCode = validAccount(invoice.accountCode, invoice.invoiceLine === "expense" ? "6000" : "5000", "expense");
    const costLines = [];
    let lineTotal = 0;
    for (const item of (invoice.items || []).filter(line => line && !line.isTextLine)) {
      const amount = amountForLine(item);
      if (!amount) continue;
      const code = validAccount(item.accountCode, defaultCostCode, "expense");
      costLines.push(makeLine(common, code, amount, 0, { description: item.description || common.description, object: item.objectName || common.object }));
      lineTotal += amount;
    }
    const difference = roundMoney(total - lineTotal);
    if (!costLines.length) costLines.push(makeLine(common, defaultCostCode, total, 0));
    else if (difference !== 0) costLines.push(makeLine(common, defaultCostCode, difference, 0));
    addVoucher(entries, common, [...costLines, makeLine(common, "2000", 0, total)]);
  };

  const paymentFingerprint = (kind, invoiceId, date, amount, method) => `${kind}|${String(invoiceId || "")}|${normalizedDate(date)}|${Math.round(Math.abs(Number(amount) || 0) * 100)}|${method || ""}`;
  const buildPayment = (entries, record, sourceType, linkedKind = "") => {
    const amount = roundMoney(record.amount);
    const date = normalizedDate(record.date || record.paid_at || record.enteredAt);
    if (amount <= 0 || !isDate(date) || ["draft", "void"].includes(record.status)) return;
    const invoiceId = record.relatedInvoiceId || "";
    const kind = linkedKind || (record.direction === "incoming" ? "client" : "supplier");
    const id = `payment-${record.relatedInvoicePaymentId || record.id || paymentFingerprint(kind, invoiceId, date, amount, record.paymentMethod || record.payment_method)}`;
    const description = record.note || record.description || record.category || (kind === "client" ? "Laekumine" : "Makse");
    const sourceDocument = record.documentReference || record.referenceNumber || record.invoiceNumber || invoiceId || record.bankReference || record.bankImportId || record.id;
    const common = voucherCommon(id, sourceType, record, date, sourceDocument, description, record.objectName || record.object);
    const cashCode = validAccount(cashAccountFor(record), "1000");
    if (invoiceId && kind === "client") addVoucher(entries, common, [makeLine(common, cashCode, amount, 0), makeLine(common, "1200", 0, amount)]);
    else if (invoiceId && kind === "supplier") addVoucher(entries, common, [makeLine(common, "2000", amount, 0), makeLine(common, cashCode, 0, amount)]);
    else if (record.paymentOrigin === "bank-import-advance" || String(record.paymentOrigin || "").endsWith("-payment-advance")) addVoucher(entries, common, record.direction === "incoming"
      ? [makeLine(common, cashCode, amount, 0), makeLine(common, "2000", 0, amount)]
      : [makeLine(common, "1200", amount, 0), makeLine(common, cashCode, 0, amount)]);
    else {
      const rawCode = record.accountCode || record.expenseAccount || record.account;
      const matched = getLedgerAccounts().find(account => String(account.code) === String(rawCode) || account.label === rawCode)?.code;
      const accountType = record.direction === "incoming" ? "income" : "expense";
      const accountCode = validAccount(matched, record.direction === "incoming" ? "3000" : "4000", accountType);
      addVoucher(entries, common, record.direction === "incoming"
        ? [makeLine(common, cashCode, amount, 0), makeLine(common, accountCode, 0, amount)]
        : [makeLine(common, accountCode, amount, 0), makeLine(common, cashCode, 0, amount)]);
    }
  };

  const buildAccountingLedgerEntries = (start, end) => {
    const entries = [];
    for (const invoice of invoices) salesVoucher(entries, invoice);
    for (const invoice of supplierInvoices) supplierInvoiceVoucher(entries, invoice);

    const matchedPayments = new Map();
    const paymentIds = new Set();
    for (const payment of purchases) {
      const linkedKind = payment.paymentOrigin === "client-invoice-payment" || payment.direction === "incoming" ? "client" : payment.paymentOrigin === "supplier-invoice-settlement" ? "supplier" : "";
      if (payment.relatedInvoiceId && linkedKind) {
        const signature = paymentFingerprint(linkedKind, payment.relatedInvoiceId, payment.date, payment.amount, payment.paymentMethod || payment.payment_method);
        matchedPayments.set(signature, (matchedPayments.get(signature) || 0) + 1);
        if (payment.relatedInvoicePaymentId) paymentIds.add(String(payment.relatedInvoicePaymentId));
        buildPayment(entries, payment, "invoicePayment", linkedKind);
      } else if (payment.paymentOrigin || payment.bankImportId || payment.direction) {
        buildPayment(entries, payment, "directPayment");
      } else {
        const amount = roundMoney(payment.amount);
        if (amount <= 0 || !isDate(payment.date)) continue;
        const due = Math.max(0, Number(payment.amountDue ?? amount) || 0);
        const costCode = validAccount(payment.accountCode, payment.category === "expense" ? "6000" : "4000", "expense");
        const creditCode = due > 0 ? "2000" : validAccount(cashAccountFor(payment), "1000");
        const common = voucherCommon(`purchase-document-${payment.id || payment.date + "-" + payment.category + "-" + payment.amount}`, "purchase", payment, payment.date, payment.invoiceNumber || payment.category || payment.documentNumber, payment.note || payment.description || payment.category, payment.objectName || payment.object);
        addVoucher(entries, common, [makeLine(common, costCode, amount, 0), makeLine(common, creditCode, 0, amount)]);
      }
    }

    const appendEmbeddedPayments = (kind, documents) => {
      for (const invoice of documents) {
        for (const payment of invoice.payments || []) {
          const date = payment.date || payment.paid_at;
          const amount = roundMoney(payment.amount);
          if (!amount || !isDate(normalizedDate(date))) continue;
          const signature = paymentFingerprint(kind, invoice.id || invoice.number, date, amount, payment.method || payment.payment_method);
          if (payment.id && paymentIds.has(String(payment.id))) continue;
          const linkedCount = matchedPayments.get(signature) || 0;
          if (linkedCount > 0) { matchedPayments.set(signature, linkedCount - 1); continue; }
          buildPayment(entries, { ...payment, id: payment.id || signature, relatedInvoiceId: invoice.id || invoice.number, date, direction: kind === "client" ? "incoming" : "outgoing", supplier: kind === "client" ? invoice.client?.name : invoice.supplierName, documentReference: invoice.number || invoice.invoiceNumber, currency: invoice.currency }, "invoicePayment", kind);
        }
      }
    };
    appendEmbeddedPayments("client", invoices);
    appendEmbeddedPayments("supplier", supplierInvoices);

    for (const expense of expenses) {
      if (["draft", "void"].includes(expense.status) || !isDate(expense.date) || roundMoney(expense.amount) <= 0) continue;
      const duplicateInvoice = supplierInvoices.some(invoice => invoice.date === expense.date && roundMoney(invoice.amount) === roundMoney(expense.amount) && String(invoice.invoiceNumber || "") === String(expense.invoiceNumber || "") && String(invoice.supplierName || "") === String(expense.supplierName || ""));
      if (duplicateInvoice) continue;
      const amount = roundMoney(expense.amount);
      const common = voucherCommon(`legacy-expense-${expense.id || expense.date + "-" + expense.name}`, "legacyExpense", expense, expense.date, expense.invoiceNumber, expense.name || expense.description, expense.objectName);
      const debitCode = validAccount(expense.accountCode, "6000", "expense");
      const creditCode = expense.status === "paid" ? validAccount(cashAccountFor(expense), "1000") : "2000";
      addVoucher(entries, common, [makeLine(common, debitCode, amount, 0), makeLine(common, creditCode, 0, amount)]);
    }

    for (const manual of manualJournalEntries) {
      if (!isDate(manual.date)) continue;
      const common = { ...voucherCommon(`manual-${manual.id}`, "manual", manual, manual.date, manual.documentNumber, manual.description || manual.internalInfo, manual.object), correctionOf: String(manual.correctionOf || ""), correctionDocument: String(manual.correctionDocument || "") };
      const lines = Array.isArray(manual.lines) ? manual.lines : [{ accountCode: manual.debitAccount, debit: manual.amount }, { accountCode: manual.creditAccount, credit: manual.amount }];
      addVoucher(entries, common, lines.map(line => makeLine(common, validAccount(line.accountCode, ""), line.debit, line.credit, { description: line.description || common.description, object: line.object || common.object })));
    }

    const fixedAssets = readStorage(STORAGE.fixedAssets, []);
    for (const asset of fixedAssets) for (const depreciation of Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : []) {
      if (!depreciation?.date || !roundMoney(depreciation.amount)) continue;
      const amount = roundMoney(depreciation.amount), common = voucherCommon(`asset-depreciation-${depreciation.id}`, "assetDepreciation", depreciation, depreciation.date, depreciation.documentNumber, depreciation.description || "Põhivara amortisatsioon", depreciation.objectName || asset.objectName);
      addVoucher(entries, common, [makeLine(common, validAccount(depreciation.expenseAccount || asset.expenseAccount, "6000"), amount, 0), makeLine(common, validAccount(depreciation.depreciationAccount || asset.depreciationAccount, "2000"), 0, amount)]);
    }

    if (isDate(ledgerOpeningBalances.effectiveDate)) {
      const common = voucherCommon(`opening-balances-${ledgerOpeningBalances.effectiveDate}`, "openingBalance", {}, ledgerOpeningBalances.effectiveDate, "ALG", "Algsaldo");
      const lines = Object.entries(ledgerOpeningBalances.accounts || {}).map(([code, value]) => makeLine(common, code, value.debit, value.credit));
      addVoucher(entries, common, lines);
    }

    return entries.filter(entry => (!start || entry.date >= start) && (!end || entry.date <= end)).sort((first, second) => first.date.localeCompare(second.date) || first.id.localeCompare(second.id) || first.lineNumber - second.lineNumber);
  };

  const demoAwareCreateLedgerEntries = createLedgerEntries;
  let ledgerDemoMode = false;
  createLedgerEntries = (start, end) => ledgerDemoMode ? demoAwareCreateLedgerEntries(start, end) : buildAccountingLedgerEntries(start, end);
  const baseSetLedgerDemoMode = window.setLedgerDemoMode;
  if (typeof baseSetLedgerDemoMode === "function") window.setLedgerDemoMode = enabled => { ledgerDemoMode = Boolean(enabled); baseSetLedgerDemoMode(enabled); };
  window.createAccountingLedgerEntries = buildAccountingLedgerEntries;
  window.getLedgerOpeningBalances = start => {
    const balances = new Map();
    if (!start) return balances;
    for (const entry of buildAccountingLedgerEntries("0001-01-01", shiftDate(start, -1))) balances.set(entry.accountCode, roundMoney((balances.get(entry.accountCode) || 0) + Number(entry.debit || 0) - Number(entry.credit || 0)));
    return balances;
  };
  window.hasLedgerOpeningBalances = () => Boolean(isDate(ledgerOpeningBalances.effectiveDate) && Object.keys(ledgerOpeningBalances.accounts || {}).length);
  const baseGenerateGeneralLedger = generateGeneralLedger;
  generateGeneralLedger = (...args) => {
    const start = document.getElementById("ledgerStartDate")?.value || "";
    const originalCreateLedgerEntries = createLedgerEntries;
    const openingAtPeriodStart = !ledgerDemoMode && isDate(start) && ledgerOpeningBalances.effectiveDate === start;
    if (openingAtPeriodStart) createLedgerEntries = (from, to) => originalCreateLedgerEntries(from, to).filter(entry => entry.sourceType !== "openingBalance" || entry.date !== start);
    let result;
    try { result = baseGenerateGeneralLedger(...args); }
    finally { createLedgerEntries = originalCreateLedgerEntries; }
    if (!start || !Array.isArray(lastLedgerEntries)) return result;
    const balances = window.getLedgerOpeningBalances(start);
    if (openingAtPeriodStart) {
      for (const entry of buildAccountingLedgerEntries(start, start)) {
        if (entry.sourceType !== "openingBalance") continue;
        const accountCode = String(entry.accountCode || "");
        balances.set(accountCode, roundMoney((balances.get(accountCode) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0)));
      }
    }
    const openingRows = [...balances.entries()].filter(([, value]) => value !== 0).map(([accountCode, value]) => ({
      id: `opening-display-${start}-${accountCode}`, sourceType: "openingBalanceDisplay", date: start,
      documentNumber: "ALG", object: "", description: translateCopy("Начальное сальдо", "ledgerOpeningBalancesTitle"),
      accountCode, account: accountFor(accountCode)?.label || accountCode, debit: 0, credit: 0, balance: value
    }));
    for (const entry of lastLedgerEntries) {
      const accountCode = String(entry.accountCode || "");
      balances.set(accountCode, roundMoney((balances.get(accountCode) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0)));
      entry.balance = balances.get(accountCode);
    }
    lastLedgerEntries = [...openingRows, ...lastLedgerEntries];
    const body = document.getElementById("ledgerTableRows");
    if (body) body.innerHTML = lastLedgerEntries.map(entry => `<tr><td>${escapeHtml(formatDate(entry.date))}</td><td>${escapeHtml(entry.documentNumber || "")}</td><td>${escapeHtml(entry.object || "")}</td><td>${escapeHtml(entry.accountCode)} · ${escapeHtml(entry.account || "")}</td><td>${escapeHtml(entry.description || "")}</td><td>${entry.debit ? money(entry.debit) : "—"}</td><td>${entry.credit ? money(entry.credit) : "—"}</td><td>${money(entry.balance || 0)} EUR</td></tr>`).join("") || `<tr><td colspan="8" class="empty-row">${escapeHtml(translateCopy("Нет проводок за выбранный период.", "ledgerEmpty"))}</td></tr>`;
    return result;
  };
  const shiftDate = (date, days) => { const [year, month, day] = date.split("-").map(Number); const shifted = new Date(year, month - 1, day + days); return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}-${String(shifted.getDate()).padStart(2, "0")}`; };

  const monthlyLedgerSummary = (start, end) => {
    const accounts = accountByCode(), result = { sales: 0, buy: 0, cost: 0 };
    for (const entry of buildAccountingLedgerEntries(start, end)) {
      const account = accounts.get(entry.accountCode);
      if (account?.type === "income") result.sales += Number(entry.credit || 0) - Number(entry.debit || 0);
      if (account?.type === "expense") {
        if (account.reportGroup === "purchases") result.buy += Number(entry.debit || 0) - Number(entry.credit || 0);
        else result.cost += Number(entry.debit || 0) - Number(entry.credit || 0);
      }
    }
    return result;
  };
  reportData = year => monthNames.map((name, index) => {
    const month = String(index + 1).padStart(2, "0"), totals = monthlyLedgerSummary(`${year}-${month}-01`, `${year}-${month}-${String(new Date(year, index + 1, 0).getDate()).padStart(2, "0")}`);
    return { name, ...totals, total: totals.buy + totals.cost };
  });
  const accountingDataSnapshot = () => JSON.stringify({
    invoices: invoices.map(item => [item.id, item.number, item.date, item.total, item.status, item.amountDue, (item.items || []).map(line => [line.accountCode, line.quantity, line.price, line.discountPercent, line.taxRate, line.isTextLine]), (item.payments || []).map(payment => [payment.id, payment.date, payment.amount, payment.status])]),
    purchases: purchases.map(item => [item.id, item.date, item.amount, item.amountDue, item.accountCode, item.category, item.status, item.direction, item.paymentOrigin, item.relatedInvoiceId, item.paymentMethod, item.payment_method, item.invoiceNumber, item.supplier, item.note]),
    supplierInvoices: supplierInvoices.map(item => [item.id, item.date, item.amount, item.status, item.accountCode, item.invoiceLine, item.invoiceNumber, item.supplierName, (item.items || []).map(line => [line.accountCode, line.quantity, line.price, line.discountPercent, line.taxRate, line.isTextLine]), (item.payments || []).map(payment => [payment.id, payment.date, payment.amount, payment.status])]),
    expenses: expenses.map(item => [item.id, item.date, item.amount, item.status, item.accountCode, item.invoiceNumber, item.supplierName]),
    journals: manualJournalEntries.map(item => [item.id, item.date, item.lines, item.correctionOf, item.correctionDocument]),
    depreciation: readStorage(STORAGE.fixedAssets, []).map(asset => [asset.id, (asset.depreciationEntries || []).map(item => [item.id, item.date, item.amount, item.expenseAccount, item.depreciationAccount, item.assetAccount])]),
    opening: ledgerOpeningBalances,
    accounts: accountPlanEntries.map(account => [account.code, account.type, account.active, account.reportGroup, account.annualReportLine])
  });
  let lastAccountingDataSnapshot = accountingDataSnapshot();
  const baseRenderReportForLedger = renderReport;
  renderReport = (...args) => {
    const result = baseRenderReportForLedger(...args);
    const snapshot = accountingDataSnapshot();
    if (snapshot !== lastAccountingDataSnapshot) {
      lastAccountingDataSnapshot = snapshot;
      document.dispatchEvent(new Event("accounting-ledger-updated"));
    }
    return result;
  };
  const defaultAnnualReportLines = { "1000": "CashAndCashEquivalents", "1100": "CashAndCashEquivalents", "1200": "ShortTermAccountsReceivable", "2000": "ShortTermTradePayablesTotal", "2900": "OtherEquity", "3000": "Revenue", "4000": "RawMaterialsAndConsumablesUsed", "5000": "RawMaterialsAndConsumablesUsed", "6000": "OtherOperatingExpense" };
  const annualReportLineFor = account => String(account.annualReportLine || defaultAnnualReportLines[String(account.code)] || "").split("_").at(-1);
  const annualReportFormCodeFor = type => ["asset", "liability"].includes(type) ? "201012" : "301011";
  window.getAnnualReportAccountLine = annualReportLineFor;
  window.calculateAnnualReportFacts = (forms, periods) => {
    const latestEnd = [periods.current.end, periods.prior.end].filter(Boolean).sort().at(-1);
    if (!latestEnd) return { facts: {}, unmappedAccounts: [] };
    const accounts = getLedgerAccounts();
    const reportLines = new Map(forms.flatMap(form => (form.rows || []).filter(row => !row.abstract && row.type !== "xbrli:stringItemType").map(row => [row.name, { formCode: form.code, periodType: row.periodType, balance: row.balance }])));
    const hasValidReportLine = account => {
      const line = reportLines.get(annualReportLineFor(account));
      const sideIsValid = account.type === "asset" ? line?.balance === "debit" : account.type === "liability" ? line?.balance === "credit" : true;
      return Boolean(line && sideIsValid && line.formCode === annualReportFormCodeFor(account.type) && line.periodType === (["asset", "liability"].includes(account.type) ? "instant" : "duration"));
    };
    const allEntries = buildAccountingLedgerEntries("0001-01-01", latestEnd);
    const activityFor = range => {
      const balances = new Map();
      for (const entry of allEntries) {
        if (entry.date < range.start || entry.date > range.end) continue;
        const code = String(entry.accountCode || "");
        balances.set(code, (balances.get(code) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0));
      }
      return balances;
    };
    const closingFor = end => {
      const balances = new Map();
      for (const entry of allEntries) {
        if (entry.date > end) continue;
        const code = String(entry.accountCode || "");
        balances.set(code, (balances.get(code) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0));
      }
      return balances;
    };
    const currentActivity = activityFor(periods.current), priorActivity = activityFor(periods.prior);
    const currentClosing = closingFor(periods.current.end), priorClosing = closingFor(periods.prior.end);
    const balanceRows = forms.find(form => form.code === "201012")?.rows || [];
    const membersOf = name => {
      const index = balanceRows.findIndex(row => row.name === name);
      if (index < 0) return new Set();
      const depth = Number(balanceRows[index].depth);
      let end = index + 1;
      while (end < balanceRows.length && Number(balanceRows[end].depth) > depth) end++;
      return new Set(balanceRows.slice(index + 1, end).map(row => row.name));
    };
    const currentAssetLines = membersOf("CurrentAssetsAbstract"), nonCurrentAssetLines = membersOf("NonCurrentAssetsAbstract");
    const currentLiabilityLines = membersOf("CurrentLiabilitiesAbstract"), nonCurrentLiabilityLines = membersOf("NonCurrentLiabilitiesAbstract");
    const equityLines = membersOf("EquityAbstract");
    const netProfit = activity => roundMoney(accounts.reduce((sum, account) => {
      const value = activity.get(String(account.code)) || 0;
      return sum + (account.type === "income" ? -value : account.type === "expense" ? -value : 0);
    }, 0));
    const accumulatedProfit = balances => roundMoney(accounts.reduce((sum, account) => {
      const value = balances.get(String(account.code)) || 0;
      return sum + (account.type === "income" ? -value : account.type === "expense" ? -value : 0);
    }, 0));
    const currentPriorProfit = accumulatedProfit(closingFor(shiftDate(periods.current.start, -1)));
    const priorPriorProfit = accumulatedProfit(closingFor(shiftDate(periods.prior.start, -1)));
    const accountTotal = (balances, predicate, normalSide) => roundMoney(accounts.reduce((sum, account) => {
      if (!predicate(account)) return sum;
      const value = balances.get(String(account.code)) || 0;
      return sum + (normalSide === "credit" ? -value : value);
    }, 0));
    const facts = {};
    for (const form of forms) {
      const rows = form.rows || [];
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.abstract || row.type === "xbrli:stringItemType") continue;
        let endIndex = index + 1;
        while (endIndex < rows.length && Number(rows[endIndex].depth) > Number(row.depth)) endIndex++;
        const subtree = new Set(rows.slice(index, endIndex).map(item => item.name));
        const valueFor = (period, activity, closing, openingProfit) => {
          if (row.name === "AnnualPeriodProfitLoss" || row.name === "TotalAnnualPeriodProfitLoss") return netProfit(activity);
          if (row.name === "TotalProfitLoss" || row.name === "TotalProfitLossBeforeTax") return netProfit(activity);
          const balances = row.periodType === "instant" ? closing : activity;
          if (row.name === "Assets") return accountTotal(balances, account => account.type === "asset", "debit");
          if (row.name === "CurrentAssets") return accountTotal(balances, account => account.type === "asset" && currentAssetLines.has(annualReportLineFor(account)), "debit");
          if (row.name === "NonCurrentAssets") return accountTotal(balances, account => account.type === "asset" && nonCurrentAssetLines.has(annualReportLineFor(account)), "debit");
          if (row.name === "CurrentLiabilities") return accountTotal(balances, account => account.type === "liability" && currentLiabilityLines.has(annualReportLineFor(account)), "credit");
          if (row.name === "NonCurrentLiabilities") return accountTotal(balances, account => account.type === "liability" && nonCurrentLiabilityLines.has(annualReportLineFor(account)), "credit");
          if (row.name === "Liabilities") return accountTotal(balances, account => account.type === "liability" && !equityLines.has(annualReportLineFor(account)), "credit");
          if (row.name === "RetainedEarningsLoss") return roundMoney(accountTotal(balances, account => account.type === "liability" && annualReportLineFor(account) === row.name, "credit") + openingProfit);
          if (row.name === "Equity") return roundMoney(accountTotal(balances, account => account.type === "liability" && equityLines.has(annualReportLineFor(account)), "credit") + openingProfit + netProfit(activity));
          if (row.name === "LiabilitiesAndEquity") return roundMoney(accountTotal(balances, account => account.type === "liability" && !equityLines.has(annualReportLineFor(account)), "credit") + accountTotal(balances, account => account.type === "liability" && equityLines.has(annualReportLineFor(account)), "credit") + openingProfit + netProfit(activity));
          return roundMoney(accounts.reduce((sum, account) => {
            const mappedLine = annualReportLineFor(account);
            if (!subtree.has(mappedLine)) return sum;
            const value = balances.get(String(account.code)) || 0;
            if (row.periodType === "instant") return sum + (account.type === "liability" ? -value : value);
            return sum + (account.type === "income" || account.type === "expense" ? -value : 0);
          }, 0));
        };
        facts[row.name] = {
          current: valueFor(periods.current, currentActivity, currentClosing, currentPriorProfit),
          prior: valueFor(periods.prior, priorActivity, priorClosing, priorPriorProfit)
        };
      }
    }
    const unmappedAccounts = accounts.filter(account => {
      if (hasValidReportLine(account)) return false;
      const hasBalance = account.type === "asset" || account.type === "liability"
        ? (currentClosing.get(String(account.code)) || 0) !== 0 || (priorClosing.get(String(account.code)) || 0) !== 0
        : (currentActivity.get(String(account.code)) || 0) !== 0 || (priorActivity.get(String(account.code)) || 0) !== 0;
      return hasBalance;
    }).map(account => ({ code: String(account.code), label: account.label }));
    return { facts, unmappedAccounts };
  };
  summarizeProfitPeriod = period => {
    const totals = monthlyLedgerSummary(period.start, period.end), costs = totals.buy + totals.cost;
    return { ...period, ...totals, purchases: totals.buy, supplierInvoices: 0, otherExpenses: totals.cost, costs, result: totals.sales - costs };
  };
  Object.assign(ruTexts, {
    balanceSheetAssets: "Активы",
    balanceSheetLiabilities: "Обязательства",
    balanceSheetEquity: "Капитал",
    balanceSheetRetained: "Накопленная прибыль / убыток",
    balanceSheetLiabilitiesEquity: "Обязательства и капитал",
    balanceSheetDifference: "Разница (должна быть 0)",
    balanceSheetBalanced: "Баланс сходится: активы равны обязательствам и капиталу.",
    balanceSheetUnbalanced: "Баланс не сходится. Проверьте начальные остатки и проводки.",
    balanceSheetNoOpening: "Начальные остатки не заданы; баланс может быть неполным.",
    balanceDisclaimer: "Сальдо на выбранную дату рассчитано по бухгалтерским проводкам."
  });
  Object.assign(etTexts, {
    balanceSheetAssets: "Aktiva",
    balanceSheetLiabilities: "Kohustised",
    balanceSheetEquity: "Omakapital",
    balanceSheetRetained: "Jaotamata kasum / kahjum",
    balanceSheetLiabilitiesEquity: "Kohustised ja omakapital",
    balanceSheetDifference: "Erinevus (peab olema 0)",
    balanceSheetBalanced: "Bilanss klapib: aktiva võrdub kohustiste ja omakapitaliga.",
    balanceSheetUnbalanced: "Bilanss ei klapi. Kontrollige algsaldo ja kanded üle.",
    balanceSheetNoOpening: "Algsaldod puuduvad; bilanss võib olla mittetäielik.",
    balanceDisclaimer: "Valitud kuupäeva saldod arvutatakse pearaamatu kannetest."
  });
  const balanceSheetAt = date => {
    if (!isDate(date)) return null;
    const accounts = getLedgerAccounts(), balances = new Map();
    for (const entry of buildAccountingLedgerEntries("0001-01-01", date)) {
      const code = String(entry.accountCode || "");
      balances.set(code, roundMoney((balances.get(code) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0)));
    }
    const accountBalances = Object.fromEntries(accounts.map(account => [account.code, balances.get(account.code) || 0]));
    const assetAccounts = accounts.filter(account => account.type === "asset");
    const liabilityAccounts = accounts.filter(account => account.type === "liability" && account.reportGroup !== "balance");
    const equityAccounts = accounts.filter(account => account.type === "liability" && account.reportGroup === "balance");
    const total = (items, normalSide) => roundMoney(items.reduce((sum, account) => {
      const balance = accountBalances[account.code] || 0;
      return sum + (normalSide === "credit" ? -balance : balance);
    }, 0));
    const retainedEarnings = roundMoney(accounts.reduce((sum, account) => {
      if (account.type !== "income" && account.type !== "expense") return sum;
      return sum - (accountBalances[account.code] || 0);
    }, 0));
    const assets = total(assetAccounts, "debit");
    const liabilities = total(liabilityAccounts, "credit");
    const equity = roundMoney(total(equityAccounts, "credit") + retainedEarnings);
    const liabilitiesAndEquity = roundMoney(liabilities + equity);
    return {
      date,
      accounts,
      accountBalances,
      assetAccounts,
      liabilityAccounts,
      equityAccounts,
      assets,
      liabilities,
      retainedEarnings,
      equity,
      liabilitiesAndEquity,
      difference: roundMoney(assets - liabilitiesAndEquity),
      balanced: Math.round(assets * 100) === Math.round(liabilitiesAndEquity * 100),
      hasOpeningBalances: isDate(ledgerOpeningBalances.effectiveDate) && ledgerOpeningBalances.effectiveDate <= date && Object.keys(ledgerOpeningBalances.accounts || {}).length > 0
    };
  };
  window.calculateAccountingBalanceSheet = balanceSheetAt;
  summarizeBalancePeriod = period => ({ ...period, ...balanceSheetAt(period.end) });
  let lastBalanceSheets = [];
  generateBalanceReport = () => {
    const periods = balancePeriodRanges().map(period => ({ ...period, ...balanceSheetAt(period.end) }));
    if (periods.some(period => !period.accounts)) return false;
    lastBalanceSheets = periods;
    const showZero = document.getElementById("balanceShowZeroRows").checked;
    const columns = periods.length + 1;
    const formatRow = (label, values, className = "") => `<tr${className ? ` class="${className}"` : ""}><th scope="row">${escapeHtml(label)}</th>${values.map(value => `<td>${money(value)} EUR</td>`).join("")}</tr>`;
    const sectionRow = label => `<tr class="balance-sheet-section"><th colspan="${columns}">${escapeHtml(label)}</th></tr>`;
    const accountRows = (key, accountList, normalSide) => accountList
      .filter(account => showZero || periods.some(period => (period.accountBalances[account.code] || 0) !== 0))
      .map(account => formatRow(`${account.code} · ${account.label}`, periods.map(period => {
        const balance = period.accountBalances[account.code] || 0;
        return normalSide === "credit" ? -balance : balance;
      }), `balance-sheet-account ${key}`)).join("");
    const rows = [sectionRow(copy("balanceSheetAssets")), accountRows("asset-account", periods[0].assetAccounts, "debit"), formatRow(copy("balanceSheetAssets"), periods.map(period => period.assets), "balance-sheet-total"), sectionRow(copy("balanceSheetLiabilities")), accountRows("liability-account", periods[0].liabilityAccounts, "credit"), formatRow(copy("balanceSheetLiabilities"), periods.map(period => period.liabilities), "balance-sheet-total"), sectionRow(copy("balanceSheetEquity")), accountRows("equity-account", periods[0].equityAccounts, "credit"), formatRow(copy("balanceSheetRetained"), periods.map(period => period.retainedEarnings), "balance-sheet-account"), formatRow(copy("balanceSheetEquity"), periods.map(period => period.equity), "balance-sheet-total"), formatRow(copy("balanceSheetLiabilitiesEquity"), periods.map(period => period.liabilitiesAndEquity), "balance-sheet-total"), formatRow(copy("balanceSheetDifference"), periods.map(period => period.difference), "balance-sheet-difference")].join("");
    document.getElementById("balanceResultTitle").textContent = copy("balanceTitle");
    document.getElementById("balanceResultPeriod").textContent = periods.map(period => `${period.label} · ${formatDate(period.end)}`).join(" · ");
    document.getElementById("balanceTableHead").innerHTML = `<tr><th>${escapeHtml(copy("ledgerAccountLabel"))}</th>${periods.map(period => `<th>${escapeHtml(period.label)}</th>`).join("")}</tr>`;
    document.getElementById("balanceTableRows").innerHTML = rows;
    let status = document.getElementById("balanceEquationStatus");
    if (!status) {
      status = document.createElement("p");
      status.id = "balanceEquationStatus";
      status.className = "hint balance-equation-status";
      document.getElementById("balanceResults").querySelector(".table-wrap")?.before(status);
    }
    const allBalanced = periods.every(period => period.balanced);
    status.textContent = `${copy(allBalanced ? "balanceSheetBalanced" : "balanceSheetUnbalanced")}${periods.some(period => !period.hasOpeningBalances) ? ` ${copy("balanceSheetNoOpening")}` : ""}`;
    status.classList.toggle("is-error", !allBalanced);
    document.getElementById("balanceResults").hidden = false;
    return true;
  };
  exportBalanceReport = () => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    if (document.getElementById("balanceResults").hidden || !lastBalanceSheets.length) generateBalanceReport();
    const periods = lastBalanceSheets;
    if (!periods.length) return;
    const reportRows = [];
    const append = (label, values) => reportRows.push([label, ...values.map(value => Number(value || 0).toFixed(2))]);
    for (const [label, list, normalSide] of [[copy("balanceSheetAssets"), periods[0].assetAccounts, "debit"], [copy("balanceSheetLiabilities"), periods[0].liabilityAccounts, "credit"], [copy("balanceSheetEquity"), periods[0].equityAccounts, "credit"]]) {
      reportRows.push([label, ...periods.map(() => "")]);
      for (const account of list) append(`${account.code} · ${account.label}`, periods.map(period => {
        const value = period.accountBalances[account.code] || 0;
        return normalSide === "credit" ? -value : value;
      }));
      append(label, periods.map(period => label === copy("balanceSheetAssets") ? period.assets : label === copy("balanceSheetLiabilities") ? period.liabilities : period.equity));
      if (label === copy("balanceSheetEquity")) append(copy("balanceSheetRetained"), periods.map(period => period.retainedEarnings));
    }
    append(copy("balanceSheetLiabilitiesEquity"), periods.map(period => period.liabilitiesAndEquity));
    append(copy("balanceSheetDifference"), periods.map(period => period.difference));
    const cell = value => {
      let text = String(value ?? "");
      if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
      return `"${text.replaceAll('"', '""')}"`;
    };
    const data = [[copy("ledgerAccountLabel"), ...periods.map(period => `${period.label} · ${period.end}`)], ...reportRows];
    triggerBlobDownload(new Blob(["\ufeff", data.map(row => row.map(cell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" }), `bilanss-${localDate()}.csv`);
  };

  const getAccountPlanPanel = () => document.getElementById("accountPlanPanel");
  const accountTypeLabel = type => ({ asset: copy("Активы", "Aktiva", "accountPlanAsset"), liability: copy("Пассивы", "Passiva", "accountPlanLiability"), income: copy("Доходы", "Tulud", "accountPlanIncome"), expense: copy("Расходы", "Kulud", "accountPlanExpense") })[type] || type;
  Object.assign(ruTexts, { accountPlanPagination: "Страницы плана счетов" });
  Object.assign(etTexts, { accountPlanPagination: "Kontoplaani leheküljed" });
  let accountPlanCurrentPage = 1;
  const accountPlanPageSize = 10;
  const annualReportLineOptions = (selected, type) => `<option value="">${escapeHtml(translateCopy("Не назначено", "accountPlanAnnualReportLine"))}</option>${(window.annualReportProfile?.forms || []).filter(form => form.code === annualReportFormCodeFor(type)).map(form => `<optgroup label="${escapeHtml(form.title)}">${form.rows.filter(concept => !concept.abstract && concept.type !== "xbrli:stringItemType").map(concept => `<option value="${escapeHtml(concept.name)}" ${annualReportLineFor({ annualReportLine: selected }) === concept.name ? "selected" : ""}>${escapeHtml(concept.label)}</option>`).join("")}</optgroup>`).join("")}`;
  const renderAccountPlan = () => {
    const panel = getAccountPlanPanel(), body = document.getElementById("accountPlanRows");
    if (!panel || !body) return;
    let pagination = panel.querySelector("#accountPlanPagination");
    if (!pagination) {
      pagination = document.createElement("div");
      pagination.id = "accountPlanPagination";
      pagination.className = "register-page-footer account-plan-pagination";
      pagination.innerHTML = '<nav class="register-page-numbers"></nav>';
      panel.querySelector(".account-plan-table-wrap").after(pagination);
    }
    const header = panel.querySelector(".account-plan-table thead tr");
    if (header && !header.querySelector("[data-annual-report-line-header]")) {
      const cell = document.createElement("th");
      cell.dataset.annualReportLineHeader = "true";
      cell.dataset.accountPlanColumn = "annualReportLine";
      cell.dataset.i18n = "accountPlanAnnualReportLine";
      cell.textContent = translateCopy("Строка годового отчёта", "accountPlanAnnualReportLine");
      header.append(cell);
    }
    const query = panel.querySelector("#accountPlanSearch")?.value.trim().toLocaleLowerCase(language) || "", type = panel.querySelector("#accountPlanTypeFilter")?.value || "";
    const rows = accountPlanEntries.filter(account => (!type || account.type === type) && (!query || `${account.code} ${account.descriptionEt} ${account.descriptionEn}`.toLocaleLowerCase(language).includes(query))).sort((a, b) => String(a.code).localeCompare(String(b.code), undefined, { numeric: true }));
    const emptyKey = query || type ? "accountPlanNoMatches" : "accountPlanEmpty";
    const pageCount = Math.max(1, Math.ceil(rows.length / accountPlanPageSize));
    accountPlanCurrentPage = Math.min(accountPlanCurrentPage, pageCount);
    const pageStart = (accountPlanCurrentPage - 1) * accountPlanPageSize;
    const visibleRows = rows.slice(pageStart, pageStart + accountPlanPageSize);
    body.innerHTML = visibleRows.map(account => `<tr data-account-code="${escapeHtml(account.code)}"><td data-account-plan-column="code">${escapeHtml(account.code)}</td><td data-account-plan-column="description">${escapeHtml(language === "et" ? account.descriptionEt : account.descriptionEn || account.descriptionEt)}</td><td data-account-plan-column="type">${escapeHtml(accountTypeLabel(account.type))}</td><td data-account-plan-column="balanceLine">${escapeHtml(account.balanceLine || "—")}</td><td data-account-plan-column="cashFlowLine">${escapeHtml(account.cashFlowLine || "—")}</td><td data-account-plan-column="annualReportLine"><select class="account-plan-line-display" data-account-plan-annual-line="${escapeHtml(account.code)}" tabindex="-1" aria-readonly="true" aria-label="${escapeHtml(account.code)} ${escapeHtml(translateCopy("Строка годового отчёта", "accountPlanAnnualReportLine"))}">${annualReportLineOptions(account.annualReportLine || defaultAnnualReportLines[String(account.code)] || "", account.type)}</select></td></tr>`).join("") || `<tr><td class="account-plan-empty" colspan="6">${escapeHtml(translateCopy(emptyKey === "accountPlanNoMatches" ? "Счета по заданному фильтру не найдены." : "Счета пока не добавлены.", emptyKey))}</td></tr>`;
    panel.querySelectorAll("[data-account-plan-column]").forEach(cell => { const toggle = panel.querySelector(`[data-account-plan-column-toggle="${cell.dataset.accountPlanColumn}"]`); if (toggle) cell.hidden = !toggle.checked; });
    pagination.hidden = rows.length === 0;
    const pageButtons = pagination.querySelector(".register-page-numbers");
    pageButtons.setAttribute("aria-label", translateCopy("Страницы плана счетов", "accountPlanPagination"));
    pageButtons.replaceChildren();
    const addPageButton = pageNumber => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(pageNumber);
      if (pageNumber === accountPlanCurrentPage) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => { accountPlanCurrentPage = pageNumber; renderAccountPlan(); });
      pageButtons.append(button);
    };
    const firstPage = Math.max(1, Math.min(accountPlanCurrentPage - 2, pageCount - 4));
    for (let pageNumber = firstPage; pageNumber <= Math.min(pageCount, firstPage + 4); pageNumber++) addPageButton(pageNumber);
  };
  const accountPlanExportButtons = [...(getAccountPlanPanel()?.querySelectorAll(".account-plan-exports button") || [])];
  const exportAccountPlan = async format => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    if (typeof window.exportTableFile !== "function") return;
    const panel = getAccountPlanPanel();
    const query = panel.querySelector("#accountPlanSearch")?.value.trim().toLocaleLowerCase(language) || "";
    const type = panel.querySelector("#accountPlanTypeFilter")?.value || "";
    const accounts = accountPlanEntries
      .filter(account => (!type || account.type === type) && (!query || `${account.code} ${account.descriptionEt} ${account.descriptionEn}`.toLocaleLowerCase(language).includes(query)))
      .sort((first, second) => String(first.code).localeCompare(String(second.code), undefined, { numeric: true }));
    if (!accounts.length) { showMessage(translateCopy("Нет счетов для экспорта.", "accountPlanExportEmpty"), true); return; }
    const headers = ["accountPlanCode", "accountPlanDescription", "accountPlanTypeColumn", "accountPlanStatementLine", "accountPlanCashFlowLine", "accountPlanAnnualReportLine"]
      .map(key => translateCopy(key, key));
    const rows = accounts.map(account => {
      const annualLine = annualReportLineFor(account);
      const reportForm = (window.annualReportProfile?.forms || []).find(form => form.code === annualReportFormCodeFor(account.type));
      const reportLineLabel = reportForm?.rows.find(concept => concept.name === annualLine)?.label || annualLine || "—";
      return [account.code, language === "et" ? account.descriptionEt : account.descriptionEn || account.descriptionEt, accountTypeLabel(account.type), account.balanceLine || "—", account.cashFlowLine || "—", reportLineLabel];
    });
    const filename = `${language === "et" ? "kontoplaan" : "plan-schetov"}-${localDate()}`;
    const title = translateCopy("План счетов", "accountPlanTab");
    try {
      if (format === "pdf") {
        const blob = await window.createLedgerPdfBlob({ title, period: localDate(), headers, rows });
        triggerBlobDownload(blob, `${filename}.pdf`);
      } else {
        window.exportTableFile({ format, filename, title, headers, rows });
      }
    } catch (error) {
      console.error(error);
      showMessage(translateCopy("Не удалось экспортировать план счетов.", "accountPlanExportError"), true);
    }
  };
  accountPlanExportButtons.forEach((button, index) => {
    const format = ["pdf", "xls", "csv"][index];
    if (!format) return;
    button.dataset.accountPlanExport = format;
    button.disabled = false;
    button.addEventListener("click", () => { void exportAccountPlan(format); });
  });
  const accountRows = document.getElementById("accountPlanRows");
  accountRows?.addEventListener("click", event => {
    if (event.target.closest("button, input, a")) return;
    const row = event.target.closest("tr[data-account-code]");
    const account = accountPlanEntries.find(item => item.code === row?.dataset.accountCode);
    if (!account) return;
    const dialog = document.getElementById("accountPlanCreateDialog");
    document.getElementById("accountPlanCodeInput").value = account.code;
    document.getElementById("accountPlanCodeInput").readOnly = true;
    document.getElementById("accountPlanDescriptionEtInput").value = account.descriptionEt || "";
    document.getElementById("accountPlanDescriptionEnInput").value = account.descriptionEn || "";
    const entryType = document.getElementById("accountPlanEntryType");
    entryType.value = account.type;
    entryType.dispatchEvent(new Event("change", { bubbles: true }));
    document.getElementById("accountPlanBalanceLineInput").value = account.balanceLine || "";
    document.getElementById("accountPlanCashFlowLineInput").value = account.cashFlowLine || "";
    annualReportLineInput.value = account.annualReportLine || defaultAnnualReportLines[String(account.code)] || "";
    window.accountPlanEditingCode = account.code;
    const saveButton = dialog.querySelector('[type="submit"]');
    saveButton.disabled = false;
    saveButton.removeAttribute("title");
    dialog.showModal();
  });
  accountRows?.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest("tr[data-account-code]");
    if (!row || event.target.closest("select, button, input, a")) return;
    event.preventDefault();
    row.querySelector("td")?.click();
  });
  document.getElementById("accountPlanAddButton")?.addEventListener("click", () => {
    window.accountPlanEditingCode = "";
    const codeInput = document.getElementById("accountPlanCodeInput");
    codeInput.readOnly = false;
    const saveButton = document.querySelector("#accountPlanCreateDialog [type=submit]");
    saveButton.disabled = false;
    saveButton.removeAttribute("title");
  });
  window.renderAccountPlan = renderAccountPlan;
  const refreshVisibleAccountingReports = () => {
    const balance = document.getElementById("balanceResults"), profit = document.getElementById("profitResults"), ledger = document.getElementById("ledgerResults"), turnover = document.getElementById("ledgerTurnoverResults");
    if (balance && !balance.hidden) generateBalanceReport();
    if (profit && !profit.hidden) generateProfitLossReport();
    if (ledger && !ledger.hidden) generateGeneralLedger();
    if (turnover && !turnover.hidden) window.refreshLedgerTurnover?.();
  };
  document.addEventListener("accounting-ledger-updated", refreshVisibleAccountingReports);
  window.refreshAccountingLedger = () => { renderAccountPlan(); renderReport(); renderDashboard(); };
  const populateAccountSelect = (select, selectedValue = select.value, type = "") => {
    if (!select) return;
    const accounts = getLedgerAccounts().filter(account => !type || account.type === type);
    select.innerHTML = `<option value="">${escapeHtml(translateCopy("Выберите счет", "invoiceAccountChoose"))}</option>${accounts.map(account => `<option value="${escapeHtml(account.code)}">${escapeHtml(account.code)} · ${escapeHtml(account.label)}</option>`).join("")}`;
    select.value = accounts.some(account => String(account.code) === String(selectedValue)) ? String(selectedValue) : "";
  };
  const baseMakeInvoiceItemRow = makeItemRow;
  makeItemRow = (item = {}) => {
    const row = baseMakeInvoiceItemRow(item);
    populateAccountSelect(row.querySelector(".item-account"), item.accountCode || "", "income");
    return row;
  };
  document.querySelectorAll("#itemRows .item-account").forEach(select => populateAccountSelect(select, select.value, "income"));
  populateAccountSelect(document.getElementById("supplierInvoiceAccount"), document.getElementById("supplierInvoiceAccount")?.value, "expense");
  document.querySelectorAll("#supplierInvoiceItemRows .supplier-line-account").forEach(select => populateAccountSelect(select, select.value, "expense"));
  const addExpenseAsSupplierInvoice = document.getElementById("addOtherExpenseButton");
  addExpenseAsSupplierInvoice?.addEventListener("click", event => {
    event.preventDefault(); event.stopImmediatePropagation();
    if (denyAction("expenses")) return;
    const form = document.getElementById("supplierInvoiceForm");
    form?.reset();
    const date = document.getElementById("supplierInvoiceDate"); if (date) date.value = localDate();
    const classification = document.getElementById("supplierInvoiceLine"); if (classification) classification.value = "expense";
    const account = document.getElementById("supplierInvoiceAccount"); if (account) account.value = getLedgerAccounts().some(item => item.code === "6000") ? "6000" : "";
    setSupplierInvoicePage(true);
  }, true);
  const accountPlanActions = getAccountPlanPanel()?.querySelector(".account-plan-actions");
  if (accountPlanActions && !document.getElementById("ledgerOpeningBalancesOpen")) {
    const openingButton = document.createElement("button");
    openingButton.type = "button";
    openingButton.className = "secondary-button";
    openingButton.id = "ledgerOpeningBalancesOpen";
    openingButton.dataset.i18n = "ledgerOpeningBalancesTitle";
    openingButton.textContent = copy("ledgerOpeningBalancesTitle");
    accountPlanActions.append(openingButton);
  }
  const openingDialog = document.createElement("dialog");
  openingDialog.className = "company-dialog account-plan-dialog ledger-opening-dialog";
  openingDialog.id = "ledgerOpeningBalancesDialog";
  openingDialog.innerHTML = `<form id="ledgerOpeningBalancesForm"><div class="account-plan-dialog-head"><h2 data-i18n="ledgerOpeningBalancesTitle">${copy("ledgerOpeningBalancesTitle")}</h2><button type="button" class="account-plan-dialog-close" id="ledgerOpeningBalancesClose" aria-label="${copy("accountPlanDialogCancel")}">×</button></div><label class="field ledger-opening-date"><span data-i18n="ledgerOpeningBalancesDate">${copy("ledgerOpeningBalancesDate")}</span><input id="ledgerOpeningBalancesDate" type="date" required></label><div class="ledger-opening-table-wrap"><table class="ledger-opening-table"><thead><tr><th data-i18n="accountPlanCode">${copy("accountPlanCode")}</th><th data-i18n="accountPlanDescription">${copy("accountPlanDescription")}</th><th data-i18n="ledgerOpeningBalancesDebit">${copy("ledgerOpeningBalancesDebit")}</th><th data-i18n="ledgerOpeningBalancesCredit">${copy("ledgerOpeningBalancesCredit")}</th></tr></thead><tbody id="ledgerOpeningBalancesRows"></tbody><tfoot><tr><th colspan="2">${copy("pageSumTotal")}</th><td id="ledgerOpeningDebitTotal">0,00 EUR</td><td id="ledgerOpeningCreditTotal">0,00 EUR</td></tr></tfoot></table></div><p id="ledgerOpeningBalancesError" class="ledger-journal-entry-error" role="alert" hidden></p><div class="account-plan-columns-actions"><button type="button" class="secondary-button" id="ledgerOpeningBalancesCancel" data-i18n="accountPlanDialogCancel">${copy("accountPlanDialogCancel")}</button><button type="submit" class="primary-button" data-i18n="ledgerOpeningBalancesSave">${copy("ledgerOpeningBalancesSave")}</button></div></form>`;
  document.body.append(openingDialog);
  const renderOpeningRows = () => {
    const existing = ledgerOpeningBalances.accounts || {};
    document.getElementById("ledgerOpeningBalancesRows").innerHTML = getLedgerAccounts().map(account => {
      const value = existing[account.code] || {};
      return `<tr data-opening-account="${escapeHtml(account.code)}"><td>${escapeHtml(account.code)}</td><td>${escapeHtml(account.label)}</td><td><input type="number" min="0" step="0.01" data-opening-side="debit" value="${Number(value.debit) || 0}" aria-label="${escapeHtml(account.code)} ${copy("ledgerOpeningBalancesDebit")}"></td><td><input type="number" min="0" step="0.01" data-opening-side="credit" value="${Number(value.credit) || 0}" aria-label="${escapeHtml(account.code)} ${copy("ledgerOpeningBalancesCredit")}"></td></tr>`;
    }).join("");
    document.getElementById("ledgerOpeningBalancesRows").querySelectorAll("input").forEach(input => input.addEventListener("input", updateOpeningTotals));
    updateOpeningTotals();
  };
  const updateOpeningTotals = () => {
    const rows = [...document.querySelectorAll("#ledgerOpeningBalancesRows tr")];
    const total = side => rows.reduce((sum, row) => sum + Math.round((Number(row.querySelector(`[data-opening-side="${side}"]`).value) || 0) * 100), 0);
    document.getElementById("ledgerOpeningDebitTotal").textContent = `${money(total("debit") / 100)} EUR`;
    document.getElementById("ledgerOpeningCreditTotal").textContent = `${money(total("credit") / 100)} EUR`;
  };
  document.getElementById("ledgerOpeningBalancesOpen")?.addEventListener("click", () => {
    document.getElementById("ledgerOpeningBalancesDate").value = ledgerOpeningBalances.effectiveDate || localDate();
    document.getElementById("ledgerOpeningBalancesError").hidden = true;
    renderOpeningRows();
    openingDialog.showModal();
  });
  const closeOpeningDialog = () => openingDialog.close();
  document.getElementById("ledgerOpeningBalancesClose").addEventListener("click", closeOpeningDialog);
  document.getElementById("ledgerOpeningBalancesCancel").addEventListener("click", closeOpeningDialog);
  openingDialog.addEventListener("click", event => { if (event.target === openingDialog) closeOpeningDialog(); });
  document.getElementById("ledgerOpeningBalancesForm").addEventListener("submit", event => {
    event.preventDefault();
    const rows = [...document.querySelectorAll("#ledgerOpeningBalancesRows tr")], values = {};
    let debit = 0, credit = 0;
    for (const row of rows) {
      const accountCode = row.dataset.openingAccount, debitValue = Math.round((Number(row.querySelector('[data-opening-side="debit"]').value) || 0) * 100), creditValue = Math.round((Number(row.querySelector('[data-opening-side="credit"]').value) || 0) * 100);
      if (debitValue && creditValue) { document.getElementById("ledgerOpeningBalancesError").textContent = copy("ledgerOpeningBalancesUnbalanced"); document.getElementById("ledgerOpeningBalancesError").hidden = false; return; }
      debit += debitValue; credit += creditValue;
      if (debitValue || creditValue) values[accountCode] = { debit: debitValue / 100, credit: creditValue / 100 };
    }
    if (debit !== credit) { document.getElementById("ledgerOpeningBalancesError").textContent = copy("ledgerOpeningBalancesUnbalanced"); document.getElementById("ledgerOpeningBalancesError").hidden = false; return; }
    const next = { effectiveDate: document.getElementById("ledgerOpeningBalancesDate").value, accounts: values };
    try { saveList(STORAGE.ledgerOpeningBalances, next); } catch { document.getElementById("ledgerOpeningBalancesError").textContent = copy("ledgerLocalDataWarning"); document.getElementById("ledgerOpeningBalancesError").hidden = false; return; }
    ledgerOpeningBalances = next;
    closeOpeningDialog();
    showMessage(copy("ledgerOpeningBalancesSaved"));
    window.refreshAccountingLedger?.();
  });
  Object.assign(ruTexts, { accountPlanAnnualReportLine: "Строка годового отчёта", accountPlanAnnualReportLineRequired: "Выберите строку годового отчёта для счёта.", accountPlanExportEmpty: "Нет счетов для экспорта.", accountPlanExportError: "Не удалось скачать план счетов." });
  Object.assign(ruTexts, { accountPlanDialogSaveHint: "Изменения будут сохранены в плане счетов." });
  Object.assign(etTexts, { accountPlanAnnualReportLine: "Aastaaruande rida", accountPlanAnnualReportLineRequired: "Valige kontole aastaaruande rida.", accountPlanDialogSaveHint: "Muudatused salvestatakse kontoplaani.", accountPlanExportEmpty: "Eksportimiseks pole kontosid.", accountPlanExportError: "Kontoplaani allalaadimine ebaõnnestus." });
  const accountPlanForm = document.getElementById("accountPlanCreateForm");
  const annualReportLineInput = document.createElement("select");
  annualReportLineInput.id = "accountPlanAnnualReportLineInput";
  annualReportLineInput.required = true;
  const annualReportLineField = document.createElement("div");
  annualReportLineField.className = "field";
  const annualReportLineLabel = document.createElement("label");
  annualReportLineLabel.htmlFor = annualReportLineInput.id;
  annualReportLineLabel.dataset.i18n = "accountPlanAnnualReportLine";
  annualReportLineLabel.textContent = translateCopy("Строка годового отчёта", "accountPlanAnnualReportLine");
  annualReportLineField.append(annualReportLineLabel, annualReportLineInput);
  document.getElementById("accountPlanBalanceLineInput")?.closest(".account-plan-entry-fields")?.append(annualReportLineField);
  const populateAnnualReportLines = () => {
    const profile = window.annualReportProfile;
    annualReportLineInput.disabled = !profile;
    const type = document.getElementById("accountPlanEntryType").value;
    annualReportLineInput.innerHTML = `<option value="">${escapeHtml(translateCopy("Выберите строку", "invoiceAccountChoose"))}</option>${(profile?.forms || []).filter(form => form.code === annualReportFormCodeFor(type)).map(form => `<optgroup label="${escapeHtml(form.title)}">${form.rows.filter(concept => !concept.abstract && concept.type !== "xbrli:stringItemType").map(concept => `<option value="${escapeHtml(concept.name)}">${escapeHtml(concept.label)}</option>`).join("")}</optgroup>`).join("")}`;
  };
  document.addEventListener("annual-report-profile-ready", () => { populateAnnualReportLines(); renderAccountPlan(); });
  document.getElementById("accountPlanEntryType")?.addEventListener("change", populateAnnualReportLines);
  populateAnnualReportLines();
  accountPlanForm?.addEventListener("submit", event => {
    event.preventDefault(); event.stopImmediatePropagation();
    const code = document.getElementById("accountPlanCodeInput").value.trim(), descriptionEt = document.getElementById("accountPlanDescriptionEtInput").value.trim(), descriptionEn = document.getElementById("accountPlanDescriptionEnInput").value.trim(), type = document.getElementById("accountPlanEntryType").value;
    const editingCode = String(window.accountPlanEditingCode || "");
    const annualReportLine = annualReportLineInput.value;
    if (!code || !descriptionEt || (!editingCode && accountPlanEntries.some(account => account.code === code))) { showMessage(translateCopy("Kontokood peab olema unikaalne ja eestikeelne kirjeldus täidetud.", "accountPlanSaveError"), true); return; }
    if (!annualReportLine) { showMessage(translateCopy("Выберите строку годового отчёта для счёта.", "accountPlanAnnualReportLineRequired"), true); return; }
    const existingAccount = accountPlanEntries.find(account => account.code === editingCode);
    const account = { ...existingAccount, code, descriptionEt, descriptionEn, type, annualReportLine, balanceLine: document.getElementById("accountPlanBalanceLineInput")?.value.trim() || "", cashFlowLine: document.getElementById("accountPlanCashFlowLineInput")?.value.trim() || "", reportGroup: type === "expense" ? "expenses" : type === "income" ? "sales" : "balance" };
    const next = editingCode ? accountPlanEntries.map(item => item.code === editingCode ? account : item) : [...accountPlanEntries, account];
    try { saveList(STORAGE.accountPlanEntries, next); } catch { showMessage(translateCopy("Kontoplaani kontot ei saanud salvestada.", "accountPlanSaveError"), true); return; }
    accountPlanEntries = next; window.accountPlanEditingCode = ""; document.getElementById("accountPlanCodeInput").readOnly = false; document.getElementById("accountPlanCreateDialog").close(); renderAccountPlan(); window.refreshAccountingLedger?.();
  }, true);
  getAccountPlanPanel()?.querySelector("#accountPlanApplyFilter")?.addEventListener("click", renderAccountPlan);
  getAccountPlanPanel()?.querySelector("#accountPlanClearFilters")?.addEventListener("click", () => requestAnimationFrame(renderAccountPlan));
  getAccountPlanPanel()?.querySelector("#accountPlanAddButton")?.addEventListener("click", () => { setTimeout(() => { const code = document.getElementById("accountPlanCodeInput"); if (code && document.getElementById("accountPlanCreateDialog")?.open) code.focus(); }, 0); });

  const expenseAddButton = document.getElementById("addOtherExpenseButton");
  if (expenseAddButton) {
    expenseAddButton.dataset.i18n = "expensePurchaseAction";
    expenseAddButton.innerHTML = `<span data-i18n="expensePurchaseAction">${copy("Добавить как Ostuarve", "Lisa Ostuarvena", "expensePurchaseAction")}</span>`;
  }
  const quickExpense = document.querySelector('.quick-actions [data-goto="expenseEditorView"]');
  const baseSetExpenseEditorPage = setExpenseEditorPage;
  setExpenseEditorPage = open => {
    if (!open) { baseSetExpenseEditorPage(false); return; }
    if (denyAction("expenses")) return;
    resetSupplierInvoiceForm();
    const classification = document.getElementById("supplierInvoiceLine"); if (classification) classification.value = "expense";
    const account = document.getElementById("supplierInvoiceAccount"); if (account) account.value = getLedgerAccounts().some(item => item.code === "6000") ? "6000" : "";
    setSupplierInvoicePage(true);
  };
  const quickExpenseLabel = quickExpense?.querySelector("[data-i18n]");
  if (quickExpense) {
    quickExpense.removeAttribute("data-goto");
    quickExpense.dataset.i18n = "quickContactsAction";
    if (quickExpenseLabel) { quickExpenseLabel.dataset.i18n = "quickContactsAction"; quickExpenseLabel.textContent = copy("Справка", "Abi", "quickContactsAction"); }
    const icon = quickExpense.querySelector(".quick-action-icon");
    if (icon) icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-1 .8-1.5 1.1-1.5 2.7M12 17h.01"></path></svg>';
    quickExpense.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!can("overview")) { denyAction("overview"); return; }
      switchView("contactsView");
      const mobileToggle = document.getElementById("mobileMenuToggle");
      if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
    }, true);
  }
  const baseQuickContactsAccess = applyRoleAccess;
  applyRoleAccess = function () { baseQuickContactsAccess(); if (quickExpense) quickExpense.hidden = !can("overview"); };
  const baseRenderExpenses = renderExpenses;
  const refreshExpenseView = () => {
    const legacy = expenses.filter(item => item.accountingSource !== "supplierInvoice" && !supplierInvoices.some(invoice => String(invoice.invoiceNumber || "") === String(item.invoiceNumber || "") && invoice.date === item.date && roundMoney(invoice.amount) === roundMoney(item.amount) && String(invoice.supplierName || "") === String(item.supplierName || item.supplier || "")));
    const invoiceRows = supplierInvoices.filter(invoice => invoice.invoiceLine === "expense").map(invoice => ({
      id: `supplier-expense-${invoice.id}`, accountingSource: "supplierInvoice", date: invoice.date,
      name: invoice.description || invoice.note || invoice.supplierName || invoice.invoiceNumber,
      supplierName: invoice.supplierName, category: "Kulu", amount: invoice.amount,
      amountDue: invoice.amountDue ?? invoice.amount, status: Number(invoice.amountDue ?? invoice.amount) === 0 ? "paid" : "unpaid",
      invoiceNumber: invoice.invoiceNumber, note: invoice.note || "", fileName: invoice.fileName || invoice.attachments?.[0]?.name || "",
      data: invoice.data || invoice.attachments?.[0]?.data || ""
    }));
    expenses = [...legacy, ...invoiceRows];
    baseRenderExpenses();
    document.querySelectorAll('#expenseRows [data-expense-action="edit"],#expenseRows [data-expense-action="delete"]').forEach(button => { button.disabled = true; button.title = copy("Расходы из счетов поставщиков изменяются через Ostuarve.", "Arvetest tulenevaid kulusid muuda Ostuarve kaudu.", "expenseViewOnlyHint"); });
  };
  renderExpenses = () => refreshExpenseView();
  const baseRenderReportForExpenses = renderReport;
  renderReport = (...args) => { const result = baseRenderReportForExpenses(...args); refreshExpenseView(); return result; };
  const independentExpenseForm = document.getElementById("expenseForm");
  if (independentExpenseForm) independentExpenseForm.hidden = true;
  independentExpenseForm?.addEventListener("submit", event => { event.preventDefault(); event.stopImmediatePropagation(); showMessage(copy("Расход создаётся через Ostuarve с классификацией Kulu.", "Kulu lisatakse Ostuarve kaudu liigitusega Kulu.", "expenseAsPurchaseInvoice")); }, true);
  renderAccountPlan();
  renderReport();
  refreshExpenseView();
  renderDashboard();
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(renderAccountPlan)));
  window.initializeLedgerMenu?.();
})();
