(() => {
  if (document.getElementById("fixedAssetsDepreciationView")) return;
  Object.assign(ruTexts, {
    assetDepTitle: "Амортизация основных средств", assetDepPeriod: "Период", assetDepCalculate: "Рассчитать",
    assetDepSave: "Сохранить проводку", assetDepCode: "Код", assetDepName: "Основное средство",
    assetDepBookValue: "Остаток до", assetDepRate: "Ставка в год", assetDepAmount: "Износ за период",
    assetDepAccount: "Счёт расхода / износа", assetDepNoAssets: "Нет основных средств для начисления амортизации за этот период.",
    assetDepNoDue: "Для выбранного периода начислений нет.", assetDepAlready: "Уже начислено",
    assetDepMissingStart: "Не задано начало амортизации", assetDepMissingAccounts: "Не заданы счёт расходов и счёт амортизации",
    assetDepSaved: "Проводка по амортизации сохранена.", assetDepError: "Не удалось сохранить амортизацию.",
    assetDepInvalidPeriod: "Выберите корректный период.", assetDepStale: "Данные изменились. Рассчитайте период заново.", assetDepLocalOnly: "Начисления сохраняются в локальном реестре основных средств и пока не синхронизируются с облаком.",
    assetDepNote: "Линейный расчёт по годовой ставке из карточки. Месяц начисляется ежемесячно, квартал — в марте, июне, сентябре и декабре, год — в декабре. Начисления задним числом не создаются автоматически.",
    assetDepDate: "Дата проводки", assetDepDocument: "Документ", assetDepTotal: "Итого",
    assetDepNumber: "№", assetDepYear: "ГОД", assetDepMonth: "МЕСЯЦ", assetDepPostingDate: "ПРОВОДКА",
    assetDepPeriodAmount: "АМОРТИЗАЦИЯ ЗА ПЕРИОД", assetDepCurrency: "€/$", assetDepAdd: "Добавить",
    assetDepMore: "Ещё", assetDepHelp: "Справка", assetDepRefresh: "Обновить список", assetDepNoRecords: "Начислений амортизации пока нет.",
    assetDepExportPdf: "PDF", assetDepExportXls: "XLS", assetDepExportCsv: "CSV",
    assetDepEntryTitle: "Начисление амортизации №", assetDepEntryDate: "Дата проводки", assetDepEntryAsset: "Основное средство",
    assetDepEntryLinear: "Линейный",
    assetDepEntryCost: "Стоимость", assetDepEntryMethod: "Метод", assetDepEntryRate: "Ставка", assetDepEntryAmount: "Износ",
    assetDepEntryBalance: "Остаток", assetDepEntryExpense: "Счёт расходов", assetDepEntryAccum: "Счёт амортизации",
    assetDepEntryAssetAccount: "Счёт основного средства", assetDepEntryObject: "Объект", assetDepEntryDescription: "Описание",
    assetDepEntrySave: "Сохранить изменения", assetDepEntryCancel: "Закрыть", assetDepEntrySaved: "Начисление обновлено.",
    assetDepEntryInvalid: "Проверьте дату, сумму и остаток основного средства.", assetDepEntryPeriod: "Период"
  });
  Object.assign(etTexts, {
    assetDepTitle: "Põhivara amortisatsioon", assetDepPeriod: "Periood", assetDepCalculate: "Arvuta",
    assetDepSave: "Salvesta kanne", assetDepCode: "Kood", assetDepName: "Põhivara",
    assetDepBookValue: "Jääk enne", assetDepRate: "Aastamäär", assetDepAmount: "Perioodi kulum",
    assetDepAccount: "Kulu- / amortisatsioonikonto", assetDepNoAssets: "Valitud perioodil pole amortiseeritavat põhivara.",
    assetDepNoDue: "Valitud perioodil amortisatsiooni ei arvestata.", assetDepAlready: "Juba arvestatud",
    assetDepMissingStart: "Amortisatsiooni algus puudub", assetDepMissingAccounts: "Kulu- ja amortisatsioonikonto puuduvad",
    assetDepSaved: "Amortisatsioonikanne salvestati.", assetDepError: "Amortisatsiooni ei saanud salvestada.",
    assetDepInvalidPeriod: "Valige korrektne periood.", assetDepStale: "Andmed muutusid. Arvutage periood uuesti.", assetDepLocalOnly: "Arvestused salvestatakse põhivararegistrisse selles seadmes ega sünkrooni veel pilve.",
    assetDepNote: "Lineaarne arvestus kaardi aastamäära järgi. Kuu arvestatakse iga kuu, kvartal märtsis, juunis, septembris ja detsembris, aasta detsembris. Mineviku arvestusi automaatselt ei looda.",
    assetDepDate: "Kande kuupäev", assetDepDocument: "Dokument", assetDepTotal: "Kokku",
    assetDepNumber: "NR", assetDepYear: "AASTA", assetDepMonth: "KUU", assetDepPostingDate: "KANNE",
    assetDepPeriodAmount: "PERIOODI KULUM", assetDepCurrency: "€/$", assetDepAdd: "Lisa uus",
    assetDepMore: "Rohkem", assetDepHelp: "Abi", assetDepRefresh: "Värskenda nimekirja", assetDepNoRecords: "Amortisatsioonikandeid pole veel.",
    assetDepExportPdf: "PDF", assetDepExportXls: "XLS", assetDepExportCsv: "CSV",
    assetDepEntryTitle: "Amortisatsioonikanne nr", assetDepEntryDate: "Kande kuupäev", assetDepEntryAsset: "Põhivara",
    assetDepEntryLinear: "Lineaarne",
    assetDepEntryCost: "Soetusmaksumus", assetDepEntryMethod: "Meetod", assetDepEntryRate: "Määr", assetDepEntryAmount: "Kulum",
    assetDepEntryBalance: "Jääk", assetDepEntryExpense: "Kulukonto", assetDepEntryAccum: "Amortisatsioonikonto",
    assetDepEntryAssetAccount: "Põhivarakonto", assetDepEntryObject: "Objekt", assetDepEntryDescription: "Kirjeldus",
    assetDepEntrySave: "Salvesta muudatused", assetDepEntryCancel: "Sulge", assetDepEntrySaved: "Amortisatsioonikanne uuendati.",
    assetDepEntryInvalid: "Kontrollige kande kuupäeva, summat ja põhivara jääki.", assetDepEntryPeriod: "Periood"
  });
  const copy = key => translateCopy(key, key);
  const view = document.createElement("section");
  view.id = "fixedAssetsDepreciationView";
  view.className = "app-view payments-subview fixed-assets-subview";
  view.hidden = true;
  view.innerHTML = `<div class="view-heading fixed-assets-heading"><div><h1 data-i18n="fixedAssetsDepreciation">${copy("fixedAssetsDepreciation")}</h1></div><button type="button" class="secondary-button" id="fixedAssetDepBack" data-i18n="fixedAssetsBack">${copy("fixedAssetsBack")}</button></div><section class="data-panel fixed-asset-depreciation-panel"><div class="fixed-asset-depreciation-heading"><h2 data-i18n="assetDepTitle">${copy("assetDepTitle")}</h2><button type="button" class="primary-button" id="fixedAssetDepCalculate" data-i18n="assetDepCalculate">${copy("assetDepCalculate")}</button></div><div class="fixed-asset-depreciation-filters"><label class="field"><span data-i18n="assetDepPeriod">${copy("assetDepPeriod")}</span><input id="fixedAssetDepPeriod" type="month" required></label><button type="button" class="secondary-button" id="fixedAssetDepSave" data-i18n="assetDepSave" disabled>${copy("assetDepSave")}</button></div><p class="fixed-asset-depreciation-note" data-i18n="assetDepNote">${copy("assetDepNote")}</p><p class="fixed-asset-depreciation-local" data-i18n="assetDepLocalOnly">${copy("assetDepLocalOnly")}</p><p class="fixed-asset-depreciation-message" id="fixedAssetDepMessage" role="status" hidden></p><div class="fixed-assets-table-wrap"><table class="fixed-assets-table fixed-asset-depreciation-table"><thead><tr><th data-i18n="assetDepCode">${copy("assetDepCode")}</th><th data-i18n="assetDepName">${copy("assetDepName")}</th><th data-i18n="assetDepBookValue">${copy("assetDepBookValue")}</th><th data-i18n="assetDepRate">${copy("assetDepRate")}</th><th data-i18n="assetDepAccount">${copy("assetDepAccount")}</th><th data-i18n="assetDepAmount">${copy("assetDepAmount")}</th></tr></thead><tbody id="fixedAssetDepRows"></tbody><tfoot><tr><th colspan="5" data-i18n="assetDepTotal">${copy("assetDepTotal")}</th><th id="fixedAssetDepTotal">0,00 EUR</th></tr></tfoot></table></div></section>`;
  view.innerHTML = `<div class="view-heading fixed-assets-heading fixed-asset-depreciation-page-heading"><div><h1 data-i18n="fixedAssetsDepreciation">${copy("fixedAssetsDepreciation")}</h1></div><button type="button" class="secondary-button" id="fixedAssetDepBack" data-i18n="fixedAssetsBack">${copy("fixedAssetsBack")}</button></div><section class="data-panel fixed-asset-depreciation-panel"><div class="fixed-asset-depreciation-heading"><h2 data-i18n="assetDepTitle">${copy("assetDepTitle")}</h2><button type="button" class="primary-button" id="fixedAssetDepCalculate" data-i18n="assetDepCalculate">${copy("assetDepCalculate")}</button></div><div class="fixed-asset-depreciation-filters"><label class="field"><span data-i18n="assetDepPeriod">${copy("assetDepPeriod")}</span><input id="fixedAssetDepPeriod" type="month" required></label><button type="button" class="secondary-button" id="fixedAssetDepSave" data-i18n="assetDepSave" disabled>${copy("assetDepSave")}</button></div><p class="fixed-asset-depreciation-note" data-i18n="assetDepNote">${copy("assetDepNote")}</p><p class="fixed-asset-depreciation-local" data-i18n="assetDepLocalOnly">${copy("assetDepLocalOnly")}</p><p class="fixed-asset-depreciation-message" id="fixedAssetDepMessage" role="status" hidden></p><div class="fixed-assets-table-wrap"><table class="fixed-assets-table fixed-asset-depreciation-table"><thead><tr><th data-i18n="assetDepCode">${copy("assetDepCode")}</th><th data-i18n="assetDepName">${copy("assetDepName")}</th><th data-i18n="assetDepBookValue">${copy("assetDepBookValue")}</th><th data-i18n="assetDepRate">${copy("assetDepRate")}</th><th data-i18n="assetDepAccount">${copy("assetDepAccount")}</th><th data-i18n="assetDepAmount">${copy("assetDepAmount")}</th></tr></thead><tbody id="fixedAssetDepRows"></tbody><tfoot><tr><th colspan="5" data-i18n="assetDepTotal">${copy("assetDepTotal")}</th><th id="fixedAssetDepTotal">0,00 EUR</th></tr></tfoot></table></div></section>`;
  const headingContent = view.querySelector(".fixed-asset-depreciation-page-heading>div");
  const exports = document.createElement("div");
  exports.className = "fixed-assets-export-links fixed-asset-depreciation-exports";
  exports.innerHTML = `<button type="button" data-depreciation-export="pdf" data-i18n="assetDepExportPdf">${copy("assetDepExportPdf")}</button><button type="button" data-depreciation-export="xls" data-i18n="assetDepExportXls">${copy("assetDepExportXls")}</button><button type="button" data-depreciation-export="csv" data-i18n="assetDepExportCsv">${copy("assetDepExportCsv")}</button>`;
  headingContent.append(exports);
  const actions = document.createElement("div");
  actions.className = "fixed-asset-depreciation-actions";
  actions.innerHTML = `<button type="button" class="primary-button" id="fixedAssetDepAdd"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg><span data-i18n="assetDepAdd">${copy("assetDepAdd")}</span></button><div class="fixed-assets-menu-wrap"><button type="button" class="secondary-button" id="fixedAssetDepMore" aria-haspopup="menu" aria-expanded="false" aria-controls="fixedAssetDepMoreMenu"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg><span data-i18n="assetDepMore">${copy("assetDepMore")}</span></button><div class="fixed-assets-small-menu" id="fixedAssetDepMoreMenu" role="menu" hidden><button type="button" role="menuitem" id="fixedAssetDepRefresh" data-i18n="assetDepRefresh">${copy("assetDepRefresh")}</button><button type="button" role="menuitem" data-depreciation-export="csv" data-i18n="assetDepExportCsv">${copy("assetDepExportCsv")}</button></div></div><button type="button" class="secondary-button" id="fixedAssetDepHelp" aria-expanded="false" aria-controls="fixedAssetDepHelpPanel"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-1 .8-1.5 1.1-1.5 2.7M12 17h.01"></path></svg><span data-i18n="assetDepHelp">${copy("assetDepHelp")}</span></button>`;
  view.querySelector(".fixed-asset-depreciation-page-heading").insertBefore(actions, view.querySelector("#fixedAssetDepBack"));
  const previewPanel = view.querySelector(".fixed-asset-depreciation-panel");
  const editor = document.createElement("dialog");
  editor.id = "fixedAssetDepDialog";
  editor.className = "fixed-asset-dialog fixed-asset-depreciation-dialog";
  editor.setAttribute("aria-labelledby", "fixedAssetDepDialogTitle");
  const editorHeading = document.createElement("div");
  editorHeading.className = "fixed-asset-dialog-heading";
  editorHeading.innerHTML = `<h2 id="fixedAssetDepDialogTitle" data-i18n="assetDepTitle">${copy("assetDepTitle")}</h2><button type="button" class="fixed-assets-clear" id="fixedAssetDepClose" aria-label="${copy("assetCancel")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button>`;
  editor.append(editorHeading, previewPanel);
  document.body.append(editor);
  const register = document.createElement("section");
  register.className = "data-panel fixed-asset-depreciation-register";
  register.innerHTML = `<p class="fixed-asset-depreciation-note" data-i18n="assetDepNote">${copy("assetDepNote")}</p><p class="fixed-asset-depreciation-local" data-i18n="assetDepLocalOnly">${copy("assetDepLocalOnly")}</p><p class="fixed-asset-depreciation-message" id="fixedAssetDepRegisterMessage" role="status" hidden></p><div class="fixed-assets-table-wrap"><table class="fixed-assets-table fixed-asset-depreciation-ledger"><thead><tr><th aria-sort="descending"><button type="button" class="fixed-assets-sort" data-depreciation-sort="number" data-i18n="assetDepNumber">${copy("assetDepNumber")}</button></th><th aria-sort="none"><button type="button" class="fixed-assets-sort" data-depreciation-sort="year" data-i18n="assetDepYear">${copy("assetDepYear")}</button></th><th aria-sort="none"><button type="button" class="fixed-assets-sort" data-depreciation-sort="month" data-i18n="assetDepMonth">${copy("assetDepMonth")}</button></th><th aria-sort="none"><button type="button" class="fixed-assets-sort" data-depreciation-sort="date" data-i18n="assetDepPostingDate">${copy("assetDepPostingDate")}</button></th><th aria-sort="none"><button type="button" class="fixed-assets-sort" data-depreciation-sort="amount" data-i18n="assetDepPeriodAmount">${copy("assetDepPeriodAmount")}</button></th><th data-i18n="assetDepCurrency">${copy("assetDepCurrency")}</th></tr></thead><tbody id="fixedAssetDepRegisterRows"></tbody></table></div><div class="fixed-assets-footer"><strong id="fixedAssetDepRegisterCount">${copy("assetDepTotal")}: 0</strong></div><div class="fixed-asset-depreciation-help" id="fixedAssetDepHelpPanel" data-i18n="assetDepNote" hidden>${copy("assetDepNote")}</div></section>`;
  register.querySelectorAll(".fixed-asset-depreciation-note,.fixed-asset-depreciation-local").forEach(element => element.remove());
  register.querySelectorAll("[data-depreciation-sort]").forEach(button => button.insertAdjacentHTML("beforeend", '<span class="fixed-assets-sort-indicator" aria-hidden="true">↕</span>'));
  view.append(register);
  const detailDialog = document.createElement("dialog");
  detailDialog.id = "fixedAssetDepEntryDialog";
  detailDialog.className = "fixed-asset-dialog fixed-asset-depreciation-dialog fixed-asset-depreciation-entry-dialog";
  detailDialog.setAttribute("aria-labelledby", "fixedAssetDepEntryTitle");
  detailDialog.innerHTML = `<form id="fixedAssetDepEntryForm"><div class="fixed-asset-dialog-heading"><h2 id="fixedAssetDepEntryTitle"></h2><button type="button" class="fixed-assets-clear" id="fixedAssetDepEntryClose" aria-label="${copy("assetDepEntryCancel")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button></div><label class="fixed-asset-depreciation-entry-date"><span data-i18n="assetDepEntryDate">${copy("assetDepEntryDate")}</span><input id="fixedAssetDepEntryDate" type="date" required></label><div id="fixedAssetDepEntryRows" class="fixed-asset-depreciation-entry-rows"></div><p id="fixedAssetDepEntryError" class="fixed-asset-error" role="alert" hidden></p><div class="fixed-asset-dialog-actions"><button type="button" class="secondary-button" id="fixedAssetDepEntryCancel" data-i18n="assetDepEntryCancel">${copy("assetDepEntryCancel")}</button><button type="submit" class="primary-button" data-i18n="assetDepEntrySave">${copy("assetDepEntrySave")}</button></div></form>`;
  document.body.append(detailDialog);
  const detailPeriod = document.createElement("div");
  detailPeriod.className = "fixed-asset-depreciation-entry-period";
  detailPeriod.innerHTML = `<span data-i18n="assetDepEntryPeriod">${copy("assetDepEntryPeriod")}</span><strong id="fixedAssetDepEntryPeriod"></strong>`;
  detailDialog.querySelector("#fixedAssetDepEntryDate").closest("label").before(detailPeriod);
  document.querySelector("main").insertBefore(view, document.getElementById("reportsView"));
  const get = id => document.getElementById(id);
  get("fixedAssetDepBack").addEventListener("click", () => switchView("fixedAssetsView"));
  get("fixedAssetDepAdd").addEventListener("click", () => { get("fixedAssetDepPeriod").value = localDate().slice(0, 7); calculate(); editor.showModal(); });
  get("fixedAssetDepClose").addEventListener("click", () => editor.close());
  editor.addEventListener("click", event => { if (event.target === editor) editor.close(); });
  get("fixedAssetDepHelp").addEventListener("click", () => { const panel = get("fixedAssetDepHelpPanel"); panel.hidden = !panel.hidden; get("fixedAssetDepHelp").setAttribute("aria-expanded", String(!panel.hidden)); });
  get("fixedAssetDepMore").addEventListener("click", () => { const menu = get("fixedAssetDepMoreMenu"); menu.hidden = !menu.hidden; get("fixedAssetDepMore").setAttribute("aria-expanded", String(!menu.hidden)); });
  get("fixedAssetDepRefresh").addEventListener("click", () => { get("fixedAssetDepMoreMenu").hidden = true; get("fixedAssetDepMore").setAttribute("aria-expanded", "false"); renderRegister(); });
  document.addEventListener("click", event => { if (!event.target.closest(".fixed-asset-depreciation-actions .fixed-assets-menu-wrap")) { get("fixedAssetDepMoreMenu").hidden = true; get("fixedAssetDepMore").setAttribute("aria-expanded", "false"); } });
  const currentPeriod = localDate().slice(0, 7);
  get("fixedAssetDepPeriod").value = currentPeriod;
  let preview = [];
  let previewSnapshot = "";
  let previewStorageKey = "";
  const formatAmount = amount => `${money(amount)} EUR`;
  const readAssets = () => {
    const value = readStorage(STORAGE.fixedAssets, []);
    return Array.isArray(value) ? value.filter(asset => asset && typeof asset.id === "string") : [];
  };
  const displayMessage = (key, isError = false, registerMessage = false) => {
    const message = get(registerMessage ? "fixedAssetDepRegisterMessage" : "fixedAssetDepMessage");
    message.textContent = copy(key);
    message.classList.toggle("is-error", isError);
    message.hidden = false;
  };
  const renderRows = rows => {
    get("fixedAssetDepRows").innerHTML = rows.map(row => `<tr><td>${escapeHtml(row.asset.code || "—")}</td><td>${escapeHtml(row.asset.description || "—")}</td><td>${formatAmount(row.bookValue)}</td><td>${money(row.rate)} %</td><td>${escapeHtml(row.asset.expenseAccount)} / ${escapeHtml(row.asset.depreciationAccount)}</td><td>${formatAmount(row.amount)}</td></tr>`).join("") || `<tr><td colspan="6" class="fixed-assets-empty">${escapeHtml(copy("assetDepNoDue"))}</td></tr>`;
    const total = rows.reduce((sum, row) => sum + row.amount, 0);
    get("fixedAssetDepTotal").textContent = formatAmount(total);
  };
  let registerSort = "period";
  let registerDirection = -1;
  const collectRegisterRows = () => {
    const periods = new Map();
    for (const asset of readAssets()) {
      for (const entry of Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : []) {
        if (!/^\d{4}-\d{2}$/.test(entry?.period || "") || !Number.isFinite(Number(entry.amount))) continue;
        const current = periods.get(entry.period) || { period: entry.period, date: entry.date || `${entry.period}-01`, amount: 0, currency: entry.currency || asset.currency || "EUR" };
        current.amount += Number(entry.amount);
        if (String(entry.date || "") > current.date) current.date = entry.date;
        periods.set(entry.period, current);
      }
    }
    return [...periods.values()].map(row => ({ ...row, year: Number(row.period.slice(0, 4)), month: Number(row.period.slice(5, 7)) })).sort((first, second) => second.period.localeCompare(first.period)).map((row, index) => ({ ...row, number: index + 1 }));
  };
  const renderRegister = () => {
    const rows = collectRegisterRows();
    const multiplier = registerDirection;
    rows.sort((first, second) => registerSort === "period" ? (multiplier < 0 ? second.period.localeCompare(first.period) : first.period.localeCompare(second.period)) : multiplier * (registerSort === "amount" ? first.amount - second.amount : registerSort === "year" ? first.year - second.year : registerSort === "month" ? first.month - second.month : first.date.localeCompare(second.date)));
    get("fixedAssetDepRegisterRows").innerHTML = rows.map((row, index) => `<tr data-depreciation-period="${escapeHtml(row.period)}" data-depreciation-number="${rows.length - index}" tabindex="0" aria-label="${escapeHtml(copy("assetDepEntryTitle"))} ${rows.length - index}"><td>${rows.length - index}</td><td>${row.year}</td><td>${row.month}</td><td>${escapeHtml(formatDate(row.date))}</td><td>${formatAmount(row.amount)}</td><td>${escapeHtml(row.currency)}</td></tr>`).join("") || `<tr><td class="fixed-assets-empty" colspan="6">${escapeHtml(copy("assetDepNoRecords"))}</td></tr>`;
    get("fixedAssetDepRegisterCount").textContent = `${copy("assetDepTotal")}: ${rows.length}`;
    view.querySelectorAll("[data-depreciation-sort]").forEach(button => {
      const heading = button.closest("th");
      const active = button.dataset.depreciationSort === (registerSort === "period" ? "number" : registerSort);
      heading.setAttribute("aria-sort", active ? registerDirection > 0 ? "ascending" : "descending" : "none");
      button.querySelector(".fixed-assets-sort-indicator").textContent = active ? registerDirection > 0 ? "↑" : "↓" : "↕";
    });
    applyLanguage(language);
    return rows;
  };
  view.querySelectorAll("[data-depreciation-sort]").forEach(button => button.addEventListener("click", () => {
    const next = button.dataset.depreciationSort === "number" ? "period" : button.dataset.depreciationSort;
    registerDirection = registerSort === next ? -registerDirection : next === "period" ? -1 : 1;
    registerSort = next;
    renderRegister();
  }));
  let editingDepreciationPeriod = "";
  let editingDepreciationStorageKey = "";
  const showEntryError = () => { const message = get("fixedAssetDepEntryError"); message.textContent = copy("assetDepEntryInvalid"); message.hidden = false; };
  const openEntry = (period, number) => {
    const assets = readAssets();
    const entries = assets.flatMap(asset => (Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : []).filter(entry => entry?.period === period).map(entry => ({ asset, entry })));
    if (!entries.length) { renderRegister(); return; }
    editingDepreciationPeriod = period;
    editingDepreciationStorageKey = STORAGE.fixedAssets;
    get("fixedAssetDepEntryTitle").textContent = `${copy("assetDepEntryTitle")} ${number}`;
    get("fixedAssetDepEntryPeriod").textContent = period.replace("-", " - ");
    get("fixedAssetDepEntryDate").value = entries[0].entry.date || `${period}-01`;
    get("fixedAssetDepEntryError").hidden = true;
    get("fixedAssetDepEntryRows").innerHTML = entries.map(({ asset, entry }) => `<section class="fixed-asset-depreciation-entry-card" data-dep-asset-id="${escapeHtml(asset.id)}" data-dep-entry-id="${escapeHtml(entry.id)}"><h3>${escapeHtml(asset.code || "")} ${escapeHtml(asset.description || "")}</h3><div class="fixed-asset-depreciation-entry-summary"><div><span data-i18n="assetDepEntryCost">${copy("assetDepEntryCost")}</span><strong>${formatAmount(Number(asset.cost) || 0)}</strong></div><div><span data-i18n="assetDepEntryMethod">${copy("assetDepEntryMethod")}</span><strong>${copy("assetDepEntryLinear")}</strong></div><div><span data-i18n="assetDepEntryRate">${copy("assetDepEntryRate")}</span><strong>${money(asset.depreciationRate || 0)} %</strong></div><div><span data-i18n="assetDepEntryBalance">${copy("assetDepEntryBalance")}</span><strong>${formatAmount(asset.bookValue || 0)}</strong></div></div><div class="fixed-asset-depreciation-entry-fields"><label><span data-i18n="assetDepEntryDescription">${copy("assetDepEntryDescription")}</span><input data-dep-entry-field="description" type="text" maxlength="300" value="${escapeHtml(entry.description ?? asset.description ?? "")}"></label><label><span data-i18n="assetDepEntryAmount">${copy("assetDepEntryAmount")}</span><input data-dep-entry-field="amount" type="number" min="0" step="0.01" required value="${escapeHtml(entry.amount)}"></label><label><span data-i18n="assetDepEntryExpense">${copy("assetDepEntryExpense")}</span><input data-dep-entry-field="expenseAccount" type="text" maxlength="100" value="${escapeHtml(entry.expenseAccount ?? asset.expenseAccount ?? "")}"></label><label><span data-i18n="assetDepEntryAccum">${copy("assetDepEntryAccum")}</span><input data-dep-entry-field="depreciationAccount" type="text" maxlength="100" value="${escapeHtml(entry.depreciationAccount ?? asset.depreciationAccount ?? "")}"></label><label><span data-i18n="assetDepEntryAssetAccount">${copy("assetDepEntryAssetAccount")}</span><input data-dep-entry-field="assetAccount" type="text" maxlength="100" value="${escapeHtml(entry.assetAccount ?? asset.assetAccount ?? "")}"></label><label><span data-i18n="assetDepEntryObject">${copy("assetDepEntryObject")}</span><input data-dep-entry-field="objectName" type="text" maxlength="300" value="${escapeHtml(entry.objectName ?? asset.objectName ?? "")}"></label></div></section>`).join("");
    applyLanguage(language);
    detailDialog.showModal();
    renderEntryTable(period);
  };
  const renderEntryTable = period => {
    const entries = readAssets().flatMap(asset => (Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : []).filter(entry => entry?.period === period).map(entry => ({ asset, entry })));
    const rows = entries.map(({ asset, entry }) => {
      const balance = Number(asset.bookValue) || 0;
      return `<tr class="fixed-asset-depreciation-entry-row" data-dep-asset-id="${escapeHtml(asset.id)}" data-dep-entry-id="${escapeHtml(entry.id)}" data-dep-old-amount="${Number(entry.amount) || 0}" data-dep-current-balance="${balance}"><td><textarea data-dep-entry-field="description" rows="2" maxlength="300">${escapeHtml(entry.description ?? asset.description ?? "")}</textarea></td><td class="fixed-asset-dep-number">${formatAmount(Number(asset.cost) || 0)}</td><td>${copy("assetDepEntryLinear")}</td><td class="fixed-asset-dep-number">${money(entry.rate ?? asset.depreciationRate ?? 0)} %</td><td><input data-dep-entry-field="amount" type="number" min="0" step="0.01" required value="${Number(entry.amount) || 0}"></td><td class="fixed-asset-dep-number" data-dep-preview-balance>${formatAmount(balance)}</td><td><input data-dep-entry-field="expenseAccount" type="text" maxlength="100" value="${escapeHtml(entry.expenseAccount ?? asset.expenseAccount ?? "")}"></td><td><input data-dep-entry-field="depreciationAccount" type="text" maxlength="100" value="${escapeHtml(entry.depreciationAccount ?? asset.depreciationAccount ?? "")}"></td><td><input data-dep-entry-field="assetAccount" type="text" maxlength="100" value="${escapeHtml(entry.assetAccount ?? asset.assetAccount ?? "")}"></td><td><input data-dep-entry-field="objectName" type="text" maxlength="300" value="${escapeHtml(entry.objectName ?? asset.objectName ?? "")}"></td></tr>`;
    }).join("");
    const costTotal = entries.reduce((sum, row) => sum + (Number(row.asset.cost) || 0), 0);
    const amountTotal = entries.reduce((sum, row) => sum + (Number(row.entry.amount) || 0), 0);
    const balanceTotal = entries.reduce((sum, row) => sum + (Number(row.asset.bookValue) || 0), 0);
    get("fixedAssetDepEntryRows").innerHTML = `<div class="fixed-assets-table-wrap fixed-asset-depreciation-entry-table-wrap"><table class="fixed-assets-table fixed-asset-depreciation-entry-table"><thead><tr><th data-i18n="assetDepEntryDescription">${copy("assetDepEntryDescription")}</th><th data-i18n="assetDepEntryCost">${copy("assetDepEntryCost")}</th><th data-i18n="assetDepEntryMethod">${copy("assetDepEntryMethod")}</th><th data-i18n="assetDepEntryRate">${copy("assetDepEntryRate")}</th><th data-i18n="assetDepEntryAmount">${copy("assetDepEntryAmount")}</th><th data-i18n="assetDepEntryBalance">${copy("assetDepEntryBalance")}</th><th data-i18n="assetDepEntryExpense">${copy("assetDepEntryExpense")}</th><th data-i18n="assetDepEntryAccum">${copy("assetDepEntryAccum")}</th><th data-i18n="assetDepEntryAssetAccount">${copy("assetDepEntryAssetAccount")}</th><th data-i18n="assetDepEntryObject">${copy("assetDepEntryObject")}</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><th></th><th>${formatAmount(costTotal)}</th><th colspan="2"></th><th data-dep-total-amount>${formatAmount(amountTotal)}</th><th data-dep-total-balance>${formatAmount(balanceTotal)}</th><th colspan="4"></th></tr></tfoot></table></div>`;
    get("fixedAssetDepEntryRows").querySelectorAll('[data-dep-entry-field="amount"]').forEach(input => input.addEventListener("input", () => {
      const row = input.closest("tr");
      const nextBalance = Number(row.dataset.depCurrentBalance) + Number(row.dataset.depOldAmount) - Number(input.value || 0);
      row.querySelector("[data-dep-preview-balance]").textContent = formatAmount(nextBalance);
      row.classList.toggle("has-invalid-balance", nextBalance < 0);
      const amountTotal = [...get("fixedAssetDepEntryRows").querySelectorAll('[data-dep-entry-field="amount"]')].reduce((sum, field) => sum + (Number(field.value) || 0), 0);
      const balanceTotal = [...get("fixedAssetDepEntryRows").querySelectorAll("[data-dep-preview-balance]")].reduce((sum, cell) => sum + Number(cell.textContent.replace(/[^\d,.-]/g, "").replace(",", ".")), 0);
      get("fixedAssetDepEntryRows").querySelector("[data-dep-total-amount]").textContent = formatAmount(amountTotal);
      get("fixedAssetDepEntryRows").querySelector("[data-dep-total-balance]").textContent = formatAmount(balanceTotal);
    }));
  };
  get("fixedAssetDepRegisterRows").addEventListener("click", event => {
    const row = event.target.closest("tr[data-depreciation-period]");
    if (row) openEntry(row.dataset.depreciationPeriod, row.dataset.depreciationNumber);
  });
  get("fixedAssetDepRegisterRows").addEventListener("keydown", event => {
    const row = event.target.closest("tr[data-depreciation-period]");
    if (row && ["Enter", " "].includes(event.key)) { event.preventDefault(); openEntry(row.dataset.depreciationPeriod, row.dataset.depreciationNumber); }
  });
  const closeEntryDialog = () => detailDialog.close();
  get("fixedAssetDepEntryClose").addEventListener("click", closeEntryDialog);
  get("fixedAssetDepEntryCancel").addEventListener("click", closeEntryDialog);
  detailDialog.addEventListener("click", event => { if (event.target === detailDialog) detailDialog.close(); });
  get("fixedAssetDepEntryForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!get("fixedAssetDepEntryForm").reportValidity() || editingDepreciationStorageKey !== STORAGE.fixedAssets) { showEntryError(); return; }
    const postingDate = get("fixedAssetDepEntryDate").value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(postingDate) || postingDate.slice(0, 7) !== editingDepreciationPeriod) { showEntryError(); return; }
    const assets = readAssets();
    const changes = [...get("fixedAssetDepEntryRows").querySelectorAll("tr[data-dep-entry-id]")];
    for (const card of changes) {
      const asset = assets.find(item => item.id === card.dataset.depAssetId);
      const entries = Array.isArray(asset?.depreciationEntries) ? asset.depreciationEntries : [];
      const entry = entries.find(item => item.id === card.dataset.depEntryId && item.period === editingDepreciationPeriod);
      const amount = Number(card.querySelector('[data-dep-entry-field="amount"]').value);
      if (!asset || !entry || !Number.isFinite(amount) || amount < 0) { showEntryError(); return; }
      const oldAmount = Number(entry.amount) || 0;
      const currentBalance = Number.isFinite(Number(asset.bookValue)) ? Number(asset.bookValue) : Number(asset.cost) - Number(asset.initialDepreciation || 0) - entries.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const nextBalance = Math.round((currentBalance + oldAmount - amount) * 100) / 100;
      if (!Number.isFinite(nextBalance) || nextBalance < 0) { showEntryError(); return; }
      const value = field => card.querySelector(`[data-dep-entry-field="${field}"]`).value.trim();
      Object.assign(entry, { date: postingDate, amount: Math.round(amount * 100) / 100, description: value("description"), expenseAccount: value("expenseAccount"), depreciationAccount: value("depreciationAccount"), assetAccount: value("assetAccount"), objectName: value("objectName") });
      asset.bookValue = nextBalance;
      asset.updatedAt = new Date().toISOString();
    }
    try { saveList(STORAGE.fixedAssets, assets); }
    catch { showEntryError(); return; }
    detailDialog.close();
    renderRegister();
    window.refreshAccountingLedger?.();
    displayMessage("assetDepEntrySaved", false, true);
  });
  const exportRegister = format => {
    const rows = collectRegisterRows();
    const headings = ["assetDepNumber", "assetDepYear", "assetDepMonth", "assetDepPostingDate", "assetDepPeriodAmount", "assetDepCurrency"].map(copy);
    const values = rows.map((row, index) => [index + 1, row.year, row.month, formatDate(row.date), Number(row.amount).toFixed(2), row.currency]);
    if (format === "csv") {
      const csv = [headings, ...values].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\r\n");
      triggerBlobDownload(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `amortisatsioon-${localDate()}.csv`);
    } else if (format === "xls") {
      const sheet = [headings, ...values].map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="String">${escapeHtml(value)}</Data></Cell>`).join("")}</Row>`).join("");
      triggerBlobDownload(new Blob([`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Amortisatsioon"><Table>${sheet}</Table></Worksheet></Workbook>`], { type: "application/vnd.ms-excel;charset=utf-8" }), `amortisatsioon-${localDate()}.xls`);
    } else {
      const table = `<h1>${escapeHtml(copy("fixedAssetsDepreciation"))}</h1><table><thead><tr>${headings.map(value => `<th>${escapeHtml(value)}</th>`).join("")}</tr></thead><tbody>${values.map(row => `<tr>${row.map(value => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      const popup = window.open("", "_blank", "width=1100,height=760");
      if (!popup) { displayMessage("assetDepError", true, true); return; }
      popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(copy("fixedAssetsDepreciation"))}</title><style>body{font:12px Arial;padding:24px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ccc;text-align:left}th{background:#d1e0e5}</style></head><body>${table}</body></html>`);
      popup.document.close();
      popup.opener = null;
      popup.focus();
      popup.print();
    }
  };
  view.querySelectorAll("[data-depreciation-export]").forEach(button => button.addEventListener("click", () => exportRegister(button.dataset.depreciationExport)));
  const calculate = () => {
    const period = get("fixedAssetDepPeriod").value;
    const match = /^(\d{4})-(\d{2})$/.exec(period);
    get("fixedAssetDepSave").disabled = true;
    get("fixedAssetDepMessage").hidden = true;
    if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
      preview = [];
      renderRows([]);
      displayMessage("assetDepInvalidPeriod", true);
      return;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const periodStart = `${period}-01`;
    const periodEnd = `${period}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`;
    const assets = readAssets();
    const results = [];
    for (const asset of assets) {
      if (asset.active === false || !Number.isFinite(Number(asset.depreciationRate)) || Number(asset.depreciationRate) <= 0) continue;
      const frequency = asset.depreciationPeriod || "month";
      if (!["month", "quarter", "year"].includes(frequency)) continue;
      if (frequency === "quarter" && ![3, 6, 9, 12].includes(month)) continue;
      if (frequency === "year" && month !== 12) continue;
      if (!asset.depreciationStart) {
        results.push({ asset, issue: "assetDepMissingStart" });
        continue;
      }
      if (asset.depreciationStart > periodEnd || asset.depreciationEnd && asset.depreciationEnd < periodStart) continue;
      const entries = Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : [];
      if (entries.some(entry => entry?.period === period)) {
        results.push({ asset, issue: "assetDepAlready" });
        continue;
      }
      const alreadyDepreciated = entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
      const bookValue = Number.isFinite(Number(asset.bookValue)) ? Number(asset.bookValue) : Math.max(0, Number(asset.cost) - Number(asset.initialDepreciation || 0) - alreadyDepreciated);
      const rate = Number(asset.depreciationRate);
      if (!Number.isFinite(bookValue) || bookValue <= 0) continue;
      if (!Number.isFinite(Number(asset.cost)) || Number(asset.cost) <= 0) continue;
      if (!String(asset.expenseAccount || "").trim() || !String(asset.depreciationAccount || "").trim()) {
        results.push({ asset, issue: "assetDepMissingAccounts" });
        continue;
      }
      const annual = Math.round(Number(asset.cost) * rate) / 100;
      const periodsPerYear = frequency === "month" ? 12 : frequency === "quarter" ? 4 : 1;
      const amount = Math.min(bookValue, Math.round(annual / periodsPerYear * 100) / 100);
      if (amount <= 0) continue;
      results.push({ asset, bookValue, rate, amount, date: periodEnd, period });
    }
    preview = results.filter(row => !row.issue);
    previewSnapshot = localStorage.getItem(STORAGE.fixedAssets) || "[]";
    previewStorageKey = STORAGE.fixedAssets;
    renderRows(preview);
    const issues = results.filter(row => row.issue);
    if (preview.length) {
      get("fixedAssetDepSave").disabled = false;
      if (issues.length) displayMessage(`${issues.length}: ${copy(issues[0].issue)}`);
    } else if (issues.length) displayMessage(`${issues.length}: ${copy(issues[0].issue)}`, true);
    else displayMessage(assets.length ? "assetDepNoDue" : "assetDepNoAssets");
    applyLanguage(language);
  };
  const save = () => {
    if (!preview.length || previewStorageKey !== STORAGE.fixedAssets || previewSnapshot !== (localStorage.getItem(STORAGE.fixedAssets) || "[]")) {
      calculate();
      displayMessage("assetDepStale", true);
      return;
    }
    if (denyAction("expenses")) return;
    const period = get("fixedAssetDepPeriod").value;
    const assets = readAssets();
    const byId = new Map(assets.map(asset => [asset.id, asset]));
    for (const row of preview) {
      const asset = byId.get(row.asset.id);
      if (!asset) continue;
      const entries = Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : [];
      if (entries.some(entry => entry?.period === period)) continue;
      const amount = Math.min(row.bookValue, row.amount);
      if (amount <= 0) continue;
      const documentNumber = `PV-${String(asset.code || asset.id.slice(0, 8))}-${period}`;
      const entry = { id: crypto.randomUUID(), period, date: row.date, amount, documentNumber, expenseAccount: String(asset.expenseAccount), depreciationAccount: String(asset.depreciationAccount), objectName: String(asset.objectName || ""), description: String(asset.description || "") };
      asset.depreciationEntries = [...entries, entry];
      asset.bookValue = Math.round((row.bookValue - amount) * 100) / 100;
      asset.updatedAt = new Date().toISOString();
    }
    try {
      saveList(STORAGE.fixedAssets, assets);
    } catch {
      displayMessage("assetDepError", true);
      return;
    }
    preview = [];
    editor.close();
    renderRegister();
    displayMessage("assetDepSaved", false, true);
    get("fixedAssetsView")?.dispatchEvent(new Event("fixed-assets-open"));
  };
  get("fixedAssetDepCalculate").addEventListener("click", calculate);
  get("fixedAssetDepPeriod").addEventListener("change", calculate);
  get("fixedAssetDepSave").addEventListener("click", save);
  view.addEventListener("fixed-assets-open", () => { renderRegister(); get("fixedAssetDepRegisterMessage").hidden = true; });
  get("companyPicker")?.addEventListener("change", () => queueMicrotask(renderRegister));
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(() => { renderRows(preview); applyLanguage(language); })));

  const baseGetLedgerAccounts = getLedgerAccounts;
  getLedgerAccounts = (...args) => {
    const accounts = baseGetLedgerAccounts(...args);
    const known = new Set(accounts.map(account => account.code));
    for (const asset of readAssets()) {
      for (const code of [asset.expenseAccount, asset.depreciationAccount, asset.assetAccount].map(value => String(value || "").trim()).filter(Boolean)) {
        if (!known.has(code)) { accounts.push({ code, label: code }); known.add(code); }
      }
    }
    return accounts;
  };
  const baseGetLedgerObjects = getLedgerObjects;
  getLedgerObjects = (...args) => [...new Set([...baseGetLedgerObjects(...args), ...readAssets().map(asset => String(asset.objectName || "").trim()).filter(Boolean)])].sort((first, second) => first.localeCompare(second, language, { sensitivity: "base" }));
  const baseCreateLedgerEntries = createLedgerEntries;
  createLedgerEntries = (start, end) => {
    const entries = baseCreateLedgerEntries(start, end);
    const accounts = Object.fromEntries(getLedgerAccounts().map(account => [account.code, account.label]));
    for (const asset of readAssets()) {
      for (const entry of Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : []) {
        if (!entry?.date || entry.date < start || entry.date > end || !Number.isFinite(Number(entry.amount)) || Number(entry.amount) <= 0) continue;
        const common = { date: entry.date, documentNumber: String(entry.documentNumber || ""), object: String(entry.objectName || ""), description: String(entry.description || "") };
        entries.push(
          { ...common, id: `asset-dep-${entry.id}-expense`, accountCode: String(entry.expenseAccount), account: accounts[String(entry.expenseAccount)] || String(entry.expenseAccount), debit: Number(entry.amount), credit: 0 },
          { ...common, id: `asset-dep-${entry.id}-depreciation`, accountCode: String(entry.depreciationAccount), account: accounts[String(entry.depreciationAccount)] || String(entry.depreciationAccount), debit: 0, credit: Number(entry.amount) }
        );
      }
    }
    return entries.sort((first, second) => String(first.date).localeCompare(String(second.date)) || first.id.localeCompare(second.id) || first.accountCode.localeCompare(second.accountCode));
  };
  Object.assign(ruTexts, { ledgerDepreciationDescription: "Амортизация основного средства", ledgerDisclaimer: "Проводки сформированы из продаж, платежей, расходов и сохранённых начислений амортизации. Начальные остатки и оплаты счетов не ведутся; отчёт не является официальной бухгалтерской книгой." });
  Object.assign(etTexts, { ledgerDepreciationDescription: "Põhivara amortisatsioon", ledgerDisclaimer: "Kanded on koostatud müügi-, makse-, kuluandmete ja salvestatud põhivara amortisatsiooni põhjal. Algsaldosid ja arvete maksmist ei hallata; see ei ole ametlik pearaamat." });
  renderRegister();
})();