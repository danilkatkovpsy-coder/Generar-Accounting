(() => {
  const nav = document.getElementById("appNav");
  const anchor = nav?.querySelector('[data-payments-menu-ready="true"]')?.closest(".payments-nav-wrap");
  const panel = document.getElementById("generalLedgerPanel");
  const tab = document.getElementById("generalLedgerTab");
  if (!anchor || !panel || !tab || document.getElementById("ledgerNavMenu")) return;
  const get = id => document.getElementById(id);

  Object.assign(ruTexts, { navLedger: "Главная книга", ledgerEntriesMenu: "Проводки главной книги", ledgerBookMenu: "Главная книга", ledgerTurnoverMenu: "Оборотная ведомость", ledgerAdvancedTitle: "Дополнительные настройки", ledgerPrintRelated: "Показывать связанные счета при печати", ledgerOnlyTransactions: "Показывать только счета с операциями", ledgerOptionsApply: "Применить", ledgerOptionsCancel: "Отмена", ledgerDemoMode: "Тестовые данные", ledgerLiveMode: "Обычные данные", ledgerTurnoverNotice: "Обороты по счетам за выбранный период.", ledgerReportBlock: "Отчет", ledgerAccountsBlock: "Счета", ledgerObjectsBlock: "Объекты", ledgerGroupDays: "Группировка", ledgerNoGrouping: "Без группировки", ledgerByDay: "По дням", ledgerByWeek: "По неделям", ledgerByMonth: "По месяцам", ledgerAvailableList: "Доступные", ledgerSelectedList: "Выбранные", ledgerAddAll: "Добавить все", ledgerRemoveAll: "Убрать все", ledgerAddItem: "Добавить", ledgerRemoveItem: "Убрать", ledgerChooseAccount: "Выберите хотя бы один счет.", ledgerNoSelection: "Ничего не выбрано.", ledgerEur: "EUR" });
  Object.assign(etTexts, { navLedger: "Pearaamat", ledgerEntriesMenu: "Pearaamatu kanded", ledgerBookMenu: "Pearaamat", ledgerTurnoverMenu: "Käibeandmik", ledgerAdvancedTitle: "Täpsemad seaded", ledgerPrintRelated: "Kuva väljarükil seotud kontod", ledgerOnlyTransactions: "Kuva ainult tehingutega kontod", ledgerOptionsApply: "Rakenda", ledgerOptionsCancel: "Tühista", ledgerDemoMode: "Näidisandmed", ledgerLiveMode: "Tegelikud andmed", ledgerTurnoverNotice: "Kontode käibeandmik valitud perioodi kohta.", ledgerReportBlock: "Aruanne", ledgerAccountsBlock: "Kontod", ledgerObjectsBlock: "Objektid", ledgerGroupDays: "Rühmitamine", ledgerNoGrouping: "Ära rühmita", ledgerByDay: "Päeva kaupa", ledgerByWeek: "Nädala kaupa", ledgerByMonth: "Kuu kaupa", ledgerAvailableList: "Kõik", ledgerSelectedList: "Valitud", ledgerAddAll: "Lisa kõik", ledgerRemoveAll: "Eemalda kõik", ledgerAddItem: "Lisa", ledgerRemoveItem: "Eemalda", ledgerChooseAccount: "Vali vähemalt üks konto.", ledgerNoSelection: "Valikuid pole.", ledgerEur: "EUR" });
  const copy = key => translateCopy(key, key);
  Object.assign(ruTexts, { journalDocumentOrDescription: "Документ или описание", journalPostingAmount: "Сумма проводки", journalDate: "КП", journalEnteredAt: "Внесено", journalEnteredBy: "Внесший", journalClearFilters: "Сбросить фильтры", journalFilter: "ФИЛЬТРОВАТЬ", journalNoRows: "Нет проводок за выбранный период.", journalSort: "Сортировать", journalNumberColumn: "№", journalDocumentColumn: "ДОКУМЕНТ-ОСНОВАНИЕ", journalDescriptionColumn: "ОПИСАНИЕ", journalAmountColumn: "СУММА ПРОВОДКИ", journalCurrencyColumn: "€/$", journalDateColumn: "КП", journalEnteredAtColumn: "ВНЕСЕНО", journalEnteredByColumn: "ВНЕСШИЙ" });
  Object.assign(etTexts, { journalDocumentOrDescription: "Alusdokument või kirjeldus", journalPostingAmount: "Kande summa", journalDate: "KP", journalEnteredAt: "Sisestatud", journalEnteredBy: "Sisestaja", journalClearFilters: "Tühjenda filtrid", journalFilter: "FILTREERI", journalNoRows: "Valitud perioodil kandeid pole.", journalSort: "Sordi", journalNumberColumn: "NR", journalDocumentColumn: "ALUSDOKUMENT", journalDescriptionColumn: "KIRJELDUS", journalAmountColumn: "KANDE SUMMA", journalCurrencyColumn: "€/$", journalDateColumn: "KP", journalEnteredAtColumn: "SISESTATUD", journalEnteredByColumn: "SISESTAJA" });
  Object.assign(ruTexts, { journalAdd: "Добавить", journalMore: "Ещё", journalHelp: "Справка", journalRefresh: "Обновить список", journalOpenLedger: "Открыть главную книгу", journalHelpText: "Список включает сохранённые документы и ручные двойные проводки. Для старых записей без номера, времени или автора показано тире.", journalAllCurrencies: "Все валюты", journalLocalOnlySaved: "Проводка сохранена на этом устройстве. Примените миграцию для облачной синхронизации.", journalEntryTitle: "Новая проводка", journalEntryDate: "Дата проводки", journalEntryDocument: "Документ-основание", journalEntryDescription: "Описание", journalEntryAmount: "Сумма проводки", journalEntryDebit: "Счёт дебета", journalEntryCredit: "Счёт кредита", journalEntryCancel: "Отмена", journalEntrySave: "Сохранить проводку", journalEntrySameAccounts: "Выберите разные счета дебета и кредита.", journalEntrySaved: "Проводка сохранена." });
  Object.assign(etTexts, { journalAdd: "Lisa uus", journalMore: "Rohkem", journalHelp: "Abi", journalRefresh: "Värskenda nimekirja", journalOpenLedger: "Ava pearaamat", journalHelpText: "Loend sisaldab salvestatud dokumentidest tuletatud kandeid ja käsitsi lisatud tasakaalus kandeid. Vanadel kirjetel puuduv number, aeg või sisestaja kuvatakse kriipsuna.", journalAllCurrencies: "Kõik valuutad", journalLocalOnlySaved: "Kanne salvestati sellesse seadmesse. Pilvesünkroonimiseks rakendage migratsioon.", journalEntryTitle: "Uus pearaamatu kanne", journalEntryDate: "Kande kuupäev", journalEntryDocument: "Alusdokument", journalEntryDescription: "Kirjeldus", journalEntryAmount: "Kande summa", journalEntryDebit: "Deebetkonto", journalEntryCredit: "Kreeditkonto", journalEntryCancel: "Tühista", journalEntrySave: "Salvesta kanne", journalEntrySameAccounts: "Vali deebet- ja kreeditkontoks erinevad kontod.", journalEntrySaved: "Kanne salvestati." });
  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap ledger-nav-wrap";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "nav-button";
  trigger.dataset.view = "ledgerView";
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "ledgerNavMenu");
  const bookIcon = '<path d="M12 6.5c-1.5-1.3-3.5-2-6-2H4v15h2c2.5 0 4.5.7 6 2m0-15c1.5-1.3 3.5-2 6-2h2v15h-2c-2.5 0-4.5.7-6 2m0-15v15"></path>';
  trigger.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${bookIcon}</svg><span data-i18n="navLedger">${copy("navLedger")}</span><svg class="payments-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>`;
  const menu = document.createElement("div");
  menu.id = "ledgerNavMenu";
  menu.className = "payments-nav-menu ledger-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(trigger, menu);
  anchor.after(wrapper);
  nav.querySelector('.nav-button[data-view="otherExpensesView"]')?.remove();
  tab.hidden = true;
  tab.tabIndex = -1;
  tab.setAttribute("aria-hidden", "true");
  if (tab.getAttribute("aria-selected") === "true") document.getElementById("annualReportTab").click();

  const ledgerView = document.createElement("section");
  ledgerView.id = "ledgerView";
  ledgerView.className = "app-view payments-subview ledger-subview";
  ledgerView.hidden = true;
  ledgerView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="ledgerBookMenu">${copy("ledgerBookMenu")}</h1></div></div>`;
  ledgerView.querySelector(".view-heading").append(document.getElementById("createLedgerButton"));
  const demoToggle = document.createElement("button");
  demoToggle.type = "button";
  demoToggle.className = "secondary-button ledger-demo-toggle";
  demoToggle.dataset.i18n = "ledgerDemoMode";
  demoToggle.setAttribute("aria-pressed", "false");
  demoToggle.textContent = copy("ledgerDemoMode");
  demoToggle.addEventListener("click", () => {
    const enabled = demoToggle.getAttribute("aria-pressed") !== "true";
    window.setLedgerDemoMode?.(enabled);
    demoToggle.setAttribute("aria-pressed", String(enabled));
    demoToggle.dataset.i18n = enabled ? "ledgerLiveMode" : "ledgerDemoMode";
    demoToggle.textContent = copy(demoToggle.dataset.i18n);
  });
  ledgerView.querySelector(".view-heading").append(demoToggle);
  panel.querySelector(":scope > .balance-heading")?.remove();
  panel.removeAttribute("role");
  panel.removeAttribute("aria-labelledby");
  ledgerView.append(panel);
   const journalRegister = document.createElement("section");
   journalRegister.id = "ledgerJournalRegister";
  journalRegister.className = "ledger-journal-register data-panel";
   journalRegister.hidden = true;
   journalRegister.innerHTML = `<section class="ledger-journal-panel"><div class="ledger-journal-toolbar"><div class="ledger-journal-filters"><input id="ledgerJournalSearch" type="search" placeholder="${copy("journalDocumentOrDescription")}" aria-label="${copy("journalDocumentOrDescription")}"><select id="ledgerJournalCurrency" aria-label="${copy("ledgerCurrencyLabel")}"><option value="EUR">EUR</option></select><div class="field"><label for="ledgerJournalStart">${copy("ledgerStartDateLabel")}</label><input id="ledgerJournalStart" type="date"></div><span aria-hidden="true">–</span><div class="field"><label for="ledgerJournalEnd">${copy("ledgerEndDateLabel")}</label><input id="ledgerJournalEnd" type="date"></div><input id="ledgerJournalAuthor" type="search" placeholder="${copy("journalEnteredBy")}" aria-label="${copy("journalEnteredBy")}"><button type="button" class="icon-button ledger-journal-clear" id="ledgerJournalClear" title="${copy("journalClearFilters")}" aria-label="${copy("journalClearFilters")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8m0-5v5h5M12 8v4l3 2"></path></svg></button><button type="button" class="primary-button" id="ledgerJournalFilter" data-i18n="journalFilter">${copy("journalFilter")}</button></div></div><div class="table-wrap"><table id="ledgerJournalTable" class="data-table ledger-journal-table"><thead><tr>${[["number","NR"],["document","ALUSDOKUMENT"],["description","KIRJELDUS"],["amount","KANDE SUMMA"],["currency","€/$"],["date","KP"],["enteredAt","SISESTATUD"],["enteredBy","SISESTAJA"]].map(([key,label])=>`<th><button type="button" class="ledger-journal-sort" data-journal-sort="${key}" aria-label="${copy("journalSort")}: ${label}"><span data-journal-label="${key}">${label}</span><span class="ledger-sort-icon" aria-hidden="true">↕</span></button></th>`).join("")}</tr></thead><tbody id="ledgerJournalRows"></tbody></table></div></section>`;
  const journalHeaderKeys = { number: "journalNumberColumn", document: "journalDocumentColumn", description: "journalDescriptionColumn", amount: "journalAmountColumn", currency: "journalCurrencyColumn", date: "journalDateColumn", enteredAt: "journalEnteredAtColumn", enteredBy: "journalEnteredByColumn" };
  journalRegister.querySelectorAll("[data-journal-label]").forEach(label => { label.dataset.i18n = journalHeaderKeys[label.dataset.journalLabel]; label.textContent = copy(label.dataset.i18n); });
   ledgerView.append(journalRegister);
  document.querySelector("main").insertBefore(ledgerView, document.getElementById("reportsView"));
  const journalHeading = ledgerView.querySelector(".view-heading");
  journalHeading.classList.add("ledger-journal-heading");
  const journalExports = document.createElement("div");
  journalExports.className = "ledger-journal-exports";
  journalExports.innerHTML = `<span id="ledgerJournalExportAnchor" hidden></span><button type="button" id="ledgerJournalCsv" data-i18n="assetDepExportCsv">CSV</button>`;
  journalHeading.firstElementChild.append(journalExports);
  const journalActions = document.createElement("div");
  journalActions.className = "ledger-journal-page-actions";
  journalActions.innerHTML = `<button type="button" class="primary-button" id="ledgerJournalAdd"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg><span data-i18n="journalAdd">${copy("journalAdd")}</span></button><div class="ledger-journal-more-wrap"><button type="button" class="secondary-button" id="ledgerJournalMore" aria-haspopup="menu" aria-expanded="false" aria-controls="ledgerJournalMoreMenu"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg><span data-i18n="journalMore">${copy("journalMore")}</span></button><div class="ledger-journal-more-menu" id="ledgerJournalMoreMenu" role="menu" hidden><button type="button" role="menuitem" data-journal-action="refresh" data-i18n="journalRefresh">${copy("journalRefresh")}</button><button type="button" role="menuitem" data-journal-action="ledger" data-i18n="journalOpenLedger">${copy("journalOpenLedger")}</button></div></div><div class="ledger-journal-help-wrap"><button type="button" class="secondary-button" id="ledgerJournalHelp" aria-expanded="false" aria-controls="ledgerJournalHelpPanel"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-1 .8-1.5 1.1-1.5 2.7M12 17h.01"></path></svg><span data-i18n="journalHelp">${copy("journalHelp")}</span></button><div class="ledger-journal-help-panel" id="ledgerJournalHelpPanel" data-i18n="journalHelpText" hidden>${copy("journalHelpText")}</div></div>`;
  journalHeading.append(journalActions);
  const journalEntryDialog = document.createElement("dialog");
  journalEntryDialog.className = "ledger-journal-dialog";
  journalEntryDialog.setAttribute("aria-labelledby", "ledgerJournalEntryTitle");
  journalEntryDialog.innerHTML = `<form id="ledgerJournalEntryForm"><div class="ledger-journal-dialog-heading"><h2 id="ledgerJournalEntryTitle" data-i18n="journalEntryTitle">${copy("journalEntryTitle")}</h2><button type="button" class="icon-button" id="ledgerJournalEntryClose" aria-label="${copy("journalEntryCancel")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button></div><div class="ledger-journal-entry-grid"><label class="field"><span data-i18n="journalEntryDate">${copy("journalEntryDate")}</span><input id="ledgerJournalEntryDate" type="date" required></label><label class="field"><span data-i18n="journalEntryDocument">${copy("journalEntryDocument")}</span><input id="ledgerJournalEntryDocument" type="text" maxlength="180"></label><label class="field ledger-journal-entry-wide"><span data-i18n="journalEntryDescription">${copy("journalEntryDescription")}</span><input id="ledgerJournalEntryDescription" type="text" maxlength="300" required></label><label class="field"><span data-i18n="journalEntryAmount">${copy("journalEntryAmount")}</span><input id="ledgerJournalEntryAmount" type="number" min="0.01" step="0.01" required></label><label class="field"><span data-i18n="ledgerCurrencyLabel">${copy("ledgerCurrencyLabel")}</span><select id="ledgerJournalEntryCurrency"><option value="EUR">EUR</option></select></label><label class="field"><span data-i18n="journalEntryDebit">${copy("journalEntryDebit")}</span><select id="ledgerJournalDebitAccount" required></select></label><label class="field"><span data-i18n="journalEntryCredit">${copy("journalEntryCredit")}</span><select id="ledgerJournalCreditAccount" required></select></label></div><p id="ledgerJournalEntryError" class="ledger-journal-entry-error" role="alert" hidden></p><div class="ledger-journal-dialog-actions"><button type="button" class="secondary-button" id="ledgerJournalEntryCancel" data-i18n="journalEntryCancel">${copy("journalEntryCancel")}</button><button type="submit" class="primary-button" data-i18n="journalEntrySave">${copy("journalEntrySave")}</button></div></form>`;
  journalEntryDialog.querySelector("#ledgerJournalEntryCurrency").closest(".field").remove();
  document.body.append(journalEntryDialog);
  const journalSort = { key: "date", direction: -1 };
  let journalRows = [];
  let journalCurrenciesInitialized = false;
  const refreshJournalCurrencies = () => {
    const select = get("ledgerJournalCurrency"), selected = journalCurrenciesInitialized ? select.value : "";
    const sourceItems = [...invoices, ...purchases, ...supplierInvoices, ...expenses, ...manualJournalEntries].filter(item => item && typeof item === "object");
    const fixedAssetCurrencies = readStorage(STORAGE.fixedAssets, []).flatMap(asset => Array.isArray(asset?.depreciationEntries) ? asset.depreciationEntries.map(entry => entry.currency || asset.currency || "EUR") : []);
    const currencies = [...new Set(["EUR", ...sourceItems.map(item => String(item.currency || "EUR").toUpperCase()), ...fixedAssetCurrencies.map(value => String(value).toUpperCase())])].sort();
    select.innerHTML = `<option value="" data-i18n="journalAllCurrencies">${copy("journalAllCurrencies")}</option>${currencies.map(currency => `<option value="${escapeHtml(currency)}">${escapeHtml(currency)}</option>`).join("")}`;
    select.value = currencies.includes(selected) ? selected : "";
    journalCurrenciesInitialized = true;
  };
  const baseJournalCreateLedgerEntries = createLedgerEntries;
  createLedgerEntries = (start, end) => {
    const entries = baseJournalCreateLedgerEntries(start, end);
    const accounts = new Map(getLedgerAccounts().map(account => [account.code, account.label]));
    for (const item of manualJournalEntries) {
      if (!item.date || item.date < start || item.date > end) continue;
      const amount = Number(item.amount) || 0;
      const common = { id: `manual-${item.id}`, journalNumber: item.number, date: item.date, documentNumber: item.documentNumber || "", description: item.description || "", currency: item.currency || "EUR", enteredAt: item.enteredAt, enteredBy: item.enteredBy };
      entries.push(
        { ...common, accountCode: item.debitAccount, account: accounts.get(item.debitAccount) || item.debitAccount, debit: amount, credit: 0 },
        { ...common, accountCode: item.creditAccount, account: accounts.get(item.creditAccount) || item.creditAccount, debit: 0, credit: amount }
      );
    }
    return entries;
  };
  const journalSourceFor = entry => {
    if (entry.id?.startsWith("manual-")) return manualJournalEntries.find(item => item.id === entry.id.slice(7));
    if (entry.id?.startsWith("sale-")) return invoices.find(item => String(item.number) === String(entry.documentNumber) && item.date === entry.date);
    if (entry.id?.startsWith("supplier-")) return supplierInvoices.find(item => String(item.id) === entry.id.slice(9));
    if (entry.id?.startsWith("expense-")) return expenses.find(item => String(item.id) === entry.id.slice(8));
    if (entry.id?.startsWith("purchase-")) {
      const amount = Number(entry.debit || entry.credit) || 0;
      return purchases.find(item => item.date === entry.date && String(item.category || "") === String(entry.documentNumber || "") && String(item.supplier || "") === String(entry.object || "") && Number(item.amount) === amount);
    }
    if (entry.id?.startsWith("asset-dep-")) {
      const sourceId = entry.id.slice(10).replace(/-(expense|depreciation)$/, "");
      return readStorage(STORAGE.fixedAssets, []).flatMap(asset => Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : []).find(item => String(item.id) === sourceId);
    }
    return null;
  };
  const journalEnteredAt = value => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? String(value) : new Intl.DateTimeFormat(language === "et" ? "et-EE" : "ru-RU", { dateStyle: "short", timeStyle: "short" }).format(date);
  };
  const renderJournalRows = () => {
    const search = get("ledgerJournalSearch").value.trim().toLocaleLowerCase(language === "et" ? "et-EE" : "ru-RU");
    const author = get("ledgerJournalAuthor").value.trim().toLocaleLowerCase(language === "et" ? "et-EE" : "ru-RU");
    const start = get("ledgerJournalStart").value, end = get("ledgerJournalEnd").value;
    const rows = journalRows.filter(row => {
      const textMatch = !search || `${row.document} ${row.description}`.toLocaleLowerCase(language === "et" ? "et-EE" : "ru-RU").includes(search);
      const authorMatch = !author || row.enteredBy.toLocaleLowerCase(language === "et" ? "et-EE" : "ru-RU").includes(author);
      const currency = get("ledgerJournalCurrency").value;
      return textMatch && authorMatch && (!start || row.date >= start) && (!end || row.date <= end) && (!currency || row.currency === currency);
    });
    rows.sort((first, second) => {
      const a = first[journalSort.key], b = second[journalSort.key];
      const compared = journalSort.key === "amount" ? Number(a) - Number(b) : String(a).localeCompare(String(b), language === "et" ? "et-EE" : "ru-RU", { numeric: true, sensitivity: "base" });
      return compared * journalSort.direction;
    });
    get("ledgerJournalRows").innerHTML = rows.map(row => `<tr><td>${escapeHtml(row.number)}</td><td>${escapeHtml(row.document || "—")}</td><td>${escapeHtml(row.description || "—")}</td><td class="ledger-journal-amount">${escapeHtml(money(row.amount))}</td><td>${escapeHtml(row.currency)}</td><td>${escapeHtml(formatDate(row.date))}</td><td>${escapeHtml(row.enteredAt)}</td><td>${escapeHtml(row.enteredBy)}</td></tr>`).join("") || `<tr><td colspan="8" class="empty-row">${escapeHtml(copy("journalNoRows"))}</td></tr>`;
  };
  const loadJournalRows = () => {
    const start = get("ledgerJournalStart").value, end = get("ledgerJournalEnd").value;
    if (start && end && start > end) { showMessage(translateCopy("Укажите корректный период.", "ledgerInvalidDates"), true); return false; }
    refreshJournalCurrencies();
    const rangeStart = start || "0001-01-01", rangeEnd = end || localDate();
    const groups = new Map();
    for (const entry of createLedgerEntries(rangeStart, rangeEnd)) {
      const source = journalSourceFor(entry) || {};
      const row = groups.get(entry.id) || { number: entry.journalNumber || entry.entryNumber || source.journalNumber || source.entryNumber || "—", document: entry.documentNumber || "", description: entry.description || "", date: entry.date || "", currency: entry.currency || source.currency || "EUR", debit: 0, credit: 0, enteredAt: journalEnteredAt(entry.enteredAt || entry.createdAt || source.enteredAt || source.createdAt || source.created_at), enteredBy: entry.enteredBy || entry.createdByEmail || entry.authorEmail || source.enteredBy || source.createdBy || source.createdByEmail || source.author || "—" };
      row.debit += Number(entry.debit) || 0;
      row.credit += Number(entry.credit) || 0;
      groups.set(entry.id, row);
    }
    journalRows = [...groups.values()].map(row => ({ ...row, amount: row.debit || row.credit })).sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.number).localeCompare(String(b.number), undefined, { numeric: true }) || String(a.document).localeCompare(String(b.document), undefined, { numeric: true }));
    renderJournalRows();
    return true;
  };
  const journalForm = get("ledgerJournalEntryForm");
  const journalAccountOptions = () => `<option value="">—</option>${getLedgerAccounts().map(account => `<option value="${escapeHtml(account.code)}">${escapeHtml(account.code)} · ${escapeHtml(account.label)}</option>`).join("")}`;
  [get("ledgerJournalDebitAccount"), get("ledgerJournalCreditAccount")].forEach(select => { select.innerHTML = journalAccountOptions(); });
  get("ledgerJournalAdd").addEventListener("click", () => {
    if (!can("reports")) { denyAction("reports"); return; }
    journalForm.reset();
    get("ledgerJournalEntryDate").value = localDate();
    get("ledgerJournalEntryError").hidden = true;
    journalEntryDialog.showModal();
  });
  const closeJournalEntry = () => journalEntryDialog.close();
  get("ledgerJournalEntryClose").addEventListener("click", closeJournalEntry);
  get("ledgerJournalEntryCancel").addEventListener("click", closeJournalEntry);
  journalEntryDialog.addEventListener("click", event => { if (event.target === journalEntryDialog) closeJournalEntry(); });
  journalForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!can("reports")) { denyAction("reports"); return; }
    if (!journalForm.reportValidity()) return;
    const debitAccount = get("ledgerJournalDebitAccount").value, creditAccount = get("ledgerJournalCreditAccount").value;
    if (debitAccount === creditAccount) { get("ledgerJournalEntryError").textContent = copy("journalEntrySameAccounts"); get("ledgerJournalEntryError").hidden = false; return; }
    const amount = Math.round(Number(get("ledgerJournalEntryAmount").value) * 100) / 100;
    if (!Number.isFinite(amount) || amount <= 0) return;
    const entry = {
      id: crypto.randomUUID(), number: Math.max(0, ...manualJournalEntries.map(item => Number(item.number) || 0)) + 1,
      date: get("ledgerJournalEntryDate").value, documentNumber: get("ledgerJournalEntryDocument").value.trim(),
      description: get("ledgerJournalEntryDescription").value.trim(), amount, currency: "EUR",
      debitAccount, creditAccount, enteredAt: new Date().toISOString(), enteredBy: currentInvoiceActorEmail() || "—"
    };
    const next = [...manualJournalEntries, entry];
    try { saveList(STORAGE.manualJournalEntries, next); }
    catch { get("ledgerJournalEntryError").textContent = translateCopy("Не удалось сохранить проводку.", "cloudSyncError"); get("ledgerJournalEntryError").hidden = false; return; }
    manualJournalEntries = next;
    get("ledgerJournalSearch").value = "";
    get("ledgerJournalAuthor").value = "";
    get("ledgerJournalStart").value = "";
    get("ledgerJournalEnd").value = "";
    closeJournalEntry();
    loadJournalRows();
    showMessage(copy("journalEntrySaved"));
  });
  get("ledgerJournalMore").addEventListener("click", () => {
    const moreMenu = get("ledgerJournalMoreMenu");
    moreMenu.hidden = !moreMenu.hidden;
    get("ledgerJournalMore").setAttribute("aria-expanded", String(!moreMenu.hidden));
    get("ledgerJournalHelpPanel").hidden = true;
    get("ledgerJournalHelp").setAttribute("aria-expanded", "false");
  });
  get("ledgerJournalHelp").addEventListener("click", () => {
    const help = get("ledgerJournalHelpPanel");
    help.hidden = !help.hidden;
    get("ledgerJournalHelp").setAttribute("aria-expanded", String(!help.hidden));
    get("ledgerJournalMoreMenu").hidden = true;
    get("ledgerJournalMore").setAttribute("aria-expanded", "false");
  });
  journalActions.addEventListener("click", event => {
    const action = event.target.closest("[data-journal-action]")?.dataset.journalAction;
    if (action === "refresh") loadJournalRows();
    if (action === "ledger") menu.querySelector('[data-ledger-mode="ledger"]')?.click();
    if (action) { get("ledgerJournalMoreMenu").hidden = true; get("ledgerJournalMore").setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("click", event => {
    if (!journalActions.contains(event.target)) {
      get("ledgerJournalMoreMenu").hidden = true;
      get("ledgerJournalMore").setAttribute("aria-expanded", "false");
      get("ledgerJournalHelpPanel").hidden = true;
      get("ledgerJournalHelp").setAttribute("aria-expanded", "false");
    }
  });
  get("ledgerJournalFilter").addEventListener("click", loadJournalRows);
  get("ledgerJournalClear").addEventListener("click", () => {
    get("ledgerJournalSearch").value = "";
    get("ledgerJournalAuthor").value = "";
    get("ledgerJournalCurrency").value = "";
    get("ledgerJournalStart").value = "";
    get("ledgerJournalEnd").value = "";
    loadJournalRows();
  });
  [get("ledgerJournalSearch"), get("ledgerJournalAuthor"), get("ledgerJournalStart"), get("ledgerJournalEnd")].forEach(control => control.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); loadJournalRows(); } }));
  journalRegister.querySelectorAll("[data-journal-sort]").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.journalSort;
    journalSort.direction = journalSort.key === key ? -journalSort.direction : 1;
    journalSort.key = key;
    journalRegister.querySelectorAll("[data-journal-sort]").forEach(item => item.setAttribute("aria-sort", item === button ? journalSort.direction === 1 ? "ascending" : "descending" : "none"));
    renderJournalRows();
  }));
  get("ledgerJournalCsv").addEventListener("click", () => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    const headers = [...get("ledgerJournalTable").querySelectorAll("thead th")].map(cell => cell.innerText.trim());
    const rows = [...get("ledgerJournalRows").querySelectorAll("tr")].filter(row => !row.querySelector(".empty-row")).map(row => [...row.cells].map(cell => cell.innerText.trim()));
    if (!rows.length) { showMessage(copy("reportExportEmpty"), true); return; }
    const cell = value => { let text = String(value ?? ""); if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; };
    const csv = [headers, ...rows].map(row => row.map(cell).join(";")).join("\r\n");
    triggerBlobDownload(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `pearamaatu-kanded-${get("ledgerJournalStart").value}-${get("ledgerJournalEnd").value}.csv`);
  });
  get("ledgerJournalStart").value = get("ledgerStartDate").value;
  get("ledgerJournalEnd").value = get("ledgerEndDate").value;
  loadJournalRows();

  const turnoverView = document.createElement("section");
  turnoverView.id = "ledgerTurnoverView";
  turnoverView.className = "app-view payments-subview ledger-subview";
  turnoverView.hidden = true;
  turnoverView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="ledgerTurnoverMenu">${copy("ledgerTurnoverMenu")}</h1></div><button type="button" class="primary-button" id="ledgerTurnoverGenerate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path><circle cx="12" cy="12" r="9"></circle></svg><span data-i18n="ledgerGenerate">${copy("ledgerGenerate")}</span></button></div><section class="data-panel ledger-turnover-panel"><p class="ledger-turnover-notice"><span aria-hidden="true">i</span><span data-i18n="ledgerTurnoverNotice">${copy("ledgerTurnoverNotice")}</span></p><div class="ledger-turnover-grid"><section class="ledger-turnover-card ledger-turnover-report-card"><h2 data-i18n="ledgerReportBlock">${copy("ledgerReportBlock")}</h2><div class="ledger-turnover-period"><div class="field"><label data-i18n="ledgerPeriodLabel">${copy("ledgerPeriodLabel")}</label><div class="ledger-turnover-date-range"><div class="field"><label for="ledgerTurnoverStart" data-i18n="ledgerStartDateLabel">${copy("ledgerStartDateLabel")}</label><input id="ledgerTurnoverStart" type="date"></div><span aria-hidden="true">–</span><div class="field"><label for="ledgerTurnoverEnd" data-i18n="ledgerEndDateLabel">${copy("ledgerEndDateLabel")}</label><input id="ledgerTurnoverEnd" type="date"></div></div></div><div class="field"><label for="ledgerTurnoverCurrency" data-i18n="ledgerCurrencyLabel">${copy("ledgerCurrencyLabel")}</label><select id="ledgerTurnoverCurrency"><option value="EUR" data-i18n="ledgerEur">${copy("ledgerEur")}</option></select></div><div class="field"><label for="ledgerTurnoverGrouping" data-i18n="ledgerGroupDays">${copy("ledgerGroupDays")}</label><select id="ledgerTurnoverGrouping"><option value="none" data-i18n="ledgerNoGrouping">${copy("ledgerNoGrouping")}</option><option value="day" data-i18n="ledgerByDay">${copy("ledgerByDay")}</option><option value="week" data-i18n="ledgerByWeek">${copy("ledgerByWeek")}</option><option value="month" data-i18n="ledgerByMonth">${copy("ledgerByMonth")}</option></select></div></section><section class="ledger-turnover-card"><div class="ledger-turnover-card-heading"><h2 data-i18n="ledgerAccountsBlock">${copy("ledgerAccountsBlock")}</h2><div class="ledger-picker-actions"><button type="button" class="ledger-picker-action" data-picker="accounts" data-action="add-all" title="${copy("ledgerAddAll")}" aria-label="${copy("ledgerAddAll")}">≫</button><button type="button" class="ledger-picker-action" data-picker="accounts" data-action="remove-all" title="${copy("ledgerRemoveAll")}" aria-label="${copy("ledgerRemoveAll")}">≪</button></div></div><div class="ledger-dual-picker"><div class="ledger-dual-column"><label for="ledgerTurnoverAccountsAvailableSearch" data-i18n="ledgerAvailableList">${copy("ledgerAvailableList")}</label><input id="ledgerTurnoverAccountsAvailableSearch" type="search" data-i18n-placeholder="ledgerSearchPlaceholder" placeholder="${copy("ledgerSearchPlaceholder")}"><div id="ledgerTurnoverAccountsAvailable" class="ledger-dual-list" role="listbox" aria-label="${copy("ledgerAvailableList")}"></div></div><div class="ledger-dual-column"><label for="ledgerTurnoverAccountsSelectedSearch" data-i18n="ledgerSelectedList">${copy("ledgerSelectedList")}</label><input id="ledgerTurnoverAccountsSelectedSearch" type="search" data-i18n-placeholder="ledgerSearchPlaceholder" placeholder="${copy("ledgerSearchPlaceholder")}"><div id="ledgerTurnoverAccountsSelected" class="ledger-dual-list" role="listbox" aria-label="${copy("ledgerSelectedList")}"></div></div></div></section><section class="ledger-turnover-card"><div class="ledger-turnover-card-heading"><h2 data-i18n="ledgerObjectsBlock">${copy("ledgerObjectsBlock")}</h2><div class="ledger-picker-actions"><button type="button" class="ledger-picker-action" data-picker="objects" data-action="add-all" title="${copy("ledgerAddAll")}" aria-label="${copy("ledgerAddAll")}">≫</button><button type="button" class="ledger-picker-action" data-picker="objects" data-action="remove-all" title="${copy("ledgerRemoveAll")}" aria-label="${copy("ledgerRemoveAll")}">≪</button></div></div><div class="ledger-dual-picker"><div class="ledger-dual-column"><label for="ledgerTurnoverObjectsAvailableSearch" data-i18n="ledgerAvailableList">${copy("ledgerAvailableList")}</label><input id="ledgerTurnoverObjectsAvailableSearch" type="search" data-i18n-placeholder="ledgerSearchPlaceholder" placeholder="${copy("ledgerSearchPlaceholder")}"><div id="ledgerTurnoverObjectsAvailable" class="ledger-dual-list" role="listbox" aria-label="${copy("ledgerAvailableList")}"></div></div><div class="ledger-dual-column"><label for="ledgerTurnoverObjectsSelectedSearch" data-i18n="ledgerSelectedList">${copy("ledgerSelectedList")}</label><input id="ledgerTurnoverObjectsSelectedSearch" type="search" data-i18n-placeholder="ledgerSearchPlaceholder" placeholder="${copy("ledgerSearchPlaceholder")}"><div id="ledgerTurnoverObjectsSelected" class="ledger-dual-list" role="listbox" aria-label="${copy("ledgerSelectedList")}"></div></div></div></section></div><section id="ledgerTurnoverResults" class="ledger-turnover-results" hidden><div class="ledger-turnover-results-head"><h2 data-i18n="ledgerTurnoverMenu">${copy("ledgerTurnoverMenu")}</h2><button type="button" class="secondary-button" id="ledgerTurnoverExport" data-i18n="ledgerExport">${copy("ledgerExport")}</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th data-i18n="ledgerAccountColumn">${copy("ledgerAccountColumn")}</th><th data-i18n="ledgerDebitColumn">${copy("ledgerDebitColumn")}</th><th data-i18n="ledgerCreditColumn">${copy("ledgerCreditColumn")}</th><th data-i18n="ledgerBalanceColumn">${copy("ledgerBalanceColumn")}</th></tr></thead><tbody id="ledgerTurnoverRows"></tbody><tfoot id="ledgerTurnoverTotals"></tfoot></table></div><p class="ledger-disclaimer" data-i18n="ledgerDisclaimer">${copy("ledgerDisclaimer")}</p></section></section>`;
  document.querySelector("main").insertBefore(turnoverView, document.getElementById("reportsView"));
  Object.assign(ruTexts, { ledgerTurnoverBack: "К фильтрам", ledgerTurnoverPeriod: "Период отчета", ledgerTurnoverAccounts: "Счета", ledgerTurnoverCurrency: "Валюта", ledgerTurnoverGenerated: "Сформировано", ledgerTurnoverOpening: "Начальное сальдо", ledgerTurnoverFiscalOpening: "Начальное сальдо с начала года", ledgerTurnoverActivity: "Обороты", ledgerTurnoverFiscalClosing: "Конечное сальдо с начала года", ledgerTurnoverClosing: "Конечное сальдо", ledgerTurnoverUnknownOpening: "Начальные остатки не загружены. Сальдо рассчитано только по доступным операциям.", ledgerTurnoverKnownOpening: "Начальные остатки взяты из временного тестового набора и не сохранены в данных компании.", ledgerTurnoverDebit: "Дебет", ledgerTurnoverCredit: "Кредит", ledgerTurnoverAccount: "Счет", ledgerTurnoverHideFilters: "Скрыть фильтры" });
  Object.assign(etTexts, { ledgerTurnoverBack: "Kuva filtrid", ledgerTurnoverPeriod: "Periood", ledgerTurnoverAccounts: "Kontod", ledgerTurnoverCurrency: "Valuuta", ledgerTurnoverGenerated: "Koostatud", ledgerTurnoverOpening: "Algsaldo", ledgerTurnoverFiscalOpening: "Algsaldo majandusaasta algusest", ledgerTurnoverActivity: "Käive", ledgerTurnoverFiscalClosing: "Lõppsaldo majandusaasta algusest", ledgerTurnoverClosing: "Lõppsaldo", ledgerTurnoverUnknownOpening: "Algsaldosid pole sisestatud. Saldo arvutatakse ainult olemasolevate kannete põhjal.", ledgerTurnoverKnownOpening: "Algsaldod pärinevad ajutisest näidisandmestikust ega ole ettevõtte andmetesse salvestatud.", ledgerTurnoverDebit: "Deebet", ledgerTurnoverCredit: "Kreedit", ledgerTurnoverAccount: "Konto", ledgerTurnoverHideFilters: "Peida filtrid" });
  const turnoverSetupGrid = turnoverView.querySelector(".ledger-turnover-grid");
  const turnoverNotice = turnoverView.querySelector(".ledger-turnover-notice");
  turnoverSetupGrid.id = "ledgerTurnoverGrid";
  turnoverNotice.id = "ledgerTurnoverNotice";
  const turnoverResults = get("ledgerTurnoverResults");
  const turnoverResultsHead = turnoverResults.querySelector(".ledger-turnover-results-head");
  const turnoverReportPeriod = document.createElement("p");
  turnoverReportPeriod.id = "ledgerTurnoverReportPeriod";
  turnoverResultsHead.querySelector("h2").after(turnoverReportPeriod);
  const turnoverMeta = document.createElement("dl");
  turnoverMeta.className = "ledger-turnover-meta";
  turnoverMeta.innerHTML = `<div><dt>${escapeHtml(copy("ledgerStartDateLabel"))}</dt><dd id="ledgerTurnoverMetaStart"></dd></div><div><dt>${escapeHtml(copy("ledgerEndDateLabel"))}</dt><dd id="ledgerTurnoverMetaEnd"></dd></div><div><dt>${escapeHtml(copy("ledgerTurnoverAccounts"))}</dt><dd id="ledgerTurnoverMetaAccounts"></dd></div><div><dt>${escapeHtml(copy("ledgerTurnoverCurrency"))}</dt><dd>EUR</dd></div><div><dt>${escapeHtml(copy("ledgerTurnoverGenerated"))}</dt><dd id="ledgerTurnoverMetaGenerated"></dd></div>`;
  turnoverResults.insertBefore(turnoverMeta, turnoverResultsHead);
  const turnoverTitleGroup = document.createElement("div");
  turnoverTitleGroup.className = "ledger-turnover-title-group";
  turnoverTitleGroup.append(turnoverResultsHead.querySelector("h2"), turnoverReportPeriod);
  turnoverResultsHead.prepend(turnoverTitleGroup);
  const turnoverResultActions = document.createElement("div");
  turnoverResultActions.className = "ledger-turnover-result-actions";
  turnoverResultActions.append(get("ledgerTurnoverExport"));
  turnoverResultsHead.append(turnoverResultActions);
  const turnoverTable = get("ledgerTurnoverRows").closest("table");
  const turnoverHeaderKeys = ["ledgerTurnoverAccount", "ledgerTurnoverOpening", "ledgerTurnoverFiscalOpening", "ledgerTurnoverActivity", "ledgerTurnoverFiscalClosing", "ledgerTurnoverClosing"];
  const turnoverFlatHeaders = () => [copy("ledgerTurnoverAccount"), ...turnoverHeaderKeys.slice(1).flatMap(key => [`${copy(key)} · ${copy("ledgerTurnoverDebit")}`, `${copy(key)} · ${copy("ledgerTurnoverCredit")}`])];
  turnoverTable.querySelector("thead").innerHTML = `<tr><th rowspan="2">${escapeHtml(copy("ledgerTurnoverAccount"))}</th>${turnoverHeaderKeys.slice(1).map(key => `<th colspan="2">${escapeHtml(copy(key))}</th>`).join("")}</tr><tr>${turnoverHeaderKeys.slice(1).flatMap(() => [`<th>${escapeHtml(copy("ledgerTurnoverDebit"))}</th>`, `<th>${escapeHtml(copy("ledgerTurnoverCredit"))}</th>`]).join("")}</tr>`;
  turnoverTable.dataset.exportHeaders = JSON.stringify(turnoverFlatHeaders());
  const reportTimestamp = () => new Intl.DateTimeFormat(language === "et" ? "et-EE" : "ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date());
  const formatBalanceSide = (balance, side) => balance === null ? "—" : money(side === "debit" ? Math.max(balance, 0) : Math.max(-balance, 0));
  Object.assign(ruTexts, { ledgerPrintRelated: "Показывать связанные счета при печати", ledgerOnlyTransactions: "Показывать только счета с операциями" });
  Object.assign(etTexts, { ledgerPrintRelated: "Kuva väljarükil seotud kontod", ledgerOnlyTransactions: "Kuva ainult tehingutega kontod" });
  const ledgerOptionsKey = () => `${STORAGE.fixedAssets}:ledger-options`;
  const readLedgerOptions = () => {
    try { const value = JSON.parse(localStorage.getItem(ledgerOptionsKey()) || "null"); return { printRelated: Boolean(value?.printRelated), onlyTransactions: value?.onlyTransactions !== false }; }
    catch { return { printRelated: false, onlyTransactions: true }; }
  };
  let ledgerOptions = readLedgerOptions();
  window.getLedgerPrintOptions = () => ({ ...ledgerOptions });
  window.getLedgerPrintEntries = () => {
    const start = get("ledgerStartDate")?.value || "";
    const end = get("ledgerEndDate")?.value || "";
    if (!ledgerOptions.printRelated || !start || !end) return [...lastLedgerEntries];
    const visibleIds = new Set(lastLedgerEntries.map(entry => entry.id));
    return createLedgerEntries(start, end).filter(entry => visibleIds.has(entry.id));
  };
  const advancedSettings = panel.querySelector("details.balance-advanced");
  const zeroAccountsCheckbox = get("ledgerShowZeroAccounts");
  const legacyOptionLabel = zeroAccountsCheckbox.closest("label");
  const legacyOptionHolder = document.createElement("div");
  legacyOptionHolder.hidden = true;
  legacyOptionHolder.append(legacyOptionLabel);
  panel.append(legacyOptionHolder);
  const onlyTransactionsCheckbox = document.createElement("input");
  onlyTransactionsCheckbox.id = "ledgerOnlyTransactionAccounts";
  onlyTransactionsCheckbox.className = "ledger-setting-checkbox";
  onlyTransactionsCheckbox.type = "checkbox";
  const onlyTransactionsLabel = document.createElement("label");
  onlyTransactionsLabel.className = "balance-toggle";
  onlyTransactionsLabel.dataset.ledgerOption = "onlyTransactions";
  const onlyTransactionsText = document.createElement("span");
  onlyTransactionsText.dataset.i18n = "ledgerOnlyTransactions";
  onlyTransactionsText.textContent = copy("ledgerOnlyTransactions");
  onlyTransactionsLabel.append(onlyTransactionsText, onlyTransactionsCheckbox);
  const printRelatedCheckbox = document.createElement("input");
  printRelatedCheckbox.id = "ledgerPrintRelatedAccounts";
  printRelatedCheckbox.className = "ledger-setting-checkbox";
  printRelatedCheckbox.type = "checkbox";
  const printRelatedLabel = document.createElement("label");
  printRelatedLabel.className = "balance-toggle";
  printRelatedLabel.dataset.ledgerOption = "printRelated";
  const printRelatedText = document.createElement("span");
  printRelatedText.dataset.i18n = "ledgerPrintRelated";
  printRelatedText.textContent = copy("ledgerPrintRelated");
  printRelatedLabel.append(printRelatedText, printRelatedCheckbox);
  advancedSettings.replaceChildren(advancedSettings.querySelector("summary"), printRelatedLabel, onlyTransactionsLabel);
  const persistLedgerOptions = () => {
    ledgerOptions = { printRelated: printRelatedCheckbox.checked, onlyTransactions: onlyTransactionsCheckbox.checked };
    zeroAccountsCheckbox.checked = !ledgerOptions.onlyTransactions;
    try { localStorage.setItem(ledgerOptionsKey(), JSON.stringify(ledgerOptions)); }
    catch { showMessage(translateCopy("Не удалось сохранить настройки.", "cloudSyncError"), true); }
    if (!get("ledgerResults").hidden) generateGeneralLedger();
  };
  printRelatedCheckbox.checked = ledgerOptions.printRelated;
  onlyTransactionsCheckbox.checked = ledgerOptions.onlyTransactions;
  zeroAccountsCheckbox.checked = !ledgerOptions.onlyTransactions;
  printRelatedCheckbox.addEventListener("change", persistLedgerOptions);
  onlyTransactionsCheckbox.addEventListener("change", persistLedgerOptions);
  const openLedgerSettings = () => { advancedSettings.open = true; advancedSettings.scrollIntoView({ block: "nearest", behavior: "smooth" }); };
  const today = localDate();
  get("ledgerTurnoverStart").value = `${today.slice(0, 4)}-01-01`;
  get("ledgerTurnoverEnd").value = today;
  const turnoverSelection = { accounts: new Set(), objects: new Set() };
  const turnoverPickerConfig = {
    accounts: { available: "ledgerTurnoverAccountsAvailable", selected: "ledgerTurnoverAccountsSelected", availableSearch: "ledgerTurnoverAccountsAvailableSearch", selectedSearch: "ledgerTurnoverAccountsSelectedSearch" },
    objects: { available: "ledgerTurnoverObjectsAvailable", selected: "ledgerTurnoverObjectsSelected", availableSearch: "ledgerTurnoverObjectsAvailableSearch", selectedSearch: "ledgerTurnoverObjectsSelectedSearch" }
  };
  const getTurnoverPickerItems = kind => kind === "accounts" ? getLedgerAccounts().map(account => ({ value: account.code, label: `${account.code} · ${account.label}` })) : getLedgerObjects().map(object => ({ value: object, label: object }));
  const formatTurnoverPeriod = period => get("ledgerTurnoverGrouping").value === "month" ? new Intl.DateTimeFormat(language === "et" ? "et-EE" : "ru-RU", { month: "long", year: "numeric" }).format(new Date(`${period}-01T12:00:00`)) : formatDate(period);
  const renderTurnoverPicker = kind => {
    const config = turnoverPickerConfig[kind], selected = turnoverSelection[kind], items = getTurnoverPickerItems(kind);
    for (const side of ["available", "selected"]) {
      const isSelected = side === "selected", search = get(config[`${side}Search`]).value.trim().toLocaleLowerCase(language === "et" ? "et-EE" : "ru-RU");
      const values = items.filter(item => isSelected === selected.has(item.value) && item.label.toLocaleLowerCase(language === "et" ? "et-EE" : "ru-RU").includes(search));
      get(config[side]).innerHTML = values.map(item => `<button type="button" class="ledger-dual-option" aria-label="${escapeHtml(item.label)} · ${escapeHtml(copy(isSelected ? "ledgerRemoveItem" : "ledgerAddItem"))}" data-picker="${kind}" data-value="${escapeHtml(item.value)}" data-action="${isSelected ? "remove" : "add"}"><span>${escapeHtml(item.label)}</span><span aria-hidden="true">${isSelected ? "−" : "+"}</span></button>`).join("") || `<p class="ledger-dual-empty">${escapeHtml(copy("ledgerNoSelection"))}</p>`;
    }
  };
  const renderTurnoverPickers = () => { renderTurnoverPicker("accounts"); renderTurnoverPicker("objects"); };
  renderTurnoverPickers();
  turnoverView.addEventListener("input", event => {
    if (Object.values(turnoverPickerConfig).some(config => [config.availableSearch, config.selectedSearch].includes(event.target.id))) renderTurnoverPickers();
  });
  turnoverView.addEventListener("click", event => {
    const target = event.target.closest("[data-picker][data-action]");
    if (!target) return;
    const { picker, action, value } = target.dataset, selected = turnoverSelection[picker];
    if (action === "add") selected.add(value);
    else if (action === "remove") selected.delete(value);
    else if (action === "add-all") getTurnoverPickerItems(picker).forEach(item => selected.add(item.value));
    else if (action === "remove-all") selected.clear();
    renderTurnoverPicker(picker);
  });
  let turnoverRows = [];
  const valueCells = row => [
    formatBalanceSide(row.openingBalance, "debit"), formatBalanceSide(row.openingBalance, "credit"),
    formatBalanceSide(row.fiscalOpeningBalance, "debit"), formatBalanceSide(row.fiscalOpeningBalance, "credit"),
    money(row.debit), money(row.credit),
    formatBalanceSide(row.fiscalClosingBalance, "debit"), formatBalanceSide(row.fiscalClosingBalance, "credit"),
    formatBalanceSide(row.closingBalance, "debit"), formatBalanceSide(row.closingBalance, "credit")
  ];
  let ledgerMode = "ledger";
  const calculateTurnover = () => {
    const start = get("ledgerTurnoverStart").value;
    const end = get("ledgerTurnoverEnd").value;
    if (!start || !end || start > end) { showMessage(copy("ledgerInvalidDates"), true); return false; }
    const grouping = get("ledgerTurnoverGrouping").value;
    const accounts = getLedgerAccounts().filter(account => !turnoverSelection.accounts.size || turnoverSelection.accounts.has(account.code)).sort((first, second) => first.code.localeCompare(second.code, language, { numeric: true }));
    const fiscalStart = `${start.slice(0, 4)}-01-01`;
    const priorDay = value => { const date = new Date(`${value}T12:00:00`); date.setDate(date.getDate() - 1); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
    const selectedEntry = entry => !turnoverSelection.objects.size || turnoverSelection.objects.has(entry.object);
    const fiscalEntries = start > fiscalStart ? createLedgerEntries(fiscalStart, end).filter(selectedEntry) : createLedgerEntries(start, end).filter(selectedEntry);
    const priorBalances = new Map();
    for (const entry of fiscalEntries) if (entry.date < start) priorBalances.set(entry.accountCode, (priorBalances.get(entry.accountCode) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0));
    const groupingKey = dateValue => {
      if (grouping === "day") return dateValue;
      if (grouping === "month") return dateValue.slice(0, 7);
      if (grouping === "week") { const date = new Date(`${dateValue}T12:00:00`); date.setDate(date.getDate() - (date.getDay() + 6) % 7); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
      return "";
    };
    const buckets = new Map();
    for (const entry of fiscalEntries) {
      if (entry.date < start || entry.date > end || (turnoverSelection.accounts.size && !turnoverSelection.accounts.has(entry.accountCode))) continue;
      const period = groupingKey(entry.date), key = `${entry.accountCode}:${period}`;
      if (!buckets.has(key)) buckets.set(key, { code: entry.accountCode, label: entry.account, period, debit: 0, credit: 0 });
      const bucket = buckets.get(key);
      bucket.debit += Number(entry.debit) || 0;
      bucket.credit += Number(entry.credit) || 0;
    }
    turnoverRows = [];
    for (const account of accounts) {
      const accountBuckets = [...buckets.values()].filter(bucket => bucket.code === account.code).sort((first, second) => first.period.localeCompare(second.period));
      if (!accountBuckets.length) accountBuckets.push({ code: account.code, label: account.label, period: "", debit: 0, credit: 0 });
      const fiscalOpeningBalance = Number.isFinite(Number(account.openingBalance)) && account.openingBalance !== undefined ? Number(account.openingBalance) : null;
      let runningBalance = fiscalOpeningBalance === null ? null : fiscalOpeningBalance + (priorBalances.get(account.code) || 0);
      for (const bucket of accountBuckets) {
        const openingBalance = runningBalance;
        if (runningBalance !== null) runningBalance += bucket.debit - bucket.credit;
        turnoverRows.push({ ...bucket, openingBalance, fiscalOpeningBalance, fiscalClosingBalance: runningBalance, closingBalance: runningBalance });
      }
    }
    get("ledgerTurnoverRows").innerHTML = turnoverRows.map(account => `<tr><td><span>${escapeHtml(account.code)} · ${escapeHtml(account.label || "")}</span>${account.period ? `<small>${escapeHtml(formatTurnoverPeriod(account.period))}</small>` : ""}</td>${valueCells(account).map(value => `<td>${value}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="11" class="empty-row">${escapeHtml(copy("ledgerEmpty"))}</td></tr>`;
    const totalDebit = turnoverRows.reduce((sum, account) => sum + account.debit, 0), totalCredit = turnoverRows.reduce((sum, account) => sum + account.credit, 0);
    const balanceTotal = key => grouping !== "none" || turnoverRows.some(account => account[key] === null) ? null : turnoverRows.reduce((sum, account) => sum + account[key], 0);
    const totalRow = { openingBalance: balanceTotal("openingBalance"), fiscalOpeningBalance: balanceTotal("fiscalOpeningBalance"), debit: totalDebit, credit: totalCredit, fiscalClosingBalance: balanceTotal("fiscalClosingBalance"), closingBalance: balanceTotal("closingBalance") };
    get("ledgerTurnoverTotals").innerHTML = `<tr><th>${escapeHtml(copy("pageSumTotal"))}</th>${valueCells(totalRow).map(value => `<td>${value}</td>`).join("")}</tr>`;
    const labels = turnoverFlatHeaders();
    turnoverTable.dataset.exportHeaders = JSON.stringify(labels);
    get("ledgerTurnoverMetaStart").textContent = formatDate(start);
    get("ledgerTurnoverMetaEnd").textContent = formatDate(end);
    get("ledgerTurnoverMetaAccounts").textContent = accounts.map(account => `${account.code} · ${account.label}`).join(", ");
    get("ledgerTurnoverMetaGenerated").textContent = reportTimestamp();
    turnoverReportPeriod.textContent = `${copy("ledgerTurnoverPeriod")}: ${formatDate(start)} – ${formatDate(end)} · EUR`;
    const hasOpeningBalances = turnoverRows.every(row => row.fiscalOpeningBalance !== null);
    get("ledgerTurnoverResults").querySelector(".ledger-disclaimer").textContent = copy(hasOpeningBalances ? "ledgerTurnoverKnownOpening" : "ledgerTurnoverUnknownOpening");
    turnoverSetupGrid.hidden = true;
    turnoverNotice.hidden = true;
    get("ledgerTurnoverResults").hidden = false;
    return true;
  };
  get("ledgerTurnoverGenerate").addEventListener("click", () => { if (can("reports")) calculateTurnover(); });
  get("ledgerTurnoverExport").addEventListener("click", () => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    if (!calculateTurnover()) return;
    const cell = value => {
      let text = String(value ?? "");
      if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
      return `"${text.replaceAll('"', '""')}"`;
    };
    const data = [turnoverFlatHeaders(), ...turnoverRows.map(account => [`${account.code} · ${account.label || ""}${account.period ? ` · ${formatTurnoverPeriod(account.period)}` : ""}`, ...valueCells(account)])];
    triggerBlobDownload(new Blob(["\ufeff", data.map(row => row.map(cell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" }), `kaibeandmik-${get("ledgerTurnoverStart").value}-${get("ledgerTurnoverEnd").value}.csv`);
  });

  const setOpen = open => { menu.hidden = !open; wrapper.classList.toggle("is-open", open); trigger.setAttribute("aria-expanded", String(open)); };
  const entries = [{ mode: "entries", key: "ledgerEntriesMenu" }, { mode: "ledger", key: "ledgerBookMenu" }, { mode: "turnover", key: "ledgerTurnoverMenu" }];
  for (const entry of entries) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "payments-nav-menu-item";
    item.setAttribute("role", "menuitem");
    item.dataset.ledgerMode = entry.mode;
    item.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${bookIcon}</svg><span data-i18n="${entry.key}">${copy(entry.key)}</span>`;
    item.addEventListener("click", () => {
      if (!can("reports")) { setOpen(false); denyAction("reports"); return; }
      ledgerMode = entry.mode;
      if (entry.mode === "turnover") { switchView("ledgerTurnoverView"); get("ledgerTurnoverResults").hidden = true; turnoverSetupGrid.hidden = false; turnoverNotice.hidden = false; renderTurnoverPickers(); }
      else {
        window.setLedgerAccountReportMode?.(entry.mode === "ledger");
        const title = ledgerView.querySelector("h1");
        title.dataset.i18n = entry.key;
        title.textContent = copy(entry.key);
        switchView("ledgerView");
        journalRegister.hidden = entry.mode !== "entries";
        journalExports.hidden = entry.mode !== "entries";
        journalActions.hidden = entry.mode !== "entries";
        demoToggle.hidden = entry.mode === "entries";
        panel.hidden = entry.mode === "entries";
        get("createLedgerButton").hidden = entry.mode === "entries";
        if (entry.mode === "entries") loadJournalRows();
        else {
          get("ledgerResults").hidden = false;
          const resultTitle = get("ledgerResults").querySelector('[data-i18n="ledgerResultsTitle"]');
          if (resultTitle) resultTitle.hidden = entry.mode === "ledger";
          generateGeneralLedger();
          if (entry.mode === "ledger") openLedgerSettings();
        }
      }
      const mobileToggle = get("mobileMenuToggle");
      if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    menu.append(item);
  }
  const baseCanOpenView = canOpenView;
  canOpenView = id => ["ledgerView", "ledgerTurnoverView"].includes(id) ? can("reports") : baseCanOpenView(id);
  const baseSwitchView = switchView;
  switchView = id => {
    baseSwitchView(id);
    const active = ["ledgerView", "ledgerTurnoverView"].includes(id) && !get(id).hidden;
    if (id === "ledgerView" && active) panel.hidden = false;
    trigger.setAttribute("aria-current", active ? "page" : "false");
    menu.querySelectorAll("[data-ledger-mode]").forEach(item => item.setAttribute("aria-current", active && item.dataset.ledgerMode === ledgerMode ? "page" : "false"));
    setOpen(false);
  };
  const syncAccess = () => {
    wrapper.hidden = !can("reports");
    trigger.hidden = wrapper.hidden;
    get("ledgerTurnoverExport").disabled = !can("exportReports");
    if (wrapper.hidden) setOpen(false);
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); syncAccess(); };
  syncAccess();
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  trigger.addEventListener("click", event => { event.preventDefault(); event.stopImmediatePropagation(); if (!hoverCapable) setOpen(menu.hidden); }, true);
  if (hoverCapable) {
    wrapper.addEventListener("mouseenter", () => setOpen(true));
    wrapper.addEventListener("mouseleave", () => { if (!wrapper.contains(document.activeElement)) setOpen(false); });
  }
  wrapper.addEventListener("focusin", () => setOpen(true));
  wrapper.addEventListener("focusout", event => { if (!wrapper.contains(event.relatedTarget)) setOpen(false); });
  trigger.addEventListener("keydown", event => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); menu.querySelector("button")?.focus(); } });
  document.addEventListener("click", event => { if (!wrapper.contains(event.target)) setOpen(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") setOpen(false); });
  applyLanguage(language);
})();