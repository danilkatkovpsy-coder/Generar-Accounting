(() => {
  const table = document.querySelector("#salesView .history-table");
  const historyRows = document.getElementById("historyRows");
  if (!table || !historyRows || window.__salesPageTotalsReady) return;
  window.__salesPageTotalsReady = true;

  Object.assign(ruTexts, {
    pageSumsTitle: "Итоги страницы",
    pageSumRows: "Строк:",
    pageSumTotal: "Сумма:",
    pageSumUnpaid: "Не оплачено:",
    pageSumOverdue: "Просрочено:",
    salesPageOf: "Страница",
    salesRowsPerPage: "Строк на странице"
  });
  Object.assign(etTexts, {
    pageSumsTitle: "Lehekülje summad",
    pageSumRows: "Ridu:",
    pageSumTotal: "Summa:",
    pageSumUnpaid: "Maksmata:",
    pageSumOverdue: "Üle tähtaja:",
    salesPageOf: "Lehekülg",
    salesRowsPerPage: "Ridu lehel"
  });

  const section = table.closest(".history");
  const footer = document.createElement("div");
  footer.className = "register-page-footer sales-register-page-footer";
  footer.innerHTML = '<nav class="register-page-numbers" aria-label="Sales pages"></nav><div class="register-page-summary"><h3 data-i18n="pageSumsTitle">Lehekülje summad</h3><dl><div><dt data-i18n="pageSumRows">Ridu:</dt><dd id="salesPageRows">0</dd></div><div><dt data-i18n="pageSumTotal">Summa:</dt><dd id="salesPageTotal">0,00 EUR</dd></div><div><dt data-i18n="pageSumUnpaid">Maksmata:</dt><dd id="salesPageUnpaid">0,00 EUR</dd></div><div><dt data-i18n="pageSumOverdue">Üle tähtaja:</dt><dd id="salesPageOverdue">0,00 EUR</dd></div></dl></div>';
  section.append(footer);
  const navigation = footer.querySelector("nav");
  const originalRenderHistory = renderHistory;
  let currentPage = 1;
  const rowsPerPage = 25;
  const currentSearch = () => document.getElementById("historySearch")?.value || "";

  const renderSummary = records => {
    const total = records.reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);
    const unpaid = records.reduce((sum, invoice) => sum + invoiceOutstandingAmount(invoice), 0);
    const overdue = records.reduce((sum, invoice) => sum + (invoiceIsOverdue(invoice) ? invoiceOutstandingAmount(invoice) : 0), 0);
    document.getElementById("salesPageRows").textContent = String(records.length);
    document.getElementById("salesPageTotal").textContent = `${money(total)} EUR`;
    document.getElementById("salesPageUnpaid").textContent = `${money(unpaid)} EUR`;
    document.getElementById("salesPageOverdue").textContent = `${money(overdue)} EUR`;
  };
  const renderPagination = total => {
    const pages = Math.max(1, Math.ceil(total / rowsPerPage));
    if (currentPage > pages) currentPage = pages;
    navigation.replaceChildren();
    const addButton = (label, target, active = false, disabled = false, ariaLabel = "") => {
      const button = document.createElement("button");
      button.type = "button"; button.textContent = label; button.disabled = disabled;
      if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
      if (active) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => { currentPage = target; renderHistory(currentSearch(), true); });
      navigation.append(button);
    };
    addButton("«", 1, false, currentPage === 1, "First page");
    addButton("‹", Math.max(1, currentPage - 1), false, currentPage === 1, "Previous page");
    const start = Math.max(1, Math.min(currentPage - 4, pages - 8));
    for (let page = start; page <= Math.min(pages, start + 8); page++) addButton(String(page), page, page === currentPage);
    addButton("›", Math.min(pages, currentPage + 1), false, currentPage === pages, "Next page");
    addButton("»", pages, false, currentPage === pages, "Last page");
    const pageLabel = document.createElement("span");
    pageLabel.textContent = `${translateCopy("Страница", "salesPageOf")} ${currentPage} / ${pages}`;
    navigation.append(pageLabel);
  };

  renderHistory = (search = currentSearch(), preservePage = false) => {
    if (!preservePage) currentPage = 1;
    const query = search.trim().toLocaleLowerCase("et");
    const from = document.getElementById("salesDateFrom").value;
    const to = document.getElementById("salesDateTo").value;
    const allInvoices = invoices;
    const filtered = allInvoices.filter(invoice => salesInvoiceMatchesFilters(invoice, query, from, to));
    filtered.sort((first, second) => String(second.number || "").localeCompare(String(first.number || ""), language, { numeric: true, sensitivity: "base" }));
    const pageRecords = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    invoices = pageRecords;
    try {
      originalRenderHistory(search);
    } finally {
      invoices = allInvoices;
    }
    for (const row of historyRows.querySelectorAll("tr[data-invoice-index]")) {
      const pageIndex = Number(row.dataset.invoiceIndex);
      const invoice = pageRecords[pageIndex];
      const globalIndex = allInvoices.indexOf(invoice);
      if (!invoice || globalIndex < 0) continue;
      row.dataset.invoiceIndex = String(globalIndex);
      const numberCell = row.querySelector(".sales-row-number-cell");
      if (numberCell) numberCell.textContent = String(globalIndex + 1);
      row.querySelectorAll("[data-invoice-index]").forEach(control => { control.dataset.invoiceIndex = String(globalIndex); });
      const paymentButton = row.querySelector("[data-invoice-payment]");
      if (paymentButton) paymentButton.dataset.invoicePayment = String(globalIndex);
    }
    updateInvoiceSelection();
    renderSummary(pageRecords);
    renderPagination(filtered.length);
    applyLanguage(language);
  };

  renderHistory(currentSearch());
})();
