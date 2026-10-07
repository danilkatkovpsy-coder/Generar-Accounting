(() => {
  const initializeComposer = paymentMethod => {
  const isCash = paymentMethod === "cash";
  const form = document.getElementById(isCash ? "cashPaymentForm" : "purchaseForm");
  const formGrid = form?.querySelector(isCash ? ".cash-payment-form-fields" : ".form-grid");
  const dateInput = document.getElementById(isCash ? "cashPaymentDate" : "purchaseDate");
  const recipientInput = document.getElementById(isCash ? "cashPaymentRecipient" : "purchaseSupplier");
  const accountSelect = document.getElementById(isCash ? "cashPaymentAccount" : "purchaseBankAccount");
  const amountInput = document.getElementById(isCash ? "cashPaymentAmount" : "purchaseAmount");
  let noteInput = document.getElementById(isCash ? "cashPaymentNote" : "purchaseNote");
  if (!form || !formGrid || !dateInput || !recipientInput || !accountSelect || !amountInput || !noteInput || form.dataset.bankComposerReady) return;

  if (isCash) {
    const noteArea = document.createElement("textarea");
    noteArea.id = noteInput.id;
    noteArea.rows = 2;
    noteInput.replaceWith(noteArea);
    noteInput = noteArea;
  }
  form.dataset.bankComposerReady = "true";
  Object.assign(ruTexts, {
    cashComposerBalanceHint: "Рассчитано по кассовым платежам, без начального остатка.",
    bankComposerClient: "Клиент", bankComposerSupplier: "Поставщик", bankComposerRecipient: "Получатель", bankComposerDate: "Дата",
    bankComposerSearch: "Поиск по контрагенту или счету", bankComposerBalance: "Остаток на счете",
    bankComposerBalanceUnavailable: "Баланс не синхронизирован с банком", bankComposerReference: "Основание платежа",
    bankComposerCurrency: "Валюта", bankComposerNote: "Примечание", bankComposerCounterparty: "Контрагент",
    bankComposerReferenceNumber: "Референс", bankComposerFilter: "Фильтровать",
    bankComposerSupplierAdvanceLabel: "Аванс поставщику:", bankComposerSupplierAdvancePlaceholder: "Описание нового аванса",
    bankComposerClientAdvanceLabel: "Аванс от клиента:", bankComposerClientAdvancePlaceholder: "Описание аванса клиента",
    bankComposerInvoice: "Счет", bankComposerDueDate: "Срок оплаты", bankComposerOutstanding: "Не оплачено",
    bankComposerPay: "К оплате", bankComposerNoDebts: "Неоплаченных счетов нет.",
    bankComposerExtraTitle: "Дополнительные строки", bankComposerDescription: "Описание",
    bankComposerQuantity: "Количество", bankComposerPrice: "Цена", bankComposerLineTotal: "Сумма",
    bankComposerAccount: "Счет учета", bankComposerObject: "Объект", bankComposerAddLine: "Добавить строку",
    bankComposerRemoveLine: "Удалить строку", bankComposerTotal: "Итого к оплате",
    bankComposerNoPayment: "Выберите счет или добавьте строку с суммой больше нуля.",
    bankComposerRecipientRequired: "Укажите получателя платежа.",
    bankComposerAccountRequired: "Выберите банковский счет.",
    bankComposerInvalidAmount: "Сумма оплаты превышает остаток счета.",
    bankComposerInvalidLine: "Для каждой строки с суммой укажите описание и положительную цену.",
    bankComposerSaved: "Банковский платеж сохранен.", bankComposerSaveError: "Не удалось сохранить банковский платеж.",
    bankComposerIncoming: "Поступление от клиента", bankComposerOutgoing: "Платеж поставщику", bankComposerClientAdvance: "Аванс клиента",
    bankComposerDetailsTitle: "Детали банковского платежа", bankComposerEdit: "Изменить", bankComposerCancelEdit: "Отмена",
    bankComposerClose: "Закрыть", bankComposerSaveChanges: "Сохранить изменения",
    bankComposerAmountLocked: "Сумма связана со счетом и здесь не редактируется.",
    bankComposerInvalidEdit: "Проверьте получателя, счет, дату и сумму платежа.",
    bankComposerUpdated: "Банковский платеж изменен.", bankComposerUpdateError: "Не удалось изменить банковский платеж.",
    bankComposerDelete: "Удалить платеж", bankComposerDeleteConfirm: "Удалить этот платеж? Связанный счет будет пересчитан.",
    bankComposerDeleteLinkedError: "Не удалось найти связанную оплату счета. Платеж не удален.",
    bankComposerDeleted: "Банковский платеж удален.", bankComposerDeleteError: "Не удалось удалить банковский платеж."
  });
  Object.assign(etTexts, {
    cashComposerBalanceHint: "Arvutatud kassamaksete põhjal, algsaldot arvestamata.",
    bankComposerClient: "Klient", bankComposerSupplier: "Hankija", bankComposerRecipient: "Saaja", bankComposerDate: "Kuupäev",
    bankComposerSearch: "Otsi osapoole või arve järgi", bankComposerBalance: "Kontojääk",
    bankComposerBalanceUnavailable: "Panga saldo pole sünkroonitud", bankComposerReference: "Alusdokument",
    bankComposerCurrency: "Valuuta", bankComposerNote: "Selgitus", bankComposerCounterparty: "Teine osapool",
    bankComposerReferenceNumber: "Viitenr", bankComposerFilter: "FILTREERI",
    bankComposerSupplierAdvanceLabel: "Hankijale tasutud ettemakse:", bankComposerSupplierAdvancePlaceholder: "Uue ettemakse kirjeldus",
    bankComposerClientAdvanceLabel: "Kliendilt laekunud ettemakse:", bankComposerClientAdvancePlaceholder: "Kliendi ettemakse kirjeldus",
    bankComposerInvoice: "Arve", bankComposerDueDate: "Maksetähtaeg", bankComposerOutstanding: "Maksmata",
    bankComposerPay: "Tasuda", bankComposerNoDebts: "Tasumata arveid ei ole.",
    bankComposerExtraTitle: "Lisaread", bankComposerDescription: "Kirjeldus",
    bankComposerQuantity: "Kogus", bankComposerPrice: "Hind", bankComposerLineTotal: "Summa",
    bankComposerAccount: "Konto", bankComposerObject: "Objekt", bankComposerAddLine: "Lisa rida",
    bankComposerRemoveLine: "Eemalda rida", bankComposerTotal: "Makse summa kokku",
    bankComposerNoPayment: "Valige arve või lisage positiivse summaga rida.",
    bankComposerRecipientRequired: "Sisestage makse saaja.",
    bankComposerAccountRequired: "Valige pangakonto.",
    bankComposerInvalidAmount: "Makse ületab arve jäägi.",
    bankComposerInvalidLine: "Täitke iga summaga rea kirjeldus ja hind.",
    bankComposerSaved: "Pangamakse salvestati.", bankComposerSaveError: "Pangamakset ei saanud salvestada.",
    bankComposerIncoming: "Laekumine kliendilt", bankComposerOutgoing: "Makse hankijale", bankComposerClientAdvance: "Kliendi ettemakse",
    bankComposerDetailsTitle: "Pangamakse üksikasjad", bankComposerEdit: "Muuda", bankComposerCancelEdit: "Tühista",
    bankComposerClose: "Sulge", bankComposerSaveChanges: "Salvesta muudatused",
    bankComposerAmountLocked: "Summa on arvega seotud ja siin muutmiseks lukustatud.",
    bankComposerInvalidEdit: "Kontrollige saajat, pangakontot, kuupäeva ja summat.",
    bankComposerUpdated: "Pangamakset muudeti.", bankComposerUpdateError: "Pangamakset ei saanud muuta.",
    bankComposerDelete: "Kustuta makse", bankComposerDeleteConfirm: "Kas kustutada see makse? Seotud arve jääk arvutatakse ümber.",
    bankComposerDeleteLinkedError: "Seotud arve makset ei leitud. Pangamakset ei kustutatud.",
    bankComposerDeleted: "Pangamakse kustutati.", bankComposerDeleteError: "Pangamakset ei saanud kustutada."
  });

  const get = id => document.getElementById(isCash && id.startsWith("bankPayment") ? id.replace("bankPayment", "cashComposer") : id);
  const copy = (fallback, key) => translateCopy(fallback, key);
  const selectedAmounts = new Map();
  let recipientType = isCash ? "client" : "supplier";
  let lastAutofilledRecipient = "";

  const fieldFor = input => input?.closest(".field");
  const dueDateField = fieldFor(get("purchaseDueDate"));
  const categoryField = fieldFor(get("purchaseCategory"));
  const dateField = fieldFor(dateInput);
  const recipientField = fieldFor(recipientInput);
  const accountField = fieldFor(accountSelect);
  const amountField = fieldFor(amountInput);
  const noteField = fieldFor(noteInput);
  if (![dateField, recipientField, accountField, amountField, noteField].every(Boolean)) return;

  recipientInput.required = false;
  recipientInput.dataset.i18nPlaceholder = "bankComposerRecipient";
  amountInput.required = false;
  amountInput.readOnly = true;
  if (!isCash) {
    dueDateField.hidden = true;
    categoryField.hidden = true;
  }
  for (const [input, key, fallback] of [
    [dateInput, "bankComposerDate", "Kuupäev"],
    [recipientInput, "bankComposerRecipient", "Saaja"],
    [amountInput, "bankComposerTotal", "Makse summa kokku"],
    [noteInput, "bankComposerNote", "Selgitus"]
  ]) {
    const label = fieldFor(input).querySelector("label");
    label.dataset.i18n = key;
    label.textContent = copy(fallback, key);
  }

  const composer = document.createElement("div");
  composer.className = "bank-payment-composer";
  const details = document.createElement("div");
  details.className = "bank-payment-composer-details";
  const documentField = document.createElement("div");
  documentField.className = "field";
  documentField.innerHTML = `<label for="bankPaymentReference" data-i18n="bankComposerReference">${copy("Alusdokument", "bankComposerReference")}</label><input id="bankPaymentReference" type="text" autocomplete="off">`;
  const currencyField = document.createElement("div");
  currencyField.className = "field";
  currencyField.innerHTML = `<label for="bankPaymentCurrency" data-i18n="bankComposerCurrency">${copy("Valuuta", "bankComposerCurrency")}</label><select id="bankPaymentCurrency"><option value="EUR">EUR</option></select>`;
  const balanceField = document.createElement("div");
  balanceField.className = "bank-payment-account-balance";
  balanceField.innerHTML = `<span data-i18n="bankComposerBalance">${copy("Kontojääk", "bankComposerBalance")}</span><strong>— EUR</strong>${isCash ? "" : `<small data-i18n="bankComposerBalanceUnavailable">${copy("Panga saldo pole sünkroonitud", "bankComposerBalanceUnavailable")}</small>`}`;
  details.append(dateField, accountField, recipientField, documentField, currencyField, balanceField, noteField);
  if (isCash) {
    const orderField = fieldFor(get("cashPaymentReference"));
    details.insertBefore(orderField, noteField);
    noteField.classList.add("wide");
    balanceField.querySelector("strong").title = copy("Arvutatud kassamaksete põhjal, algsaldot arvestamata.", "cashComposerBalanceHint");
  }

  const debtToolbar = document.createElement("div");
  debtToolbar.className = "bank-payment-debt-toolbar";
  const tabs = document.createElement("div");
  tabs.className = "bank-payment-recipient-tabs";
  tabs.setAttribute("role", "group");
  tabs.setAttribute("aria-label", "Payment recipient type");
  const makeTab = (type, key, fallback) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.recipientType = type;
    button.dataset.i18n = key;
    button.textContent = copy(fallback, key);
    button.setAttribute("aria-pressed", String(type === recipientType));
    return button;
  };
  const clientTab = makeTab("client", "bankComposerClient", "Klient");
  const supplierTab = makeTab("supplier", "bankComposerSupplier", "Hankija");
  tabs.append(clientTab, supplierTab);
  const searchField = document.createElement("div");
  searchField.className = "field bank-payment-debt-search";
  searchField.innerHTML = `<label class="sr-only" for="bankPaymentDebtSearch" data-i18n="bankComposerSearch">${copy("Otsi osapoole või arve järgi", "bankComposerSearch")}</label><div class="bank-payment-search-controls"><input id="bankPaymentDebtSearch" type="search" data-i18n-placeholder="bankComposerSearch" placeholder="${copy("Otsi osapoole või arve järgi", "bankComposerSearch")}" aria-label="${copy("Otsi osapoole või arve järgi", "bankComposerSearch")}"><button type="button" class="primary-button" data-i18n="bankComposerFilter">${copy("FILTREERI", "bankComposerFilter")}</button></div>`;
  const filterButton = searchField.querySelector("button");
  debtToolbar.append(tabs, searchField);

  const debtsPanel = document.createElement("section");
  debtsPanel.className = "bank-payment-debts-panel";
  const debtTableWrap = document.createElement("div");
  debtTableWrap.className = "table-wrap bank-payment-debts-wrap";
  debtTableWrap.innerHTML = `<table class="data-table bank-payment-debts-table"><thead><tr><th data-i18n="bankComposerCounterparty">${copy("Teine osapool", "bankComposerCounterparty")}</th><th data-i18n="bankComposerInvoice">${copy("Arve", "bankComposerInvoice")}</th><th data-i18n="bankComposerReferenceNumber">${copy("Viitenr", "bankComposerReferenceNumber")}</th><th data-i18n="bankComposerDueDate">${copy("Maksetähtaeg", "bankComposerDueDate")}</th><th data-i18n="bankComposerCurrency">${copy("Valuuta", "bankComposerCurrency")}</th><th data-i18n="bankComposerOutstanding">${copy("Maksmata", "bankComposerOutstanding")}</th><th data-i18n="bankComposerPay">${copy("Tasuda", "bankComposerPay")}</th><th><span class="sr-only">Vali</span></th></tr></thead><tbody></tbody></table>`;
  const debtEmpty = document.createElement("p");
  debtEmpty.className = "bank-payment-debts-empty";
  debtEmpty.dataset.i18n = "bankComposerNoDebts";
  debtEmpty.textContent = copy("Tasumata arveid ei ole.", "bankComposerNoDebts");
  debtsPanel.append(debtTableWrap, debtEmpty);

  const advanceSection = document.createElement("div");
  advanceSection.className = "bank-payment-advance-row";
  advanceSection.innerHTML = `<label id="bankPaymentAdvanceLabel" for="bankPaymentAdvanceDescription" data-i18n="bankComposerSupplierAdvanceLabel">${copy("Hankijale tasutud ettemakse:", "bankComposerSupplierAdvanceLabel")}</label><input id="bankPaymentAdvanceDescription" type="text" data-i18n-placeholder="bankComposerSupplierAdvancePlaceholder" placeholder="${copy("Uue ettemakse kirjeldus", "bankComposerSupplierAdvancePlaceholder")}"><input id="bankPaymentAdvanceAmount" type="number" min="0" step="0.01" placeholder="0,00" aria-label="${copy("Makse summa kokku", "bankComposerTotal")}">`;

  const extraSection = document.createElement("section");
  extraSection.className = "bank-payment-extra-section";
  const extraHeader = document.createElement("div");
  extraHeader.className = "bank-payment-extra-heading";
  const extraTitle = document.createElement("h3");
  extraTitle.dataset.i18n = "bankComposerExtraTitle";
  extraTitle.textContent = copy("Lisaread", "bankComposerExtraTitle");
  const addLineButton = document.createElement("button");
  addLineButton.type = "button";
  addLineButton.className = "secondary-button bank-payment-add-line";
  addLineButton.dataset.i18n = "bankComposerAddLine";
  addLineButton.textContent = copy("Lisa rida", "bankComposerAddLine");
  extraHeader.append(extraTitle, addLineButton);
  const extraWrap = document.createElement("div");
  extraWrap.className = "table-wrap bank-payment-extra-wrap";
  extraWrap.innerHTML = `<table class="data-table bank-payment-extra-table"><thead><tr><th data-i18n="bankComposerDescription">${copy("Kirjeldus", "bankComposerDescription")}</th><th data-i18n="bankComposerQuantity">${copy("Kogus", "bankComposerQuantity")}</th><th data-i18n="bankComposerPrice">${copy("Hind", "bankComposerPrice")}</th><th data-i18n="bankComposerLineTotal">${copy("Summa", "bankComposerLineTotal")}</th><th data-i18n="bankComposerAccount">${copy("Konto", "bankComposerAccount")}</th><th data-i18n="bankComposerObject">${copy("Objekt", "bankComposerObject")}</th><th></th></tr></thead><tbody></tbody></table>`;
  extraSection.append(extraHeader, extraWrap);

  const totalBar = document.createElement("div");
  totalBar.className = "bank-payment-composer-total";
  const totalLabel = document.createElement("span");
  totalLabel.dataset.i18n = "bankComposerTotal";
  totalLabel.textContent = copy("Makse summa kokku", "bankComposerTotal");
  totalBar.append(totalLabel, amountField);

  composer.append(details, debtToolbar, debtsPanel, advanceSection, extraSection, totalBar);
  if (isCash) {
    for (const element of composer.querySelectorAll("[id]")) {
      if (element.id.startsWith("bankPayment")) element.id = element.id.replace("bankPayment", "cashComposer");
    }
    for (const label of composer.querySelectorAll("label[for]")) {
      if (label.htmlFor.startsWith("bankPayment")) label.htmlFor = label.htmlFor.replace("bankPayment", "cashComposer");
    }
  }
  form.insertBefore(composer, formGrid);
  formGrid.hidden = true;

  const debtBody = debtTableWrap.querySelector("tbody");
  const extraBody = extraWrap.querySelector("tbody");
  const searchInput = searchField.querySelector("input");
  const advanceLabel = advanceSection.querySelector("label");
  const advanceDescription = get("bankPaymentAdvanceDescription");
  const advanceAmount = get("bankPaymentAdvanceAmount");
  const updateCashBalance = () => {
    if (!isCash) return;
    const balance = purchases.filter(item => item.paymentMethod === "cash" && (item.cashRegister || item.bankAccount || "Kassa / Cash") === accountSelect.value)
      .reduce((sum, item) => sum + (item.direction === "incoming" ? 1 : -1) * Math.abs(Number(item.amount) || 0), 0);
    balanceField.querySelector("strong").textContent = `${money(balance)} EUR`;
  };
  accountSelect.addEventListener("change", updateCashBalance);
  form.addEventListener("cash-payment-editor-open", () => { renderDebts(); updateCashBalance(); });

  const outstandingFor = (record, type) => {
    if (type === "client") return invoiceIsPaid(record) ? 0 : invoiceOutstandingAmount(record);
    if (record.paymentStatus === "paid" || record.status === "paid") return 0;
    return Math.max(0, Number(record.amountDue ?? record.amount) || 0);
  };
  const allDebtRecords = () => recipientType === "client"
      ? invoices.filter(invoice => outstandingFor(invoice, "client") > 0).map(invoice => ({
        record: invoice, id: String(invoice.id || invoice.number), name: invoice.client?.name || "—",
        reference: invoice.number || invoice.invoiceNumber || "—", referenceNumber: invoice.referenceNumber || invoice.reference || "—", date: invoice.dueDate || "",
        currency: invoice.currency || "EUR", balance: outstandingFor(invoice, "client"),
        description: [invoice.note, ...(invoice.items || []).map(line => line.description)].filter(Boolean).join(" ")
      }))
      : supplierInvoices.filter(invoice => outstandingFor(invoice, "supplier") > 0).map(invoice => ({
        record: invoice, id: String(invoice.id), name: invoice.supplierName || "—",
        reference: invoice.invoiceNumber || "—", referenceNumber: invoice.referenceNumber || invoice.reference || invoice.paymentReference || "—", date: invoice.dueDate || "",
        currency: invoice.currency || "EUR", balance: outstandingFor(invoice, "supplier"),
        description: invoice.description || invoice.note || ""
      }));
  const debtRecords = () => {
    const query = searchInput.value.trim().toLocaleLowerCase(language);
    return allDebtRecords().filter(item => `${item.name} ${item.reference} ${item.referenceNumber} ${item.description}`.toLocaleLowerCase(language).includes(query));
  };
  const paymentKey = (type, id) => `${type}:${id}`;
  const chosenDebts = () => allDebtRecords().filter(item => Number(selectedAmounts.get(paymentKey(recipientType, item.id))) > 0)
    .map(item => ({ ...item, amount: Number(selectedAmounts.get(paymentKey(recipientType, item.id))) }));
  const readExtraLines = () => [...extraBody.querySelectorAll("tr[data-extra-line]")].map(row => {
    const quantity = Number(row.querySelector('[data-line-field="quantity"]').value) || 0;
    const price = Number(row.querySelector('[data-line-field="price"]').value) || 0;
    return {
      description: row.querySelector('[data-line-field="description"]').value.trim(),
      quantity, price, amount: Math.round(quantity * price * 100) / 100,
      account: row.querySelector('[data-line-field="account"]').value,
      object: row.querySelector('[data-line-field="object"]').value.trim()
    };
  });

  const syncRecipient = () => {
    const names = [...new Set(chosenDebts().map(item => item.name).filter(name => name !== "—"))];
    const nextValue = names.length === 1 ? names[0] : names.length > 1 ? (language === "et" ? "Mitu saajat" : "Несколько получателей") : "";
    if (!recipientInput.value || recipientInput.value === lastAutofilledRecipient) recipientInput.value = nextValue;
    lastAutofilledRecipient = nextValue;
  };
  const updateTotal = () => {
    const debtTotal = chosenDebts().reduce((sum, item) => sum + item.amount, 0);
    const extraTotal = readExtraLines().reduce((sum, line) => sum + line.amount, 0);
    const advanceTotal = Number(advanceAmount.value) || 0;
    amountInput.value = (Math.round((debtTotal + extraTotal + advanceTotal) * 100) / 100).toFixed(2);
    extraBody.querySelectorAll("tr[data-extra-line]").forEach(row => {
      const quantity = Number(row.querySelector('[data-line-field="quantity"]').value) || 0;
      const price = Number(row.querySelector('[data-line-field="price"]').value) || 0;
      row.querySelector("output").textContent = money(quantity * price);
    });
  };
  const renderDebts = () => {
    const records = debtRecords();
    debtBody.innerHTML = records.map(item => {
      const key = paymentKey(recipientType, item.id);
      const value = Number(selectedAmounts.get(key)) || 0;
      return `<tr data-debt-row="${escapeHtml(key)}"><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.reference)}</td><td>${escapeHtml(item.referenceNumber)}</td><td>${escapeHtml(formatDate(item.date) || "—")}</td><td>${escapeHtml(item.currency)}</td><td class="bank-payment-debt-balance">${money(item.balance)}</td><td><input type="number" min="0" max="${item.balance}" step="0.01" value="${value ? value.toFixed(2) : ""}" data-pay-amount="${escapeHtml(key)}" aria-label="${escapeHtml(copy("Tasuda", "bankComposerPay"))} ${escapeHtml(item.name)}"></td><td><input type="checkbox" data-pay-select="${escapeHtml(key)}" aria-label="${escapeHtml(copy("Vali", "bankComposerPay"))} ${escapeHtml(item.reference)}" ${value > 0 ? "checked" : ""}></td></tr>`;
    }).join("");
    debtEmpty.hidden = records.length > 0;
    syncRecipient();
    updateTotal();
  };

  const addExtraLine = () => {
    const row = document.createElement("tr");
    row.dataset.extraLine = "true";
    row.innerHTML = `<td><input type="text" data-line-field="description" aria-label="${escapeHtml(copy("Kirjeldus", "bankComposerDescription"))}"></td><td><input type="number" min="0.01" step="0.01" value="1" data-line-field="quantity" aria-label="${escapeHtml(copy("Kogus", "bankComposerQuantity"))}"></td><td><input type="number" min="0" step="0.01" value="0" data-line-field="price" aria-label="${escapeHtml(copy("Hind", "bankComposerPrice"))}"></td><td class="bank-payment-extra-total"><output>0,00</output></td><td><select data-line-field="account" aria-label="${escapeHtml(copy("Konto", "bankComposerAccount"))}"><option value="">—</option><option value="4000">4000</option><option value="2100">2100</option><option value="1000">1000</option></select></td><td><input type="text" data-line-field="object" aria-label="${escapeHtml(copy("Objekt", "bankComposerObject"))}"></td><td><button type="button" class="bank-payment-remove-line" aria-label="${escapeHtml(copy("Eemalda rida", "bankComposerRemoveLine"))}" title="${escapeHtml(copy("Eemalda rida", "bankComposerRemoveLine"))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"></path></svg></button></td>`;
    if (isCash) {
      const description = row.querySelector('[data-line-field="description"]');
      const descriptionArea = document.createElement("textarea");
      descriptionArea.dataset.lineField = "description";
      descriptionArea.rows = 2;
      descriptionArea.setAttribute("aria-label", description.getAttribute("aria-label"));
      description.replaceWith(descriptionArea);
    }
    extraBody.append(row);
  };
  const setRecipientType = type => {
    recipientType = type;
    clientTab.setAttribute("aria-pressed", String(type === "client"));
    supplierTab.setAttribute("aria-pressed", String(type === "supplier"));
    const labelKey = type === "client" ? "bankComposerClientAdvanceLabel" : "bankComposerSupplierAdvanceLabel";
    const placeholderKey = type === "client" ? "bankComposerClientAdvancePlaceholder" : "bankComposerSupplierAdvancePlaceholder";
    const labelText = type === "client" ? "Kliendilt laekunud ettemakse:" : "Hankijale tasutud ettemakse:";
    const placeholderText = type === "client" ? "Kliendi ettemakse kirjeldus" : "Uue ettemakse kirjeldus";
    advanceLabel.dataset.i18n = labelKey;
    advanceLabel.textContent = copy(labelText, labelKey);
    advanceDescription.dataset.i18nPlaceholder = placeholderKey;
    advanceDescription.placeholder = copy(placeholderText, placeholderKey);
    renderDebts();
  };

  clientTab.addEventListener("click", () => setRecipientType("client"));
  supplierTab.addEventListener("click", () => setRecipientType("supplier"));
  searchInput.addEventListener("input", renderDebts);
  filterButton.addEventListener("click", renderDebts);
  advanceAmount.addEventListener("input", updateTotal);
  debtBody.addEventListener("change", event => {
    const checkbox = event.target.closest("input[data-pay-select]");
    if (!checkbox) return;
    const key = checkbox.dataset.paySelect;
    const row = checkbox.closest("tr");
    const amountInput = row.querySelector("input[data-pay-amount]");
    const current = Number(amountInput.value) || 0;
    if (checkbox.checked && current <= 0) amountInput.value = amountInput.max;
    if (!checkbox.checked) amountInput.value = "";
    const amount = Number(amountInput.value) || 0;
    if (amount > 0) selectedAmounts.set(key, amount);
    else selectedAmounts.delete(key);
    syncRecipient();
    updateTotal();
  });
  debtBody.addEventListener("input", event => {
    const input = event.target.closest("input[data-pay-amount]");
    if (!input) return;
    const amount = Number(input.value) || 0;
    const key = input.dataset.payAmount;
    const checkbox = input.closest("tr").querySelector("input[data-pay-select]");
    checkbox.checked = amount > 0;
    if (amount > 0) selectedAmounts.set(key, amount);
    else selectedAmounts.delete(key);
    syncRecipient();
    updateTotal();
  });
  extraBody.addEventListener("input", updateTotal);
  extraBody.addEventListener("change", updateTotal);
  extraBody.addEventListener("click", event => {
    if (!event.target.closest(".bank-payment-remove-line")) return;
    event.target.closest("tr[data-extra-line]").remove();
    updateTotal();
  });
  addLineButton.addEventListener("click", () => { addExtraLine(); updateTotal(); });
  recipientInput.addEventListener("input", () => { if (recipientInput.value !== lastAutofilledRecipient) lastAutofilledRecipient = ""; });
  form.addEventListener("reset", () => {
    selectedAmounts.clear();
    recipientType = isCash ? "client" : "supplier";
    lastAutofilledRecipient = "";
    searchInput.value = "";
    get("bankPaymentReference").value = "";
    get("bankPaymentCurrency").value = "EUR";
    advanceDescription.value = "";
    advanceAmount.value = "";
    extraBody.replaceChildren();
    addExtraLine();
    setRecipientType(isCash ? "client" : "supplier");
    queueMicrotask(updateTotal);
  });

  const currentSelectedRecords = () => chosenDebts().map(item => ({ ...item,
    source: recipientType === "client" ? invoices.find(invoice => String(invoice.id || invoice.number) === item.id) : supplierInvoices.find(invoice => String(invoice.id) === item.id)
  }));
  const onSubmit = async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!can("payments")) { denyAction("payments"); return; }
    const selected = currentSelectedRecords();
    const lines = readExtraLines();
    const advanceValue = Math.round((Number(advanceAmount.value) || 0) * 100) / 100;
    const advanceText = advanceDescription.value.trim();
    const activeLines = lines.filter(line => line.description || line.amount > 0);
    if (activeLines.some(line => !line.description || line.amount <= 0) || (advanceValue > 0 && !advanceText)) {
      showMessage(copy("Täitke iga summaga rea kirjeldus ja hind.", "bankComposerInvalidLine"), true);
      return;
    }
    const amount = Math.round((selected.reduce((sum, item) => sum + item.amount, 0) + activeLines.reduce((sum, line) => sum + line.amount, 0) + advanceValue) * 100) / 100;
    if (!dateInput.value || amount <= 0) {
      showMessage(copy("Valige arve või lisage positiivse summaga rida.", "bankComposerNoPayment"), true);
      return;
    }
    if (selected.some(item => item.amount <= 0 || item.amount > outstandingFor(item.source, recipientType))) {
      showMessage(copy("Makse ületab arve jäägi.", "bankComposerInvalidAmount"), true);
      return;
    }
    const names = [...new Set(selected.map(item => item.name))];
    const recipient = recipientInput.value.trim() || (names.length === 1 ? names[0] : "");
    if (!recipient && !selected.length) {
      showMessage(copy("Sisestage makse saaja.", "bankComposerRecipientRequired"), true);
      recipientInput.focus();
      return;
    }

    const paymentDate = dateInput.value;
    const bankAccount = accountSelect.value;
    if (!bankAccount) {
      showMessage(isCash ? copy("Kassa", "cashPaymentAccount") : copy("Valige pangakonto.", "bankComposerAccountRequired"), true);
      accountSelect.focus();
      return;
    }
    const currency = get("bankPaymentCurrency").value;
    const reference = get("bankPaymentReference").value.trim();
    const cashFields = isCash ? { cashRegister: bankAccount, referenceNumber: get("cashPaymentReference").value.trim() } : {};
    const note = noteInput.value.trim();
    const batchId = crypto.randomUUID();
    const enteredAt = new Date().toISOString();
    const enteredBy = currentInvoiceActorEmail() || "—";
    const incoming = recipientType === "client";
    const records = selected.map(item => {
      const paymentId = crypto.randomUUID();
      return {
      id: paymentId, date: paymentDate, dueDate: "", supplier: item.name,
      category: incoming ? copy("Laekumine kliendilt", "bankComposerIncoming") : copy("Makse hankijale", "bankComposerOutgoing"),
      amount: item.amount, amountDue: 0, currency,
      note: [incoming ? copy("Laekumine kliendilt", "bankComposerIncoming") : copy("Makse hankijale", "bankComposerOutgoing"), reference, `${copy("Arve", "bankComposerInvoice")} ${item.reference}`, note].filter(Boolean).join(" · "),
      bankAccount, paymentMethod, ...cashFields, documentReference: reference, direction: incoming ? "incoming" : "outgoing",
      paymentOrigin: incoming ? "client-invoice-payment" : "supplier-invoice-settlement",
      paymentBatchId: batchId, relatedInvoiceId: item.source.id || item.source.number, relatedInvoicePaymentId: paymentId,
      enteredAt, enteredBy
      };
    });
    for (const line of activeLines) records.push({
      id: crypto.randomUUID(), date: paymentDate, dueDate: "", supplier: recipient || (names.length > 1 ? names.join(", ") : names[0] || "—"),
      category: line.account || (incoming ? copy("Kliendi ettemakse", "bankComposerClientAdvance") : copy("Makse hankijale", "bankComposerOutgoing")),
      amount: line.amount, amountDue: 0, currency,
      note: [incoming ? copy("Laekumine kliendilt", "bankComposerIncoming") : copy("Makse hankijale", "bankComposerOutgoing"), reference, line.description, note].filter(Boolean).join(" · "),
      bankAccount, paymentMethod, ...cashFields, documentReference: reference, direction: incoming ? "incoming" : "outgoing",
      paymentOrigin: `${paymentMethod}-payment-line`, paymentBatchId: batchId,
      account: line.account, object: line.object, quantity: line.quantity, unitPrice: line.price,
      enteredAt, enteredBy
    });
    if (advanceValue > 0) records.push({
      id: crypto.randomUUID(), date: paymentDate, dueDate: "", supplier: recipient || names[0] || "—",
      category: incoming ? copy("Kliendi ettemakse", "bankComposerClientAdvance") : copy("Hankijale tasutud ettemakse", "bankComposerSupplierAdvanceLabel"),
      amount: advanceValue, amountDue: 0, currency,
      note: [incoming ? copy("Laekumine kliendilt", "bankComposerIncoming") : copy("Makse hankijale", "bankComposerOutgoing"), reference, advanceText, note].filter(Boolean).join(" · "),
      bankAccount, paymentMethod, ...cashFields, documentReference: reference, direction: incoming ? "incoming" : "outgoing",
      paymentOrigin: `${paymentMethod}-payment-advance`, paymentBatchId: batchId, enteredAt, enteredBy
    });

    const previousPurchases = purchases.slice();
    const previousSupplierState = selected.filter(() => !incoming).map(item => ({
      invoice: item.source, amountDue: item.source.amountDue, paymentStatus: item.source.paymentStatus,
      paidAt: item.source.paidAt, payments: item.source.payments
    }));
    const previousClientState = selected.filter(() => incoming).map(item => ({
      invoice: item.source, amountDue: item.source.amountDue, paymentStatus: item.source.paymentStatus,
      paidAt: item.source.paidAt, payments: item.source.payments
    }));
    const saveButton = document.querySelector(isCash ? "#cashPaymentEditorView button[type='submit']" : "#purchaseEditorView .invoice-editor-actions button[type='submit']");
    if (saveButton) saveButton.disabled = true;
    try {
      purchases.unshift(...records);
      saveList(STORAGE.purchases, purchases);
      if (incoming) {
        for (const item of selected) {
          const payment = records.find(record => String(record.relatedInvoiceId) === String(item.source.id || item.source.number));
          await recordInvoicePayment(item.source, item.amount, isCash ? "cash" : "transfer", paymentDate, payment?.relatedInvoicePaymentId);
        }
        if (!cloudWorkspace) saveList(STORAGE.invoices, invoices);
      } else if (selected.length) {
        for (const item of selected) {
          const invoice = item.source;
          const remaining = Math.round((outstandingFor(invoice, "supplier") - item.amount) * 100) / 100;
          invoice.amountDue = remaining;
          invoice.paymentStatus = remaining === 0 ? "paid" : "unpaid";
          invoice.paidAt = remaining === 0 ? enteredAt : null;
          const payment = records.find(record => String(record.relatedInvoiceId) === String(invoice.id));
          invoice.payments = [...(invoice.payments || []), { id: payment?.relatedInvoicePaymentId, amount: item.amount, payment_method: isCash ? "cash" : "transfer", paid_at: enteredAt }];
        }
        saveList(STORAGE.supplierInvoices, supplierInvoices);
      }
      renderPurchases();
      renderDashboard();
      renderReport();
      if (!incoming && typeof renderSupplierInvoices === "function") renderSupplierInvoices();
      if (isCash) {
        form.reset();
        dateInput.value = localDate();
        form.dispatchEvent(new Event("cash-payment-saved"));
      } else setPurchaseFormOpen(false, true);
      showMessage(isCash ? copy("Sularahamakse salvestati.", "cashPaymentSaved") : copy("Pangamakse salvestati.", "bankComposerSaved"));
    } catch (error) {
      purchases.splice(0, purchases.length, ...previousPurchases);
      for (const previous of [...previousSupplierState, ...previousClientState]) {
        Object.assign(previous.invoice, {
          amountDue: previous.amountDue, paymentStatus: previous.paymentStatus,
          paidAt: previous.paidAt, payments: previous.payments
        });
      }
      if (incoming && !cloudWorkspace) saveList(STORAGE.invoices, invoices);
      else if (!incoming && selected.length) saveList(STORAGE.supplierInvoices, supplierInvoices);
      try { saveList(STORAGE.purchases, purchases); } catch {}
      console.error(error);
      showMessage(error.message || (isCash ? copy("Не удалось сохранить кассовый платеж.", "paymentImportError") : copy("Pangamakset ei saanud salvestada.", "bankComposerSaveError")), true);
    } finally {
      if (saveButton) saveButton.disabled = false;
      renderDebts();
      updateTotal();
    }
  };
  form.addEventListener("submit", onSubmit, true);
  addExtraLine();
  setRecipientType(isCash ? "client" : "supplier");
  updateCashBalance();
  applyLanguage(language);
  if (isCash) return;

  const withExpensePurchases = callback => {
    const allPurchases = purchases;
    purchases = allPurchases.filter(item => item.direction !== "incoming" && item.paymentOrigin !== "supplier-invoice-settlement");
    try { return callback(); }
    finally { purchases = allPurchases; }
  };
  const baseReportData = reportData;
  reportData = year => withExpensePurchases(() => baseReportData(year));
  const baseBalanceSummary = summarizeBalancePeriod;
  summarizeBalancePeriod = period => withExpensePurchases(() => baseBalanceSummary(period));
  const baseProfitSummary = summarizeProfitPeriod;
  summarizeProfitPeriod = period => withExpensePurchases(() => baseProfitSummary(period));
  const baseLedgerEntries = createLedgerEntries;
  createLedgerEntries = (start, end) => withExpensePurchases(() => baseLedgerEntries(start, end));
  const baseDashboard = renderDashboard;
  renderDashboard = (...args) => {
    baseDashboard(...args);
    const year = new Date().getFullYear();
    const income = invoices.filter(invoice => inYear(invoice.date, year)).reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
    const payouts = purchases.filter(item => item.direction !== "incoming" && inYear(item.date, year)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    get("dashboardBalance").textContent = `${money(income - payouts)} EUR`;
    get("dashboardPayouts").textContent = `${money(payouts)} EUR`;
    const activityRows = [...get("dashboardActivity").rows];
    for (const item of purchases.filter(entry => entry.direction === "incoming")) {
      const description = item.note || item.category || "";
      const row = activityRows.find(candidate => candidate.cells[0]?.textContent === copy("Платеж", "dashboardPaymentType")
        && candidate.cells[2]?.textContent === item.supplier && candidate.cells[3]?.textContent === description);
      if (!row) continue;
      const amountCell = row.cells[4];
      amountCell.textContent = `+${money(Math.abs(Number(item.amount) || 0))} EUR`;
      amountCell.classList.remove("is-outgoing");
      amountCell.classList.add("is-incoming");
    }
  };

  const paymentDialog = document.createElement("dialog");
  paymentDialog.className = "bank-payment-editor-dialog";
  paymentDialog.setAttribute("aria-labelledby", "bankPaymentDialogTitle");
  paymentDialog.innerHTML = `<div class="bank-payment-dialog-heading"><h2 id="bankPaymentDialogTitle" data-i18n="bankComposerDetailsTitle">${copy("Pangamakse üksikasjad", "bankComposerDetailsTitle")}</h2><button type="button" class="bank-payment-dialog-close" aria-label="${copy("Sulge", "bankComposerClose")}">×</button></div><dl class="bank-payment-dialog-details"><div><dt data-i18n="bankComposerRecipient">${copy("Saaja", "bankComposerRecipient")}</dt><dd id="bankPaymentDialogRecipient"></dd></div><div><dt data-i18n="bankComposerDate">${copy("Kuupäev", "bankComposerDate")}</dt><dd id="bankPaymentDialogDate"></dd></div><div><dt data-i18n="bankPaymentAccount">${copy("Pangakonto", "bankPaymentAccount")}</dt><dd id="bankPaymentDialogAccount"></dd></div><div><dt data-i18n="bankComposerTotal">${copy("Makse summa kokku", "bankComposerTotal")}</dt><dd id="bankPaymentDialogAmount"></dd></div><div><dt data-i18n="bankComposerReference">${copy("Alusdokument", "bankComposerReference")}</dt><dd id="bankPaymentDialogReference"></dd></div><div class="bank-payment-dialog-note"><dt data-i18n="bankComposerNote">${copy("Selgitus", "bankComposerNote")}</dt><dd id="bankPaymentDialogNote"></dd></div></dl><form id="bankPaymentEditForm" class="bank-payment-edit-form" hidden><label><span data-i18n="bankComposerRecipient">${copy("Saaja", "bankComposerRecipient")}</span><input id="bankPaymentEditRecipient" type="text" required></label><label><span data-i18n="bankComposerDate">${copy("Kuupäev", "bankComposerDate")}</span><input id="bankPaymentEditDate" type="date" required></label><label><span data-i18n="bankPaymentAccount">${copy("Pangakonto", "bankPaymentAccount")}</span><select id="bankPaymentEditAccount" required></select></label><label><span data-i18n="bankComposerTotal">${copy("Makse summa kokku", "bankComposerTotal")}</span><input id="bankPaymentEditAmount" type="number" min="0.01" step="0.01" required></label><label><span data-i18n="bankComposerCurrency">${copy("Valuuta", "bankComposerCurrency")}</span><select id="bankPaymentEditCurrency"><option value="EUR">EUR</option></select></label><label><span data-i18n="bankComposerReference">${copy("Alusdokument", "bankComposerReference")}</span><input id="bankPaymentEditReference" type="text"></label><label class="bank-payment-edit-note"><span data-i18n="bankComposerNote">${copy("Selgitus", "bankComposerNote")}</span><textarea id="bankPaymentEditNote" rows="3"></textarea></label><p id="bankPaymentAmountLockHint" class="bank-payment-amount-lock" data-i18n="bankComposerAmountLocked" hidden>${copy("Summa on arvega seotud ja siin muutmiseks lukustatud.", "bankComposerAmountLocked")}</p></form><div class="bank-payment-dialog-actions"><button type="button" class="secondary-button bank-payment-dialog-cancel" hidden data-i18n="bankComposerCancelEdit">${copy("Tühista", "bankComposerCancelEdit")}</button><button type="button" class="secondary-button bank-payment-dialog-edit" data-i18n="bankComposerEdit">${copy("Muuda", "bankComposerEdit")}</button><button type="submit" form="bankPaymentEditForm" class="primary-button bank-payment-dialog-save" hidden data-i18n="bankComposerSaveChanges">${copy("Salvesta muudatused", "bankComposerSaveChanges")}</button><button type="button" class="secondary-button bank-payment-dialog-close" data-i18n="bankComposerClose">${copy("Sulge", "bankComposerClose")}</button></div>`;
  document.body.append(paymentDialog);
  const deletePaymentButton = document.createElement("button");
  deletePaymentButton.type = "button";
  deletePaymentButton.className = "secondary-button bank-payment-dialog-delete";
  deletePaymentButton.dataset.i18n = "bankComposerDelete";
  deletePaymentButton.textContent = copy("Kustuta makse", "bankComposerDelete");
  paymentDialog.querySelector(".bank-payment-dialog-actions").prepend(deletePaymentButton);
  const editForm = paymentDialog.querySelector("#bankPaymentEditForm");
  const editFields = {
    recipient: paymentDialog.querySelector("#bankPaymentEditRecipient"),
    date: paymentDialog.querySelector("#bankPaymentEditDate"),
    account: paymentDialog.querySelector("#bankPaymentEditAccount"),
    amount: paymentDialog.querySelector("#bankPaymentEditAmount"),
    currency: paymentDialog.querySelector("#bankPaymentEditCurrency"),
    reference: paymentDialog.querySelector("#bankPaymentEditReference"),
    note: paymentDialog.querySelector("#bankPaymentEditNote")
  };
  editFields.account.innerHTML = accountSelect.innerHTML;
  const detailFields = {
    recipient: paymentDialog.querySelector("#bankPaymentDialogRecipient"),
    date: paymentDialog.querySelector("#bankPaymentDialogDate"),
    account: paymentDialog.querySelector("#bankPaymentDialogAccount"),
    amount: paymentDialog.querySelector("#bankPaymentDialogAmount"),
    reference: paymentDialog.querySelector("#bankPaymentDialogReference"),
    note: paymentDialog.querySelector("#bankPaymentDialogNote")
  };
  let editingPurchaseIndex = -1;
  let paymentAmountLocked = false;
  const closeDialog = () => paymentDialog.close();
  const paymentAccountName = item => String(item.bankAccount || item.bankName || item.bank || accountSelect.value || "—");
  const setDialogEditing = editing => {
    paymentDialog.querySelector(".bank-payment-dialog-details").hidden = editing;
    editForm.hidden = !editing;
    paymentDialog.querySelector(".bank-payment-dialog-edit").hidden = editing || !can("payments");
    deletePaymentButton.hidden = !can("payments");
    paymentDialog.querySelector(".bank-payment-dialog-cancel").hidden = !editing;
    paymentDialog.querySelector(".bank-payment-dialog-save").hidden = !editing;
    for (const input of Object.values(editFields)) input.disabled = !editing;
    editFields.amount.readOnly = paymentAmountLocked;
    editFields.recipient.disabled = !editing || paymentAmountLocked;
    editFields.date.disabled = !editing || paymentAmountLocked;
    editFields.amount.disabled = !editing;
    editFields.currency.disabled = !editing || paymentAmountLocked;
    paymentDialog.querySelector("#bankPaymentAmountLockHint").hidden = !editing || !paymentAmountLocked;
  };
  const fillPaymentDialog = item => {
    const recipient = item.supplier || item.counterparty || item.recipient || "—";
    const date = item.date || "";
    const account = paymentAccountName(item);
    const currency = item.currency || "EUR";
    const reference = item.documentReference || "";
    const note = item.memo || item.note || "";
    const amount = Math.abs(Number(item.amount) || 0);
    const direction = item.direction === "incoming" ? copy("Laekumine kliendilt", "bankComposerIncoming") : copy("Makse hankijale", "bankComposerOutgoing");
    paymentAmountLocked = Boolean(item.relatedInvoiceId);
    paymentDialog.querySelector("#bankPaymentDialogTitle").textContent = `${copy("Pangamakse üksikasjad", "bankComposerDetailsTitle")} · ${editingPurchaseIndex + 1}`;
    detailFields.recipient.textContent = recipient;
    detailFields.date.textContent = formatDate(date) || "—";
    detailFields.account.textContent = account;
    detailFields.amount.textContent = `${money(amount)} ${currency}`;
    detailFields.reference.textContent = reference || "—";
    detailFields.note.textContent = `${direction}${note ? ` · ${note}` : ""}`;
    editFields.recipient.value = recipient === "—" ? "" : recipient;
    editFields.date.value = date;
    editFields.account.value = account;
    editFields.amount.value = amount.toFixed(2);
    if (![...editFields.currency.options].some(option => option.value === currency)) editFields.currency.add(new Option(currency, currency));
    editFields.currency.value = currency;
    editFields.reference.value = reference;
    editFields.note.value = note;
    setDialogEditing(false);
  };
  window.openBankPaymentEditor = index => {
    if (!can("payments")) { denyAction("payments"); return; }
    const item = purchases[index];
    if (!item) return;
    editingPurchaseIndex = index;
    fillPaymentDialog(item);
    paymentDialog.showModal();
  };
  paymentDialog.querySelectorAll(".bank-payment-dialog-close").forEach(button => button.addEventListener("click", closeDialog));
  paymentDialog.querySelector(".bank-payment-dialog-edit").addEventListener("click", () => setDialogEditing(true));
  paymentDialog.querySelector(".bank-payment-dialog-cancel").addEventListener("click", () => {
    const item = purchases[editingPurchaseIndex];
    if (item) fillPaymentDialog(item);
  });
  deletePaymentButton.addEventListener("click", async () => {
    if (!can("payments")) { denyAction("payments"); return; }
    const item = purchases[editingPurchaseIndex];
    if (!item) { closeDialog(); return; }
    if (!window.confirm(copy("Удалить этот платеж? Связанный счет будет пересчитан.", "bankComposerDeleteConfirm"))) return;
    const purchaseIndex = purchases.indexOf(item);
    const previousPurchases = purchases.slice();
    let linkedInvoice = null;
    let linkedState = null;
    let reversedCloudPayment = false;
    deletePaymentButton.disabled = true;
    try {
      if (item.relatedInvoiceId) {
        const paymentId = String(item.relatedInvoicePaymentId || "");
        if (!paymentId) throw new Error(copy("Не удалось найти связанную оплату счета. Платеж не удален.", "bankComposerDeleteLinkedError"));
        if (item.direction === "incoming") {
          linkedInvoice = invoices.find(invoice => String(invoice.id || invoice.number) === String(item.relatedInvoiceId));
          if (!linkedInvoice) throw new Error(copy("Не удалось найти связанную оплату счета. Платеж не удален.", "bankComposerDeleteLinkedError"));
          linkedState = { kind: "client", invoice: linkedInvoice, amountDue: linkedInvoice.amountDue, paymentStatus: linkedInvoice.paymentStatus, paidAt: linkedInvoice.paidAt, payments: linkedInvoice.payments };
          if (cloudWorkspace) {
            const { data, error } = await cloudWorkspace.supabase.rpc("delete_invoice_payment_by_id", {
              p_organization_id: cloudWorkspace.organizationId,
              p_payment_id: paymentId
            });
            if (error) throw error;
            linkedInvoice.amountDue = Number(data);
            reversedCloudPayment = true;
          } else {
            const payment = (linkedInvoice.payments || []).find(entry => String(entry.id) === paymentId);
            if (!payment) throw new Error(copy("Не удалось найти связанную оплату счета. Платеж не удален.", "bankComposerDeleteLinkedError"));
            const restoredAmount = Number(payment.amount) || Math.abs(Number(item.amount) || 0);
            linkedInvoice.amountDue = Math.min(Number(linkedInvoice.total) || 0, Math.round((invoiceOutstandingAmount(linkedInvoice) + restoredAmount) * 100) / 100);
            linkedInvoice.payments = linkedInvoice.payments.filter(entry => String(entry.id) !== paymentId);
          }
          linkedInvoice.paymentStatus = linkedInvoice.amountDue === 0 ? "paid" : "unpaid";
          linkedInvoice.paidAt = linkedInvoice.amountDue === 0 ? linkedState.paidAt || null : null;
          if (!cloudWorkspace) saveList(STORAGE.invoices, invoices);
        } else {
          linkedInvoice = supplierInvoices.find(invoice => String(invoice.id) === String(item.relatedInvoiceId));
          if (!linkedInvoice) throw new Error(copy("Не удалось найти связанную оплату счета. Платеж не удален.", "bankComposerDeleteLinkedError"));
          const payment = (linkedInvoice.payments || []).find(entry => String(entry.id) === paymentId);
          if (!payment) throw new Error(copy("Не удалось найти связанную оплату счета. Платеж не удален.", "bankComposerDeleteLinkedError"));
          linkedState = { kind: "supplier", invoice: linkedInvoice, amountDue: linkedInvoice.amountDue, paymentStatus: linkedInvoice.paymentStatus, paidAt: linkedInvoice.paidAt, payments: linkedInvoice.payments };
          const total = Number(linkedInvoice.amount) || 0;
          const currentDue = Math.max(0, Number(linkedInvoice.amountDue ?? (linkedInvoice.paymentStatus === "paid" ? 0 : total)) || 0);
          linkedInvoice.amountDue = Math.min(total, Math.round((currentDue + (Number(payment.amount) || Math.abs(Number(item.amount) || 0))) * 100) / 100);
          linkedInvoice.paymentStatus = linkedInvoice.amountDue === 0 ? "paid" : "unpaid";
          linkedInvoice.paidAt = linkedInvoice.amountDue === 0 ? linkedState.paidAt || null : null;
          linkedInvoice.payments = linkedInvoice.payments.filter(entry => String(entry.id) !== paymentId);
          saveList(STORAGE.supplierInvoices, supplierInvoices);
        }
      }
      purchases.splice(purchaseIndex, 1);
      saveList(STORAGE.purchases, purchases);
      renderPurchases();
      renderDashboard();
      renderReport();
      if (linkedState?.kind === "supplier" && typeof renderSupplierInvoices === "function") renderSupplierInvoices();
      closeDialog();
      showMessage(copy("Pangamakse kustutati.", "bankComposerDeleted"));
    } catch (error) {
      purchases.splice(0, purchases.length, ...previousPurchases);
      if (linkedState) {
        Object.assign(linkedInvoice, {
          amountDue: linkedState.amountDue, paymentStatus: linkedState.paymentStatus,
          paidAt: linkedState.paidAt, payments: linkedState.payments
        });
        if (linkedState.kind === "supplier") {
          try { saveList(STORAGE.supplierInvoices, supplierInvoices); } catch {}
        } else if (!cloudWorkspace) {
          try { saveList(STORAGE.invoices, invoices); } catch {}
        }
      }
      if (reversedCloudPayment && linkedInvoice) {
        try {
          await cloudWorkspace.supabase.rpc("record_invoice_payment_with_id", {
            p_organization_id: cloudWorkspace.organizationId,
            p_invoice_id: linkedInvoice.id,
            p_payment_id: item.relatedInvoicePaymentId,
            p_amount: Math.abs(Number(item.amount) || 0),
            p_payment_method: "transfer",
            p_paid_at: new Date(`${item.date || localDate()}T12:00:00`).toISOString()
          });
        } catch {}
      }
      try { saveList(STORAGE.purchases, purchases); } catch {}
      console.error(error);
      showMessage(error.message || copy("Pangamakset ei saanud kustutada.", "bankComposerDeleteError"), true);
      renderPurchases();
    } finally {
      deletePaymentButton.disabled = false;
    }
  });
  editForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!can("payments")) { denyAction("payments"); return; }
    const item = purchases[editingPurchaseIndex];
    if (!item) { closeDialog(); return; }
    const nextAmount = Math.round(Number(editFields.amount.value) * 100) / 100;
    if (!editFields.recipient.value.trim() || !editFields.date.value || !editFields.account.value || !Number.isFinite(nextAmount) || nextAmount <= 0) {
      showMessage(copy("Проверьте получателя, счет, дату и сумму платежа.", "bankComposerInvalidEdit"), true);
      return;
    }
    const previous = { ...item };
    Object.assign(item, {
      supplier: paymentAmountLocked ? item.supplier : editFields.recipient.value.trim(),
      date: paymentAmountLocked ? item.date : editFields.date.value,
      bankAccount: editFields.account.value,
      amount: paymentAmountLocked ? item.amount : (Number(item.amount) < 0 ? -nextAmount : nextAmount),
      currency: paymentAmountLocked ? item.currency : editFields.currency.value,
      documentReference: editFields.reference.value.trim(),
      memo: editFields.note.value.trim(),
      note: editFields.note.value.trim(),
      updatedAt: new Date().toISOString(),
      updatedBy: currentInvoiceActorEmail() || "—"
    });
    try {
      saveList(STORAGE.purchases, purchases);
      renderPurchases();
      closeDialog();
      showMessage(copy("Pangamakset muudeti.", "bankComposerUpdated"));
    } catch (error) {
      Object.assign(item, previous);
      showMessage(error.message || copy("Pangamakset ei saanud muuta.", "bankComposerUpdateError"), true);
      renderPurchases();
    }
  });
  const paymentRowsBody = get("purchaseRows");
  paymentRowsBody.addEventListener("click", event => {
    const row = event.target.closest("tr[data-purchase-index]");
    if (row) window.openBankPaymentEditor(Number(row.dataset.purchaseIndex));
  });
  paymentRowsBody.addEventListener("keydown", event => {
    const row = event.target.closest("tr[data-purchase-index]");
    if (!row || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    window.openBankPaymentEditor(Number(row.dataset.purchaseIndex));
  });

  };
  initializeComposer("bank");
  initializeComposer("cash");
})();