(() => {
  const trigger = document.querySelector('.nav-button[data-view="salesView"]');
  const main = document.querySelector("main");
  if (!trigger || !main || trigger.dataset.salesMenuReady === "true") return;
  trigger.dataset.salesMenuReady = "true";

  Object.assign(ruTexts, {
    salesMenuInvoices: "Счета продажи", salesMenuQuotes: "Ценовые предложения", salesMenuOrders: "Заказы",
    salesMenuArticles: "Артикли", salesMenuClients: "Клиенты", salesMenuLabel: "Разделы продаж",
    salesMenuQuotesDescription: "Предложения клиентам и сроки действия.",
    salesMenuOrdersDescription: "Заказы клиентов и состав позиций.",
    salesMenuArticlesDescription: "Сохраненные артикли и услуги.",
    salesMenuClientsDescription: "Клиентская база компании.",
    salesQuoteAdd: "＋ Новое предложение", salesOrderAdd: "＋ Новый заказ",
    salesArticleAdd: "＋ Новый артикль", salesClientAdd: "＋ Новый клиент",
    salesDocumentNumber: "Номер", salesDocumentClient: "Клиент", salesDocumentDate: "Дата",
    salesQuoteValidUntil: "Действует до", salesOrderDueDate: "Срок выполнения",
    salesDocumentStatus: "Статус", salesDocumentTotal: "Сумма", salesDocumentActions: "Действия",
    salesDocumentDraft: "Черновик", salesDocumentCreateQuote: "Новое ценовое предложение",
    salesDocumentCreateOrder: "Новый заказ", salesDocumentEditQuote: "Изменить предложение",
    salesDocumentEditOrder: "Изменить заказ", salesDocumentSaveQuote: "Сохранить предложение",
    salesDocumentSaveOrder: "Сохранить заказ", salesDocumentCancel: "Отмена",
    salesDocumentReference: "Номер ссылки", salesDocumentDescription: "Описание",
    salesDocumentQuantity: "Количество", salesDocumentPrice: "Цена, EUR", salesDocumentLineTotal: "Сумма",
    salesDocumentNote: "Примечание", salesDocumentAddRow: "＋ Добавить строку",
    salesDocumentRemoveRow: "Удалить строку", salesDocumentGrandTotal: "Итого",
    salesDocumentNoRows: "Записей пока нет.", salesDocumentInvalid: "Укажите клиента и хотя бы одну позицию с ценой.",
    salesDocumentSaved: "Документ сохранен.", salesDocumentSaveError: "Не удалось сохранить документ.",
    salesDocumentDelete: "Удалить", salesDocumentDeleteConfirm: "Удалить этот документ?",
    salesDocumentDuplicate: "Номер документа уже используется.", salesEdit: "Изменить",
    salesArticleNumber: "Артикул", salesArticleName: "Название", salesClientName: "Клиент", salesClientType: "Тип",
    salesClientCompany: "Компания", salesClientPerson: "Частное лицо", salesClientAddress: "Адрес",
    salesClientRegistration: "Регистрационный код", salesClientPhone: "Телефон", salesClientEmail: "Электронная почта",
    salesDocumentBack: "Назад к продажам"
  });
  Object.assign(etTexts, {
    salesMenuInvoices: "Müügiarved", salesMenuQuotes: "Hinnapakkumised", salesMenuOrders: "Tellimused",
    salesMenuArticles: "Artiklid", salesMenuClients: "Kliendid", salesMenuLabel: "Müügi jaotised",
    salesMenuQuotesDescription: "Klientidele saadetud pakkumised ja nende kehtivusaeg.",
    salesMenuOrdersDescription: "Klientide tellimused ja nende read.",
    salesMenuArticlesDescription: "Salvestatud artiklid ja teenused.",
    salesMenuClientsDescription: "Ettevõtte kliendibaas.",
    salesQuoteAdd: "＋ Uus pakkumine", salesOrderAdd: "＋ Uus tellimus",
    salesArticleAdd: "＋ Uus artikkel", salesClientAdd: "＋ Uus klient",
    salesDocumentNumber: "Number", salesDocumentClient: "Klient", salesDocumentDate: "Kuupäev",
    salesQuoteValidUntil: "Kehtib kuni", salesOrderDueDate: "Tähtaeg",
    salesDocumentStatus: "Staatus", salesDocumentTotal: "Summa", salesDocumentActions: "Toimingud",
    salesDocumentDraft: "Mustand", salesDocumentCreateQuote: "Uus hinnapakkumine",
    salesDocumentCreateOrder: "Uus tellimus", salesDocumentEditQuote: "Muuda pakkumist",
    salesDocumentEditOrder: "Muuda tellimust", salesDocumentSaveQuote: "Salvesta pakkumine",
    salesDocumentSaveOrder: "Salvesta tellimus", salesDocumentCancel: "Tühista",
    salesDocumentReference: "Viitenumber", salesDocumentDescription: "Kirjeldus",
    salesDocumentQuantity: "Kogus", salesDocumentPrice: "Hind, EUR", salesDocumentLineTotal: "Summa",
    salesDocumentNote: "Märkus", salesDocumentAddRow: "＋ Lisa rida",
    salesDocumentRemoveRow: "Eemalda rida", salesDocumentGrandTotal: "Kokku",
    salesDocumentNoRows: "Kirjeid pole veel.", salesDocumentInvalid: "Valige klient ja lisage vähemalt üks hinnaga rida.",
    salesDocumentSaved: "Dokument salvestati.", salesDocumentSaveError: "Dokumenti ei saanud salvestada.",
    salesDocumentDelete: "Kustuta", salesDocumentDeleteConfirm: "Kas kustutada see dokument?",
    salesDocumentDuplicate: "Dokumendi number on juba kasutusel.", salesEdit: "Muuda",
    salesArticleNumber: "Artikkel", salesArticleName: "Nimi", salesClientName: "Klient", salesClientType: "Tüüp",
    salesClientCompany: "Ettevõte", salesClientPerson: "Eraisik", salesClientAddress: "Aadress",
    salesClientRegistration: "Registrikood", salesClientPhone: "Telefon", salesClientEmail: "E-post",
    salesDocumentBack: "Tagasi müügi juurde"
  });

  const copy = (fallback, key) => translateCopy(fallback, key);
  const viewIds = { quote: "salesQuotesView", order: "salesOrdersView", articles: "salesArticlesView", clients: "salesClientsView" };
  const labelKeys = { quote: "salesMenuQuotes", order: "salesMenuOrders", articles: "salesMenuArticles", clients: "salesMenuClients" };
  const descriptionKeys = { quote: "salesMenuQuotesDescription", order: "salesMenuOrdersDescription" };
  const listViews = {};
  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap sales-nav-wrap";
  trigger.before(wrapper);
  wrapper.append(trigger);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "salesNavMenu");
  trigger.insertAdjacentHTML("beforeend", '<svg class="payments-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>');
  const menu = document.createElement("div");
  menu.className = "payments-nav-menu sales-nav-menu";
  menu.id = "salesNavMenu";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", copy("Разделы продаж", "salesMenuLabel"));
  menu.hidden = true;
  wrapper.append(menu);

  const iconFor = {
    invoices: '<path d="M6 3h8l4 4v14H6z"></path><path d="M14 3v5h5M9 13h6m-6 4h6"></path>',
    quote: '<path d="M5 4h14v16H5z"></path><path d="M8 8h8m-8 4h5m-5 4h7"></path>',
    order: '<path d="M4 5h16v14H4z"></path><path d="M8 9h8m-8 4h8m-8 4h4"></path>',
    articles: '<path d="M4 5h16v14H4z"></path><path d="M8 9h8m-8 4h8m-8 4h5"></path>',
    clients: '<circle cx="9" cy="8" r="3"></circle><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.8M17 14c2.4.7 4 2.9 4 6"></path>'
  };
  const menuItems = [
    { key: "salesMenuInvoices", icon: "invoices", view: "salesView" },
    { key: labelKeys.articles, icon: "articles", view: viewIds.articles },
    { key: labelKeys.clients, icon: "clients", view: viewIds.clients }
  ];
  const navEntries = [];
  const items = [];
  for (const entry of menuItems) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "payments-nav-menu-item sales-nav-menu-item";
    button.setAttribute("role", "menuitem");
    button.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${iconFor[entry.icon]}</svg><span data-i18n="${entry.key}">${copy(entry.key, entry.key)}</span>`;
    button.addEventListener("click", () => {
      closeMenu();
      if (entry.kind) showDocumentList(entry.kind);
      else if (entry.view === viewIds.articles) showArticles();
      else if (entry.view === viewIds.clients) showClients();
      else switchView(entry.view);
    });
    menu.append(button);
    items.push({ button, view: entry.view });
  }
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const openMenu = () => {
    for (const other of document.querySelectorAll(".payments-nav-wrap.is-open")) {
      if (other === wrapper) continue;
      other.classList.remove("is-open");
      const otherMenu = other.querySelector(":scope > .payments-nav-menu");
      if (otherMenu) otherMenu.hidden = true;
      other.querySelector(":scope > .nav-button")?.setAttribute("aria-expanded", "false");
    }
    menu.hidden = false;
    wrapper.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };
  const closeMenu = () => { menu.hidden = true; wrapper.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false"); };
  trigger.addEventListener("click", event => {
    event.preventDefault(); event.stopImmediatePropagation();
    if (hoverCapable) return;
    if (menu.hidden) openMenu(); else closeMenu();
  }, true);
  if (hoverCapable) {
    wrapper.addEventListener("mouseenter", openMenu);
    wrapper.addEventListener("mouseleave", () => { if (!wrapper.contains(document.activeElement)) closeMenu(); });
  }
  wrapper.addEventListener("focusin", openMenu);
  wrapper.addEventListener("focusout", event => { if (!wrapper.contains(event.relatedTarget)) closeMenu(); });
  trigger.addEventListener("keydown", event => { if (event.key === "ArrowDown") { event.preventDefault(); openMenu(); } });
  document.addEventListener("click", event => { if (!wrapper.contains(event.target)) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

  const makeListView = (kind, titleKey, descriptionKey) => {
    const view = document.createElement("section");
    view.id = viewIds[kind];
    view.className = "app-view sales-subview";
    view.hidden = true;
    const heading = document.createElement("div");
    heading.className = "view-heading";
    const titleBlock = document.createElement("div");
    const title = document.createElement("h1"); title.dataset.i18n = titleKey; title.textContent = copy(titleKey, titleKey);
    const description = document.createElement("p"); description.dataset.i18n = descriptionKey; description.textContent = copy(descriptionKey, descriptionKey);
    titleBlock.append(title, description);
    const actions = document.createElement("div"); actions.className = "inline-actions sales-subview-actions";
    const add = document.createElement("button"); add.type = "button"; add.className = "primary-button"; add.dataset.i18n = kind === "quote" ? "salesQuoteAdd" : "salesOrderAdd"; add.textContent = copy(add.dataset.i18n, add.dataset.i18n);
    const back = document.createElement("button"); back.type = "button"; back.className = "secondary-button"; back.dataset.i18n = "salesDocumentBack"; back.textContent = copy("Tagasi müügi juurde", "salesDocumentBack"); back.addEventListener("click", () => switchView("salesView"));
    actions.append(add, back); heading.append(titleBlock, actions); view.append(heading);
    const panel = document.createElement("section"); panel.className = "data-panel sales-document-list";
    panel.innerHTML = `<div class="sales-document-toolbar"><label class="field"><span>${copy("Klient", "salesDocumentClient")}</span><input type="search" data-doc-search placeholder="${copy("Klient", "salesDocumentClient")}"></label><span class="sales-document-count"></span></div><div class="table-wrap"><table class="data-table sales-document-table"><thead><tr><th data-i18n="salesDocumentNumber">Number</th><th data-i18n="salesDocumentClient">Klient</th><th data-i18n="salesDocumentDate">Kuupäev</th><th data-i18n="${kind === "quote" ? "salesQuoteValidUntil" : "salesOrderDueDate"}">${copy(kind === "quote" ? "Kehtib kuni" : "Tähtaeg", kind === "quote" ? "salesQuoteValidUntil" : "salesOrderDueDate")}</th><th data-i18n="salesDocumentStatus">Staatus</th><th data-i18n="salesDocumentTotal">Summa</th><th data-i18n="salesDocumentActions">Toimingud</th></tr></thead><tbody></tbody></table></div><p class="sales-document-empty" data-i18n="salesDocumentNoRows" hidden>${copy("Kirjeid pole veel.", "salesDocumentNoRows")}</p>`;
    view.append(panel); main.insertBefore(view, document.getElementById("reportsView"));
    const entry = { view, add, panel, kind };
    listViews[kind] = entry;
    add.addEventListener("click", () => openDocumentEditor(kind));
    panel.querySelector("[data-doc-search]").addEventListener("input", () => renderDocumentList(kind));
    return entry;
  };
  makeListView("quote", labelKeys.quote, descriptionKeys.quote);
  makeListView("order", labelKeys.order, descriptionKeys.order);

  const articleView = document.createElement("section");
  articleView.id = viewIds.articles; articleView.className = "app-view sales-subview"; articleView.hidden = true;
  articleView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="salesMenuArticles">Artiklid</h1><p data-i18n="salesMenuArticlesDescription">Salvestatud artiklid ja teenused.</p></div><div class="inline-actions sales-subview-actions"><button type="button" class="primary-button" id="salesAddArticle" data-i18n="salesArticleAdd">＋ Uus artikkel</button><button type="button" class="secondary-button" data-sales-back data-i18n="salesDocumentBack">Tagasi müügi juurde</button></div></div><section class="data-panel sales-directory-panel"><div class="sales-document-toolbar"><label class="field"><span data-i18n="salesArticleName">Nimi</span><input id="salesArticleSearch" type="search"></label><span id="salesArticleCount" class="sales-document-count"></span></div><div class="table-wrap"><table class="data-table sales-directory-table"><thead><tr><th data-i18n="salesArticleNumber">Artikkel</th><th data-i18n="salesArticleName">Nimi</th><th data-i18n="salesDocumentActions">Toimingud</th></tr></thead><tbody id="salesArticleRows"></tbody></table></div><p id="salesArticleEmpty" class="sales-document-empty" data-i18n="salesDocumentNoRows" hidden>${copy("Kirjeid pole veel.", "salesDocumentNoRows")}</p></section>`;
  main.insertBefore(articleView, document.getElementById("reportsView"));
  articleView.querySelector("[data-sales-back]").addEventListener("click", () => switchView("salesView"));
  articleView.querySelector("#salesAddArticle").addEventListener("click", () => openArticleDialog());
  articleView.querySelector("#salesArticleSearch").addEventListener("input", () => renderArticles());
  document.getElementById("articleEditDialog").addEventListener("close", () => renderArticles());

  const clientView = document.createElement("section");
  clientView.id = viewIds.clients; clientView.className = "app-view sales-subview"; clientView.hidden = true;
  clientView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="salesMenuClients">Kliendid</h1><p data-i18n="salesMenuClientsDescription">Ettevõtte kliendibaas.</p></div><div class="inline-actions sales-subview-actions"><button type="button" class="primary-button" id="salesAddClient" data-i18n="salesClientAdd">＋ Uus klient</button><button type="button" class="secondary-button" data-sales-back data-i18n="salesDocumentBack">Tagasi müügi juurde</button></div></div><section class="data-panel sales-directory-panel"><div class="sales-document-toolbar"><label class="field"><span data-i18n="salesClientName">Klient</span><input id="salesClientSearch" type="search"></label><span id="salesClientCount" class="sales-document-count"></span></div><div class="table-wrap"><table class="data-table sales-directory-table"><thead><tr><th data-i18n="salesClientType">Tüüp</th><th data-i18n="salesClientName">Klient</th><th data-i18n="salesClientRegistration">Registrikood</th><th data-i18n="salesClientAddress">Aadress</th><th data-i18n="salesClientPhone">Telefon</th><th data-i18n="salesClientEmail">E-post</th><th data-i18n="salesDocumentActions">Toimingud</th></tr></thead><tbody id="salesClientRows"></tbody></table></div><p id="salesClientEmpty" class="sales-document-empty" data-i18n="salesDocumentNoRows" hidden>${copy("Kirjeid pole veel.", "salesDocumentNoRows")}</p></section>`;
  main.insertBefore(clientView, document.getElementById("reportsView"));
  clientView.querySelector("[data-sales-back]").addEventListener("click", () => switchView("salesView"));
  clientView.querySelector("#salesAddClient").addEventListener("click", () => openClientDialog());
  clientView.querySelector("#salesClientSearch").addEventListener("input", () => renderClients());
  document.getElementById("clientDialog").addEventListener("close", () => renderClients());

  const editorView = document.createElement("section");
  editorView.id = "salesDocumentEditorView";
  editorView.className = "app-view sales-subview";
  editorView.hidden = true;
  editorView.innerHTML = `<div class="view-heading"><div><h1 id="salesDocumentEditorTitle"></h1><p data-i18n="salesMenuQuotesDescription">Hinnapakkumised</p></div><div class="inline-actions sales-subview-actions"><button type="button" class="secondary-button" id="salesDocumentBack" data-i18n="salesDocumentBack">Tagasi müügi juurde</button></div></div><form id="salesDocumentForm" class="data-panel sales-document-editor"><div class="sales-document-fields"><label class="field"><span data-i18n="salesDocumentClient">Klient</span><input id="salesDocumentClient" list="salesDocumentClientList" required><datalist id="salesDocumentClientList"></datalist></label><label class="field"><span data-i18n="salesDocumentNumber">Number</span><input id="salesDocumentNumber" required></label><label class="field"><span data-i18n="salesDocumentDate">Kuupäev</span><input id="salesDocumentDate" type="date" required></label><label class="field"><span id="salesDocumentEndDateLabel" data-i18n="salesQuoteValidUntil">Kehtib kuni</span><input id="salesDocumentEndDate" type="date"></label><label class="field"><span data-i18n="salesDocumentReference">Viitenumber</span><input id="salesDocumentReference"></label><label class="field sales-document-note-field"><span data-i18n="salesDocumentNote">Märkus</span><input id="salesDocumentNote"></label></div><section class="sales-document-lines"><div class="sales-document-lines-heading"><h2 data-i18n="invoiceAddProduct">Teenused ja tooted</h2><button type="button" class="secondary-button" id="salesDocumentAddRow" data-i18n="salesDocumentAddRow">＋ Lisa rida</button></div><div class="table-wrap"><table class="data-table sales-document-lines-table"><thead><tr><th data-i18n="salesArticleNumber">Artikkel</th><th data-i18n="salesDocumentDescription">Kirjeldus</th><th data-i18n="salesDocumentQuantity">Kogus</th><th data-i18n="salesDocumentPrice">Hind, EUR</th><th data-i18n="salesDocumentLineTotal">Summa</th><th></th></tr></thead><tbody id="salesDocumentLineRows"></tbody></table></div><div class="sales-document-grand-total"><span data-i18n="salesDocumentGrandTotal">Kokku</span><strong id="salesDocumentTotal">0,00 EUR</strong></div></section><div class="sales-document-form-actions"><button type="submit" class="primary-button" id="salesDocumentSave"></button></div></form>`;
  main.insertBefore(editorView, document.getElementById("reportsView"));

  const editorForm = editorView.querySelector("#salesDocumentForm");
  const lineBody = editorView.querySelector("#salesDocumentLineRows");
  let editingDocumentType = "quote";
  let editingDocumentId = null;
  const documentList = kind => kind === "quote" ? quotes : salesOrders;
  const saveDocumentList = (kind, list) => {
    if (kind === "quote") { quotes = list; saveList(STORAGE.quotes, quotes); }
    else { salesOrders = list; saveList(STORAGE.salesOrders, salesOrders); }
  };
  const documentPrefix = kind => kind === "quote" ? "KP" : "ORD";
  const nextDocumentNumber = kind => {
    const prefix = `${documentPrefix(kind)}-${new Date().getFullYear()}-`;
    const largest = documentList(kind).reduce((max, document) => {
      const match = String(document.number || "").match(new RegExp(`^${prefix}(\\d+)$`));
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${prefix}${String(largest + 1).padStart(3, "0")}`;
  };
  const readDocumentItems = () => [...lineBody.querySelectorAll("tr[data-document-line]")].map(row => ({
    articleNumber: row.querySelector("[data-line-field=article]").value,
    description: row.querySelector("[data-line-field=description]").value.trim(),
    quantity: Math.max(0, Number(row.querySelector("[data-line-field=quantity]").value) || 0),
    price: Math.max(0, Number(row.querySelector("[data-line-field=price]").value) || 0),
    discountPercent: 0, taxRate: currentVatRate()
  })).filter(item => item.description || item.price > 0);
  const updateDocumentTotal = () => {
    const items = readDocumentItems();
    const totals = invoiceTotals(items);
    editorView.querySelector("#salesDocumentTotal").textContent = `${money(totals.total)} EUR`;
    lineBody.querySelectorAll("tr[data-document-line]").forEach(row => {
      const quantity = Number(row.querySelector("[data-line-field=quantity]").value) || 0;
      const price = Number(row.querySelector("[data-line-field=price]").value) || 0;
      row.querySelector("output").textContent = money(quantity * price);
    });
  };
  const addDocumentLine = (item = {}) => {
    const row = document.createElement("tr");
    row.dataset.documentLine = "true";
    row.innerHTML = `<td><select data-line-field="article" aria-label="${copy("Artikkel", "salesArticleNumber")}"><option value="">—</option>${articleEntries.map(article => `<option value="${escapeHtml(article.number)}">${escapeHtml(article.number)} · ${escapeHtml(article.name)}</option>`).join("")}</select></td><td><input data-line-field="description" type="text" value="${escapeHtml(item.description || "")}" aria-label="${copy("Kirjeldus", "salesDocumentDescription")}"></td><td><input data-line-field="quantity" type="number" min="0.01" step="0.01" value="${escapeHtml(item.quantity ?? 1)}" aria-label="${copy("Kogus", "salesDocumentQuantity")}"></td><td><input data-line-field="price" type="number" min="0" step="0.01" value="${escapeHtml(item.price ?? "")}" aria-label="${copy("Hind, EUR", "salesDocumentPrice")}"></td><td class="sales-document-line-total"><output>0,00</output></td><td><button type="button" class="sales-document-remove-line" aria-label="${copy("Eemalda rida", "salesDocumentRemoveRow")}">×</button></td>`;
    row.querySelector("[data-line-field=article]").value = String(item.articleNumber || "");
    row.querySelector("[data-line-field=article]").addEventListener("change", event => {
      const article = articleEntries.find(entry => String(entry.number) === event.target.value);
      if (article) row.querySelector("[data-line-field=description]").value = article.name;
      updateDocumentTotal();
    });
    row.addEventListener("input", updateDocumentTotal);
    row.querySelector(".sales-document-remove-line").addEventListener("click", () => {
      if (lineBody.children.length > 1) row.remove();
      else { row.querySelectorAll("input").forEach(input => input.value = ""); row.querySelector("[data-line-field=quantity]").value = "1"; row.querySelector("[data-line-field=article]").value = ""; }
      updateDocumentTotal();
    });
    lineBody.append(row);
    updateDocumentTotal();
  };
  const fillDocumentClientList = () => {
    editorView.querySelector("#salesDocumentClientList").innerHTML = clients.map(client => `<option value="${escapeHtml(client.name)}"></option>`).join("");
  };
  const openDocumentEditor = (kind, documentRecord = null) => {
    if (!can("sales")) { denyAction("sales"); return; }
    if (!documentRecord && !can("createInvoice")) { denyAction("createInvoice"); return; }
    if (documentRecord && !can("editInvoices")) { denyAction("editInvoices"); return; }
    editingDocumentType = kind;
    editingDocumentId = documentRecord?.id || null;
    const isQuote = kind === "quote";
    const titleKey = documentRecord ? (isQuote ? "salesDocumentEditQuote" : "salesDocumentEditOrder") : (isQuote ? "salesDocumentCreateQuote" : "salesDocumentCreateOrder");
    const saveKey = isQuote ? "salesDocumentSaveQuote" : "salesDocumentSaveOrder";
    const title = editorView.querySelector("#salesDocumentEditorTitle");
    title.dataset.i18n = titleKey;
    title.textContent = copy(isQuote ? (documentRecord ? "Muuda pakkumist" : "Uus hinnapakkumine") : (documentRecord ? "Muuda tellimust" : "Uus tellimus"), titleKey);
    editorView.querySelector("#salesDocumentSave").dataset.i18n = saveKey;
    editorView.querySelector("#salesDocumentSave").textContent = copy(isQuote ? "Salvesta pakkumine" : "Salvesta tellimus", saveKey);
    const endLabel = editorView.querySelector("#salesDocumentEndDateLabel");
    endLabel.dataset.i18n = isQuote ? "salesQuoteValidUntil" : "salesOrderDueDate";
    endLabel.textContent = copy(isQuote ? "Kehtib kuni" : "Tähtaeg", endLabel.dataset.i18n);
    editorView.querySelector(".view-heading p").dataset.i18n = descriptionKeys[kind];
    editorView.querySelector(".view-heading p").textContent = copy(descriptionKeys[kind], descriptionKeys[kind]);
    editorView.querySelector("#salesDocumentNumber").value = documentRecord?.number || nextDocumentNumber(kind);
    editorView.querySelector("#salesDocumentClient").value = documentRecord?.client?.name || "";
    editorView.querySelector("#salesDocumentDate").value = documentRecord?.date || localDate();
    editorView.querySelector("#salesDocumentEndDate").value = documentRecord?.validUntil || documentRecord?.dueDate || "";
    editorView.querySelector("#salesDocumentReference").value = documentRecord?.reference || "";
    editorView.querySelector("#salesDocumentNote").value = documentRecord?.note || "";
    fillDocumentClientList();
    lineBody.replaceChildren();
    (documentRecord?.items?.length ? documentRecord.items : [{}]).forEach(addDocumentLine);
    applyLanguage(language);
    switchView("salesDocumentEditorView");
    editorView.querySelector("#salesDocumentClient").focus();
  };
  const showDocumentList = kind => { renderDocumentList(kind); switchView(viewIds[kind]); };
  const showArticles = () => { renderArticles(); switchView(viewIds.articles); };
  const showClients = () => { renderClients(); switchView(viewIds.clients); };
  window.openSalesMenuSection = kind => {
    if (kind === "invoices") switchView("salesView");
    else if (kind === "quote" || kind === "order") showDocumentList(kind);
    else if (kind === "articles") showArticles();
    else if (kind === "clients") showClients();
  };

  editorView.querySelector("#salesDocumentBack").addEventListener("click", () => showDocumentList(editingDocumentType));
  editorView.querySelector("#salesDocumentAddRow").addEventListener("click", () => addDocumentLine());
  editorForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!can(editingDocumentId ? "editInvoices" : "createInvoice")) { denyAction(editingDocumentId ? "editInvoices" : "createInvoice"); return; }
    const clientName = editorView.querySelector("#salesDocumentClient").value.trim();
    const items = readDocumentItems();
    if (!clientName || !items.length || items.some(item => !item.description || item.price <= 0)) { showMessage(copy("Valige klient ja lisage vähemalt üks hinnaga rida.", "salesDocumentInvalid"), true); return; }
    const number = editorView.querySelector("#salesDocumentNumber").value.trim();
    const list = documentList(editingDocumentType);
    if (list.some(item => item.id !== editingDocumentId && item.number === number)) { showMessage(copy("Dokumendi number on juba kasutusel.", "salesDocumentDuplicate"), true); return; }
    const client = clients.find(saved => saved.name === clientName);
    const totals = invoiceTotals(items);
    const documentRecord = {
      id: editingDocumentId || crypto.randomUUID(), number, date: editorView.querySelector("#salesDocumentDate").value,
      validUntil: editorView.querySelector("#salesDocumentEndDate").value, dueDate: editorView.querySelector("#salesDocumentEndDate").value,
      reference: editorView.querySelector("#salesDocumentReference").value.trim(), note: editorView.querySelector("#salesDocumentNote").value.trim(),
      client: { name: clientName, address: client?.address || "", email: client?.email || "" }, items,
      ...totals, currency: "EUR", status: "draft", createdAt: editingDocumentId ? list.find(item => item.id === editingDocumentId)?.createdAt : new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    const next = editingDocumentId ? list.map(item => item.id === editingDocumentId ? documentRecord : item) : [documentRecord, ...list];
    try {
      if (editingDocumentType === "quote") { quotes = next; saveList(STORAGE.quotes, quotes); }
      else { salesOrders = next; saveList(STORAGE.salesOrders, salesOrders); }
      showMessage(copy("Dokument salvestati.", "salesDocumentSaved"));
      showDocumentList(editingDocumentType);
    } catch (error) { showMessage(error.message || copy("Dokumenti ei saanud salvestada.", "salesDocumentSaveError"), true); }
  });

  const renderDocumentList = kind => {
    const entry = listViews[kind];
    const query = entry.panel.querySelector("[data-doc-search]").value.trim().toLocaleLowerCase(language);
    const rows = documentList(kind).filter(item => `${item.number} ${item.client?.name || ""}`.toLocaleLowerCase(language).includes(query));
    const tbody = entry.panel.querySelector("tbody");
    tbody.innerHTML = rows.map(item => `<tr><td>${escapeHtml(item.number)}</td><td>${escapeHtml(item.client?.name || "—")}</td><td>${escapeHtml(formatDate(item.date) || "—")}</td><td>${escapeHtml(formatDate(kind === "quote" ? item.validUntil : item.dueDate) || "—")}</td><td><span class="sales-document-status">${copy("Черновик", "salesDocumentDraft")}</span></td><td>${escapeHtml(money(item.total))} EUR</td><td><div class="sales-document-row-actions"><button type="button" class="text-button" data-document-edit="${escapeHtml(item.id)}">${copy("Изменить", "salesEdit")}</button><button type="button" class="text-button sales-document-delete" data-document-delete="${escapeHtml(item.id)}">${copy("Удалить", "salesDocumentDelete")}</button></div></td></tr>`).join("");
    entry.panel.querySelector(".sales-document-count").textContent = `${copy("Kokku", "supplierRegisterCount")}: ${rows.length}`;
    entry.panel.querySelector(".sales-document-empty").hidden = rows.length > 0;
    tbody.querySelectorAll("[data-document-edit]").forEach(button => button.addEventListener("click", () => openDocumentEditor(kind, documentList(kind).find(item => item.id === button.dataset.documentEdit))));
    tbody.querySelectorAll("[data-document-delete]").forEach(button => button.addEventListener("click", () => {
      const item = documentList(kind).find(documentRecord => documentRecord.id === button.dataset.documentDelete);
      if (!item || !window.confirm(copy("Удалить этот документ?", "salesDocumentDeleteConfirm"))) return;
      const next = documentList(kind).filter(documentRecord => documentRecord.id !== item.id);
      try { if (kind === "quote") { quotes = next; saveList(STORAGE.quotes, quotes); } else { salesOrders = next; saveList(STORAGE.salesOrders, salesOrders); } renderDocumentList(kind); }
      catch (error) { showMessage(error.message || copy("Документ не удалось удалить.", "salesDocumentSaveError"), true); }
    }));
    applyLanguage(language);
  };

  const renderArticles = () => {
    const query = articleView.querySelector("#salesArticleSearch").value.trim().toLocaleLowerCase(language);
    const rows = articleEntries.filter(article => `${article.number} ${article.name}`.toLocaleLowerCase(language).includes(query)).sort((a,b) => a.number-b.number);
    articleView.querySelector("#salesArticleRows").innerHTML = rows.map(article => `<tr><td>${escapeHtml(formatArticleNumber(article.number))}</td><td>${escapeHtml(article.name)}</td><td><button type="button" class="text-button" data-edit-sales-article="${article.number}">${copy("Изменить", "salesEdit")}</button></td></tr>`).join("");
    articleView.querySelector("#salesArticleCount").textContent = `${copy("Kokku", "supplierRegisterCount")}: ${rows.length}`;
    articleView.querySelector("#salesArticleEmpty").hidden = rows.length > 0;
    articleView.querySelectorAll("[data-edit-sales-article]").forEach(button => button.addEventListener("click", () => openArticleDialog(articleEntries.find(article => article.number === Number(button.dataset.editSalesArticle)))));
    applyLanguage(language);
  };
  const renderClients = () => {
    const query = clientView.querySelector("#salesClientSearch").value.trim().toLocaleLowerCase(language);
    const rows = clients.filter(client => `${client.name} ${client.reg || ""} ${client.email || ""}`.toLocaleLowerCase(language).includes(query)).sort((a,b) => a.name.localeCompare(b.name, language));
    clientView.querySelector("#salesClientRows").innerHTML = rows.map(client => `<tr><td>${copy(client.type === "company" ? "Компания" : "Частное лицо", client.type === "company" ? "salesClientCompany" : "salesClientPerson")}</td><td>${escapeHtml(client.name)}</td><td>${escapeHtml(client.reg || "—")}</td><td>${escapeHtml(client.address || "—")}</td><td>${escapeHtml(client.phone || "—")}</td><td>${escapeHtml(client.email || "—")}</td><td><button type="button" class="text-button" data-edit-sales-client="${escapeHtml(client.name)}">${copy("Изменить", "salesEdit")}</button></td></tr>`).join("");
    clientView.querySelector("#salesClientCount").textContent = `${copy("Kokku", "supplierRegisterCount")}: ${rows.length}`;
    clientView.querySelector("#salesClientEmpty").hidden = rows.length > 0;
    clientView.querySelectorAll("[data-edit-sales-client]").forEach(button => button.addEventListener("click", () => openClientDialog(clients.find(client => client.name === button.dataset.editSalesClient))));
    applyLanguage(language);
  };

  const baseCanOpenView = canOpenView;
  canOpenView = id => id === "salesDocumentEditorView" ? can("createInvoice") || can("editInvoices")
    : Object.values(viewIds).includes(id) ? can("sales") : baseCanOpenView(id);
  const baseSwitchView = switchView;
  switchView = id => {
    baseSwitchView(id);
    if (id === "salesView" || id === "salesDocumentEditorView" || Object.values(viewIds).includes(id)) {
      document.querySelectorAll(".nav-button").forEach(button => button.setAttribute("aria-current", String(button === trigger)));
    }
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); wrapper.hidden = !can("sales"); };
  wrapper.hidden = !can("sales");
  document.getElementById("articleEditDialog").addEventListener("close", renderArticles);
  document.getElementById("clientDialog").addEventListener("close", renderClients);
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(() => { menu.setAttribute("aria-label", copy("Разделы продаж", "salesMenuLabel")); renderArticles(); renderClients(); Object.keys(listViews).forEach(renderDocumentList); })));
  applyLanguage(language);
})();