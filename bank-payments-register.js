(() => {
  const view = document.getElementById("purchasesView");
  const body = document.getElementById("purchaseRows");
  if (!view || !body || view.dataset.bankPaymentsReady) return;
  view.dataset.bankPaymentsReady = "true";

  Object.assign(ruTexts, {
    bankPaymentsTitle: "Банковские платежи", bankPaymentsDescription: "Платежи по банковским счетам.",
    bankPaymentCounterparty: "Контрагент", bankPaymentAccount: "Банковский счет", bankPaymentAllAccounts: "Все счета",
    bankPaymentEnteredBy: "Кем внесено", bankPaymentFilter: "ФИЛЬТРОВАТЬ", bankPaymentClear: "Очистить фильтры",
    bankPaymentNoRows: "Платежей по заданным фильтрам нет.", bankPaymentOpen: "Открыть банковский платеж",
    bankPaymentNumber: "№", bankPaymentDescription: "Описание",
    bankPaymentDate: "Дата", bankPaymentAmount: "Сумма", bankPaymentCurrency: "€/$", bankPaymentEntered: "Внесено",
    bankPaymentRows: "Строк на странице", bankPaymentTotal: "Всего", bankPaymentHelp: "Справка",
    bankPaymentHelpText: "Фильтруйте по контрагенту, счету, периоду и автору.", bankPaymentAddNew: "＋ Добавить",
    bankPaymentMore: "Ещё", bankPaymentImport: "Импорт банковских платежей", bankPaymentExport: "Экспорт платежных поручений",
    bankPaymentSaveError: "Не удалось сохранить платеж.", pageSumsTitle: "Итоги страницы", pageSumRows: "Строк:",
    pageSumTotal: "Сумма:", pageSumUnpaid: "Не оплачено:", pageSumOverdue: "Просрочено:"
  });
  Object.assign(etTexts, {
    bankPaymentsTitle: "Pangamaksed", bankPaymentsDescription: "Pangakontode maksed.",
    bankPaymentCounterparty: "Teine osapool", bankPaymentAccount: "Pangakonto", bankPaymentAllAccounts: "Kõik pangakontod",
    bankPaymentEnteredBy: "Sisestaja", bankPaymentFilter: "FILTREERI", bankPaymentClear: "Tühjenda filtrid",
    bankPaymentNoRows: "Valitud filtritega makseid pole.", bankPaymentOpen: "Ava pangamakse",
    bankPaymentNumber: "NR", bankPaymentDescription: "KIRJELDUS",
    bankPaymentDate: "KUUPÄEV", bankPaymentAmount: "SUMMA", bankPaymentCurrency: "€/$", bankPaymentEntered: "SISESTATUD",
    bankPaymentRows: "Ridu lehel", bankPaymentTotal: "Kokku", bankPaymentHelp: "Abi",
    bankPaymentHelpText: "Filtreeri osapoole, pangakonto, perioodi ja sisestaja järgi.", bankPaymentAddNew: "＋ Lisa uus",
    bankPaymentMore: "Rohkem", bankPaymentImport: "Pangamaksete import", bankPaymentExport: "Maksekorralduste eksport",
    bankPaymentSaveError: "Makse salvestamine ebaõnnestus.", pageSumsTitle: "Lehekülje summad", pageSumRows: "Ridu:",
    pageSumTotal: "Summa:", pageSumUnpaid: "Maksmata:", pageSumOverdue: "Üle tähtaja:"
  });

  const id = value => document.getElementById(value);
  const heading = view.querySelector(":scope > .view-heading");
  const titleBlock = heading.firstElementChild;
  const title = titleBlock.querySelector("h1");
  const description = titleBlock.querySelector("p");
  const listPanel = body.closest(".data-panel");
  const table = body.closest("table");
  const tableWrap = table.closest(".table-wrap");
  const dateRange = listPanel.querySelector(".date-range-filter");
  const dateFields = [...(dateRange?.querySelectorAll(".field") || [])];
  const fromDate = id("purchasesDateFrom");
  const toDate = id("purchasesDateTo");
  let currentPage = 1;
  let rowsPerPage = 25;
  let sortColumn = "date";
  let sortDirection = -1;
  let searchCounterparty = "";
  let searchAuthor = "";
  let accountFilter = "";

  title.dataset.i18n = "bankPaymentsTitle";
  title.textContent = translateCopy("Банковские платежи", "bankPaymentsTitle");
  description.dataset.i18n = "bankPaymentsDescription";
  description.textContent = translateCopy("Платежи по банковским счетам.", "bankPaymentsDescription");
  heading.classList.add("bank-payments-heading");
  titleBlock.classList.add("bank-payments-title");
  listPanel.querySelector(":scope > h2")?.remove();

  const exportLinks = document.createElement("div");
  exportLinks.className = "bank-payment-export-links";
  exportLinks.setAttribute("role", "group");
  exportLinks.setAttribute("aria-label", "Форматы экспорта");
  exportLinks.innerHTML = '<button type="button" data-bank-export="pdf">PDF</button><button type="button" data-bank-export="xls">XLS</button><button type="button" data-bank-export="csv">CSV</button>';
  titleBlock.append(exportLinks);

  const actions = document.createElement("div");
  actions.className = "bank-payment-page-actions";
  const addButton = id("openPurchaseFormButton");
  if (addButton) {
    addButton.innerHTML = `<span data-i18n="bankPaymentAddNew">${translateCopy("＋ Добавить", "bankPaymentAddNew")}</span>`;
    addButton.classList.add("bank-payment-add-button");
    actions.append(addButton);
  }
  const moreWrap = document.createElement("div");
  moreWrap.className = "bank-payment-more-wrap";
  const moreButton = document.createElement("button");
  moreButton.type = "button";
  moreButton.className = "secondary-button";
  moreButton.setAttribute("aria-expanded", "false");
  moreButton.innerHTML = `<span data-i18n="bankPaymentMore">${translateCopy("Rohkem", "bankPaymentMore")}</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>`;
  const moreMenu = document.createElement("div");
  moreMenu.className = "bank-payment-more-menu";
  moreMenu.hidden = true;
  moreMenu.innerHTML = `<button type="button" data-payment-navigation="paymentImportView"><span data-i18n="bankPaymentImport">${translateCopy("Импорт банковских платежей", "bankPaymentImport")}</span></button><button type="button" data-payment-navigation="paymentExportView"><span data-i18n="bankPaymentExport">${translateCopy("Экспорт платежных поручений", "bankPaymentExport")}</span></button>`;
  moreWrap.append(moreButton, moreMenu);
  actions.append(moreWrap);
  const helpWrap = document.createElement("div");
  helpWrap.className = "bank-payment-help-wrap";
  const helpButton = document.createElement("button");
  helpButton.type = "button";
  helpButton.className = "secondary-button";
  helpButton.setAttribute("aria-expanded", "false");
  helpButton.innerHTML = `<span data-i18n="bankPaymentHelp">${translateCopy("Справка", "bankPaymentHelp")}</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-1 .8-1.5 1.1-1.5 2.7M12 17h.01"></path></svg>`;
  const help = document.createElement("div");
  help.className = "bank-payment-help-panel";
  help.hidden = true;
  help.dataset.i18n = "bankPaymentHelpText";
  help.textContent = translateCopy("Фильтруйте по контрагенту, счету, периоду и автору.", "bankPaymentHelpText");
  helpWrap.append(helpButton, help);
  actions.append(helpWrap);
  heading.append(actions);

  const makeField = (fieldId, key, label, type = "search") => {
    const field = document.createElement("div");
    field.className = "field";
    const caption = document.createElement("label");
    caption.htmlFor = fieldId;
    caption.dataset.i18n = key;
    caption.textContent = translateCopy(label, key);
    const control = document.createElement(type === "select" ? "select" : "input");
    control.id = fieldId;
    if (type !== "select") {
      control.type = type;
      if (type === "search") control.placeholder = translateCopy(label, key);
    }
    field.append(caption, control);
    return field;
  };
  const filterBar = document.createElement("div");
  filterBar.className = "bank-payment-filterbar";
  const counterpartySearch = makeField("bankCounterpartySearch", "bankPaymentCounterparty", "Teine osapool");
  const accountField = makeField("bankPaymentAccountFilter", "bankPaymentAccount", "Pangakonto", "select");
  const authorSearch = makeField("bankAuthorSearch", "bankPaymentEnteredBy", "Sisestaja");
  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "text-button bank-payment-clear";
  clearButton.title = translateCopy("Очистить фильтры", "bankPaymentClear");
  clearButton.setAttribute("aria-label", clearButton.title);
  clearButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"></path></svg>';
  const applyButton = document.createElement("button");
  applyButton.type = "button";
  applyButton.className = "primary-button bank-payment-apply";
  applyButton.dataset.i18n = "bankPaymentFilter";
  applyButton.textContent = translateCopy("FILTREERI", "bankPaymentFilter");
  const dateFromField = dateFields.find(field => field.contains(fromDate));
  const dateToField = dateFields.find(field => field.contains(toDate));
  filterBar.append(counterpartySearch, accountField, dateFromField, dateToField, authorSearch, clearButton, applyButton);
  dateRange?.remove();
  listPanel.insertBefore(filterBar, tableWrap);
  if (fromDate && !fromDate.value) fromDate.value = `${localDate().slice(0, 4)}-01-01`;
  if (toDate && !toDate.value) toDate.value = localDate();

  const accountSelect = accountField.querySelector("select");
  const accountFor = item => String(item.bankAccount || item.bankName || item.bank || (item.paymentMethod === "cash" ? "Kassa" : currentSeller()?.bank) || "—");
  const authorFor = item => String(item.enteredBy || item.createdBy || item.createdByEmail || item.author || "—");
  const enteredAtFor = item => {
    const value = item.enteredAt || item.createdAt || item.created_at;
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? String(value) : new Intl.DateTimeFormat(language === "et" ? "et-EE" : "ru-RU", { dateStyle: "short", timeStyle: "short" }).format(date);
  };
  const updateAccounts = () => {
    const selected = accountSelect.value;
    const accounts = [...new Set([currentSeller()?.bank, ...purchases.map(accountFor)].filter(Boolean))];
    accountSelect.innerHTML = `<option value="">${escapeHtml(translateCopy("Все счета", "bankPaymentAllAccounts"))}</option>${accounts.map(account => `<option value="${escapeHtml(account)}">${escapeHtml(account)}</option>`).join("")}`;
    accountSelect.value = accounts.includes(selected) ? selected : "";
  };
  const filteredRows = () => purchases.map((item, index) => ({ item, index })).filter(({ item }) => {
    if (item.paymentMethod === "cash" || item.category === "cash") return false;
    const counterparty = String(item.supplier || item.counterparty || item.recipient || "").toLocaleLowerCase(language);
    const description = String(item.note || item.description || "").toLocaleLowerCase(language);
    return isWithinDateRange(item.date, fromDate.value, toDate.value)
      && `${counterparty} ${description}`.includes(counterpartySearch.querySelector("input").value.trim().toLocaleLowerCase(language))
      && authorFor(item).toLocaleLowerCase(language).includes(authorSearch.querySelector("input").value.trim().toLocaleLowerCase(language))
      && (!accountSelect.value || accountFor(item) === accountSelect.value);
  });
  const valueFor = (record, key) => ({
    number: record.index + 1,
    counterparty: record.item.supplier || record.item.counterparty || record.item.recipient || "",
    description: record.item.note || record.item.description || "",
    account: accountFor(record.item), date: record.item.date || "", amount: Number(record.item.amount) || 0,
    currency: record.item.currency || "EUR", enteredAt: record.item.enteredAt || record.item.createdAt || "", enteredBy: authorFor(record.item)
  })[key];
  const columns = [
    ["number", "bankPaymentNumber", "NR", "bank-payment-number"],
    ["counterparty", "bankPaymentCounterparty", "TEINE OSAPOOL", "bank-payment-counterparty"],
    ["description", "bankPaymentDescription", "KIRJELDUS", "bank-payment-description"],
    ["account", "bankPaymentAccount", "PANGAKONTO", "bank-payment-account"],
    ["date", "bankPaymentDate", "KUUPÄEV", "bank-payment-date"],
    ["amount", "bankPaymentAmount", "SUMMA", "bank-payment-amount"],
    ["currency", "bankPaymentCurrency", "€/$", "bank-payment-currency"],
    ["enteredAt", "bankPaymentEntered", "SISESTATUD", "bank-payment-entered"],
    ["enteredBy", "bankPaymentEnteredBy", "SISESTAJA", "bank-payment-author"]
  ];
  const tableHead = table.tHead;
  const headerRow = tableHead.rows[0];
  headerRow.replaceChildren();
  for (const [key, i18n, fallback, className] of columns) {
    const cell = document.createElement("th");
    cell.className = className;
    cell.dataset.i18n = i18n;
    const sortButton = document.createElement("button");
    sortButton.type = "button";
    sortButton.className = "bank-payment-sort";
    sortButton.dataset.sort = key;
    sortButton.innerHTML = `<span>${translateCopy(fallback, i18n)}</span><span class="bank-payment-sort-indicator">↕</span>`;
    sortButton.addEventListener("click", () => { sortDirection = sortColumn === key ? -sortDirection : key === "date" ? -1 : 1; sortColumn = key; currentPage = 1; renderRegister(); });
    cell.append(sortButton);
    headerRow.append(cell);
  }
  table.classList.add("bank-payment-table");
  tableWrap.classList.add("bank-payment-table-wrap");
  const pagination = document.createElement("div");
  pagination.className = "bank-payment-pagination";
  pagination.innerHTML = '<nav class="bank-payment-page-buttons" aria-label="Payment pages"></nav><span class="bank-payment-total"></span><label class="bank-payment-page-size"><span data-i18n="bankPaymentRows"></span><select aria-label="Rows per page"><option value="10">10</option><option value="25" selected>25</option><option value="50">50</option></select></label>';
  listPanel.append(pagination);
  const pageSummary = document.createElement("section");
  pageSummary.className = "register-page-summary bank-payment-page-summary";
  pageSummary.innerHTML = '<h3 data-i18n="pageSumsTitle">Lehekülje summad</h3><dl><div><dt data-i18n="pageSumRows">Ridu:</dt><dd id="bankPageRows">0</dd></div><div><dt data-i18n="pageSumTotal">Summa:</dt><dd id="bankPageTotal">0,00 EUR</dd></div><div><dt data-i18n="pageSumUnpaid">Maksmata:</dt><dd id="bankPageUnpaid">0,00 EUR</dd></div><div><dt data-i18n="pageSumOverdue">Üle tähtaja:</dt><dd id="bankPageOverdue">0,00 EUR</dd></div></dl>';
  listPanel.append(pageSummary);
  const pageButtons = pagination.querySelector(".bank-payment-page-buttons");
  const totalLabel = pagination.querySelector(".bank-payment-total");
  const pageSizeSelect = pagination.querySelector("select");

  const renderPagination = total => {
    const pages = Math.max(1, Math.ceil(total / rowsPerPage));
    if (currentPage > pages) currentPage = pages;
    pageButtons.replaceChildren();
    const addButton = (label, target, active = false, disabled = false, ariaLabel = "") => {
      const button = document.createElement("button");
      button.type = "button"; button.textContent = label; button.disabled = disabled;
      if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
      if (active) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => { currentPage = target; renderRegister(); });
      pageButtons.append(button);
    };
    addButton("«", 1, false, currentPage === 1, "First page");
    addButton("‹", Math.max(1, currentPage - 1), false, currentPage === 1, "Previous page");
    const start = Math.max(1, Math.min(currentPage - 4, pages - 8));
    for (let target = start; target <= Math.min(pages, start + 8); target++) addButton(String(target), target, target === currentPage);
    addButton("›", Math.min(pages, currentPage + 1), false, currentPage === pages, "Next page");
    addButton("»", pages, false, currentPage === pages, "Last page");
    const pageLabel = document.createElement("span");
    pageLabel.textContent = `${language === "et" ? "Lehekülg" : "Страница"} ${currentPage} / ${pages}`;
    pageButtons.append(pageLabel);
    totalLabel.textContent = `${translateCopy("Всего", "bankPaymentTotal")}: ${total}`;
  };
  const renderRegister = () => {
    updateAccounts();
    const filtered = filteredRows().sort((first, second) => {
      const a = valueFor(first, sortColumn), b = valueFor(second, sortColumn);
      const comparison = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), language, { numeric: true, sensitivity: "base" });
      return comparison * sortDirection;
    });
    const total = filtered.length;
    const visible = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const pageTotal = visible.reduce((sum, record) => sum + (Number(record.item.amount) || 0), 0);
    const pageUnpaid = visible.reduce((sum, record) => sum + Math.max(0, Number(record.item.amountDue ?? record.item.amount) || 0), 0);
    const pageOverdue = visible.reduce((sum, record) => {
      const unpaid = Math.max(0, Number(record.item.amountDue ?? record.item.amount) || 0);
      return sum + (unpaid > 0 && record.item.dueDate && record.item.dueDate < localDate() ? unpaid : 0);
    }, 0);
    id("bankPageRows").textContent = String(visible.length);
    id("bankPageTotal").textContent = `${money(pageTotal)} EUR`;
    id("bankPageUnpaid").textContent = `${money(pageUnpaid)} EUR`;
    id("bankPageOverdue").textContent = `${money(pageOverdue)} EUR`;
    body.innerHTML = visible.map(({ item, index }) => {
      const amount = Number(item.amount) || 0;
      const counterparty = item.supplier || item.counterparty || item.recipient || "—";
      const rowLabel = `${translateCopy("Открыть банковский платеж", "bankPaymentOpen")}: ${counterparty} · ${money(amount)} ${item.currency || "EUR"}`;
      const cells = [index + 1, item.supplier || item.counterparty || item.recipient || "—", item.note || item.description || "—", accountFor(item), formatDate(item.date) || "—", money(amount), item.currency || "EUR", enteredAtFor(item), authorFor(item)];
      return `<tr data-purchase-index="${index}" tabindex="0" aria-label="${escapeHtml(rowLabel)}" title="${escapeHtml(translateCopy("Открыть банковский платеж", "bankPaymentOpen"))}">${cells.map((value, cellIndex) => `<td class="${["bank-payment-number","bank-payment-counterparty","bank-payment-description","bank-payment-account","","bank-payment-amount","bank-payment-currency","bank-payment-entered","bank-payment-author"][cellIndex]} ${cellIndex === 5 && amount < 0 ? "is-negative" : ""}"${cellIndex === 8 ? ` title="${escapeHtml(value)}"` : ""}>${escapeHtml(value)}</td>`).join("")}</tr>`;
    }).join("") || `<tr><td class="empty-row" colspan="9">${translateCopy("Платежей по заданным фильтрам нет.", "bankPaymentNoRows")}</td></tr>`;
    tableHead.querySelectorAll("[data-sort]").forEach(button => { button.querySelector(".bank-payment-sort-indicator").textContent = button.dataset.sort === sortColumn ? (sortDirection > 0 ? "↑" : "↓") : "↕"; });
    renderPagination(total);
    applyLanguage(language);
  };
  const originalRenderPurchases = renderPurchases;
  renderPurchases = (...args) => {
    originalRenderPurchases(...args);
    tableHead.querySelectorAll(".purchase-balance-column,.purchase-currency-column,.purchase-due-date-column,.purchase-actions-column").forEach(cell => cell.remove());
    renderRegister();
  };

  const bankAccountSelect = document.createElement("select");
  bankAccountSelect.id = "purchaseBankAccount";
  const initialAccounts = [...new Set([currentSeller()?.bank, ...purchases.map(accountFor)].filter(Boolean))];
  bankAccountSelect.innerHTML = initialAccounts.map(account => `<option value="${escapeHtml(account)}">${escapeHtml(account)}</option>`).join("") || '<option value="">—</option>';
  const bankField = document.createElement("div"); bankField.className = "field";
  const bankLabel = document.createElement("label"); bankLabel.htmlFor = bankAccountSelect.id; bankLabel.dataset.i18n = "bankPaymentAccount"; bankLabel.textContent = translateCopy("Банковский счет", "bankPaymentAccount");
  bankField.append(bankLabel, bankAccountSelect);
  id("purchaseSupplier").closest(".field").after(bankField);
    id("purchaseForm").addEventListener("submit", () => {
      const saved = purchases[0];
      if (!saved) return;
      Object.assign(saved, { bankAccount: bankAccountSelect.value, enteredAt: new Date().toISOString(), enteredBy: currentInvoiceActorEmail() || "—", paymentMethod: "bank" });
      try { saveList(STORAGE.purchases, purchases); }
      catch (error) { showMessage(error.message || translateCopy("Не удалось сохранить платеж.", "bankPaymentSaveError"), true); }
      renderRegister();
    });
  const applyFilters = () => { filters = { counterparty: counterpartySearch.querySelector("input").value.trim().toLocaleLowerCase(language), author: authorSearch.querySelector("input").value.trim().toLocaleLowerCase(language), account: accountSelect.value }; currentPage = 1; renderRegister(); };
  applyButton.addEventListener("click", applyFilters);
  [counterpartySearch.querySelector("input"), authorSearch.querySelector("input"), accountSelect, fromDate, toDate].forEach(control => control?.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); applyFilters(); } }));
  clearButton.addEventListener("click", () => { counterpartySearch.querySelector("input").value = ""; authorSearch.querySelector("input").value = ""; accountSelect.value = ""; fromDate.value = ""; toDate.value = ""; applyFilters(); });
  pageSizeSelect.addEventListener("change", () => { rowsPerPage = Number(pageSizeSelect.value) || 25; currentPage = 1; renderRegister(); });
  moreButton.addEventListener("click", () => { moreMenu.hidden = !moreMenu.hidden; moreButton.setAttribute("aria-expanded", String(!moreMenu.hidden)); help.hidden = true; });
  helpButton.addEventListener("click", () => { help.hidden = !help.hidden; helpButton.setAttribute("aria-expanded", String(!help.hidden)); moreMenu.hidden = true; });
  moreMenu.addEventListener("click", event => { const item = event.target.closest("[data-payment-navigation]"); if (item) switchView(item.dataset.paymentNavigation); });
  document.addEventListener("click", event => { if (!moreWrap.contains(event.target)) moreMenu.hidden = true; if (!helpWrap.contains(event.target)) help.hidden = true; });

  const exportData = records => [["Nr","Teine osapool","Kirjeldus","Pangakonto","Kuupäev","Summa","Valuuta","Sisestatud","Sisestaja"], ...records.map(({item,index}) => [index+1,item.supplier||item.counterparty||item.recipient||"",item.note||item.description||"",accountFor(item),item.date||"",Number(item.amount||0).toFixed(2),item.currency||"EUR",enteredAtFor(item),authorFor(item)])];
  const csvCell = value => { let text = String(value ?? ""); if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; };
  const download = async format => {
    if (!can("exportInvoices")) { denyAction("exportInvoices"); return; }
    const records = filteredRows().sort((first,second) => String(valueFor(first,sortColumn)).localeCompare(String(valueFor(second,sortColumn)),language,{numeric:true}));
    if (!records.length) { showMessage(translateCopy("Платежей по заданным фильтрам нет.","bankPaymentNoRows"), true); return; }
    const data = exportData(records); let blob;
    if (format === "csv") blob = new Blob(["\ufeff",data.map(row=>row.map(csvCell).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"});
    else if (format === "xls") { const xml=data.map(row=>`<Row>${row.map(value=>`<Cell><Data ss:Type="String">${escapeHtml(value)}</Data></Cell>`).join("")}</Row>`).join(""); blob=new Blob([`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Pangamaksed"><Table>${xml}</Table></Worksheet></Workbook>`],{type:"application/vnd.ms-excel;charset=utf-8"}); }
    else { const canvas=document.createElement("canvas");canvas.width=1600;canvas.height=Math.max(900,150+records.length*36);const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,1600,canvas.height);ctx.fillStyle="#29483d";ctx.font="bold 30px Arial";ctx.fillText(translateCopy("Банковские платежи","bankPaymentsTitle"),42,48);ctx.fillStyle="#e8eeea";ctx.fillRect(42,78,1515,36);ctx.fillStyle="#35483e";ctx.font="bold 12px Arial";let x=48;const widths=[50,210,400,180,130,110,70,180,170];data[0].forEach((value,index)=>{ctx.fillText(String(value),x,101,widths[index]-6);x+=widths[index]});records.forEach((record,index)=>{const y=114+index*36;ctx.fillStyle=index%2?"#fafbf9":"#fff";ctx.fillRect(42,y,1515,36);ctx.fillStyle="#26352e";ctx.font="12px Arial";x=48;data[index+1].forEach((value,column)=>{ctx.fillText(String(value),x,y+23,widths[column]-6);x+=widths[column]})});blob=await createCanvasPdfBlob(canvas); }
    triggerBlobDownload(blob,`pangamaksed-${localDate()}.${format}`);
  };
  exportLinks.querySelectorAll("[data-bank-export]").forEach(button=>button.addEventListener("click",()=>download(button.dataset.bankExport)));
  renderRegister();
  applyLanguage(language);
  document.querySelectorAll("[data-language]").forEach(button=>button.addEventListener("click",()=>requestAnimationFrame(renderRegister)));
})();
