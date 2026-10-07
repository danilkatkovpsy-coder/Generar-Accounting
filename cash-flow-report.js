(() => {
  const reports = document.getElementById("reportsView");
  const tabs = reports?.querySelector(".report-tabs");
  if (!tabs || document.getElementById("cashFlowTab")) return;
  Object.assign(ruTexts, {
    cashFlowTab: "Движение денежных средств", cashFlowTitle: "Движение денежных средств", cashFlowStart: "С",
    cashFlowEnd: "По", cashFlowGenerate: "Сформировать", cashFlowExport: "Скачать CSV", cashFlowIncoming: "Поступления",
    cashFlowOutgoing: "Выплаты", cashFlowNet: "Изменение денежных средств", cashFlowDate: "Дата", cashFlowParty: "Контрагент",
    cashFlowDescription: "Описание", cashFlowMethod: "Способ оплаты", cashFlowEmpty: "Зарегистрированных оплат за период нет.",
    cashFlowInvalid: "Укажите корректный период.", cashFlowCurrency: "Валюта", cashFlowCash: "Наличные", cashFlowBank: "Банк",
    cashFlowCard: "Карта", cashFlowDisclaimer: "Сводка зарегистрированных оплат. Начальные остатки и классификация по операционной, инвестиционной и финансовой деятельности не учтены; это не полный официальный отчет.",
    cashFlowExcluded: "Оплаты в другой валюте или без подтвержденной даты/суммы не включены:"
  });
  Object.assign(etTexts, {
    cashFlowTab: "Rahavoogude aruanne", cashFlowTitle: "Rahavoogude aruanne", cashFlowStart: "Alates",
    cashFlowEnd: "Kuni", cashFlowGenerate: "Koosta", cashFlowExport: "Laadi CSV alla", cashFlowIncoming: "Laekumised",
    cashFlowOutgoing: "Väljamaksed", cashFlowNet: "Raha muutus", cashFlowDate: "Kuupäev", cashFlowParty: "Osapool",
    cashFlowDescription: "Kirjeldus", cashFlowMethod: "Makseviis", cashFlowEmpty: "Valitud perioodil registreeritud makseid pole.",
    cashFlowInvalid: "Valige korrektne periood.", cashFlowCurrency: "Valuuta", cashFlowCash: "Sularaha", cashFlowBank: "Pank",
    cashFlowCard: "Kaart", cashFlowDisclaimer: "Registreeritud maksete kokkuvõte. Algsaldod ning äri-, investeerimis- ja finantseerimistegevuse liigitus on lisamata; see ei ole täielik ametlik aruanne.",
    cashFlowExcluded: "Teises valuutas või kinnitamata kuupäeva/summaga makseid ei arvestatud:"
  });
  const copy = key => translateCopy(key, key);
  const get = id => document.getElementById(id);
  const tab = document.createElement("button");
  tab.id = "cashFlowTab";
  tab.type = "button";
  tab.className = "report-tab";
  tab.dataset.i18n = "cashFlowTab";
  tab.textContent = copy("cashFlowTab");
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-selected", "false");
  tab.setAttribute("aria-controls", "cashFlowPanel");
  tabs.append(tab);
  const panel = document.createElement("section");
  panel.id = "cashFlowPanel";
  panel.className = "report-panel";
  panel.hidden = true;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.innerHTML = `<div class="balance-heading"><h2 data-i18n="cashFlowTitle">${copy("cashFlowTitle")}</h2><button type="button" class="primary-button" id="cashFlowGenerate" data-i18n="cashFlowGenerate">${copy("cashFlowGenerate")}</button></div><section class="data-panel"><div class="cash-flow-filters"><div class="field"><label for="cashFlowStart" data-i18n="cashFlowStart">${copy("cashFlowStart")}</label><input id="cashFlowStart" type="date"></div><div class="field"><label for="cashFlowEnd" data-i18n="cashFlowEnd">${copy("cashFlowEnd")}</label><input id="cashFlowEnd" type="date"></div><div class="field"><label for="cashFlowCurrency" data-i18n="cashFlowCurrency">${copy("cashFlowCurrency")}</label><select id="cashFlowCurrency" disabled><option>EUR</option></select></div><button type="button" class="secondary-button" id="cashFlowExport" data-i18n="cashFlowExport">${copy("cashFlowExport")}</button></div><div class="cash-flow-summary"><div><span data-i18n="cashFlowIncoming">${copy("cashFlowIncoming")}</span><strong id="cashFlowIncoming">0,00 EUR</strong></div><div><span data-i18n="cashFlowOutgoing">${copy("cashFlowOutgoing")}</span><strong id="cashFlowOutgoing">0,00 EUR</strong></div><div><span data-i18n="cashFlowNet">${copy("cashFlowNet")}</span><strong id="cashFlowNet">0,00 EUR</strong></div></div><p class="cash-flow-warning" id="cashFlowExcluded" hidden></p><div class="table-wrap"><table class="data-table cash-flow-table"><thead><tr><th data-i18n="cashFlowDate">${copy("cashFlowDate")}</th><th data-i18n="cashFlowParty">${copy("cashFlowParty")}</th><th data-i18n="cashFlowDescription">${copy("cashFlowDescription")}</th><th data-i18n="cashFlowMethod">${copy("cashFlowMethod")}</th><th data-i18n="cashFlowIncoming">${copy("cashFlowIncoming")}</th><th data-i18n="cashFlowOutgoing">${copy("cashFlowOutgoing")}</th></tr></thead><tbody id="cashFlowRows"></tbody></table></div><p class="ledger-disclaimer" data-i18n="cashFlowDisclaimer">${copy("cashFlowDisclaimer")}</p></section>`;
  reports.append(panel);
  const today = localDate();
  get("cashFlowStart").value = `${today.slice(0, 4)}-01-01`;
  get("cashFlowEnd").value = today;
  const knownMethods = new Set(["bank", "transfer", "cash", "card"]);
  const methodFor = value => value === "transfer" ? "bank" : value || "bank";
  let lastRows = [];
  const collectPayments = () => {
    if (typeof window.createAccountingLedgerEntries === "function") {
      const cashAccounts = new Map(getLedgerAccounts().filter(account => ["bank", "cash"].includes(account.reportGroup)).map(account => [String(account.code), account.reportGroup === "cash" ? "cash" : "bank"]));
      const records = window.createAccountingLedgerEntries(get("cashFlowStart").value || "0001-01-01", get("cashFlowEnd").value || localDate())
        .map(entry => ({ entry, signedAmount: Math.round(((Number(entry.debit) || 0) - (Number(entry.credit) || 0)) * 100) / 100 }))
        .filter(({ entry, signedAmount }) => entry.sourceType !== "openingBalance" && cashAccounts.has(String(entry.accountCode)) && signedAmount !== 0)
        .map(({ entry, signedAmount }) => ({ date: entry.date, amount: Math.abs(signedAmount), incoming: signedAmount > 0, party: entry.party || entry.object || "—", description: entry.description || entry.documentNumber || "", method: cashAccounts.get(String(entry.accountCode)), currency: entry.currency || "EUR" }));
      return { records, excluded: 0 };
    }
    const records = [];
    const linkedIds = new Set();
    const linkedKeys = new Map();
    let excluded = 0;
    const paymentKey = (kind, invoiceId, date, amount) => `${kind}:${invoiceId}:${date}:${Math.round(Math.abs(Number(amount)) * 100)}`;
    const add = record => {
      const amount = Math.abs(Number(record.amount));
      const date = String(record.date || "").slice(0, 10);
      if (amount === 0) return false;
      const parsedDate = new Date(`${date}T12:00:00Z`);
      if (!Number.isFinite(amount) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf()) || !parsedDate.toISOString().startsWith(date) || !knownMethods.has(record.method) || (record.currency || "EUR") !== "EUR") { excluded += 1; return false; }
      records.push({ ...record, amount, date });
      return true;
    };
    for (const item of purchases) {
      if (!knownMethods.has(item.paymentMethod) || item.status === "draft") continue;
      const kind = item.direction === "incoming" ? "client" : "supplier";
      const date = String(item.date || "").slice(0, 10);
      const included = add({ date, amount: item.amount, incoming: kind === "client", party: item.supplier || item.counterparty || "—", description: item.note || item.description || "", method: methodFor(item.paymentMethod), currency: item.currency });
      if (!included) continue;
      if (item.relatedInvoicePaymentId) linkedIds.add(String(item.relatedInvoicePaymentId));
      if (item.relatedInvoiceId) {
        const key = paymentKey(kind, item.relatedInvoiceId, date, item.amount);
        linkedKeys.set(key, (linkedKeys.get(key) || 0) + 1);
      }
    }
    for (const [kind, invoicesList] of [["client", invoices], ["supplier", supplierInvoices]]) {
      for (const invoice of invoicesList) {
        for (const payment of invoice.payments || []) {
          const date = String(payment.date || payment.paid_at || "").slice(0, 10);
          const key = paymentKey(kind, invoice.id || invoice.number, date, payment.amount);
          if (payment.id && linkedIds.has(String(payment.id))) {
            if (linkedKeys.get(key)) linkedKeys.set(key, linkedKeys.get(key) - 1);
            continue;
          }
          if (!payment.id && linkedKeys.get(key)) { linkedKeys.set(key, linkedKeys.get(key) - 1); continue; }
          add({ date, amount: payment.amount, incoming: kind === "client", party: kind === "client" ? invoice.client?.name || "—" : invoice.supplierName || "—", description: invoice.invoiceNumber || invoice.number || invoice.description || "", method: methodFor(payment.method || payment.payment_method), currency: invoice.currency });
        }
      }
    }
    return { records, excluded };
  };
  const render = () => {
    if (!can("reports")) return false;
    const start = get("cashFlowStart").value;
    const end = get("cashFlowEnd").value;
    if (!start || !end || start > end) { showMessage(copy("cashFlowInvalid"), true); return false; }
    const { records, excluded } = collectPayments();
    lastRows = records.filter(record => record.date >= start && record.date <= end).sort((first, second) => first.date.localeCompare(second.date));
    const incoming = lastRows.filter(record => record.incoming).reduce((sum, record) => sum + record.amount, 0);
    const outgoing = lastRows.filter(record => !record.incoming).reduce((sum, record) => sum + record.amount, 0);
    get("cashFlowIncoming").textContent = `${money(incoming)} EUR`;
    get("cashFlowOutgoing").textContent = `${money(outgoing)} EUR`;
    get("cashFlowNet").textContent = `${money(incoming - outgoing)} EUR`;
    const methodLabel = method => copy(method === "cash" ? "cashFlowCash" : method === "card" ? "cashFlowCard" : "cashFlowBank");
    get("cashFlowRows").innerHTML = lastRows.map(record => `<tr><td>${escapeHtml(formatDate(record.date))}</td><td>${escapeHtml(record.party)}</td><td>${escapeHtml(record.description)}</td><td>${escapeHtml(methodLabel(record.method))}</td><td>${record.incoming ? money(record.amount) : "—"}</td><td>${record.incoming ? "—" : money(record.amount)}</td></tr>`).join("") || `<tr><td class="empty-row" colspan="6">${escapeHtml(copy("cashFlowEmpty"))}</td></tr>`;
    get("cashFlowExcluded").hidden = !excluded;
    get("cashFlowExcluded").textContent = `${copy("cashFlowExcluded")} ${excluded}`;
    get("cashFlowExport").disabled = !can("exportReports") || !lastRows.length;
    applyLanguage(language);
    return true;
  };
  get("cashFlowGenerate").addEventListener("click", render);
  get("cashFlowExport").addEventListener("click", () => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    if (!render() || !lastRows.length) return;
    const cell = value => {
      let text = String(value ?? "");
      if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
      return `"${text.replaceAll('"', '""')}"`;
    };
    const data = [[copy("cashFlowDate"), copy("cashFlowParty"), copy("cashFlowDescription"), copy("cashFlowMethod"), copy("cashFlowIncoming"), copy("cashFlowOutgoing")], ...lastRows.map(record => [formatDate(record.date), record.party, record.description, record.method, record.incoming ? record.amount.toFixed(2) : "", record.incoming ? "" : record.amount.toFixed(2)])];
    triggerBlobDownload(new Blob(["\ufeff", data.map(row => row.map(cell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" }), `rahavood-${get("cashFlowStart").value}-${get("cashFlowEnd").value}.csv`);
  });
  const reportTabs = [...tabs.querySelectorAll("[role=tab]")];
  reportTabs.forEach(button => button.addEventListener("click", () => {
    reportTabs.forEach(item => item.setAttribute("aria-selected", String(item === button)));
    reports.querySelectorAll(":scope > .report-panel").forEach(reportPanel => { reportPanel.hidden = reportPanel.id !== button.getAttribute("aria-controls"); });
    if (button === tab) render();
  }));
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => { if (!panel.hidden) requestAnimationFrame(render); }));
  get("companyPicker")?.addEventListener("change", () => { if (!panel.hidden) queueMicrotask(render); });
  applyLanguage(language);
})();