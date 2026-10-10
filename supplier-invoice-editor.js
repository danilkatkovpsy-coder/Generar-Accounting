(() => {
  const form = document.getElementById("supplierInvoiceForm");
  const grid = form?.querySelector(".form-grid");
  if (!form || !grid || form.dataset.composerReady === "true") return;
  form.dataset.composerReady = "true";

  Object.assign(ruTexts, {
    supplierInvoiceNew: "Новый счет поставщика",
    supplierInvoiceSectionSupplier: "Поставщик",
    supplierInvoiceSectionDetails: "Реквизиты счета",
    supplierInvoiceSectionItems: "Товары и услуги",
    supplierInvoiceSectionPayments: "Оплаты",
    supplierInvoiceSectionFiles: "Файлы",
    supplierInvoiceSectionExtra: "Дополнительно",
    supplierInvoiceLateFee: "Пени (% в день)",
    supplierInvoiceCurrency: "Валюта",
    supplierInvoiceLine: "Классификация",
    supplierInvoiceClassChoose: "Выберите классификацию", supplierInvoiceClassGoods: "Товар",
    supplierInvoiceClassService: "Услуга", supplierInvoiceClassOther: "Прочее", supplierInvoiceClassExpense: "Расход",
    supplierInvoiceObject: "Объект",
    supplierInvoiceAccount: "Счет учета",
    supplierInvoiceWarehouse: "Склад",
    supplierInvoiceHeaderNote: "Примечание",
    supplierInvoiceAddRow: "Добавить строку",
    supplierInvoiceAddProduct: "Добавить товар/услугу",
    supplierInvoiceAddText: "Добавить текстовую строку",
    supplierInvoiceSubtotal: "Сумма без НДС",
    supplierInvoiceVatTotal: "НДС",
    supplierInvoiceRounding: "Округление",
    supplierInvoiceGrandTotal: "Итого",
    supplierInvoiceAddPayment: "Добавить оплату",
    supplierInvoicePaid: "Оплачено",
    supplierInvoiceUnpaid: "Не оплачено",
    supplierInvoiceFilesLabel: "Перетащите файлы сюда или выберите на компьютере",
    supplierInvoiceAdditionalInfo: "Дополнительная информация",
    supplierInvoiceSaveDraft: "Сохранить черновик",
    supplierInvoicePrint: "Скачать PDF",
    supplierInvoiceCopy: "Копировать",
    supplierInvoicePaymentMethod: "Способ оплаты",
    supplierInvoiceDraftSaved: "Черновик счета сохранен.",
    supplierInvoiceDraftError: "Не удалось сохранить черновик.",
    supplierInvoiceFilesTooLarge: "Общий размер файлов не должен превышать 3 МБ.",
    supplierInvoiceUnit: "Единица",
    supplierInvoiceRemove: "Удалить"
  });
  Object.assign(etTexts, {
    supplierInvoiceNew: "Uus ostuarve",
    supplierInvoiceSectionSupplier: "Tarnija",
    supplierInvoiceSectionDetails: "Arve andmed",
    supplierInvoiceLateFee: "Viivis (% päevas)",
    supplierInvoiceCurrency: "Valuuta",
    supplierInvoiceLine: "Liigitus",
    supplierInvoiceClassChoose: "Vali liigitus", supplierInvoiceClassGoods: "Kaup",
    supplierInvoiceClassService: "Teenus", supplierInvoiceClassOther: "Muu", supplierInvoiceClassExpense: "Kulu",
    supplierInvoiceObject: "Objekt",
    supplierInvoiceAccount: "Konto",
    supplierInvoiceWarehouse: "Ladu",
    supplierInvoiceHeaderNote: "Märkus",
    supplierInvoiceSectionItems: "Artiklid ja teenused",
    supplierInvoiceSectionPayments: "Maksed",
    supplierInvoiceSectionFiles: "Failid",
    supplierInvoiceSectionExtra: "Lisainfo",
    supplierInvoiceAddRow: "Lisa rida",
    supplierInvoiceAddProduct: "Lisa toode/teenus",
    supplierInvoiceAddText: "Lisa tekstirida",
    supplierInvoiceSubtotal: "Summa käibemaksuta",
    supplierInvoiceVatTotal: "Käibemaks",
    supplierInvoiceVatTotal: "Käibemaks",
    supplierInvoiceRounding: "Ümardus",
    supplierInvoiceGrandTotal: "Summa kokku",
    supplierInvoiceAddPayment: "Lisa makse",
    supplierInvoicePaid: "Makstud",
    supplierInvoiceUnpaid: "Maksmata",
    supplierInvoiceFilesLabel: "Lohista failid siia või vali arvutist",
    supplierInvoiceAdditionalInfo: "Lisainfo",
    supplierInvoiceSaveDraft: "Salvesta mustand",
    supplierInvoicePrint: "Laadi PDF alla",
    supplierInvoiceCopy: "Kopeeri",
    supplierInvoicePaymentMethod: "Makseviis",
    supplierInvoiceDraftSaved: "Arve mustand salvestati.",
    supplierInvoiceDraftError: "Arve mustandit ei saanud salvestada.",
    supplierInvoiceFilesTooLarge: "Failide kogumaht ei tohi ületada 3 MB.",
    supplierInvoiceUnit: "Ühik",
    supplierInvoiceRemove: "Eemalda"
  });

  const byId = id => document.getElementById(id);
  const supplierField = byId("supplierPicker").closest(".field");
  const numberField = byId("supplierInvoiceNumber").closest(".field");
  const dateField = byId("supplierInvoiceDate").closest(".field");
  const dueField = byId("supplierInvoiceDueDate").closest(".field");
  const amountField = byId("supplierInvoiceAmount").closest(".field");
  const descriptionField = byId("supplierInvoiceDescription").closest(".field");
  const fileField = byId("supplierInvoiceFile").closest(".field");
  const noteField = byId("supplierInvoiceNote").closest(".field");
  const actionField = grid.querySelector(".supplier-invoice-actions");
  const amountInput = byId("supplierInvoiceAmount");
  const lineRoot = document.createElement("div");
  const paymentRoot = document.createElement("div");
  const paymentSource = new WeakMap();
  const fileList = document.createElement("div");
  const draftKey = () => `accounting-supplier-invoice-draft-v1:${activeCompanyId}`;
  let attachments = [];
  let fileRead = Promise.resolve();
  let legacyPaidAmount = 0;

  const makeSection = (step, key, title, extraClass = "") => {
    const section = document.createElement("section");
    section.className = `supplier-invoice-card ${extraClass}`.trim();
    const heading = document.createElement("h3");
    heading.innerHTML = `<span class="supplier-invoice-step">${step}</span><span data-i18n="${key}">${title}</span>`;
    section.append(heading);
    return section;
  };
  const makeField = (key, label, id, type = "text", options = "", extraClass = "") => {
    const wrapper = document.createElement("div");
    wrapper.className = `field ${extraClass}`.trim();
    const caption = document.createElement("label");
    caption.htmlFor = id;
    caption.dataset.i18n = key;
    caption.textContent = label;
    const control = document.createElement(type === "textarea" ? "textarea" : type === "select" ? "select" : "input");
    control.id = id;
    if (type === "select") control.innerHTML = options;
    else if (type !== "textarea") control.type = type;
    wrapper.append(caption, control);
    return wrapper;
  };
  const heading = byId("supplierInvoiceFormTitle");
  const top = document.createElement("div");
  top.className = "supplier-invoice-top";
  const supplierCard = makeSection("01", "supplierInvoiceSectionSupplier", "Tarnija", "supplier-invoice-supplier");
  const supplierAddress = document.createElement("p");
  supplierAddress.className = "supplier-invoice-supplier-address";
  supplierAddress.id = "supplierInvoiceSupplierAddress";
  supplierCard.append(supplierField, supplierAddress);
  const detailsCard = makeSection("02", "supplierInvoiceSectionDetails", "Arve andmed", "supplier-invoice-details");
  const details = document.createElement("div");
  details.className = "supplier-invoice-details-grid";
  for (const field of [numberField, dateField, dueField]) field.classList.remove("wide");
  descriptionField.classList.remove("wide");
  descriptionField.classList.add("detail-wide");
  byId("supplierInvoiceDescription").placeholder = "Otsi või kirjuta...";
  details.append(
    numberField,
    dateField,
    dueField,
    makeField("supplierInvoiceLateFee", "Viivis (% päevas)", "supplierInvoiceLateFee", "number"),
    makeField("supplierInvoiceCurrency", "Valuuta", "supplierInvoiceCurrency", "select", '<option value="EUR">EUR - Euro</option>'),
    makeField("supplierInvoiceLine", "Liigitus", "supplierInvoiceLine", "select", '<option value="" data-i18n="supplierInvoiceClassChoose">Vali liigitus</option><option value="goods" data-i18n="supplierInvoiceClassGoods">Kaup</option><option value="service" data-i18n="supplierInvoiceClassService">Teenus</option><option value="expense" data-i18n="supplierInvoiceClassExpense">Kulu</option><option value="other" data-i18n="supplierInvoiceClassOther">Muu</option>'),
    makeField("supplierInvoiceObject", "Objekt", "supplierInvoiceObject", "text", "", "detail-wide"),
    makeField("supplierInvoiceAccount", "Konto", "supplierInvoiceAccount", "select", '<option value="">Vali konto</option><option value="4000">4000 · Kaubad</option><option value="4200">4200 · Teenused</option><option value="4900">4900 · Muud kulud</option>', "detail-wide"),
    makeField("supplierInvoiceWarehouse", "Ladu", "supplierInvoiceWarehouse", "text", "", "detail-wide"),
    descriptionField
  );
  detailsCard.append(details);
  details.querySelector("#supplierInvoiceLateFee").min = "0";
  details.querySelector("#supplierInvoiceLateFee").step = "0.01";
  top.append(supplierCard, detailsCard);

  const itemsCard = makeSection("03", "supplierInvoiceSectionItems", "Artiklid ja teenused", "supplier-invoice-items");
  itemsCard.querySelector("h3").classList.add("supplier-invoice-items-heading");
  const itemActions = document.createElement("div");
  itemActions.className = "supplier-invoice-item-actions";
  itemActions.innerHTML = '<button class="secondary-button" id="supplierInvoiceAddRow" type="button">＋ <span data-i18n="supplierInvoiceAddRow">Lisa rida</span></button><button class="secondary-button" id="supplierInvoiceAddProduct" type="button">◇ <span data-i18n="supplierInvoiceAddProduct">Lisa toode/teenus</span></button><button class="secondary-button" id="supplierInvoiceAddText" type="button">▤ <span data-i18n="supplierInvoiceAddText">Lisa tekstirida</span></button>';
  itemsCard.querySelector("h3").append(itemActions);
  lineRoot.id = "supplierInvoiceItemRows";
  const lines = document.createElement("div");
  lines.className = "supplier-invoice-lines-scroll";
  lines.innerHTML = '<div class="supplier-invoice-line-grid supplier-invoice-line-head"><span>Artikkel</span><span>Kirjeldus</span><span>Kogus</span><span>Ühik</span><span>Hind, EUR</span><span>Allahindlus %</span><span>KM %</span><span>Summa, EUR</span><span>Konto</span><span>Objekt</span><span></span></div>';
  lines.append(lineRoot);
  const addInline = document.createElement("button");
  addInline.type = "button";
  addInline.id = "supplierInvoiceAddInline";
  addInline.className = "supplier-invoice-add-line";
  addInline.innerHTML = '＋ <span data-i18n="supplierInvoiceAddRow">Lisa rida</span>';
  const totals = document.createElement("div");
  totals.className = "supplier-invoice-totals";
  totals.innerHTML = '<div class="supplier-invoice-total-row"><span data-i18n="supplierInvoiceSubtotal">Summa käibemaksuta</span><strong id="supplierInvoiceSubtotal">0,00 EUR</strong></div><div class="supplier-invoice-total-row"><span data-i18n="supplierInvoiceVatTotal">Käibemaks 22%</span><strong id="supplierInvoiceVatTotal">0,00 EUR</strong></div><label class="supplier-invoice-rounding"><span data-i18n="supplierInvoiceRounding">Ümardus</span><input id="supplierInvoiceRounding" type="number" step="0.01" value="0.00"></label><div class="supplier-invoice-total-row supplier-invoice-grand-total"><span data-i18n="supplierInvoiceGrandTotal">Summa kokku</span><strong id="supplierInvoiceGrandTotal">0,00 EUR</strong></div>';
  itemsCard.append(lines, addInline, totals);

  const finance = document.createElement("div");
  finance.className = "supplier-invoice-finance";
  const paymentsCard = makeSection("04", "supplierInvoiceSectionPayments", "Maksed", "supplier-invoice-payments");
  const paymentHead = document.createElement("div");
  paymentHead.className = "supplier-payment-head";
  paymentHead.innerHTML = "<span>Kuupäev</span><span>Makseviis</span><span>Summa, EUR</span><span></span>";
  paymentRoot.id = "supplierInvoicePayments";
  const addPaymentButton = document.createElement("button");
  addPaymentButton.type = "button";
  addPaymentButton.id = "supplierInvoiceAddPayment";
  addPaymentButton.className = "supplier-invoice-add-line";
  addPaymentButton.innerHTML = '＋ <span data-i18n="supplierInvoiceAddPayment">Lisa makse</span>';
  const paymentSummary = document.createElement("div");
  paymentSummary.className = "supplier-invoice-payment-summary";
  paymentSummary.innerHTML = '<span><span data-i18n="supplierInvoicePaid">Makstud</span>: <strong id="supplierInvoicePaid">0,00 EUR</strong></span><span><span data-i18n="supplierInvoiceUnpaid">Maksmata</span>: <strong id="supplierInvoiceUnpaid">0,00 EUR</strong></span>';
  paymentsCard.append(paymentHead, paymentRoot, addPaymentButton, paymentSummary);

  const filesCard = makeSection("05", "supplierInvoiceSectionFiles", "Failid", "supplier-invoice-files");
  const fileInput = byId("supplierInvoiceFile");
  fileInput.multiple = true;
  fileInput.classList.add("supplier-invoice-file-input");
  const fileStatus = byId("supplierInvoiceFileStatus");
  const drop = document.createElement("label");
  drop.className = "supplier-invoice-drop";
  drop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4m-4 4 4-4 4 4"></path><path d="M5 14v5h14v-5"></path></svg><span data-i18n="supplierInvoiceFilesLabel">Lohista failid siia või vali arvutist</span>';
  drop.append(fileInput);
  fileList.id = "supplierInvoiceFileList";
  fileList.className = "supplier-invoice-file-list";
  filesCard.append(drop, fileStatus, fileList);

  const extraCard = makeSection("06", "supplierInvoiceSectionExtra", "Lisainfo", "supplier-invoice-extra");
  noteField.classList.remove("full");
  noteField.querySelector("label").dataset.i18n = "supplierInvoiceAdditionalInfo";
  noteField.querySelector("textarea").placeholder = "Lisa märkus...";
  extraCard.append(noteField);
  finance.append(paymentsCard, filesCard, extraCard);

  amountInput.type = "hidden";
  amountInput.required = false;
  amountField.hidden = true;
  grid.className = "supplier-invoice-composer";
  grid.replaceChildren(top, itemsCard, finance, amountField, actionField);
  const editorHeading = document.querySelector("#supplierInvoiceEditorView > .view-heading");
  if (editorHeading && heading.parentElement !== editorHeading) editorHeading.prepend(heading);
  else if (!editorHeading) form.insertBefore(heading, grid);
  byId("supplierInvoiceLateFee").value = "0.05";

  const number = value => {
    const parsed = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const euro = value => `${money(number(value))} EUR`;
  const accountChoices = () => {
    try {
      const accounts = getLedgerAccounts().filter(account => account.type === "expense");
      if (accounts.length) return accounts.map(account => `<option value="${escapeHtml(account.code)}">${escapeHtml(account.code)} · ${escapeHtml(account.label || account.name || "")}</option>`).join("");
    } catch {}
    return '<option value="4000">4000 · Kaubad</option><option value="4200">4200 · Teenused</option><option value="4900">4900 · Muud kulud</option>';
  };
  const articleChoices = () => (Array.isArray(articleEntries) ? articleEntries : []).map(article => `<option value="${escapeHtml(article.number)}">${escapeHtml(formatArticleNumber(article.number))} · ${escapeHtml(article.name)}</option>`).join("");

  const makeRemove = label => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "supplier-invoice-remove";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.textContent = "×";
    return button;
  };
  const recalculate = () => {
    let subtotal = 0;
    let taxTotal = 0;
    for (const row of lineRoot.querySelectorAll(".supplier-invoice-line:not(.supplier-invoice-text-line)")) {
      const quantity = number(row.querySelector(".supplier-line-quantity").value);
      const price = number(row.querySelector(".supplier-line-price").value);
      const discount = Math.min(100, Math.max(0, number(row.querySelector(".supplier-line-discount").value)));
      const rate = number(row.querySelector(".supplier-line-tax").value);
      const net = quantity * price * (1 - discount / 100);
      const tax = net * rate / 100;
      subtotal += net;
      taxTotal += tax;
      row.querySelector(".supplier-invoice-line-total").textContent = money(net + tax);
    }
    const rounding = number(byId("supplierInvoiceRounding").value);
    const total = Math.max(0, subtotal + taxTotal + rounding);
    const paid = legacyPaidAmount + [...paymentRoot.querySelectorAll(".supplier-payment-amount")].reduce((sum, input) => sum + number(input.value), 0);
    byId("supplierInvoiceSubtotal").textContent = euro(subtotal);
    byId("supplierInvoiceVatTotal").textContent = euro(taxTotal);
    byId("supplierInvoiceGrandTotal").textContent = euro(total);
    byId("supplierInvoicePaid").textContent = euro(paid);
    byId("supplierInvoiceUnpaid").textContent = euro(Math.max(0, total - paid));
    amountInput.value = total.toFixed(2);
  };

  const addLine = (item = {}) => {
    const row = document.createElement("div");
    row.className = "supplier-invoice-line-grid supplier-invoice-line";
    row.innerHTML = `<select class="supplier-line-article" aria-label="Artikkel"><option value="">Vali artikkel</option>${articleChoices()}</select><input class="supplier-line-description" aria-label="Kirjeldus" placeholder="Kirjeldus" value="${escapeHtml(item.description || "")}"><input class="supplier-line-quantity" aria-label="Kogus" type="number" min="0" step="0.01" value="${escapeHtml(item.quantity ?? 1)}"><select class="supplier-line-unit" aria-label="${translateCopy("Единица","supplierInvoiceUnit")}"><option value="tk">tk</option><option value="h">h</option><option value="kuu">kuu</option></select><input class="supplier-line-price" aria-label="Hind" type="number" min="0" step="0.01" value="${escapeHtml(item.price ?? "")}"><input class="supplier-line-discount" aria-label="Allahindlus %" type="number" min="0" max="100" step="0.01" value="${escapeHtml(item.discountPercent ?? 0)}"><select class="supplier-line-tax" aria-label="KM %"><option value="0">0%</option><option value="9">9%</option><option value="22">22%</option><option value="24">24%</option></select><span class="supplier-invoice-line-total">0,00</span><select class="supplier-line-account" aria-label="Konto"><option value="">Vali konto</option>${accountChoices()}</select><input class="supplier-line-object" aria-label="Objekt" placeholder="Vali objekt" value="${escapeHtml(item.objectName || "")}"></div>`;
    row.append(makeRemove(translateCopy("Удалить","supplierInvoiceRemove")));
    row.querySelector(".supplier-line-article").value = String(item.articleNumber || "");
    row.querySelector(".supplier-line-unit").value = item.unit || "tk";
    row.querySelector(".supplier-line-tax").value = String(item.taxRate ?? 22);
    row.querySelector(".supplier-line-account").value = String(item.accountCode || "");
    row.addEventListener("input", recalculate);
    row.addEventListener("change", event => {
      if (event.target.matches(".supplier-line-article")) {
        const article = articleEntries.find(entry => String(entry.number) === event.target.value);
        if (article) row.querySelector(".supplier-line-description").value = article.name;
      }
      recalculate();
    });
    row.querySelector(".supplier-invoice-remove").addEventListener("click", () => {
      if (lineRoot.querySelectorAll(".supplier-invoice-line:not(.supplier-invoice-text-line)").length <= 1) {
        row.querySelector(".supplier-line-description").value = "";
        row.querySelector(".supplier-line-quantity").value = "1";
        row.querySelector(".supplier-line-price").value = "";
        row.querySelector(".supplier-line-discount").value = "0";
        row.querySelector(".supplier-line-tax").value = "22";
      } else row.remove();
      recalculate();
    });
    lineRoot.append(row);
    recalculate();
    return row;
  };
  const addTextLine = (text = "") => {
    const row = document.createElement("div");
    row.className = "supplier-invoice-line-grid supplier-invoice-line supplier-invoice-text-line";
    row.innerHTML = `<textarea class="supplier-line-text" aria-label="${translateCopy("Текстовая строка","supplierInvoiceAddText")}" placeholder="${translateCopy("Текстовая строка","supplierInvoiceAddText")}">${escapeHtml(text)}</textarea>`;
    row.append(makeRemove(translateCopy("Удалить","supplierInvoiceRemove")));
    row.querySelector(".supplier-line-text").addEventListener("input", recalculate);
    row.querySelector(".supplier-invoice-remove").addEventListener("click", () => row.remove());
    lineRoot.append(row);
  };
  const addPayment = (payment = {}) => {
    const row = document.createElement("div");
    row.className = "supplier-payment-row";
    paymentSource.set(row, { ...payment });
    row.innerHTML = `<input class="supplier-payment-date" type="date" aria-label="Kuupäev" value="${escapeHtml(payment.date || String(payment.paid_at || "").slice(0, 10) || localDate())}"><select class="supplier-payment-method" aria-label="${translateCopy("Способ оплаты","supplierInvoicePaymentMethod")}"><option value="bank">Pangaülekanne</option><option value="cash">Sularaha</option><option value="card">Kaart</option></select><input class="supplier-payment-amount" type="number" min="0" step="0.01" aria-label="${translateCopy("Сумма, EUR","amountEurLabel")}" value="${escapeHtml(payment.amount ?? 0)}">`;
    row.append(makeRemove(translateCopy("Удалить","supplierInvoiceRemove")));
    row.querySelector(".supplier-payment-method").value = payment.method || (payment.payment_method === "transfer" ? "bank" : payment.payment_method) || "bank";
    row.addEventListener("input", recalculate);
    row.addEventListener("change", recalculate);
    row.querySelector(".supplier-invoice-remove").addEventListener("click", () => { row.remove(); recalculate(); });
    paymentRoot.append(row);
    recalculate();
  };
  const collect = () => {
    const items = [...lineRoot.querySelectorAll(".supplier-invoice-line")].map(row => row.classList.contains("supplier-invoice-text-line")
      ? { isTextLine: true, description: row.querySelector(".supplier-line-text").value.trim() }
      : {
          articleNumber: row.querySelector(".supplier-line-article").value,
          description: row.querySelector(".supplier-line-description").value.trim(),
          quantity: number(row.querySelector(".supplier-line-quantity").value),
          unit: row.querySelector(".supplier-line-unit").value,
          price: number(row.querySelector(".supplier-line-price").value),
          discountPercent: number(row.querySelector(".supplier-line-discount").value),
          taxRate: number(row.querySelector(".supplier-line-tax").value),
          accountCode: row.querySelector(".supplier-line-account").value,
          objectName: row.querySelector(".supplier-line-object").value.trim()
        });
    const payments = [...paymentRoot.querySelectorAll(".supplier-payment-row")].map(row => {
      const source = paymentSource.get(row) || {};
      const date = row.querySelector(".supplier-payment-date").value;
      const method = row.querySelector(".supplier-payment-method").value;
      const payment = { ...source, date, method, amount: number(row.querySelector(".supplier-payment-amount").value) };
      if ("payment_method" in source) payment.payment_method = method === "bank" ? "transfer" : method;
      if ("paid_at" in source) payment.paid_at = String(source.paid_at || "").slice(0, 10) === date ? source.paid_at : date ? new Date(`${date}T12:00:00`).toISOString() : null;
      return payment;
    });
    const subtotal = items.filter(item => !item.isTextLine).reduce((sum, item) => sum + item.quantity * item.price * (1 - Math.min(100, Math.max(0, item.discountPercent)) / 100), 0);
    const taxTotal = items.filter(item => !item.isTextLine).reduce((sum, item) => sum + item.quantity * item.price * (1 - Math.min(100, Math.max(0, item.discountPercent)) / 100) * item.taxRate / 100, 0);
    const rounding = number(byId("supplierInvoiceRounding").value);
    const amount = Math.round(Math.max(0, subtotal + taxTotal + rounding) * 100) / 100;
    const paid = legacyPaidAmount + payments.reduce((sum, item) => sum + item.amount, 0);
    return {
      items, payments, subtotal, taxTotal, rounding, amount,
      amountDue: Math.round(Math.max(0, amount - paid) * 100) / 100, currency: "EUR",
      lateFeePercent: number(byId("supplierInvoiceLateFee").value),
      invoiceLine: byId("supplierInvoiceLine").value,
      objectName: byId("supplierInvoiceObject").value.trim(),
      accountCode: byId("supplierInvoiceAccount").value,
      warehouseName: byId("supplierInvoiceWarehouse").value.trim(),
      attachments: attachments.map(file => ({ ...file }))
    };
  };
  const renderFiles = () => {
    fileList.replaceChildren();
    for (const [index, file] of attachments.entries()) {
      const row = document.createElement("div");
      row.className = "supplier-invoice-file-row";
      const name = document.createElement("span");
      name.className = "supplier-invoice-file-name";
      name.textContent = file.name;
      const remove = makeRemove(translateCopy("Удалить файл","supplierInvoiceRemove"));
      remove.addEventListener("click", () => { attachments.splice(index, 1); renderFiles(); });
      row.append(name, remove);
      fileList.append(row);
    }
    fileStatus.textContent = attachments.length ? attachments.map(file => file.name).join(", ") : translateCopy("Файл не прикреплен. Максимальный размер — 3 МБ.", "noSupplierFile");
  };
  const readFile = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, data: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  fileInput.addEventListener("change", () => {
    const selected = [...fileInput.files];
    if (!selected.length) return;
    fileRead = Promise.all(selected.map(readFile)).then(files => {
      const size = attachments.reduce((sum, file) => sum + Number(file.size || 0), 0) + files.reduce((sum, file) => sum + file.size, 0);
      if (size > 3 * 1024 * 1024) {
        showMessage(translateCopy("Общий размер файлов не должен превышать 3 МБ.", "supplierInvoiceFilesTooLarge"), true);
        return;
      }
      attachments.push(...files);
      renderFiles();
    }).catch(() => showMessage(translateCopy("Не удалось прочитать файл.", "supplierInvoiceFileReadError"), true)).finally(() => { fileInput.value = ""; });
  });
  const dropZone = fileInput.closest(".supplier-invoice-drop");
  dropZone.addEventListener("dragover", event => { event.preventDefault(); dropZone.classList.add("is-dragging"); });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-dragging"));
  dropZone.addEventListener("drop", event => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
    const files = [...(event.dataTransfer?.files || [])];
    if (!files.length) return;
    fileRead = Promise.all(files.map(readFile)).then(added => {
      const size = attachments.reduce((sum, file) => sum + Number(file.size || 0), 0) + added.reduce((sum, file) => sum + file.size, 0);
      if (size > 3 * 1024 * 1024) { showMessage(translateCopy("Общий размер файлов не должен превышать 3 МБ.", "supplierInvoiceFilesTooLarge"), true); return; }
      attachments.push(...added);
      renderFiles();
    }).catch(() => showMessage(translateCopy("Не удалось прочитать файл.", "supplierInvoiceFileReadError"), true));
  });

  byId("supplierInvoiceAddRow").addEventListener("click", () => addLine());
  byId("supplierInvoiceAddInline").addEventListener("click", () => addLine());
  byId("supplierInvoiceAddProduct").addEventListener("click", () => addLine().querySelector(".supplier-line-article").focus());
  byId("supplierInvoiceAddText").addEventListener("click", () => addTextLine());
  byId("supplierInvoiceAddPayment").addEventListener("click", () => addPayment());
  byId("supplierInvoiceRounding").addEventListener("input", recalculate);
  byId("supplierPicker").addEventListener("change", () => {
    const supplier = suppliers.find(item => item.id === byId("supplierPicker").value);
    supplierAddress.textContent = supplier ? [supplier.address, supplier.reg].filter(Boolean).join(" · ") : "";
  });
  byId("supplierInvoiceDate").addEventListener("change", () => {
    const date = new Date(`${byId("supplierInvoiceDate").value}T12:00:00`);
    if (Number.isNaN(date.valueOf())) return;
    date.setDate(date.getDate() + 14);
    byId("supplierInvoiceDueDate").value = date.toISOString().slice(0, 10);
  });

  const collectDraft = () => ({
    supplierId: byId("supplierPicker").value,
    supplierName: byId("supplierPicker").selectedOptions[0]?.textContent || "",
    invoiceNumber: byId("supplierInvoiceNumber").value.trim(),
    date: byId("supplierInvoiceDate").value,
    dueDate: byId("supplierInvoiceDueDate").value,
    description: byId("supplierInvoiceDescription").value.trim(),
    note: byId("supplierInvoiceNote").value.trim(),
    ...collect()
  });
  const applyDraft = draft => {
    renderSupplierPicker(draft.supplierId || "", draft.supplierName || "");
    const selectedSupplier = suppliers.find(item => item.id === draft.supplierId);
    supplierAddress.textContent = selectedSupplier ? [selectedSupplier.address, selectedSupplier.reg].filter(Boolean).join(" · ") : "";
    byId("supplierInvoiceNumber").value = draft.invoiceNumber || "";
    byId("supplierInvoiceDate").value = draft.date || localDate();
    byId("supplierInvoiceDueDate").value = draft.dueDate || "";
    byId("supplierInvoiceDescription").value = draft.description || "";
    byId("supplierInvoiceNote").value = draft.note || "";
    byId("supplierInvoiceLateFee").value = draft.lateFeePercent ?? "0.05";
    byId("supplierInvoiceLine").value = draft.invoiceLine || "";
    byId("supplierInvoiceObject").value = draft.objectName || "";
    byId("supplierInvoiceAccount").value = draft.accountCode || "";
    byId("supplierInvoiceWarehouse").value = draft.warehouseName || "";
    byId("supplierInvoiceRounding").value = draft.rounding ?? "0.00";
    const existingPaid = Math.max(0, number(draft.amount) - number(draft.amountDue ?? (draft.paymentStatus === "paid" || draft.status === "paid" ? 0 : draft.amount)));
    const recordedPaid = (draft.payments || []).reduce((sum, payment) => sum + number(payment.amount), 0);
    legacyPaidAmount = Math.max(0, existingPaid - recordedPaid);
    const fallbackItems = number(draft.amount) > 0
      ? [{ description: draft.description || draft.invoiceNumber || "", quantity: 1, price: Math.max(0, number(draft.amount) - number(draft.rounding)), taxRate: 0, accountCode: draft.accountCode || "", objectName: draft.objectName || "" }]
      : [{}, {}];
    lineRoot.replaceChildren();
    (draft.items?.length ? draft.items : fallbackItems).forEach(item => item.isTextLine ? addTextLine(item.description) : addLine(item));
    paymentRoot.replaceChildren();
    (draft.payments?.length ? draft.payments : [{}]).forEach(addPayment);
    attachments = (draft.attachments || []).map(file => ({ ...file }));
    renderFiles();
    recalculate();
  };
  const originalReset = resetSupplierInvoiceForm;
  resetSupplierInvoiceForm = () => {
    originalReset();
    legacyPaidAmount = 0;
    supplierAddress.textContent = "";
    lineRoot.replaceChildren();
    addLine();
    addLine();
    paymentRoot.replaceChildren();
    addPayment();
    attachments = [];
    byId("supplierInvoiceLateFee").value = "0.05";
    byId("supplierInvoiceLine").value = "";
    byId("supplierInvoiceObject").value = "";
    byId("supplierInvoiceAccount").value = "";
    byId("supplierInvoiceWarehouse").value = "";
    byId("supplierInvoiceRounding").value = "0.00";
    renderFiles();
    recalculate();
  };
  const originalEdit = editSupplierInvoice;
  editSupplierInvoice = id => {
    originalEdit(id);
    const invoice = supplierInvoices.find(item => item.id === id);
    if (!invoice) return;
    applyDraft({ ...invoice, items: invoice.items, payments: invoice.payments, attachments: invoice.attachments?.length ? invoice.attachments : invoice.data ? [{ id: invoice.id, name: invoice.fileName || "Invoice", type: invoice.fileType || "application/pdf", size: 0, data: invoice.data }] : [] });
  };

  const registerRows = byId("supplierInvoiceRows");
  const decorateInvoiceRows = () => {
    registerRows.querySelectorAll("tr[data-supplier-invoice-id]").forEach(row => {
      row.classList.add("supplier-invoice-open-row");
      row.tabIndex = 0;
      const invoice = supplierInvoices.find(item => String(item.id) === row.dataset.supplierInvoiceId);
      row.setAttribute("aria-label", `${translateCopy("Изменить счет поставщика", "supplierInvoiceRowEdit")} ${invoice?.invoiceNumber || ""}`);
    });
  };
  const baseRenderSupplierInvoices = renderSupplierInvoices;
  renderSupplierInvoices = (...args) => { baseRenderSupplierInvoices(...args); decorateInvoiceRows(); };
  const openInvoiceRow = row => {
    if (denyAction("expenses")) return;
    editSupplierInvoice(row.dataset.supplierInvoiceId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  registerRows.addEventListener("click", event => {
    if (event.target.closest("a,button,input,select,textarea,label,[contenteditable]")) return;
    const row = event.target.closest("tr[data-supplier-invoice-id]");
    if (row) openInvoiceRow(row);
  });
  registerRows.addEventListener("keydown", event => {
    const row = event.target.closest("tr[data-supplier-invoice-id]");
    if (!row || event.target !== row || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    openInvoiceRow(row);
  });
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(decorateInvoiceRows)));
  decorateInvoiceRows();

  const saveDraft = () => {
    try {
      localStorage.setItem(draftKey(), JSON.stringify(collectDraft()));
      showMessage(translateCopy("Черновик счета сохранен.", "supplierInvoiceDraftSaved"));
    } catch {
      showMessage(translateCopy("Не удалось сохранить черновик.", "supplierInvoiceDraftError"), true);
    }
  };
  Object.assign(ruTexts, {
    supplierPostingTitle: "Проводка", supplierPostingDocument: "Основание", supplierPostingCurrency: "Валюта",
    supplierPostingAccount: "Счет учета", supplierPostingDebit: "Дебет", supplierPostingCredit: "Кредит",
    supplierPostingDescription: "Описание", supplierPostingObject: "Объект", supplierPostingTotal: "Итого",
    supplierPostingFiles: "Файлы", supplierPostingNote: "Примечание", supplierPostingEdit: "Изменить",
    supplierPostingClose: "Закрыть", supplierPostingNoFiles: "Файлы не прикреплены.",
    supplierPostingEmpty: "Проводка отсутствует.", supplierPostingFileError: "Не удалось скачать файл.",
    supplierPostingPrint: "Скачать PDF"
  });
  Object.assign(etTexts, {
    supplierPostingTitle: "Kanne", supplierPostingDocument: "Alusdokument", supplierPostingCurrency: "Valuuta",
    supplierPostingAccount: "Konto", supplierPostingDebit: "Deebet", supplierPostingCredit: "Kreedit",
    supplierPostingDescription: "Kirjeldus", supplierPostingObject: "Objekt", supplierPostingTotal: "Kokku",
    supplierPostingFiles: "Failid", supplierPostingNote: "Siseinfo", supplierPostingEdit: "Muuda",
    supplierPostingClose: "Sulge", supplierPostingNoFiles: "Faile pole lisatud.",
    supplierPostingEmpty: "Kanne puudub.", supplierPostingFileError: "Faili ei saanud alla laadida.",
    supplierPostingPrint: "Laadi PDF alla"
  });
  const postingCopy = key => translateCopy(key, key);
  const postingIcon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${{
    ledger: '<path d="M4 3h16v18H4zM9 3v18M12 7h5M12 12h5M12 17h5"></path>',
    pdf: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"></path>',
    edit: '<path d="m4 16-1 5 5-1L20 8a2.1 2.1 0 0 0-3-3L4 16zM14 6l4 4"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"></path>'
  }[name]}</svg>`;
  const postingDialog = document.createElement("dialog");
  postingDialog.id = "supplierPostingDialog";
  postingDialog.className = "supplier-posting-dialog";
  postingDialog.setAttribute("aria-labelledby", "supplierPostingTitle");
  postingDialog.innerHTML = `<header class="supplier-posting-heading"><div><h2 id="supplierPostingTitle" data-i18n="supplierPostingTitle">${postingCopy("supplierPostingTitle")}</h2><p id="supplierPostingAudit" hidden></p></div><div class="supplier-posting-actions"><button type="button" class="secondary-button" id="supplierPostingPdf">${postingIcon("pdf")}<span>PDF</span></button><button type="button" class="secondary-button" id="supplierPostingEdit">${postingIcon("edit")}<span data-i18n="supplierPostingEdit">${postingCopy("supplierPostingEdit")}</span></button><button type="button" class="supplier-posting-close" id="supplierPostingClose" aria-label="${postingCopy("supplierPostingClose")}">${postingIcon("close")}</button></div></header><div class="supplier-posting-body"><p id="supplierPostingError" class="supplier-posting-error" role="alert" hidden></p><dl class="supplier-posting-meta"><div><dt data-i18n="supplierInvoiceDate">${translateCopy("Kuupäev", "supplierInvoiceDate")}</dt><dd id="supplierPostingDate"></dd></div><div><dt data-i18n="supplierPostingDocument">${postingCopy("supplierPostingDocument")}</dt><dd id="supplierPostingDocument"></dd></div><div><dt data-i18n="supplierPostingCurrency">${postingCopy("supplierPostingCurrency")}</dt><dd id="supplierPostingCurrency"></dd></div></dl><div class="supplier-posting-table-wrap"><table class="data-table supplier-posting-table"><thead><tr><th data-i18n="supplierPostingAccount">${postingCopy("supplierPostingAccount")}</th><th class="supplier-posting-amount" data-i18n="supplierPostingDebit">${postingCopy("supplierPostingDebit")}</th><th class="supplier-posting-amount" data-i18n="supplierPostingCredit">${postingCopy("supplierPostingCredit")}</th><th data-i18n="supplierPostingDescription">${postingCopy("supplierPostingDescription")}</th><th data-i18n="supplierPostingObject">${postingCopy("supplierPostingObject")}</th></tr></thead><tbody id="supplierPostingRows"></tbody><tfoot><tr><th data-i18n="supplierPostingTotal">${postingCopy("supplierPostingTotal")}</th><td class="supplier-posting-amount" id="supplierPostingDebitTotal"></td><td class="supplier-posting-amount" id="supplierPostingCreditTotal"></td><td colspan="2"></td></tr></tfoot></table></div><div class="supplier-posting-footer"><section><h3 data-i18n="supplierPostingFiles">${postingCopy("supplierPostingFiles")}</h3><div class="supplier-posting-files" id="supplierPostingFiles"></div></section><section><h3 data-i18n="supplierPostingNote">${postingCopy("supplierPostingNote")}</h3><textarea id="supplierPostingNote" rows="3" readonly></textarea><div class="supplier-posting-print-note" id="supplierPostingPrintNote"></div></section></div></div>`;
  document.body.append(postingDialog);
  const openPosting = async () => {
    if (denyAction("expenses")) return;
    await fileRead;
    const saved = supplierInvoices.find(invoice => invoice.id === editingSupplierInvoiceId);
    const draft = collectDraft();
    const invoice = { ...saved, ...draft, id: saved?.id || "preview", supplierName: byId("supplierPicker").value ? draft.supplierName : saved?.supplierName || "" };
    const entries = createSupplierInvoiceLedgerEntries(invoice);
    byId("supplierPostingError").hidden = true;
    byId("supplierPostingDate").textContent = formatDate(invoice.date) || "—";
    byId("supplierPostingDocument").textContent = invoice.invoiceNumber || "—";
    byId("supplierPostingCurrency").textContent = invoice.currency || "EUR";
    const changedAt = saved?.updatedAt || saved?.enteredAt || saved?.createdAt;
    const author = saved?.updatedByEmail || saved?.updatedBy || saved?.enteredBy || saved?.createdByEmail;
    byId("supplierPostingAudit").textContent = [changedAt ? formatDate(String(changedAt).slice(0, 10)) : "", author].filter(Boolean).join(" · ");
    byId("supplierPostingAudit").hidden = !changedAt && !author;
    byId("supplierPostingRows").innerHTML = entries.map(entry => `<tr><td>${escapeHtml([entry.accountCode, entry.account].filter(Boolean).join(" · "))}</td><td class="supplier-posting-amount">${money(entry.debit)}</td><td class="supplier-posting-amount">${money(entry.credit)}</td><td>${escapeHtml(entry.credit ? invoice.supplierName || entry.description : entry.description)}</td><td>${escapeHtml(invoice.objectName || "—")}</td></tr>`).join("") || `<tr><td colspan="5" class="supplier-posting-empty">${escapeHtml(postingCopy("supplierPostingEmpty"))}</td></tr>`;
    byId("supplierPostingDebitTotal").textContent = money(entries.reduce((sum, entry) => sum + entry.debit, 0));
    byId("supplierPostingCreditTotal").textContent = money(entries.reduce((sum, entry) => sum + entry.credit, 0));
    byId("supplierPostingNote").value = invoice.note || "";
    byId("supplierPostingPrintNote").textContent = invoice.note || "—";
    byId("supplierPostingFiles").replaceChildren();
    const files = invoice.attachments?.length ? invoice.attachments : invoice.data ? [{ name: invoice.fileName || "Invoice", data: invoice.data }] : [];
    for (const file of files) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "supplier-posting-file";
      button.innerHTML = postingIcon("download");
      const name = document.createElement("span");
      name.textContent = file.name || "Invoice";
      button.append(name);
      button.disabled = !file.data;
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          const url = new URL(file.data, location.href);
          if (!["data:", "blob:", "http:", "https:"].includes(url.protocol)) throw new Error("Invalid file URL");
          const response = await fetch(url.href);
          if (!response.ok) throw new Error("Unable to read file");
          triggerBlobDownload(await response.blob(), file.name || "invoice-document");
        } catch {
          byId("supplierPostingError").textContent = postingCopy("supplierPostingFileError");
          byId("supplierPostingError").hidden = false;
        } finally { button.disabled = false; }
      });
      byId("supplierPostingFiles").append(button);
    }
    if (!files.length) {
      const empty = document.createElement("p");
      empty.textContent = postingCopy("supplierPostingNoFiles");
      byId("supplierPostingFiles").append(empty);
    }
    byId("supplierPostingPdf").disabled = !entries.length || !can("exportReports");
    byId("supplierPostingPdf").title = postingCopy("supplierPostingPrint");
    byId("supplierPostingEdit").disabled = !can("expenses");
    byId("supplierPostingClose").setAttribute("aria-label", postingCopy("supplierPostingClose"));
    byId("supplierPostingClose").title = postingCopy("supplierPostingClose");
    byId("supplierPostingNote").setAttribute("aria-label", postingCopy("supplierPostingNote"));
    applyLanguage(language);
    if (!postingDialog.open) postingDialog.showModal();
  };
  byId("supplierPostingClose").addEventListener("click", () => postingDialog.close());
  byId("supplierPostingEdit").addEventListener("click", () => { postingDialog.close(); byId("supplierInvoiceNumber").focus(); });
  postingDialog.addEventListener("click", event => {
    if (event.target !== postingDialog) return;
    const bounds = postingDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) postingDialog.close();
  });
  byId("supplierPostingPdf").addEventListener("click", async () => {
    if (!can("exportReports")) return;
    const headers = [...postingDialog.querySelectorAll(".supplier-posting-table thead th")].map(cell => cell.textContent.trim());
    const rows = [...byId("supplierPostingRows").querySelectorAll("tr")]
      .filter(row => !row.querySelector(".supplier-posting-empty"))
      .map(row => [...row.cells].map(cell => cell.textContent.trim()));
    rows.push([postingCopy("supplierPostingTotal"), byId("supplierPostingDebitTotal").textContent, byId("supplierPostingCreditTotal").textContent, "", ""]);
    const documentNumber = byId("supplierPostingDocument").textContent.trim();
    const safeDocumentNumber = documentNumber.replace(/[^a-z0-9_-]/gi, "-") || localDate();
    await window.downloadTablePdf({
      filename: `supplier-posting-${safeDocumentNumber}.pdf`,
      title: postingCopy("supplierPostingTitle"),
      period: [byId("supplierPostingDate").textContent, documentNumber, byId("supplierPostingCurrency").textContent].filter(Boolean).join(" · "),
      headers,
      rows
    });
  });
  const downloadSupplierInvoicePdf = async () => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    const saved = supplierInvoices.find(invoice => invoice.id === editingSupplierInvoiceId);
    const invoice = { ...saved, ...collectDraft() };
    const isEstonian = language === "et";
    const headers = isEstonian
      ? ["Kirjeldus", "Kogus", "Ühik", "Hind, EUR", "Allahindlus, %", "KM, %", "Summa, EUR"]
      : ["Описание", "Количество", "Ед.", "Цена, EUR", "Скидка, %", "НДС, %", "Сумма, EUR"];
    const rows = (invoice.items || []).map(item => {
      if (item.isTextLine) return [item.description || "", "", "", "", "", "", ""];
      const net = number(item.quantity) * number(item.price) * (1 - Math.min(100, Math.max(0, number(item.discountPercent))) / 100);
      const total = net * (1 + number(item.taxRate) / 100);
      return [item.description || "", item.quantity, item.unit || "", euro(item.price), `${item.discountPercent || 0}%`, `${item.taxRate || 0}%`, euro(total)];
    });
    const totalLabel = isEstonian ? "Kokku" : "Итого";
    rows.push(["", "", "", "", "", isEstonian ? "Summa km-ta" : "Сумма без НДС", euro(invoice.subtotal)]);
    rows.push(["", "", "", "", "", isEstonian ? "Käibemaks" : "НДС", euro(invoice.taxTotal)]);
    if (number(invoice.rounding)) rows.push(["", "", "", "", "", isEstonian ? "Ümardus" : "Округление", euro(invoice.rounding)]);
    rows.push(["", "", "", "", "", totalLabel, euro(invoice.amount)]);
    rows.push(["", "", "", "", "", isEstonian ? "Maksmata" : "К оплате", euro(invoice.amountDue)]);
    const numberPart = String(invoice.invoiceNumber || "draft").replace(/[^a-z0-9_-]/gi, "-");
    const title = `${isEstonian ? "Hankija arve" : "Счёт поставщика"} ${invoice.invoiceNumber || ""}`.trim();
    await window.downloadTablePdf({
      filename: `${isEstonian ? "hankija-arve" : "supplier-invoice"}-${numberPart}.pdf`,
      title,
      period: [invoice.supplierName, invoice.date, invoice.dueDate].filter(Boolean).join(" · "),
      headers,
      rows
    });
  };
  const addToolbar = () => {
    const editor = byId("supplierInvoiceEditorView");
    const toolbar = editor?.querySelector(".invoice-editor-actions");
    if (!toolbar || toolbar.dataset.composerReady === "true") return;
    toolbar.dataset.composerReady = "true";
    toolbar.classList.add("supplier-invoice-toolbar");
    const save = byId("saveSupplierInvoiceButton");
    const makeButton = (id, key, label, handler) => {
      const button = document.createElement("button");
      button.type = "button";
      button.id = id;
      button.className = "secondary-button";
      button.dataset.i18n = key;
      button.textContent = label;
      button.addEventListener("click", handler);
      return button;
    };
    const draft = makeButton("supplierInvoiceSaveDraft", "supplierInvoiceSaveDraft", "Salvesta mustand", saveDraft);
    draft.classList.add("supplier-invoice-draft");
    const downloadPdf = makeButton("supplierInvoicePrint", "supplierInvoicePrint", "Laadi PDF alla", () => { void downloadSupplierInvoicePdf(); });
    const copy = makeButton("supplierInvoiceCopy", "supplierInvoiceCopy", "Kopeeri", () => {
      const draftData = collectDraft();
      resetSupplierInvoiceForm();
      applyDraft({ ...draftData, invoiceNumber: "" });
      setSupplierInvoicePage(true);
    });
    const posting = makeButton("supplierInvoiceKanneButton", "supplierPostingTitle", "Kanne", openPosting);
    posting.removeAttribute("data-i18n");
    posting.innerHTML = `${postingIcon("ledger")}<span data-i18n="supplierPostingTitle">${postingCopy("supplierPostingTitle")}</span>`;
    const draftGroup = document.createElement("div");
    draftGroup.className = "supplier-invoice-draft-group";
    draftGroup.append(draft, posting);
    toolbar.insertBefore(draftGroup, save);
    toolbar.insertBefore(downloadPdf, save);
    toolbar.insertBefore(copy, save);
    const remove = byId("deleteSupplierInvoiceButton");
    if (remove) {
      remove.classList.add("supplier-invoice-delete");
      toolbar.insertBefore(remove, save);
    }
    applyLanguage(language);
  };
  const originalSetPage = setSupplierInvoicePage;
  setSupplierInvoicePage = open => {
    originalSetPage(open);
    if (!open) return;
    addToolbar();
    if (!editingSupplierInvoiceId && !byId("supplierInvoiceNumber").value) {
      try {
        const draft = JSON.parse(localStorage.getItem(draftKey()) || "null");
        if (draft) applyDraft(draft);
      } catch {}
    }
  };

  const saveInvoice = async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (denyAction("expenses")) return;
    await fileRead;
    const supplierId = byId("supplierPicker").value;
    const existing = supplierInvoices.find(invoice => invoice.id === editingSupplierInvoiceId);
    const supplier = suppliers.find(item => item.id === supplierId);
    const supplierName = supplier?.name || (existing?.supplierId === supplierId ? existing.supplierName : "");
    const invoiceNumber = byId("supplierInvoiceNumber").value.trim();
    const date = byId("supplierInvoiceDate").value;
    const calculated = collect();
    if (!supplierId || !supplierName || !invoiceNumber || !date || calculated.amount <= 0) {
      showMessage(translateCopy("supplierInvoiceInvalid", "supplierInvoiceInvalid"), true);
      return;
    }
    if (supplierInvoices.some(invoice => invoice.id !== editingSupplierInvoiceId && invoice.supplierId === supplierId && invoice.invoiceNumber.toLocaleLowerCase("et") === invoiceNumber.toLocaleLowerCase("et"))) {
      showMessage(translateCopy("supplierInvoiceDuplicate", "supplierInvoiceDuplicate"), true);
      return;
    }
    const invoice = {
      ...existing,
      id: editingSupplierInvoiceId || crypto.randomUUID(),
      supplierId,
      supplierName,
      invoiceNumber,
      date,
      dueDate: byId("supplierInvoiceDueDate").value,
      amount: calculated.amount,
      amountDue: calculated.amountDue,
      currency: calculated.currency,
      description: byId("supplierInvoiceDescription").value.trim(),
      note: byId("supplierInvoiceNote").value.trim(),
      lateFeePercent: calculated.lateFeePercent,
      invoiceLine: calculated.invoiceLine,
      objectName: calculated.objectName,
      accountCode: calculated.accountCode,
      warehouseName: calculated.warehouseName,
      subtotal: calculated.subtotal,
      taxTotal: calculated.taxTotal,
      rounding: calculated.rounding,
      items: calculated.items,
      payments: calculated.payments,
      attachments: calculated.attachments,
      fileName: calculated.attachments[0]?.name || existing?.fileName || "",
      fileType: calculated.attachments[0]?.type || existing?.fileType || "",
      data: calculated.attachments[0]?.data || existing?.data || ""
    };
    const next = editingSupplierInvoiceId ? supplierInvoices.map(saved => saved.id === editingSupplierInvoiceId ? invoice : saved) : [invoice, ...supplierInvoices];
    try {
      saveList(STORAGE.supplierInvoices, next);
    } catch {
      showMessage(translateCopy("supplierInvoiceStorageError", "supplierInvoiceStorageError"), true);
      return;
    }
    supplierInvoices = next;
    try { localStorage.removeItem(draftKey); } catch {}
    const wasEditing = Boolean(editingSupplierInvoiceId);
    resetSupplierInvoiceForm();
    renderSupplierInvoices(byId("supplierInvoiceSearch").value);
    renderDashboard();
    renderReport();
    showMessage(translateCopy(wasEditing ? "Счет поставщика обновлен." : "Счет поставщика сохранен.", wasEditing ? "supplierInvoiceUpdated" : "supplierInvoiceSaved"));
  };
  document.addEventListener("submit", event => {
    if (event.target !== form) return;
    saveInvoice(event);
  }, true);

  addLine();
  addLine();
  addPayment();
  renderFiles();
  applyLanguage(language);
})();
