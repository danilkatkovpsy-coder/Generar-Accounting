(() => {
  const view = document.getElementById("otherExpensesView");
  const panel = document.getElementById("otherExpensesRegisterPanel");
  const body = document.getElementById("expenseRows");
  const form = document.getElementById("expenseForm");
  if (!view || !panel || !body || !form || view.dataset.expensesRegisterReady) return;
  view.dataset.expensesRegisterReady = "true";

  Object.assign(ruTexts, {
    expensesRegisterTitle: "Расходы", expensesRegisterAdd: "Добавить расход", expensesPeriod: "Период",
    expensesSearch: "Поиск", expensesCategory: "Категория", expensesSupplier: "Поставщик", expensesExport: "Экспорт",
    expensesDate: "Дата", expensesDescription: "Описание", expensesAmount: "Сумма", expensesStatus: "Статус",
    expensesInvoiceNumber: "№ счета", expensesNote: "Примечание", expensesAllCategories: "Все категории",
    expensesAllSuppliers: "Все поставщики", expensesTotal: "Итого", expensesRows: "Строк на странице",
    expensesEmpty: "Расходов пока нет.", expensesNoResults: "Расходов по заданным фильтрам нет.",
    expensesRecorded: "Внесено", expensesPaid: "Оплачено", expensesUnpaid: "Не оплачено", expensesDraft: "Черновик",
    expensesActions: "Действия", expensesEdit: "Редактировать", expensesDownload: "Скачать документ",
    expensesDelete: "Удалить", expensesDeleteConfirm: "Удалить этот расход?", expensesSaveError: "Не удалось сохранить расход.",
    expensesInvalid: "Укажите дату, описание и сумму больше нуля.", expenseSaved: "Расход сохранен.",
    expensesEditorNew: "Новый расход", expensesEditorEdit: "Редактирование расхода",
    expensesDeleted: "Расход удален.", expensesClear: "Очистить фильтры", expensesFirst: "Первая страница",
    expensesPrevious: "Предыдущая страница", expensesNext: "Следующая страница", expensesLast: "Последняя страница"
  });
  Object.assign(etTexts, {
    expensesRegisterTitle: "Kulud", expensesRegisterAdd: "Lisa kulu", expensesPeriod: "Periood",
    expensesSearch: "Otsing", expensesCategory: "Kategooria", expensesSupplier: "Tarnija", expensesExport: "Eksport",
    expensesDate: "Kuupäev", expensesDescription: "Kirjeldus", expensesAmount: "Summa", expensesStatus: "Staatus",
    expensesInvoiceNumber: "Arve nr", expensesNote: "Märkus", expensesAllCategories: "Kõik kategooriad",
    expensesAllSuppliers: "Kõik tarnijad", expensesTotal: "Kokku", expensesRows: "Ridu lehel",
    expensesEmpty: "Kulusid veel pole.", expensesNoResults: "Valitud filtritega kulusid pole.",
    expensesRecorded: "Lisatud", expensesPaid: "Makstud", expensesUnpaid: "Maksmata", expensesDraft: "Mustand",
    expensesActions: "Toimingud", expensesEdit: "Muuda", expensesDownload: "Laadi dokument alla",
    expensesDelete: "Kustuta", expensesDeleteConfirm: "Kas kustutada see kulu?", expensesSaveError: "Kulu ei saanud salvestada.",
    expensesInvalid: "Sisestage kuupäev, kirjeldus ja nullist suurem summa.", expenseSaved: "Kulu salvestati.",
    expensesEditorNew: "Uus kulu", expensesEditorEdit: "Kulu muutmine",
    expensesDeleted: "Kulu kustutati.", expensesClear: "Tühjenda filtrid", expensesFirst: "Esimene lehekülg",
    expensesPrevious: "Eelmine lehekülg", expensesNext: "Järgmine lehekülg", expensesLast: "Viimane lehekülg"
  });
  const copy = key => translateCopy(key, key);
  const get = id => document.getElementById(id);
  const icons = {
    plus: '<path d="M12 5v14M5 12h14"></path>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"></path>',
    more: '<circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    first: '<path d="M5 5v14m12-14-7 7 7 7"></path>',
    previous: '<path d="m15 5-7 7 7 7"></path>',
    next: '<path d="m9 5 7 7-7 7"></path>',
    last: '<path d="M19 5v14M7 5l7 7-7 7"></path>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  const heading = view.querySelector(":scope > .view-heading");
  const title = heading.querySelector("h1");
  title.dataset.i18n = "expensesRegisterTitle";
  title.textContent = copy("expensesRegisterTitle");
  heading.querySelector("p")?.remove();
  const addButton = get("addOtherExpenseButton");
  addButton.innerHTML = `${icon("plus")}<span data-i18n="expensesRegisterAdd">${copy("expensesRegisterAdd")}</span>`;
  const editorTitle = document.querySelector("#expenseEditorView .view-heading h1, #expenseEditorView .view-heading h2");
  const setEditorTitle = editing => {
    if (!editorTitle) return;
    editorTitle.dataset.i18n = editing ? "expensesEditorEdit" : "expensesEditorNew";
    editorTitle.textContent = copy(editorTitle.dataset.i18n);
  };
  addButton.addEventListener("click", () => setEditorTitle(false));
  setEditorTitle(false);
  panel.querySelector(":scope > h2")?.remove();

  const from = get("expensesDateFrom");
  const to = get("expensesDateTo");
  const dateRange = panel.querySelector(".date-range-filter");
  const filters = document.createElement("div");
  filters.className = "expense-register-filters";
  const period = document.createElement("fieldset");
  period.className = "expense-register-period";
  period.innerHTML = `<legend data-i18n="expensesPeriod">${copy("expensesPeriod")}</legend>`;
  period.append(from.closest(".field"), to.closest(".field"));
  filters.append(period);
  const searchField = document.createElement("div");
  searchField.className = "field";
  searchField.innerHTML = `<label for="expenseRegisterSearch" data-i18n="expensesSearch">${copy("expensesSearch")}</label><input id="expenseRegisterSearch" type="search" autocomplete="off">`;
  const categoryField = document.createElement("div");
  categoryField.className = "field";
  categoryField.innerHTML = `<label for="expenseRegisterCategory" data-i18n="expensesCategory">${copy("expensesCategory")}</label><select id="expenseRegisterCategory"></select>`;
  const supplierField = document.createElement("div");
  supplierField.className = "field";
  supplierField.innerHTML = `<label for="expenseRegisterSupplier" data-i18n="expensesSupplier">${copy("expensesSupplier")}</label><select id="expenseRegisterSupplier"></select>`;
  const exportWrap = document.createElement("div");
  exportWrap.className = "expense-export-wrap";
  exportWrap.innerHTML = `<button type="button" class="secondary-button" id="expenseRegisterExport" aria-haspopup="menu" aria-expanded="false" aria-controls="expenseRegisterExportMenu">${icon("download")}<span data-i18n="expensesExport">${copy("expensesExport")}</span></button><div class="expense-export-menu" id="expenseRegisterExportMenu" role="menu" hidden><button type="button" role="menuitem" data-expense-export="csv">CSV</button><button type="button" role="menuitem" data-expense-export="xls">Excel (XLS)</button></div>`;
  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "text-button expense-clear-button";
  clearButton.innerHTML = icon("close");
  filters.append(searchField, categoryField, supplierField, exportWrap, clearButton);
  panel.prepend(filters);
  dateRange.remove();
  const search = get("expenseRegisterSearch");
  const category = get("expenseRegisterCategory");
  const supplier = get("expenseRegisterSupplier");
  const exportButton = get("expenseRegisterExport");
  const exportMenu = get("expenseRegisterExportMenu");
  const table = body.closest("table");
  table.classList.add("expense-register-table");
  table.closest(".table-wrap").classList.add("expense-register-table-wrap");
  const columns = [
    ["date", "expensesDate"], ["name", "expensesDescription"], ["supplier", "expensesSupplier"],
    ["category", "expensesCategory"], ["amount", "expensesAmount"], ["status", "expensesStatus"],
    ["invoiceNumber", "expensesInvoiceNumber"], ["note", "expensesNote"]
  ];
  table.querySelector("thead").innerHTML = `<tr>${columns.map(([key, label]) => `<th><button type="button" class="expense-sort-button" data-expense-sort="${key}"><span data-i18n="${label}">${copy(label)}</span><span class="expense-sort-indicator" aria-hidden="true"></span></button></th>`).join("")}<th class="expense-actions-heading">${icon("more")}<span class="expense-visually-hidden" data-i18n="expensesActions">${copy("expensesActions")}</span></th></tr>`;

  const footer = document.createElement("div");
  footer.className = "expense-register-footer";
  footer.innerHTML = `<strong id="expenseRegisterTotal"></strong><nav class="register-page-numbers" id="expenseRegisterPages"></nav><label class="expense-page-size"><span data-i18n="expensesRows">${copy("expensesRows")}</span><select id="expenseRegisterPageSize"><option value="10">10</option><option value="25" selected>25</option><option value="50">50</option><option value="100">100</option></select></label>`;
  panel.append(footer);
  const formGrid = form.querySelector(".form-grid");
  const addField = (id, key, control) => {
    const field = document.createElement("div");
    field.className = "field";
    field.innerHTML = `<label for="${id}" data-i18n="${key}">${copy(key)}</label>${control}`;
    formGrid.append(field);
  };
  addField("expenseSupplierName", "expensesSupplier", '<input id="expenseSupplierName" list="expenseSupplierOptions"><datalist id="expenseSupplierOptions"></datalist>');
  addField("expenseCategory", "expensesCategory", '<input id="expenseCategory" list="expenseCategoryOptions"><datalist id="expenseCategoryOptions"></datalist>');
  addField("expenseStatus", "expensesStatus", `<select id="expenseStatus"><option value="unpaid" data-i18n="expensesUnpaid">${copy("expensesUnpaid")}</option><option value="paid" data-i18n="expensesPaid">${copy("expensesPaid")}</option><option value="draft" data-i18n="expensesDraft">${copy("expensesDraft")}</option><option value="recorded" data-i18n="expensesRecorded">${copy("expensesRecorded")}</option></select>`);
  addField("expenseInvoiceNumber", "expensesInvoiceNumber", '<input id="expenseInvoiceNumber">');
  addField("expenseNote", "expensesNote", '<textarea id="expenseNote" rows="2"></textarea>');
  for (const [id, key] of [["expenseDate", "expensesDate"], ["expenseName", "expensesDescription"], ["expenseAmount", "expensesAmount"]]) {
    const label = get(id).closest(".field").querySelector("label");
    label.dataset.i18n = key;
    label.textContent = copy(key);
  }

  let currentPage = 1;
  let pageSize = 25;
  let sortKey = "date";
  let sortDirection = -1;
  let openedMenu = null;
  const supplierFor = item => String(item.supplierName || item.supplier || item.counterparty || "");
  const categoryFor = item => String(item.category || "");
  const invoiceFor = item => String(item.invoiceNumber || item.invoiceNo || "");
  const noteFor = item => String(item.note || item.remarks || "");
  const statusFor = item => {
    const value = item.status || item.paymentStatus;
    if (["paid", "unpaid", "draft", "recorded"].includes(value)) return value;
    if (item.amountDue != null) return Number(item.amountDue) === 0 ? "paid" : "unpaid";
    return "recorded";
  };
  const statusKey = status => ({ paid: "expensesPaid", unpaid: "expensesUnpaid", draft: "expensesDraft", recorded: "expensesRecorded" })[status];
  const valueFor = (item, key) => key === "supplier" ? supplierFor(item) : key === "category" ? categoryFor(item)
    : key === "invoiceNumber" ? invoiceFor(item) : key === "note" ? noteFor(item) : key === "status" ? copy(statusKey(statusFor(item)))
      : key === "amount" ? Number(item.amount) || 0 : item[key] || "";
  const filteredRows = () => {
    const query = search.value.trim().toLocaleLowerCase(language);
    return expenses.map((item, index) => ({ item, index })).filter(({ item }) =>
      isWithinDateRange(item.date, from.value, to.value)
      && (!category.value || categoryFor(item) === category.value)
      && (!supplier.value || supplierFor(item) === supplier.value)
      && (!query || [item.name, supplierFor(item), categoryFor(item), invoiceFor(item), noteFor(item), item.fileName].join(" ").toLocaleLowerCase(language).includes(query))
    ).sort((first, second) => {
      const firstValue = valueFor(first.item, sortKey);
      const secondValue = valueFor(second.item, sortKey);
      return sortDirection * (sortKey === "amount" ? firstValue - secondValue : String(firstValue).localeCompare(String(secondValue), language, { numeric: true, sensitivity: "base" }));
    });
  };
  const setOptions = (select, values, allKey) => {
    const selected = select.value;
    select.replaceChildren(new Option(copy(allKey), ""));
    values.forEach(value => select.add(new Option(value, value)));
    select.value = values.includes(selected) ? selected : "";
  };
  const closeRowMenu = () => {
    if (!openedMenu) return;
    openedMenu.hidden = true;
    openedMenu.parentElement.querySelector(".expense-row-more").setAttribute("aria-expanded", "false");
    openedMenu = null;
  };
  renderExpenses = () => {
    closeRowMenu();
    const categories = [...new Set(expenses.map(categoryFor).filter(Boolean))].sort((first, second) => first.localeCompare(second, language));
    const suppliers = [...new Set(expenses.map(supplierFor).filter(Boolean))].sort((first, second) => first.localeCompare(second, language));
    setOptions(category, categories, "expensesAllCategories");
    setOptions(supplier, suppliers, "expensesAllSuppliers");
    get("expenseCategoryOptions").replaceChildren(...categories.map(value => new Option(value, value)));
    get("expenseSupplierOptions").replaceChildren(...suppliers.map(value => new Option(value, value)));
    const rows = filteredRows();
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const visible = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    body.innerHTML = visible.map(({ item, index }) => {
      const status = statusFor(item);
      return `<tr><td class="expense-date">${escapeHtml(formatDate(item.date))}</td><td class="expense-description">${escapeHtml(item.name || "—")}</td><td>${escapeHtml(supplierFor(item) || "—")}</td><td>${escapeHtml(categoryFor(item) || "—")}</td><td class="expense-amount">${money(item.amount)} EUR</td><td><span class="expense-status is-${status}">${escapeHtml(copy(statusKey(status)))}</span></td><td>${escapeHtml(invoiceFor(item) || "—")}</td><td class="expense-note">${escapeHtml(noteFor(item) || "—")}</td><td class="expense-actions-cell"><div class="expense-row-actions"><button type="button" class="expense-row-more" aria-haspopup="menu" aria-expanded="false" aria-controls="expenseRowMenu${index}" aria-label="${escapeHtml(copy("expensesActions"))}" title="${escapeHtml(copy("expensesActions"))}">${icon("more")}</button><div class="expense-row-menu" id="expenseRowMenu${index}" role="menu" hidden><button type="button" role="menuitem" data-expense-action="edit" data-index="${index}" ${can("expenses") ? "" : "disabled"}>${escapeHtml(copy("expensesEdit"))}</button>${item.data ? `<button type="button" role="menuitem" data-expense-action="download" data-index="${index}">${escapeHtml(copy("expensesDownload"))}</button>` : ""}<button type="button" role="menuitem" class="expense-delete-action" data-expense-action="delete" data-index="${index}" ${can("expenses") ? "" : "disabled"}>${escapeHtml(copy("expensesDelete"))}</button></div></div></td></tr>`;
    }).join("") || `<tr><td class="expense-empty" colspan="9">${escapeHtml(copy(expenses.length ? "expensesNoResults" : "expensesEmpty"))}</td></tr>`;
    get("expenseRegisterTotal").textContent = `${copy("expensesTotal")}: ${money(rows.reduce((sum, { item }) => sum + (Number(item.amount) || 0), 0))} EUR`;
    const pages = get("expenseRegisterPages");
    pages.setAttribute("aria-label", copy("expensesRows"));
    pages.replaceChildren();
    const addPage = (label, target, disabled, name = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = disabled;
      if (name) { button.innerHTML = icon(name); button.setAttribute("aria-label", copy(label)); button.title = copy(label); }
      else { button.textContent = label; if (target === currentPage) button.setAttribute("aria-current", "page"); }
      button.addEventListener("click", () => { currentPage = target; renderExpenses(); });
      pages.append(button);
    };
    addPage("expensesFirst", 1, currentPage === 1, "first");
    addPage("expensesPrevious", currentPage - 1, currentPage === 1, "previous");
    const start = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
    for (let pageNumber = start; pageNumber <= Math.min(pageCount, start + 4); pageNumber++) addPage(String(pageNumber), pageNumber, false);
    addPage("expensesNext", currentPage + 1, currentPage === pageCount, "next");
    addPage("expensesLast", pageCount, currentPage === pageCount, "last");
    const pageLabel = document.createElement("span");
    pageLabel.textContent = `${currentPage} / ${pageCount}`;
    pages.append(pageLabel);
    table.querySelectorAll("[data-expense-sort]").forEach(button => {
      const active = button.dataset.expenseSort === sortKey;
      button.closest("th").setAttribute("aria-sort", active ? sortDirection > 0 ? "ascending" : "descending" : "none");
      button.querySelector(".expense-sort-indicator").textContent = active ? sortDirection > 0 ? "↑" : "↓" : "";
    });
    clearButton.title = copy("expensesClear");
    clearButton.setAttribute("aria-label", copy("expensesClear"));
    exportButton.disabled = !rows.length || !can("exportReports");
    if (exportButton.disabled) { exportMenu.hidden = true; exportButton.setAttribute("aria-expanded", "false"); }
    applyLanguage(language);
  };
  for (const input of [search, category, supplier, from, to]) input.addEventListener(input === search ? "input" : "change", () => { currentPage = 1; renderExpenses(); });
  clearButton.addEventListener("click", () => { search.value = ""; category.value = ""; supplier.value = ""; from.value = ""; to.value = ""; currentPage = 1; renderExpenses(); });
  get("expenseRegisterPageSize").addEventListener("change", event => { pageSize = Number(event.target.value); currentPage = 1; renderExpenses(); });
  table.querySelector("thead").addEventListener("click", event => {
    const button = event.target.closest("[data-expense-sort]");
    if (!button) return;
    sortDirection = sortKey === button.dataset.expenseSort ? -sortDirection : 1;
    sortKey = button.dataset.expenseSort;
    currentPage = 1;
    renderExpenses();
  });
  form.addEventListener("reset", () => { delete form.dataset.expenseEditIndex; });
  body.addEventListener("click", event => {
    const more = event.target.closest(".expense-row-more");
    if (more) {
      const menu = more.parentElement.querySelector(".expense-row-menu");
      const open = menu.hidden;
      closeRowMenu();
      if (open) {
        menu.hidden = false;
        const anchor = more.getBoundingClientRect();
        const bounds = menu.getBoundingClientRect();
        menu.style.left = `${Math.max(8, Math.min(innerWidth - bounds.width - 8, anchor.right - bounds.width))}px`;
        menu.style.top = `${anchor.bottom + bounds.height + 5 <= innerHeight - 8 ? anchor.bottom + 5 : Math.max(8, anchor.top - bounds.height - 5)}px`;
        more.setAttribute("aria-expanded", "true");
        openedMenu = menu;
      }
      return;
    }
    const action = event.target.closest("[data-expense-action]");
    if (!action) return;
    const index = Number(action.dataset.index);
    const item = expenses[index];
    closeRowMenu();
    if (!item) return;
    if (action.dataset.expenseAction === "download") {
      const link = document.createElement("a");
      link.href = item.data;
      link.download = item.fileName || "expense-document";
      link.click();
      return;
    }
    if (!can("expenses")) { denyAction("expenses"); return; }
    if (action.dataset.expenseAction === "edit") {
      form.reset();
      form.dataset.expenseEditIndex = String(index);
      get("expenseDate").value = item.date || localDate();
      get("expenseName").value = item.name || "";
      get("expenseAmount").value = Number(item.amount || 0).toFixed(2);
      get("expenseSupplierName").value = supplierFor(item);
      get("expenseCategory").value = categoryFor(item);
      get("expenseStatus").value = statusFor(item);
      get("expenseInvoiceNumber").value = invoiceFor(item);
      get("expenseNote").value = noteFor(item);
      setEditorTitle(true);
      setExpenseEditorPage(true);
      get("expenseName").focus();
      return;
    }
    if (!window.confirm(copy("expensesDeleteConfirm"))) return;
    const next = expenses.filter((record, recordIndex) => recordIndex !== index);
    try { saveList(STORAGE.expenses, next); expenses = next; }
    catch { showMessage(copy("expensesSaveError"), true); return; }
    renderExpenses(); renderDashboard(); renderReport();
    showMessage(copy("expensesDeleted"));
  });
  exportButton.addEventListener("click", () => { exportMenu.hidden = !exportMenu.hidden; exportButton.setAttribute("aria-expanded", String(!exportMenu.hidden)); });
  const csvCell = value => {
    let text = String(value ?? "");
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  exportMenu.addEventListener("click", event => {
    const button = event.target.closest("[data-expense-export]");
    if (!button || !can("exportReports")) return;
    const rows = filteredRows();
    if (!rows.length) return;
    const records = [columns.map(([, label]) => copy(label)), ...rows.map(({ item }) => columns.map(([key]) => key === "date" ? formatDate(item.date) : key === "amount" ? Number(item.amount || 0).toFixed(2) : valueFor(item, key)))];
    const format = button.dataset.expenseExport;
    const blob = format === "csv" ? new Blob(["\ufeff", records.map(row => row.map(csvCell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" })
      : new Blob([`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Kulud"><Table>${records.map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="String">${escapeHtml(String(value))}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet></Workbook>`], { type: "application/vnd.ms-excel;charset=utf-8" });
    triggerBlobDownload(blob, `kulud-${localDate()}.${format}`);
    exportMenu.hidden = true;
    exportButton.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".expense-row-actions")) closeRowMenu();
    if (!exportWrap.contains(event.target)) { exportMenu.hidden = true; exportButton.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeRowMenu(); exportMenu.hidden = true; exportButton.setAttribute("aria-expanded", "false"); }
  });
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(renderExpenses)));
  table.closest(".table-wrap").addEventListener("scroll", closeRowMenu);
  window.addEventListener("resize", closeRowMenu);
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); renderExpenses(); };
  renderExpenses();
})();