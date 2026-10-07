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
  const cashAccountFor = item => item?.paymentMethod === "cash" || item?.payment_method === "cash" || item?.cashRegister ? "1100" : "1000";
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
    if (amount <= 0 || !isDate(date) || record.status === "draft") return;
    const invoiceId = record.relatedInvoiceId || "";
    const kind = linkedKind || (record.direction === "incoming" ? "client" : "supplier");
    const id = `payment-${record.relatedInvoicePaymentId || record.id || paymentFingerprint(kind, invoiceId, date, amount, record.paymentMethod || record.payment_method)}`;
    const description = record.note || record.description || record.category || (kind === "client" ? "Laekumine" : "Makse");
    const common = voucherCommon(id, sourceType, record, date, record.documentReference || record.referenceNumber || record.invoiceNumber || invoiceId, description, record.objectName || record.object);
    const cashCode = validAccount(cashAccountFor(record), "1000");
    if (invoiceId && kind === "client") addVoucher(entries, common, [makeLine(common, cashCode, amount, 0), makeLine(common, "1200", 0, amount)]);
    else if (invoiceId && kind === "supplier") addVoucher(entries, common, [makeLine(common, "2000", amount, 0), makeLine(common, cashCode, 0, amount)]);
    else if (record.paymentOrigin === "bank-import-advance") addVoucher(entries, common, record.direction === "incoming"
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
      if (expense.status === "draft" || !isDate(expense.date) || roundMoney(expense.amount) <= 0) continue;
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
      const common = voucherCommon(`manual-${manual.id}`, "manual", manual, manual.date, manual.documentNumber, manual.description || manual.internalInfo, manual.object);
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
    const result = baseGenerateGeneralLedger(...args);
    if (!start || !Array.isArray(lastLedgerEntries)) return result;
    const balances = window.getLedgerOpeningBalances(start);
    for (const entry of lastLedgerEntries) {
      const accountCode = String(entry.accountCode || "");
      balances.set(accountCode, roundMoney((balances.get(accountCode) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0)));
      entry.balance = balances.get(accountCode);
    }
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
  summarizeProfitPeriod = period => {
    const totals = monthlyLedgerSummary(period.start, period.end), costs = totals.buy + totals.cost;
    return { ...period, ...totals, purchases: totals.buy, supplierInvoices: 0, otherExpenses: totals.cost, costs, result: totals.sales - costs };
  };
  summarizeBalancePeriod = period => {
    const totals = summarizeProfitPeriod(period);
    return { ...period, ...totals, totalExpenses: totals.costs };
  };

  const getAccountPlanPanel = () => document.getElementById("accountPlanPanel");
  const accountTypeLabel = type => ({ asset: copy("Активы", "Aktiva", "accountPlanAsset"), liability: copy("Пассивы", "Passiva", "accountPlanLiability"), income: copy("Доходы", "Tulud", "accountPlanIncome"), expense: copy("Расходы", "Kulud", "accountPlanExpense") })[type] || type;
  const renderAccountPlan = () => {
    const panel = getAccountPlanPanel(), body = document.getElementById("accountPlanRows");
    if (!panel || !body) return;
    const query = panel.querySelector("#accountPlanSearch")?.value.trim().toLocaleLowerCase(language) || "", type = panel.querySelector("#accountPlanTypeFilter")?.value || "";
    const rows = accountPlanEntries.filter(account => (!type || account.type === type) && (!query || `${account.code} ${account.descriptionEt} ${account.descriptionEn}`.toLocaleLowerCase(language).includes(query))).sort((a, b) => String(a.code).localeCompare(String(b.code), undefined, { numeric: true }));
    const emptyKey = query || type ? "accountPlanNoMatches" : "accountPlanEmpty";
    body.innerHTML = rows.map(account => `<tr data-account-code="${escapeHtml(account.code)}"><td data-account-plan-column="code">${escapeHtml(account.code)}</td><td data-account-plan-column="description">${escapeHtml(language === "et" ? account.descriptionEt : account.descriptionEn || account.descriptionEt)}</td><td data-account-plan-column="type">${escapeHtml(accountTypeLabel(account.type))}</td><td data-account-plan-column="balanceLine">${escapeHtml(account.balanceLine || "—")}</td><td data-account-plan-column="cashFlowLine">${escapeHtml(account.cashFlowLine || "—")}</td></tr>`).join("") || `<tr><td class="account-plan-empty" colspan="5">${escapeHtml(translateCopy(emptyKey === "accountPlanNoMatches" ? "Счета по заданному фильтру не найдены." : "Счета пока не добавлены.", emptyKey))}</td></tr>`;
    panel.querySelectorAll("[data-account-plan-column]").forEach(cell => { const toggle = panel.querySelector(`[data-account-plan-column-toggle="${cell.dataset.accountPlanColumn}"]`); if (toggle) cell.hidden = !toggle.checked; });
  };
  window.renderAccountPlan = renderAccountPlan;
  window.refreshAccountingLedger = () => { renderAccountPlan(); renderReport(); renderDashboard(); document.dispatchEvent(new Event("accounting-ledger-updated")); };
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
  const accountPlanForm = document.getElementById("accountPlanCreateForm");
  accountPlanForm?.addEventListener("submit", event => {
    event.preventDefault(); event.stopImmediatePropagation();
    const code = document.getElementById("accountPlanCodeInput").value.trim(), descriptionEt = document.getElementById("accountPlanDescriptionEtInput").value.trim(), descriptionEn = document.getElementById("accountPlanDescriptionEnInput").value.trim(), type = document.getElementById("accountPlanEntryType").value;
    if (!code || !descriptionEt || accountPlanEntries.some(account => account.code === code)) { showMessage(translateCopy("Kontokood peab olema unikaalne ja eestikeelne kirjeldus täidetud.", "accountPlanSaveError"), true); return; }
    const account = { code, descriptionEt, descriptionEn, type, balanceLine: document.getElementById("accountPlanBalanceLineInput")?.value.trim() || "", cashFlowLine: document.getElementById("accountPlanCashFlowLineInput")?.value.trim() || "", reportGroup: type === "expense" ? "expenses" : type === "income" ? "sales" : "balance" };
    const next = [...accountPlanEntries, account];
    try { saveList(STORAGE.accountPlanEntries, next); } catch { showMessage(translateCopy("Kontoplaani kontot ei saanud salvestada.", "accountPlanSaveError"), true); return; }
    accountPlanEntries = next; document.getElementById("accountPlanCreateDialog").close(); renderAccountPlan();
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
})();
