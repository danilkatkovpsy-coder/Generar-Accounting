(() => {
  const trigger = document.querySelector('.nav-button[data-view="purchasesView"]');
  const main = document.querySelector("main");
  if (!trigger || !main || trigger.dataset.paymentsMenuReady === "true") return;
  trigger.dataset.paymentsMenuReady = "true";

  Object.assign(ruTexts, {
    navPaymentMenu: "Платежи",
    paymentBankTitle: "Банковские платежи",
    paymentImportTitle: "Импорт банковских платежей",
    paymentExportTitle: "Экспорт платежных поручений",
    paymentCashTitle: "Кассовые платежи",
    paymentImportDescription: "Банковская XML-выписка ISO 20022 CAMT.053 / CAMT.054.",
    paymentExportDescription: "Сформируйте файл платежных поручений за выбранный период.",
    paymentCashDescription: "Платежи, проведенные наличными.",
    paymentImportChoose: "Выберите XML файл",
    paymentImportPreview: "Предварительный просмотр",
    paymentImportConfirm: "Импортировать платежи",
    paymentImportReady: "Готово к импорту",
    paymentImportEmpty: "Выберите XML файл для просмотра операций.",
    paymentImportInvalid: "Некорректный банковский XML: проверьте даты, суммы, валюту и направление операций.",
    paymentImportUnsupported: "Поддерживаются только XML-выписки CAMT.053 / CAMT.054.",
    paymentImportBatchError: "Пакетная операция содержит неоднозначные суммы. Импорт остановлен.",
    paymentImportTooLarge: "Максимальный размер XML файла — 20 МБ.",
    paymentImportReadError: "Не удалось прочитать XML файл.",
    paymentImportCurrencyError: "Сейчас импортируются только операции в EUR. Пересчет других валют не настроен.",
    paymentImportSkipped: "Пропущено операций", paymentImportDuplicate: "Уже импортировано",
    paymentImportIncoming: "Поступление", paymentImportOutgoing: "Выплата", paymentImportDirection: "Направление",
    paymentImportCounterparty: "Контрагент", paymentImportUnknownParty: "Банковская операция",
    paymentImportNoRows: "Новых проведенных операций для импорта нет.", paymentImportContextChanged: "Компания изменилась. Загрузите XML файл заново.",
    paymentImportSaved: "Платежи импортированы.",
    paymentImportError: "Не удалось сохранить импортированные платежи.",
    paymentExportFrom: "С даты",
    paymentExportTo: "По дату",
    paymentExportAction: "Скачать CSV",
    paymentExportEmpty: "За выбранный период платежей нет.",
    paymentExported: "Экспорт платежных поручений скачан.",
    cashPaymentDate: "Дата",
    cashPaymentRecipient: "Получатель",
    cashPaymentAmount: "Сумма, EUR",
    cashPaymentNote: "Описание",
    cashPaymentFormTitle: "Новый кассовый платеж",
    cashPaymentNew: "＋ Добавить",
    cashPaymentCancel: "Отмена",
    cashPaymentAccount: "Касса",
    cashPaymentReference: "Номер ордера",
    cashPaymentSearch: "Контрагент или описание",
    cashPaymentFrom: "С даты",
    cashPaymentTo: "По дату",
    cashPaymentAccountFilter: "Касса",
    cashPaymentAccountAll: "Все кассы",
    cashPaymentAuthor: "Кем внесено",
    cashPaymentClear: "Очистить фильтры",
    cashPaymentApply: "ФИЛЬТРОВАТЬ",
    cashPaymentNoFilterResults: "По заданным фильтрам платежей нет.",
    cashPaymentRows: "Строк на странице",
    cashPaymentTotal: "Всего",
    cashPaymentSave: "Сохранить платеж",
    cashPaymentSaved: "Кассовый платеж сохранен.",
    cashPaymentInvalid: "Укажите дату, получателя и сумму больше нуля.",
    cashPaymentNoRows: "Кассовых платежей пока нет.",
    paymentBack: "Назад к платежам",
    paymentDateColumn: "Дата",
    paymentRecipientColumn: "Получатель",
    paymentDescriptionColumn: "Описание",
    paymentAmountColumn: "Сумма",
    paymentImportBank: "Банковские платежи",
    paymentImportCash: "Кассовые платежи",
    paymentImportCount: "Строк для импорта",
    paymentExportCount: "Платежей",
    paymentImportNoFile: "Нет файла для импорта",
    paymentCashCategory: "Кассовый платеж"
  });
  Object.assign(etTexts, {
    navPaymentMenu: "Maksed",
    paymentBankTitle: "Pangamaksed",
    paymentImportTitle: "Pangamaksete import",
    paymentExportTitle: "Maksekorralduste eksport",
    paymentCashTitle: "Kassamaksed",
    paymentImportDescription: "ISO 20022 CAMT.053 / CAMT.054 pangaväljavõtte XML-fail.",
    paymentExportDescription: "Koostage maksekorralduste fail valitud perioodi kohta.",
    paymentCashDescription: "Sularahas tehtud maksed.",
    paymentImportChoose: "Vali XML-fail",
    paymentImportPreview: "Eelvaade",
    paymentImportConfirm: "Impordi maksed",
    paymentImportReady: "Valmis importimiseks",
    paymentImportEmpty: "Valige XML-fail tehingute eelvaateks.",
    paymentImportInvalid: "Panga XML ei ole korrektne: kontrollige kuupäevi, summasid, valuutat ja tehingute suunda.",
    paymentImportUnsupported: "Toetatud on ainult CAMT.053 / CAMT.054 XML-väljavõtted.",
    paymentImportBatchError: "Koondtehingu summad on ebaselged. Import peatati.",
    paymentImportTooLarge: "XML-faili suurus võib olla kuni 20 MB.",
    paymentImportReadError: "XML-faili ei saanud lugeda.",
    paymentImportCurrencyError: "Praegu saab importida ainult EUR-tehinguid. Teiste valuutade ümberarvestus pole seadistatud.",
    paymentImportSkipped: "Vahele jäetud tehinguid", paymentImportDuplicate: "Juba imporditud",
    paymentImportIncoming: "Laekumine", paymentImportOutgoing: "Väljamakse", paymentImportDirection: "Suund",
    paymentImportCounterparty: "Osapool", paymentImportUnknownParty: "Pangatehing",
    paymentImportNoRows: "Uusi broneeritud tehinguid importimiseks pole.", paymentImportContextChanged: "Ettevõte on muutunud. Laadige XML-fail uuesti.",
    paymentImportSaved: "Maksed imporditi.",
    paymentImportError: "Imporditud makseid ei saanud salvestada.",
    paymentExportFrom: "Alates",
    paymentExportTo: "Kuni",
    paymentExportAction: "Laadi CSV alla",
    paymentExportEmpty: "Valitud perioodil makseid pole.",
    paymentExported: "Maksekorralduste eksport laaditi alla.",
    cashPaymentDate: "Kuupäev",
    cashPaymentRecipient: "Saaja",
    cashPaymentAmount: "Summa, EUR",
    cashPaymentNote: "Kirjeldus",
    cashPaymentFormTitle: "Uus sularahamakse",
    cashPaymentNew: "＋ Lisa uus",
    cashPaymentCancel: "Tühista",
    cashPaymentAccount: "Kassa",
    cashPaymentReference: "Order nr",
    cashPaymentSearch: "Osapool või kirjeldus",
    cashPaymentFrom: "Alates",
    cashPaymentTo: "Kuni",
    cashPaymentAccountFilter: "Kassa",
    cashPaymentAccountAll: "Kõik kassad",
    cashPaymentAuthor: "Sisestaja",
    cashPaymentClear: "Tühjenda filtrid",
    cashPaymentApply: "FILTREERI",
    cashPaymentNoFilterResults: "Valitud filtritega makseid pole.",
    cashPaymentRows: "Ridu lehel",
    cashPaymentTotal: "Kokku",
    cashPaymentSave: "Salvesta makse",
    cashPaymentSaved: "Sularahamakse salvestati.",
    cashPaymentInvalid: "Sisestage kuupäev, saaja ja nullist suurem summa.",
    cashPaymentNoRows: "Sularahamakseid pole veel.",
    paymentBack: "Tagasi maksete juurde",
    paymentDateColumn: "Kuupäev",
    paymentRecipientColumn: "Saaja",
    paymentDescriptionColumn: "Kirjeldus",
    paymentAmountColumn: "Summa",
    paymentImportBank: "Pangamaksed",
    paymentImportCash: "Kassamaksed",
    paymentImportCount: "Imporditavad read",
    paymentExportCount: "Makseid",
    paymentImportNoFile: "Imporditavat faili pole",
    paymentCashCategory: "Sularahamakse"
  });

  const iconMarkup = {
    bank: '<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18M7 15h3"></path></svg>',
    import: '<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5"></path><path d="M5 14v5h14v-5"></path></svg>',
    export: '<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12m-5-5 5 5 5-5"></path><path d="M5 16v4h14v-4"></path></svg>',
    cash: '<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="M6 9h.01M18 15h.01"></path></svg>'
  };
  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap";
  trigger.before(wrapper);
  wrapper.append(trigger);
  const caret = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  caret.setAttribute("viewBox", "0 0 24 24");
  caret.setAttribute("aria-hidden", "true");
  caret.classList.add("payments-nav-chevron");
  caret.innerHTML = '<path d="m7 10 5 5 5-5"></path>';
  trigger.append(caret);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  const menu = document.createElement("div");
  menu.id = "paymentsNavMenu";
  menu.className = "payments-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(menu);

  const pages = {};
  const closeMenu = () => {
    menu.hidden = true;
    wrapper.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    menu.hidden = false;
    wrapper.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  trigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (hoverCapable) return;
    if (menu.hidden) openMenu(); else closeMenu();
  }, true);
  if (hoverCapable) {
    wrapper.addEventListener("mouseenter", openMenu);
    wrapper.addEventListener("mouseleave", () => {
      if (!wrapper.contains(document.activeElement)) closeMenu();
    });
  }
  trigger.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") { event.preventDefault(); openMenu(); }
  });
  wrapper.addEventListener("focusin", openMenu);
  wrapper.addEventListener("focusout", event => {
    if (!wrapper.contains(event.relatedTarget)) closeMenu();
  });

  const makeView = (id, titleKey, descriptionKey) => {
    const view = document.createElement("section");
    view.id = id;
    view.className = "app-view payments-subview";
    view.hidden = true;
    const heading = document.createElement("div");
    heading.className = "view-heading";
    const title = document.createElement("h1");
    title.dataset.i18n = titleKey;
    title.textContent = translateCopy(titleKey, titleKey);
    const description = document.createElement("p");
    description.dataset.i18n = descriptionKey;
    description.textContent = translateCopy(descriptionKey, descriptionKey);
    const headingCopy = document.createElement("div");
    headingCopy.append(title, description);
    const back = document.createElement("button");
    back.type = "button";
    back.className = "secondary-button";
    back.dataset.i18n = "paymentBack";
    back.textContent = translateCopy("Назад к платежам", "paymentBack");
    heading.append(headingCopy, back);
    view.append(heading);
    main.insertBefore(view, document.getElementById("reportsView"));
    back.addEventListener("click", () => switchView("purchasesView"));
    pages[id] = view;
    return view;
  };
  const showView = id => {
    if (!can("payments")) { denyAction("payments"); return; }
    closeMenu();
    document.querySelectorAll(".app-view").forEach(view => { view.hidden = view.id !== id; });
    document.querySelectorAll(".nav-button").forEach(button => button.setAttribute("aria-current", String(button === trigger)));
    pages[id].hidden = false;
    if (id === "paymentExportView") renderExportPreview();
    if (id === "cashPaymentsView") renderCashPayments();
    const mobileMenu = document.getElementById("mobileMenuToggle");
    if (mobileMenu?.getAttribute("aria-expanded") === "true") mobileMenu.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeMobileNavigation = () => {
    const toggle = document.getElementById("mobileMenuToggle");
    if (toggle?.getAttribute("aria-expanded") === "true") toggle.click();
  };
  const menuItems = [
    { key: "paymentBankTitle", icon: "bank", target: "purchasesView" },
    { key: "paymentImportTitle", icon: "import", target: "paymentImportView" },
    { key: "paymentExportTitle", icon: "export", target: "paymentExportView" },
    { key: "paymentCashTitle", icon: "cash", target: "cashPaymentsView" }
  ];
  for (const item of menuItems) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "payments-nav-menu-item";
    button.setAttribute("role", "menuitem");
    button.innerHTML = `${iconMarkup[item.icon]}<span data-i18n="${item.key}">${translateCopy(item.key, item.key)}</span>`;
    button.addEventListener("click", () => {
      if (item.target === "purchasesView") {
        closeMenu();
        switchView("purchasesView");
        closeMobileNavigation();
      } else showView(item.target);
    });
    menu.append(button);
  }

  const importView = makeView("paymentImportView", "paymentImportTitle", "paymentImportDescription");
  const importPanel = document.createElement("section");
  importPanel.className = "data-panel";
  importPanel.innerHTML = `<label class="payments-import-drop"><span data-i18n="paymentImportChoose">Vali XML-fail</span><input id="paymentImportFile" type="file" accept=".xml,application/xml,text/xml"></label><div class="payments-preview" id="paymentImportPreview"><p class="payments-empty" data-i18n="paymentImportEmpty">Valige XML-fail tehingute eelvaateks.</p></div><div class="payments-actions"><span id="paymentImportCount"></span><button class="primary-button" id="paymentImportConfirm" type="button" disabled data-i18n="paymentImportConfirm">Impordi maksed</button></div>`;
  importView.append(importPanel);

  const exportView = makeView("paymentExportView", "paymentExportTitle", "paymentExportDescription");
  const exportPanel = document.createElement("section");
  exportPanel.className = "data-panel";
  exportPanel.innerHTML = `<div class="form-grid"><div class="field"><label for="paymentExportFrom" data-i18n="paymentExportFrom">Alates</label><input id="paymentExportFrom" type="date"></div><div class="field"><label for="paymentExportTo" data-i18n="paymentExportTo">Kuni</label><input id="paymentExportTo" type="date"></div><div class="field"><span id="paymentExportCount"></span></div><button class="primary-button" id="paymentExportAction" type="button" data-i18n="paymentExportAction">Laadi CSV alla</button></div><div id="paymentExportPreview" class="table-wrap"></div>`;
  exportView.append(exportPanel);

  const cashView = makeView("cashPaymentsView", "paymentCashTitle", "paymentCashDescription");
  const cashHeading = cashView.querySelector(":scope > .view-heading");
  const cashHeadingContent = cashHeading.firstElementChild;
  const cashBackButton = cashHeading.querySelector(":scope > button");
  const cashHeadingActions = document.createElement("div");
  cashHeadingActions.className = "inline-actions cash-payment-heading-actions";
  const cashExports = document.createElement("div");
  cashExports.className = "cash-payment-export-links";
  cashExports.setAttribute("role", "group");
  cashExports.setAttribute("aria-label", "Export formats");
  cashExports.innerHTML = '<button type="button" data-cash-export="pdf">PDF</button><button type="button" data-cash-export="xls">XLS</button><button type="button" data-cash-export="csv">CSV</button>';
  cashHeadingContent.append(cashExports);
  const cashAddButton = document.createElement("button");
  cashAddButton.type = "button";
  cashAddButton.className = "primary-button cash-payment-add-button";
  cashAddButton.dataset.i18n = "cashPaymentNew";
  cashAddButton.textContent = translateCopy("＋ Lisa uus", "cashPaymentNew");
  cashHeadingActions.append(cashAddButton, cashBackButton);
  cashHeading.append(cashHeadingActions);
  const cashForm = document.createElement("form");
  cashForm.className = "data-panel cash-payment-form";
  cashForm.hidden = true;
  cashForm.innerHTML = `<div class="cash-payment-form-heading"><h2 data-i18n="cashPaymentFormTitle">Uus sularahamakse</h2><button class="text-button" id="cashPaymentCancel" type="button" data-i18n="cashPaymentCancel">Tühista</button></div><div class="cash-payment-form-fields"><div class="field"><label for="cashPaymentDate" data-i18n="cashPaymentDate">Kuupäev</label><input id="cashPaymentDate" type="date" required></div><div class="field"><label for="cashPaymentRecipient" data-i18n="cashPaymentRecipient">Saaja</label><input id="cashPaymentRecipient" required></div><div class="field"><label for="cashPaymentAccount" data-i18n="cashPaymentAccount">Kassa</label><select id="cashPaymentAccount"><option value="Kassa / Cash">Kassa / Cash</option></select></div><div class="field"><label for="cashPaymentAmount" data-i18n="cashPaymentAmount">Summa, EUR</label><input id="cashPaymentAmount" type="number" min="0.01" step="0.01" required></div><div class="field"><label for="cashPaymentReference" data-i18n="cashPaymentReference">Order nr</label><input id="cashPaymentReference"></div><div class="field cash-note-field"><label for="cashPaymentNote" data-i18n="cashPaymentNote">Kirjeldus</label><input id="cashPaymentNote"></div><button class="primary-button" type="submit" data-i18n="cashPaymentSave">Salvesta makse</button></div>`;
  const cashList = document.createElement("section");
  cashList.className = "data-panel cash-payment-register";
  cashList.innerHTML = `<div class="cash-payment-filterbar"><label class="field cash-payment-search-field"><span data-i18n="cashPaymentSearch">Osapool või kirjeldus</span><input id="cashPaymentSearch" type="search" placeholder="${translateCopy("Osapool või kirjeldus", "cashPaymentSearch")}"></label><label class="field"><span data-i18n="cashPaymentAccountFilter">Kassa</span><select id="cashPaymentAccountFilter"><option value="">Kassa / Cash</option></select></label><label class="field"><span data-i18n="cashPaymentFrom">Alates</span><input id="cashPaymentFrom" type="date"></label><label class="field"><span data-i18n="cashPaymentTo">Kuni</span><input id="cashPaymentTo" type="date"></label><label class="field"><span data-i18n="cashPaymentAuthor">Sisestaja</span><input id="cashPaymentAuthor" type="search" placeholder="${translateCopy("Sisestaja", "cashPaymentAuthor")}"></label><button class="text-button cash-payment-clear" id="cashPaymentClear" type="button" aria-label="${translateCopy("Tühjenda filtrid", "cashPaymentClear")}" title="${translateCopy("Tühjenda filtrid", "cashPaymentClear")}">×</button><button class="primary-button cash-payment-apply" id="cashPaymentApply" type="button" data-i18n="cashPaymentApply">FILTREERI</button></div><div class="table-wrap cash-payment-table-wrap" id="cashPaymentsTable"></div><div class="cash-payment-pagination"><nav class="register-page-numbers" id="cashPaymentPages" aria-label="Cash payment pages"></nav><span id="cashPaymentTotal"></span><label class="cash-payment-page-size"><span data-i18n="cashPaymentRows">Ridu lehel</span><select id="cashPaymentPageSize" aria-label="Rows per page"><option value="10">10</option><option value="25" selected>25</option><option value="50">50</option></select></label></div><section class="register-page-summary cash-payment-summary"><h3 data-i18n="pageSumsTitle">Lehekülje summad</h3><dl><div><dt data-i18n="pageSumRows">Ridu:</dt><dd id="cashPageRows">0</dd></div><div><dt data-i18n="pageSumTotal">Summa:</dt><dd id="cashPageAmount">0,00 EUR</dd></div></dl></section>`;
  cashView.append(cashList);
  const cashEditorView = makeView("cashPaymentEditorView", "cashPaymentFormTitle", "paymentCashDescription");
  const cashEditorHeading = cashEditorView.querySelector(":scope > .view-heading");
  cashEditorHeading.querySelector("p")?.remove();
  cashEditorHeading.querySelector(":scope > button").remove();
  const cashEditorActions = document.createElement("div");
  cashEditorActions.className = "inline-actions cash-payment-editor-actions";
  const cashCancelButton = cashForm.querySelector("#cashPaymentCancel");
  cashCancelButton.className = "secondary-button";
  const cashSaveButton = cashForm.querySelector('button[type="submit"]');
  cashForm.id = "cashPaymentForm";
  cashSaveButton.setAttribute("form", cashForm.id);
  const cashNewButton = cashAddButton.cloneNode(true);
  cashNewButton.className = "secondary-button";
  cashNewButton.addEventListener("click", () => cashAddButton.click());
  cashEditorActions.append(cashNewButton, cashSaveButton, cashCancelButton);
  cashEditorHeading.append(cashEditorActions);
  cashForm.querySelector(".cash-payment-form-heading").remove();
  cashForm.hidden = false;
  cashEditorView.append(cashForm);

  const parseDate = value => {
    const text = String(value || "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    const match = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : "";
  };
  const parseCsv = text => {
    const source = text.replace(/^\uFEFF/, "");
    const firstLine = source.split(/\r?\n/, 1)[0] || "";
    const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ",";
    const records = [];
    let record = [], value = "", quoted = false;
    for (let index = 0; index < source.length; index++) {
      const char = source[index];
      if (char === '"' && quoted && source[index + 1] === '"') { value += '"'; index++; }
      else if (char === '"') quoted = !quoted;
      else if (char === delimiter && !quoted) { record.push(value.trim()); value = ""; }
      else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && source[index + 1] === "\n") index++;
        record.push(value.trim());
        if (record.some(cell => cell !== "")) records.push(record);
        record = []; value = "";
      } else value += char;
    }
    record.push(value.trim());
    if (record.some(cell => cell !== "")) records.push(record);
    return records;
  };
  const parseAmount = value => {
    const normalized = String(value || "").replace(/\s/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".");
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : 0;
  };
  const normalizeHeader = value => String(value || "").toLocaleLowerCase("et").replace(/[._-]/g, " ").trim();
  const parseImport = text => {
    const records = parseCsv(text);
    if (records.length < 2) return [];
    const headers = records[0].map(normalizeHeader);
    const find = names => headers.findIndex(header => names.includes(header));
    const dateIndex = find(["date", "kuupaev", "kuupäev", "makse kuupäev", "дата"]);
    const recipientIndex = find(["recipient", "payee", "saaja", "saaja nimi", "получатель", "контрагент"]);
    const amountIndex = find(["amount", "summa", "summa eur", "summa eur", "сумма"]);
    const noteIndex = find(["description", "kirjeldus", "selgitus", "описание", "назначение"]);
    if (dateIndex < 0 || recipientIndex < 0 || amountIndex < 0) return null;
    return records.slice(1).map(row => ({
      date: parseDate(row[dateIndex]),
      supplier: String(row[recipientIndex] || "").trim(),
      amount: parseAmount(row[amountIndex]),
      note: noteIndex < 0 ? "" : String(row[noteIndex] || "").trim()
    })).filter(row => row.date && row.supplier && row.amount > 0);
  };
  const csvCell = value => {
    let text = String(value ?? "");
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const paymentRowsInPeriod = () => purchases.filter(item => (!document.getElementById("paymentExportFrom").value || item.date >= document.getElementById("paymentExportFrom").value) && (!document.getElementById("paymentExportTo").value || item.date <= document.getElementById("paymentExportTo").value));
  const renderExportPreview = () => {
    const rows = paymentRowsInPeriod();
    document.getElementById("paymentExportCount").textContent = `${rows.length} ${translateCopy("Платежей", "paymentExportCount")}`;
    document.getElementById("paymentExportPreview").innerHTML = rows.length ? `<table class="data-table"><thead><tr><th>${translateCopy("Дата", "paymentDateColumn")}</th><th>${translateCopy("Получатель", "paymentRecipientColumn")}</th><th>${translateCopy("Описание", "paymentDescriptionColumn")}</th><th>${translateCopy("Сумма", "paymentAmountColumn")}</th></tr></thead><tbody>${rows.slice(0, 50).map(item => `<tr><td>${escapeHtml(formatDate(item.date))}</td><td>${escapeHtml(item.supplier)}</td><td>${escapeHtml(item.note || "")}</td><td>${money(item.amount)} ${escapeHtml(item.currency || "EUR")}</td></tr>`).join("")}</tbody></table>` : `<p class="payments-empty">${translateCopy("За выбранный период платежей нет.", "paymentExportEmpty")}</p>`;
  };
  const originalRenderPurchases = renderPurchases;
  renderPurchases = () => {
    originalRenderPurchases();
    const from = document.getElementById("purchasesDateFrom").value;
    const to = document.getElementById("purchasesDateTo").value;
    const visible = purchases.filter(item => isWithinDateRange(item.date, from, to));
    [...document.querySelectorAll("#purchaseRows tr")].forEach((row, index) => {
      const item = visible[index];
      if (!item?.paymentMethod || !row.cells[2]) return;
      row.cells[2].textContent = translateCopy(item.paymentMethod === "cash" ? "Кассовый платеж" : "Банковский платеж", item.paymentMethod === "cash" ? "paymentCashCategory" : "paymentImportBank");
    });
  };
  renderPurchases();

  let cashCurrentPage = 1;
  let cashPageSize = 25;
  let cashSortKey = "date";
  let cashSortDirection = -1;
  const cashAccountFor = item => item.cashRegister || item.bankAccount || "Kassa / Cash";
  const cashAuthorFor = item => item.enteredBy || item.createdBy || item.createdByEmail || "—";
  const cashEnteredAtFor = item => {
    const value = item.enteredAt || item.createdAt;
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? String(value) : new Intl.DateTimeFormat(language === "et" ? "et-EE" : "ru-RU", { dateStyle: "short", timeStyle: "short" }).format(date);
  };
  const cashFilteredRows = () => {
    const query = document.getElementById("cashPaymentSearch").value.trim().toLocaleLowerCase(language);
    const authorQuery = document.getElementById("cashPaymentAuthor").value.trim().toLocaleLowerCase(language);
    const account = document.getElementById("cashPaymentAccountFilter").value;
    const from = document.getElementById("cashPaymentFrom").value;
    const to = document.getElementById("cashPaymentTo").value;
    return purchases.map((item, index) => ({ item, index })).filter(({ item }) => {
      if (item.paymentMethod !== "cash" && item.category !== "cash") return false;
      const searchText = `${item.supplier || item.counterparty || ""} ${item.note || item.description || ""} ${item.referenceNumber || item.orderNumber || ""}`.toLocaleLowerCase(language);
      return isWithinDateRange(item.date, from, to)
        && searchText.includes(query)
        && cashAuthorFor(item).toLocaleLowerCase(language).includes(authorQuery)
        && (!account || cashAccountFor(item) === account);
    });
  };
  const renderCashPayments = () => {
    const accountSelect = document.getElementById("cashPaymentAccountFilter");
    const selectedAccount = accountSelect.value;
    const cashAccounts = [...new Set(purchases.filter(item => item.paymentMethod === "cash" || item.category === "cash").map(cashAccountFor))];
    if (!cashAccounts.length) cashAccounts.push("Kassa / Cash");
    accountSelect.innerHTML = `<option value="">${translateCopy("Kõik kassad", "cashPaymentAccountAll")}</option>${cashAccounts.map(account => `<option value="${escapeHtml(account)}">${escapeHtml(account)}</option>`).join("")}`;
    accountSelect.value = cashAccounts.includes(selectedAccount) ? selectedAccount : "";
    const columns = [
      ["number", "NR", record => record.index + 1, "cash-payment-number"],
      ["counterparty", "TEINE OSAPOOL", record => record.item.supplier || record.item.counterparty || "—", "cash-payment-counterparty"],
      ["description", "KIRJELDUS", record => record.item.note || record.item.description || "—", "cash-payment-description"],
      ["account", "KASSA", record => cashAccountFor(record.item), "cash-payment-account"],
      ["date", "KUUPÄEV", record => record.item.date || "", "cash-payment-date"],
      ["amount", "SUMMA", record => Number(record.item.amount) || 0, "cash-payment-amount"],
      ["currency", "€/$", record => record.item.currency || "EUR", "cash-payment-currency"],
      ["reference", "ORDER NR", record => record.item.referenceNumber || record.item.orderNumber || "—", "cash-payment-reference"],
      ["enteredAt", "SISESTATUD", record => record.item.enteredAt || record.item.createdAt || "", "cash-payment-entered"],
      ["enteredBy", "SISESTAJA", record => cashAuthorFor(record.item), "cash-payment-author"]
    ];
    const rows = cashFilteredRows().sort((first, second) => {
      const column = columns.find(entry => entry[0] === cashSortKey) || columns[4];
      const a = column[2](first), b = column[2](second);
      const comparison = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), language, { numeric: true, sensitivity: "base" });
      return comparison * cashSortDirection;
    });
    const pageCount = Math.max(1, Math.ceil(rows.length / cashPageSize));
    if (cashCurrentPage > pageCount) cashCurrentPage = pageCount;
    const visible = rows.slice((cashCurrentPage - 1) * cashPageSize, cashCurrentPage * cashPageSize);
    const table = document.createElement("table");
    table.className = "data-table cash-payment-table";
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    for (const [key, title] of columns) {
      const th = document.createElement("th");
      const sortButton = document.createElement("button");
      sortButton.type = "button";
      sortButton.className = "cash-payment-sort";
      sortButton.dataset.sort = key;
      sortButton.innerHTML = `<span>${escapeHtml(key === "counterparty" ? translateCopy("Контрагент", "paymentRecipientColumn") : key === "description" ? translateCopy("Описание", "paymentDescriptionColumn") : key === "date" ? translateCopy("Дата", "paymentDateColumn") : key === "amount" ? translateCopy("Сумма", "paymentAmountColumn") : title)}</span><span class="cash-payment-sort-indicator">↕</span>`;
      sortButton.addEventListener("click", () => {
        cashSortDirection = cashSortKey === key ? -cashSortDirection : key === "date" ? -1 : 1;
        cashSortKey = key;
        renderCashPayments();
      });
      th.append(sortButton);
      headerRow.append(th);
    }
    header.append(headerRow);
    table.append(header);
    const body = document.createElement("tbody");
    if (visible.length) {
      for (const record of visible) {
        const values = columns.map(([key, , getValue]) => getValue(record));
        const row = document.createElement("tr");
        row.innerHTML = values.map((value, columnIndex) => {
          const [key, , , className] = columns[columnIndex];
          const content = key === "date" ? formatDate(value) || "—"
            : key === "enteredAt" ? escapeHtml(cashEnteredAtFor(record.item))
              : key === "amount" ? escapeHtml(money(value))
                : escapeHtml(value ?? "—");
          return `<td class="${className}">${content}</td>`;
        }).join("");
        body.append(row);
      }
    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td class="empty-row" colspan="10">${translateCopy(rows.length ? "По заданным фильтрам платежей нет." : "Кассовых платежей пока нет.", rows.length ? "cashPaymentNoFilterResults" : "cashPaymentNoRows")}</td>`;
      body.append(row);
    }
    table.append(body);
    document.getElementById("cashPaymentsTable").replaceChildren(table);
    table.querySelectorAll("[data-sort]").forEach(button => {
      button.querySelector(".cash-payment-sort-indicator").textContent = button.dataset.sort === cashSortKey ? (cashSortDirection > 0 ? "↑" : "↓") : "↕";
    });
    const pageNav = document.getElementById("cashPaymentPages");
    pageNav.replaceChildren();
    const addPageButton = (label, target, active = false, disabled = false, ariaLabel = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.disabled = disabled;
      if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
      if (active) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => { cashCurrentPage = target; renderCashPayments(); });
      pageNav.append(button);
    };
    addPageButton("«", 1, false, cashCurrentPage === 1, "First page");
    addPageButton("‹", Math.max(1, cashCurrentPage - 1), false, cashCurrentPage === 1, "Previous page");
    const start = Math.max(1, Math.min(cashCurrentPage - 4, pageCount - 8));
    for (let target = start; target <= Math.min(pageCount, start + 8); target++) addPageButton(String(target), target, target === cashCurrentPage);
    addPageButton("›", Math.min(pageCount, cashCurrentPage + 1), false, cashCurrentPage === pageCount, "Next page");
    addPageButton("»", pageCount, false, cashCurrentPage === pageCount, "Last page");
    const pageLabel = document.createElement("span");
    pageLabel.textContent = `${translateCopy("Страница", "salesPageOf")} ${cashCurrentPage} / ${pageCount}`;
    pageNav.append(pageLabel);
    document.getElementById("cashPaymentTotal").textContent = `${translateCopy("Всего", "cashPaymentTotal")}: ${rows.length}`;
    document.getElementById("cashPaymentPageSize").value = String(cashPageSize);
    const pageAmount = visible.reduce((sum, record) => sum + (Number(record.item.amount) || 0), 0);
    document.getElementById("cashPageRows").textContent = String(visible.length);
    document.getElementById("cashPageAmount").textContent = `${money(pageAmount)} EUR`;
    applyLanguage(language);
  };
  const exportCashRegister = async format => {
    if (!can("exportInvoices")) { denyAction("exportInvoices"); return; }
    const rows = cashFilteredRows().sort((first, second) => String(second.item.date || "").localeCompare(String(first.item.date || "")));
    if (!rows.length) { showMessage(translateCopy("По заданным фильтрам платежей нет.", "cashPaymentNoFilterResults"), true); return; }
    const data = [["Nr", "Teine osapool", "Kirjeldus", "Kassa", "Kuupäev", "Summa", "Valuuta", "Order nr", "Sisestatud", "Sisestaja"], ...rows.map(({ item, index }) => [index + 1, item.supplier || "", item.note || "", cashAccountFor(item), item.date || "", Number(item.amount || 0).toFixed(2), item.currency || "EUR", item.referenceNumber || "", cashEnteredAtFor(item), cashAuthorFor(item)])];
    let blob;
    if (format === "csv") blob = new Blob(["\ufeff", data.map(row => row.map(csvCell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    else if (format === "xls") {
      const xml = data.map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="String">${escapeHtml(value)}</Data></Cell>`).join("")}</Row>`).join("");
      blob = new Blob([`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Kassamaksed"><Table>${xml}</Table></Worksheet></Workbook>`], { type: "application/vnd.ms-excel;charset=utf-8" });
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = 1500; canvas.height = Math.max(500, 120 + rows.length * 32);
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#29483d"; context.font = "bold 26px Arial";
      context.fillText(translateCopy("Кассовые платежи", "paymentCashTitle"), 32, 42);
      context.fillStyle = "#e8eeea"; context.fillRect(32, 62, 1436, 32);
      const widths = [48, 190, 330, 150, 105, 95, 65, 100, 150, 160];
      context.fillStyle = "#35483e"; context.font = "bold 11px Arial";
      let x = 38; data[0].forEach((value, index) => { context.fillText(String(value), x, 83, widths[index] - 6); x += widths[index]; });
      data.slice(1).forEach((row, rowIndex) => { const y = 94 + rowIndex * 32; context.fillStyle = rowIndex % 2 ? "#fafbf9" : "#fff"; context.fillRect(32, y, 1436, 32); context.fillStyle = "#26352e"; context.font = "11px Arial"; x = 38; row.forEach((value, index) => { context.fillText(String(value), x, y + 21, widths[index] - 6); x += widths[index]; }); });
      blob = await createCanvasPdfBlob(canvas);
    }
    triggerBlobDownload(blob, `kassamaksed-${localDate()}.${format}`);
  };
  cashExports.querySelectorAll("[data-cash-export]").forEach(button => button.addEventListener("click", () => exportCashRegister(button.dataset.cashExport)));
  cashAddButton.addEventListener("click", () => {
    if (!can("payments")) { denyAction("payments"); return; }
    cashForm.reset();
    document.getElementById("cashPaymentDate").value = localDate();
    showView("cashPaymentEditorView");
    cashForm.dispatchEvent(new Event("cash-payment-editor-open"));
    document.getElementById("cashPaymentRecipient").focus();
  });
  document.getElementById("cashPaymentCancel").addEventListener("click", () => {
    cashForm.reset();
    document.getElementById("cashPaymentDate").value = localDate();
    showView("cashPaymentsView");
  });
  document.getElementById("cashPaymentApply").addEventListener("click", () => { cashCurrentPage = 1; renderCashPayments(); });
  document.getElementById("cashPaymentClear").addEventListener("click", () => {
    for (const id of ["cashPaymentSearch", "cashPaymentAuthor", "cashPaymentFrom", "cashPaymentTo"]) document.getElementById(id).value = "";
    document.getElementById("cashPaymentAccountFilter").value = "";
    cashCurrentPage = 1;
    renderCashPayments();
  });
  ["cashPaymentSearch", "cashPaymentAuthor", "cashPaymentAccountFilter", "cashPaymentFrom", "cashPaymentTo"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); cashCurrentPage = 1; renderCashPayments(); }
    });
  });
  document.getElementById("cashPaymentPageSize").addEventListener("change", event => {
    cashPageSize = Number(event.target.value) || 25;
    cashCurrentPage = 1;
    renderCashPayments();
  });
  document.getElementById("paymentExportFrom").addEventListener("change", renderExportPreview);
  document.getElementById("paymentExportTo").addEventListener("change", renderExportPreview);
  document.getElementById("paymentExportAction").addEventListener("click", () => {
    const rows = paymentRowsInPeriod();
    if (!rows.length) { showMessage(translateCopy("За выбранный период платежей нет.", "paymentExportEmpty"), true); return; }
    const records = [["Date", "Recipient", "Description", "Amount", "Currency"], ...rows.map(item => [item.date, item.supplier, item.note || "", Number(item.amount || 0).toFixed(2), item.currency || "EUR"])];
    const csv = records.map(row => row.map(csvCell).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `maksekorraldused-${localDate()}.csv`; link.click(); URL.revokeObjectURL(url);
    showMessage(translateCopy("Экспорт платежных поручений скачан.", "paymentExported"));
  });
  const xmlChild = (node, name) => [...(node?.children || [])].find(child => child.localName === name);
  const xmlPath = (node, ...names) => names.reduce((parent, name) => xmlChild(parent, name), node);
  const xmlValue = (node, ...names) => xmlPath(node, ...names)?.textContent.trim() || "";
  const importHash = async text => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))].map(value => value.toString(16).padStart(2, "0")).join("");
  const readXmlFile = async file => {
    if (!/\.xml$/i.test(file.name)) throw new Error("paymentImportUnsupported");
    if (file.size > 20 * 1024 * 1024) throw new Error("paymentImportTooLarge");
    const bytes = new Uint8Array(await file.arrayBuffer());
    let encoding = bytes[0] === 255 && bytes[1] === 254 || bytes[0] === 60 && bytes[1] === 0 ? "utf-16le"
      : bytes[0] === 254 && bytes[1] === 255 || bytes[0] === 0 && bytes[1] === 60 ? "utf-16be" : "utf-8";
    if (encoding === "utf-8") {
      const declaration = new TextDecoder("ascii").decode(bytes.slice(0, 200)).match(/<\?xml[^>]*encoding\s*=\s*["']([^"']+)["']/i);
      if (declaration) encoding = declaration[1];
    }
    return new TextDecoder(encoding, { fatal: true }).decode(bytes);
  };
  const parseXmlImport = async text => {
    if (text.includes("<!DOCTYPE") || text.includes("<!ENTITY")) throw new Error("paymentImportInvalid");
    const document = new DOMParser().parseFromString(text, "application/xml");
    if (document.getElementsByTagNameNS("*", "parsererror").length) throw new Error("paymentImportInvalid");
    const root = document.documentElement;
    if (root.localName !== "Document" || !/^urn:iso:std:iso:20022:tech:xsd:camt\.(053|054)\.001\.\d+$/.test(root.namespaceURI || "")) throw new Error("paymentImportUnsupported");
    const statementRoot = xmlChild(root, "BkToCstmrStmt") || xmlChild(root, "BkToCstmrDbtCdtNtfctn");
    if (!statementRoot) throw new Error("paymentImportUnsupported");
    const statements = [...statementRoot.children].filter(node => ["Stmt", "Ntfctn"].includes(node.localName));
    if (!statements.length) throw new Error("paymentImportInvalid");
    const fileHash = await importHash(text);
    const rows = [];
    let skipped = 0;
    const amountFor = (node, allowZero = false) => {
      const value = node?.textContent.trim() || "";
      const amount = Number(value);
      if (!/^\d+(\.\d+)?$/.test(value) || !Number.isFinite(amount) || amount < 0 || !allowZero && amount === 0) throw new Error("paymentImportInvalid");
      return amount;
    };
    for (const [statementIndex, statement] of statements.entries()) {
      const account = xmlValue(statement, "Acct", "Id", "IBAN") || xmlValue(statement, "Acct", "Id", "Othr", "Id");
      const entries = [...statement.children].filter(node => node.localName === "Ntry");
      for (const [entryIndex, entry] of entries.entries()) {
        const status = xmlValue(entry, "Sts", "Cd") || xmlValue(entry, "Sts");
        if (!status) throw new Error("paymentImportInvalid");
        if (status !== "BOOK") { skipped += 1; continue; }
        const date = (xmlValue(entry, "BookgDt", "Dt") || xmlValue(entry, "BookgDt", "DtTm")).slice(0, 10);
        const parsedDate = new Date(`${date}T12:00:00Z`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf()) || !parsedDate.toISOString().startsWith(date)) throw new Error("paymentImportInvalid");
        const entryAmountNode = xmlChild(entry, "Amt");
        const entryAmount = amountFor(entryAmountNode, true);
        const currency = entryAmountNode?.getAttribute("Ccy") || xmlValue(statement, "Acct", "Ccy");
        const indicator = xmlValue(entry, "CdtDbtInd");
        if (!/^[A-Z]{3}$/.test(currency) || !["CRDT", "DBIT"].includes(indicator)) throw new Error("paymentImportInvalid");
        if (currency !== "EUR") throw new Error("paymentImportCurrencyError");
        const details = [...entry.getElementsByTagNameNS("*", "TxDtls")];
        const transactions = details.length ? details : [null];
        if (!entryAmount && transactions.length === 1) { skipped += 1; continue; }
        const entryRows = [];
        for (const [transactionIndex, transaction] of transactions.entries()) {
          const detailAmountNode = xmlChild(transaction, "Amt") || xmlPath(transaction, "AmtDtls", "TxAmt", "Amt");
          const transactionIndicator = xmlValue(transaction, "CdtDbtInd") || indicator;
          if (!["CRDT", "DBIT"].includes(transactionIndicator)) throw new Error("paymentImportInvalid");
          if (transactions.length === 1 && transactionIndicator !== indicator) throw new Error("paymentImportBatchError");
          if (transactions.length > 1 && (!detailAmountNode || (detailAmountNode.getAttribute("Ccy") || currency) !== currency)) throw new Error("paymentImportBatchError");
          const amount = transactions.length === 1 ? entryAmount : amountFor(detailAmountNode);
          const incoming = transactionIndicator === "CRDT";
          const party = xmlPath(transaction, "RltdPties", incoming ? "Dbtr" : "Cdtr");
          const supplier = xmlValue(party, "Pty", "Nm") || xmlValue(party, "Nm") || xmlValue(transaction, "RltdPties", incoming ? "DbtrAcct" : "CdtrAcct", "Id", "IBAN") || translateCopy("Банковская операция", "paymentImportUnknownParty");
          const remittance = xmlChild(transaction, "RmtInf");
          const note = [remittance ? [...remittance.getElementsByTagNameNS("*", "Ustrd")].map(node => node.textContent.trim()).join(" · ") : "", xmlValue(transaction, "AddtlTxInf"), xmlValue(entry, "AddtlNtryInf")].filter(Boolean).join(" · ");
          const transactionReference = xmlValue(transaction, "Refs", "AcctSvcrRef");
          const reference = transactionReference || xmlValue(entry, "AcctSvcrRef");
          const batchReference = transactions.length > 1 && !transactionReference ? xmlValue(transaction, "Refs", "TxId") || transactionIndex : "";
          const identity = reference && reference !== "NOTPROVIDED" && account
            ? [account, reference, batchReference, date, transactionIndicator, amount, currency].join("|")
            : `${fileHash}:${statementIndex}:${entryIndex}:${transactionIndex}`;
          entryRows.push({ date, supplier, amount, currency, direction: incoming ? "incoming" : "outgoing", note,
            bankAccount: account, bankReference: reference, referenceNumber: xmlValue(transaction, "RmtInf", "Strd", "CdtrRefInf", "Ref"),
            isReversal: xmlValue(entry, "RvslInd") === "true", bankImportId: await importHash(identity) });
        }
        const signedTotal = entryRows.reduce((sum, row) => sum + (row.direction === "incoming" ? row.amount : -row.amount), 0);
        if (Math.abs(signedTotal - (indicator === "CRDT" ? entryAmount : -entryAmount)) > 0.005) throw new Error("paymentImportBatchError");
        rows.push(...entryRows);
      }
    }
    return { rows, skipped };
  };
  const importInput = document.getElementById("paymentImportFile");
  const importPreview = document.getElementById("paymentImportPreview");
  const importConfirm = document.getElementById("paymentImportConfirm");
  let importedRows = [];
  let importGeneration = 0;
  let importedContext = "";
  const importContext = () => `${cloudWorkspace?.organizationId || activeCompanyId}:${STORAGE.purchases}`;
  importInput.addEventListener("change", async () => {
    const generation = ++importGeneration;
    const context = importContext();
    importedRows = [];
    importConfirm.disabled = true;
    document.getElementById("paymentImportCount").textContent = "";
    if (!can("payments")) { denyAction("payments"); return; }
    const file = importInput.files[0];
    if (!file) { importPreview.innerHTML = `<p class="payments-empty">${translateCopy("Выберите XML файл для просмотра операций.", "paymentImportEmpty")}</p>`; return; }
    try {
      const parsed = await parseXmlImport(await readXmlFile(file));
      if (generation !== importGeneration) return;
      if (context !== importContext()) throw new Error("paymentImportContextChanged");
      const knownIds = new Set(purchases.map(item => item.bankImportId).filter(Boolean));
      importedRows = parsed.rows.filter(item => !knownIds.has(item.bankImportId));
      importedContext = context;
      const duplicates = parsed.rows.length - importedRows.length;
      document.getElementById("paymentImportCount").textContent = [`${importedRows.length} ${translateCopy("Строк для импорта", "paymentImportCount")}`, parsed.skipped ? `${translateCopy("Пропущено", "paymentImportSkipped")}: ${parsed.skipped}` : "", duplicates ? `${translateCopy("Уже импортировано", "paymentImportDuplicate")}: ${duplicates}` : ""].filter(Boolean).join(" · ");
      importPreview.innerHTML = importedRows.length ? `<table class="data-table"><thead><tr><th>${translateCopy("Дата", "paymentDateColumn")}</th><th>${translateCopy("Контрагент", "paymentImportCounterparty")}</th><th>${translateCopy("Направление", "paymentImportDirection")}</th><th>${translateCopy("Описание", "paymentDescriptionColumn")}</th><th>${translateCopy("Сумма", "paymentAmountColumn")}</th></tr></thead><tbody>${importedRows.slice(0, 50).map(item => `<tr><td>${escapeHtml(formatDate(item.date))}</td><td>${escapeHtml(item.supplier)}</td><td>${translateCopy(item.direction === "incoming" ? "Поступление" : "Выплата", item.direction === "incoming" ? "paymentImportIncoming" : "paymentImportOutgoing")}</td><td>${escapeHtml(item.note)}</td><td>${money(item.amount)} ${escapeHtml(item.currency)}</td></tr>`).join("")}</tbody></table>` : `<p class="payments-empty">${translateCopy("Новых проведенных операций нет.", "paymentImportNoRows")}</p>`;
      importConfirm.disabled = !importedRows.length;
    } catch (error) {
      if (generation !== importGeneration) return;
      importedRows = []; importConfirm.disabled = true;
      importPreview.innerHTML = `<p class="payments-empty">${escapeHtml(translateCopy("Не удалось прочитать XML файл.", /^paymentImport/.test(error.message) ? error.message : "paymentImportReadError"))}</p>`;
    }
  });
  importConfirm.addEventListener("click", () => {
    if (!can("payments")) { denyAction("payments"); return; }
    if (!importedRows.length) return;
    if (importedContext !== importContext()) { importedRows = []; importConfirm.disabled = true; showMessage(translateCopy("Компания изменилась. Загрузите XML заново.", "paymentImportContextChanged"), true); return; }
    const knownIds = new Set(purchases.map(item => item.bankImportId).filter(Boolean));
    const rows = importedRows.filter(item => !knownIds.has(item.bankImportId)).map(item => ({ ...item, id: crypto.randomUUID(), category: "bank", amountDue: 0, paymentMethod: "bank", paymentOrigin: "bank-import", enteredAt: new Date().toISOString(), enteredBy: currentInvoiceActorEmail() || "—" }));
    if (!rows.length) { importedRows = []; importConfirm.disabled = true; showMessage(translateCopy("Новых операций нет.", "paymentImportNoRows")); return; }
    const next = [...rows, ...purchases];
    try { saveList(STORAGE.purchases, next); purchases = next; }
    catch { showMessage(translateCopy("Не удалось сохранить импортированные платежи.", "paymentImportError"), true); return; }
    importedRows = []; importInput.value = ""; importConfirm.disabled = true;
    importPreview.innerHTML = `<p class="payments-empty">${translateCopy("Выберите XML файл для просмотра операций.", "paymentImportEmpty")}</p>`;
    document.getElementById("paymentImportCount").textContent = "";
    renderPurchases(); renderDashboard(); renderReport();
    showMessage(translateCopy("Платежи импортированы.", "paymentImportSaved"));
  });
  cashForm.addEventListener("cash-payment-saved", () => {
    cashCurrentPage = 1;
    showView("cashPaymentsView");
  });
  cashForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!can("payments")) { denyAction("payments"); return; }
    const item = {
      id: crypto.randomUUID(), date: document.getElementById("cashPaymentDate").value,
      supplier: document.getElementById("cashPaymentRecipient").value.trim(),
      amount: parseAmount(document.getElementById("cashPaymentAmount").value), amountDue: 0,
      currency: "EUR", category: "cash", cashRegister: document.getElementById("cashPaymentAccount").value,
      referenceNumber: document.getElementById("cashPaymentReference").value.trim(),
      note: document.getElementById("cashPaymentNote").value.trim(), paymentMethod: "cash",
      direction: "outgoing", enteredAt: new Date().toISOString(), enteredBy: currentInvoiceActorEmail() || "—"
    };
    if (!item.date || !item.supplier || item.amount <= 0) { showMessage(translateCopy("Укажите дату, получателя и сумму больше нуля.", "cashPaymentInvalid"), true); return; }
    const next = [item, ...purchases];
    try { saveList(STORAGE.purchases, next); purchases = next; }
    catch { showMessage(translateCopy("Не удалось сохранить кассовый платеж.", "paymentImportError"), true); return; }
    cashForm.reset(); document.getElementById("cashPaymentDate").value = localDate();
    cashCurrentPage = 1;
    renderPurchases(); renderDashboard(); renderReport();
    showView("cashPaymentsView");
    showMessage(translateCopy("Кассовый платеж сохранен.", "cashPaymentSaved"));
  });
  document.getElementById("cashPaymentDate").value = localDate();
  renderExportPreview(); renderCashPayments();
  applyLanguage(language);
  document.addEventListener("click", event => { if (!wrapper.contains(event.target)) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
})();
