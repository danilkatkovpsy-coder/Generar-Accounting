(() => {
  const menu = document.getElementById("fixedAssetsNavMenu");
  if (!menu || document.getElementById("fixedAssetsRegister")) return;
  Object.assign(ruTexts, {
    assetAdd: "Добавить", assetBuy: "Купить", assetMore: "Ещё", assetHelp: "Справка", assetGroup: "Группа",
    assetAllGroups: "Все группы", assetSearch: "Код или описание актива", assetObject: "Объект", assetShowInactive: "Показывать неактивные",
    assetFilter: "ФИЛЬТРОВАТЬ", assetClear: "Очистить фильтры", assetCode: "КОД", assetDescription: "ОПИСАНИЕ",
    assetCost: "СТОИМОСТЬ ПРИОБРЕТЕНИЯ", assetBookValue: "ОСТАТОК", assetAcquired: "ПРИОБРЕТЕНО",
    assetStart: "НАЧАЛО АМОРТИЗАЦИИ", assetRate: "АМОРТ. %", assetEnd: "КОНЕЦ АМОРТИЗАЦИИ",
    assetResponsible: "ОТВЕТСТВЕННЫЙ", assetTotal: "Всего", assetRows: "Строк на странице", assetEmpty: "Основных средств пока нет.",
    assetNoResults: "Активов по заданным фильтрам нет.", assetNewTitle: "Новое основное средство", assetEditTitle: "Изменить основное средство",
    assetSave: "Сохранить", assetCancel: "Отмена", assetActive: "Активно", assetSaved: "Основное средство сохранено.",
    assetSaveError: "Не удалось сохранить основное средство.", assetInvalid: "Проверьте код, описание, даты, стоимость, остаток и процент амортизации.",
    assetDuplicate: "Такой код уже используется.", assetWrongCompany: "Компания изменилась. Откройте запись заново.",
    assetHelpText: "Остаток — введённая учетная стоимость. Изменение ставки само по себе не проводит амортизацию.",
    assetLocalSaved: "Сохранено на этом устройстве. Облачная синхронизация основных средств пока недоступна.",
    assetLocalMode: "Основные средства сохраняются на этом устройстве. Облачная синхронизация пока недоступна.",
    assetPdf: "Печать / PDF", assetSettingsAction: "Настройки основных средств", assetFirst: "Первая страница",
    assetPrevious: "Предыдущая страница", assetNext: "Следующая страница", assetLast: "Последняя страница"
  });
  Object.assign(etTexts, {
    assetAdd: "Lisa uus", assetBuy: "Osta", assetMore: "Rohkem", assetHelp: "Abi", assetGroup: "Põhivara grupp",
    assetAllGroups: "Kõik grupid", assetSearch: "Põhivara kood või kirjeldus", assetObject: "Objekt", assetShowInactive: "Näita mitteaktiivseid",
    assetFilter: "FILTREERI", assetClear: "Tühjenda filtrid", assetCode: "KOOD", assetDescription: "KIRJELDUS",
    assetCost: "SOETUSMAKSUMUS", assetBookValue: "JÄÄK", assetAcquired: "SOETATUD", assetStart: "ARV ALGUS",
    assetRate: "AMORT. %", assetEnd: "ARV LÕPP", assetResponsible: "VASTUTAV ISIK", assetTotal: "Kokku",
    assetRows: "Ridu lehel", assetEmpty: "Põhivara pole veel lisatud.", assetNoResults: "Valitud filtritega põhivara pole.",
    assetNewTitle: "Uus põhivara", assetEditTitle: "Muuda põhivara", assetSave: "Salvesta", assetCancel: "Tühista",
    assetActive: "Aktiivne", assetSaved: "Põhivara salvestati.", assetSaveError: "Põhivara ei saanud salvestada.",
    assetInvalid: "Kontrollige koodi, kirjeldust, kuupäevi, soetusmaksumust, jääki ja amortisatsiooniprotsenti.",
    assetDuplicate: "See kood on juba kasutusel.", assetWrongCompany: "Ettevõte on muutunud. Avage kirje uuesti.",
    assetHelpText: "Jääk on sisestatud raamatupidamislik väärtus. Määra muutmine ei kirjenda automaatselt amortisatsiooni.",
    assetLocalSaved: "Salvestatud selles seadmes. Põhivara pilvesünkroonimine ei ole veel saadaval.",
    assetLocalMode: "Põhivara salvestatakse selles seadmes. Pilvesünkroonimine ei ole veel saadaval.",
    assetPdf: "Prindi / PDF", assetSettingsAction: "Põhivara seaded", assetFirst: "Esimene lehekülg",
    assetPrevious: "Eelmine lehekülg", assetNext: "Järgmine lehekülg", assetLast: "Viimane lehekülg"
  });
  const copy = key => translateCopy(key, key);
  const get = id => document.getElementById(id);
  const icons = {
    add: '<path d="M12 5v14M5 12h14"></path>', buy: '<path d="M18 5a7 7 0 1 0 0 14M3 10h12M3 14h12"></path>',
    more: '<circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle>',
    help: '<circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-1 .8-1.5 1.1-1.5 2.7M12 17h.01"></path>',
    clear: '<path d="m6 6 12 12M18 6 6 18"></path>', first: '<path d="M5 5v14m12-14-7 7 7 7"></path>',
    previous: '<path d="m15 5-7 7 7 7"></path>', next: '<path d="m9 5 7 7-7 7"></path>', last: '<path d="M19 5v14M7 5l7 7-7 7"></path>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  let view = get("fixedAssetsView");
  if (!view) {
    view = document.createElement("section");
    view.id = "fixedAssetsView";
    view.className = "app-view payments-subview fixed-assets-subview";
    view.hidden = true;
    document.querySelector("main").insertBefore(view, get("reportsView"));
  }
  view.innerHTML = `<div class="view-heading fixed-assets-heading"><div><h1 data-i18n="fixedAssetsList">${copy("fixedAssetsList")}</h1><div class="fixed-assets-export-links"><button type="button" data-asset-export="pdf" title="${copy("assetPdf")}">PDF</button><button type="button" data-asset-export="xls">XLS</button><button type="button" data-asset-export="csv">CSV</button></div></div><div class="fixed-assets-actions"><button type="button" class="primary-button" id="fixedAssetAdd">${icon("add")}<span data-i18n="assetAdd">${copy("assetAdd")}</span></button><button type="button" class="secondary-button" id="fixedAssetBuy">${icon("buy")}<span data-i18n="assetBuy">${copy("assetBuy")}</span></button><div class="fixed-assets-menu-wrap"><button type="button" class="secondary-button" id="fixedAssetMore" aria-haspopup="menu" aria-expanded="false" aria-controls="fixedAssetMoreMenu">${icon("more")}<span data-i18n="assetMore">${copy("assetMore")}</span></button><div class="fixed-assets-small-menu" id="fixedAssetMoreMenu" role="menu" hidden><button type="button" role="menuitem" id="fixedAssetSettings" data-i18n="assetSettingsAction">${copy("assetSettingsAction")}</button><button type="button" role="menuitem" data-asset-export="csv">CSV</button></div></div><div class="fixed-assets-menu-wrap"><button type="button" class="secondary-button" id="fixedAssetHelp" aria-expanded="false" aria-controls="fixedAssetHelpPanel">${icon("help")}<span data-i18n="assetHelp">${copy("assetHelp")}</span></button><div class="fixed-assets-help" id="fixedAssetHelpPanel" data-i18n="assetHelpText" hidden>${copy("assetHelpText")}</div></div></div></div><section class="data-panel" id="fixedAssetsRegister"><div class="fixed-assets-filterbar"><label class="field"><span class="fixed-assets-visually-hidden" data-i18n="assetGroup">${copy("assetGroup")}</span><select id="fixedAssetGroupFilter"></select></label><label class="field"><span class="fixed-assets-visually-hidden" data-i18n="assetSearch">${copy("assetSearch")}</span><input id="fixedAssetSearch" type="search" data-i18n-placeholder="assetSearch" placeholder="${copy("assetSearch")}"></label><label class="field"><span class="fixed-assets-visually-hidden" data-i18n="assetObject">${copy("assetObject")}</span><input id="fixedAssetObjectFilter" type="search" data-i18n-placeholder="assetObject" placeholder="${copy("assetObject")}"></label><label class="fixed-assets-inactive"><span data-i18n="assetShowInactive">${copy("assetShowInactive")}</span><input id="fixedAssetShowInactive" type="checkbox"></label><button type="button" class="text-button fixed-assets-clear" id="fixedAssetClear" aria-label="${copy("assetClear")}" title="${copy("assetClear")}">${icon("clear")}</button><button type="button" class="primary-button" id="fixedAssetFilter" data-i18n="assetFilter">${copy("assetFilter")}</button></div><div class="table-wrap fixed-assets-table-wrap"><table class="data-table fixed-assets-table"><thead id="fixedAssetsTableHead"></thead><tbody id="fixedAssetsRows"></tbody></table></div><div class="fixed-assets-footer"><strong id="fixedAssetsCount"></strong><nav class="register-page-numbers" id="fixedAssetsPages"></nav><label class="fixed-assets-page-size"><span data-i18n="assetRows">${copy("assetRows")}</span><select id="fixedAssetsPageSize"><option value="10">10</option><option value="25" selected>25</option><option value="50">50</option><option value="100">100</option></select></label></div></section>`;
  const columns = [["code", "assetCode"], ["description", "assetDescription"], ["cost", "assetCost"], ["bookValue", "assetBookValue"], ["acquiredDate", "assetAcquired"], ["depreciationStart", "assetStart"], ["depreciationRate", "assetRate"], ["depreciationEnd", "assetEnd"], ["responsible", "assetResponsible"], ["objectName", "assetObject"]];
  const syncStatus = document.createElement("p");
  syncStatus.className = "fixed-asset-error";
  syncStatus.hidden = true;
  get("fixedAssetsRegister").prepend(syncStatus);
  get("fixedAssetsTableHead").innerHTML = `<tr>${columns.map(([key, label]) => `<th><button type="button" class="fixed-assets-sort" data-asset-sort="${key}"><span data-i18n="${label}">${copy(label)}</span><span class="fixed-assets-sort-indicator" aria-hidden="true">↕</span></button></th>`).join("")}</tr>`;
  const dialog = document.createElement("dialog");
  dialog.className = "fixed-asset-dialog";
  dialog.id = "fixedAssetDialog";
  dialog.setAttribute("aria-labelledby", "fixedAssetDialogTitle");
  const fields = [["code", "assetCode", "text"], ["description", "assetDescription", "text"], ["group", "assetGroup", "text"], ["cost", "assetCost", "number"], ["bookValue", "assetBookValue", "number"], ["acquiredDate", "assetAcquired", "date"], ["depreciationStart", "assetStart", "date"], ["depreciationRate", "assetRate", "number"], ["depreciationEnd", "assetEnd", "date"], ["responsible", "assetResponsible", "text"], ["objectName", "assetObject", "text"]];
  dialog.innerHTML = `<form id="fixedAssetForm"><div class="fixed-asset-dialog-heading"><h2 id="fixedAssetDialogTitle"></h2><button type="button" class="fixed-assets-clear" id="fixedAssetDialogClose" aria-label="${copy("assetCancel")}">${icon("clear")}</button></div><div class="fixed-asset-form-grid">${fields.map(([key, label, type]) => `<div class="field"><label for="assetField-${key}" data-i18n="${label}">${copy(label)}</label><input id="assetField-${key}" data-asset-field="${key}" type="${type}" ${["code", "description", "cost", "bookValue", "acquiredDate", "depreciationRate"].includes(key) ? "required" : ""} ${type === "number" ? `min="0" step="0.01" ${key === "depreciationRate" ? 'max="100"' : ""}` : 'maxlength="300"'}></div>`).join("")}<label class="fixed-assets-inactive"><input id="assetField-active" type="checkbox" checked><span data-i18n="assetActive">${copy("assetActive")}</span></label></div><p id="fixedAssetError" class="fixed-asset-error" role="alert" hidden></p><div class="fixed-asset-dialog-actions"><button type="button" class="secondary-button" id="fixedAssetCancel" data-i18n="assetCancel">${copy("assetCancel")}</button><button type="submit" class="primary-button" id="fixedAssetSave" data-i18n="assetSave">${copy("assetSave")}</button></div></form>`;
  document.body.append(dialog);
  const form = get("fixedAssetForm");
  let assets = [];
  let storageKey = "";
  let serialized = "";
  let editingId = null;
  let editingKey = "";
  let page = 1;
  let pageSize = 25;
  let sort = "code";
  let direction = 1;
  const readAssets = () => {
    const nextKey = STORAGE.fixedAssets;
    const nextSerialized = localStorage.getItem(nextKey) || "[]";
    if (storageKey !== nextKey) {
      if (dialog.open) dialog.close();
      get("fixedAssetSearch").value = "";
      get("fixedAssetObjectFilter").value = "";
      get("fixedAssetGroupFilter").value = "";
      get("fixedAssetShowInactive").checked = false;
      page = 1;
    }
    if (storageKey !== nextKey || serialized !== nextSerialized) {
      const data = readStorage(nextKey, []);
      assets = Array.isArray(data) ? data.filter(asset => asset && typeof asset.id === "string") : [];
      storageKey = nextKey;
      serialized = nextSerialized;
    }
  };
  const filtered = () => {
    const search = get("fixedAssetSearch").value.trim().toLocaleLowerCase(language);
    const object = get("fixedAssetObjectFilter").value.trim().toLocaleLowerCase(language);
    const group = get("fixedAssetGroupFilter").value;
    return assets.filter(asset => (get("fixedAssetShowInactive").checked || asset.active !== false)
      && (!group || asset.group === group)
      && `${asset.code || ""} ${asset.description || ""}`.toLocaleLowerCase(language).includes(search)
      && String(asset.objectName || "").toLocaleLowerCase(language).includes(object))
      .sort((first, second) => direction * (["cost", "bookValue", "depreciationRate"].includes(sort)
        ? Number(first[sort] || 0) - Number(second[sort] || 0)
        : String(first[sort] || "").localeCompare(String(second[sort] || ""), language, { numeric: true, sensitivity: "base" })));
  };
  const displayValue = (asset, key) => {
    const value = asset[key];
    if (value == null || value === "") return "—";
    if (["cost", "bookValue"].includes(key)) return Number.isFinite(Number(value)) ? money(value) : "—";
    if (key === "depreciationRate") return `${money(value)} %`;
    if (["acquiredDate", "depreciationStart", "depreciationEnd"].includes(key)) return formatDate(value);
    return String(value);
  };
  const render = () => {
    readAssets();
    const groups = [...new Set(assets.map(asset => asset.group).filter(Boolean))].sort((first, second) => first.localeCompare(second, language));
    const select = get("fixedAssetGroupFilter");
    const selected = select.value;
    select.replaceChildren(new Option(copy("assetAllGroups"), ""));
    groups.forEach(group => select.add(new Option(group, group)));
    select.value = groups.includes(selected) ? selected : "";
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    page = Math.min(page, pages);
    get("fixedAssetsRows").innerHTML = rows.slice((page - 1) * pageSize, page * pageSize).map(asset => `<tr data-asset-id="${escapeHtml(asset.id)}" tabindex="0" class="${asset.active === false ? "is-inactive" : ""}" aria-label="${escapeHtml(copy("assetEditTitle"))} ${escapeHtml(asset.code)}">${columns.map(([key]) => `<td class="asset-column-${key}">${escapeHtml(displayValue(asset, key))}</td>`).join("")}</tr>`).join("") || `<tr><td class="fixed-assets-empty" colspan="10">${escapeHtml(copy(assets.length ? "assetNoResults" : "assetEmpty"))}</td></tr>`;
    get("fixedAssetsCount").textContent = `${copy("assetTotal")}: ${rows.length}`;
    const pagesRoot = get("fixedAssetsPages");
    pagesRoot.replaceChildren();
    const addPage = (label, target, disabled, symbol = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = disabled;
      if (symbol) { button.innerHTML = icon(symbol); button.setAttribute("aria-label", copy(label)); }
      else { button.textContent = label; if (target === page) button.setAttribute("aria-current", "page"); }
      button.addEventListener("click", () => { page = target; render(); });
      pagesRoot.append(button);
    };
    addPage("assetFirst", 1, page === 1, "first"); addPage("assetPrevious", page - 1, page === 1, "previous");
    const start = Math.max(1, Math.min(page - 2, pages - 4));
    for (let number = start; number <= Math.min(pages, start + 4); number++) addPage(String(number), number, false);
    addPage("assetNext", page + 1, page === pages, "next"); addPage("assetLast", pages, page === pages, "last");
    const caption = document.createElement("span"); caption.textContent = `${page} / ${pages}`; pagesRoot.append(caption);
    get("fixedAssetAdd").disabled = !can("expenses"); get("fixedAssetBuy").disabled = !can("expenses");
    get("fixedAssetSettings").hidden = !can("companySettings");
    syncStatus.hidden = !cloudWorkspace || fixedAssetsCloudSupported;
    syncStatus.textContent = copy("assetLocalMode");
    view.querySelectorAll("[data-asset-export]").forEach(button => { button.disabled = !rows.length || !can("exportReports"); });
    view.querySelectorAll("[data-asset-sort]").forEach(button => {
      button.querySelector(".fixed-assets-sort-indicator").textContent = button.dataset.assetSort === sort ? direction > 0 ? "↑" : "↓" : "↕";
      button.closest("th").setAttribute("aria-sort", button.dataset.assetSort === sort ? direction > 0 ? "ascending" : "descending" : "none");
    });
    get("fixedAssetClear").title = copy("assetClear"); get("fixedAssetClear").setAttribute("aria-label", copy("assetClear"));
    applyLanguage(language);
  };
  const openEditor = id => {
    if (!can("expenses")) { denyAction("expenses"); return; }
    readAssets();
    const asset = assets.find(item => item.id === id);
    if (id && !asset) return;
    form.reset();
    delete get("assetField-bookValue").dataset.manual;
    editingId = asset?.id || null; editingKey = storageKey;
    const titleKey = asset ? "assetEditTitle" : "assetNewTitle";
    get("fixedAssetDialogTitle").dataset.i18n = titleKey; get("fixedAssetDialogTitle").textContent = copy(titleKey);
    fields.forEach(([key]) => { get(`assetField-${key}`).value = asset?.[key] ?? ""; });
    if (!asset) {
      const maximum = assets.reduce((value, item) => /^\d+$/.test(item.code) ? Math.max(value, Number(item.code)) : value, 0);
      get("assetField-code").value = String(maximum + 1).padStart(2, "0");
      get("assetField-acquiredDate").value = localDate(); get("assetField-depreciationRate").value = "0";
    } else get("assetField-bookValue").dataset.manual = "true";
    get("assetField-active").checked = asset?.active !== false;
    get("fixedAssetError").hidden = true;
    dialog.showModal(); get("assetField-description").focus();
  };
  get("fixedAssetAdd").addEventListener("click", () => openEditor());
  get("fixedAssetBuy").addEventListener("click", () => { if (!can("expenses")) { denyAction("expenses"); return; } resetSupplierInvoiceForm(); setSupplierInvoicePage(true); });
  get("fixedAssetMore").addEventListener("click", () => { const open = get("fixedAssetMoreMenu").hidden; get("fixedAssetMoreMenu").hidden = !open; get("fixedAssetMore").setAttribute("aria-expanded", String(open)); });
  get("fixedAssetHelp").addEventListener("click", () => { const open = get("fixedAssetHelpPanel").hidden; get("fixedAssetHelpPanel").hidden = !open; get("fixedAssetHelp").setAttribute("aria-expanded", String(open)); });
  get("fixedAssetSettings").addEventListener("click", () => { get("fixedAssetMoreMenu").hidden = true; get("fixedAssetMore").setAttribute("aria-expanded", "false"); menu.querySelector('[data-target="fixedAssetsSettingsView"]').click(); });
  get("assetField-cost").addEventListener("input", () => { if (!get("assetField-bookValue").dataset.manual) get("assetField-bookValue").value = get("assetField-cost").value; });
  get("assetField-bookValue").addEventListener("input", event => { event.target.dataset.manual = "true"; });
  ["fixedAssetDialogClose", "fixedAssetCancel"].forEach(id => get(id).addEventListener("click", () => dialog.close()));
  const error = key => { get("fixedAssetError").textContent = copy(key); get("fixedAssetError").hidden = false; };
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!can("expenses")) { denyAction("expenses"); return; }
    if (editingKey !== STORAGE.fixedAssets) { error("assetWrongCompany"); return; }
    readAssets();
    const asset = Object.fromEntries(fields.map(([key]) => [key, get(`assetField-${key}`).value.trim()]));
    for (const key of ["cost", "bookValue", "depreciationRate"]) asset[key] = Number(asset[key]);
    if (!asset.code || !asset.description || !asset.acquiredDate || ![asset.cost, asset.bookValue, asset.depreciationRate].every(Number.isFinite) || asset.cost < 0 || asset.bookValue < 0 || asset.bookValue > asset.cost || asset.depreciationRate < 0 || asset.depreciationRate > 100 || asset.depreciationStart && asset.depreciationEnd && asset.depreciationStart > asset.depreciationEnd) { error("assetInvalid"); return; }
    if (assets.some(item => item.id !== editingId && String(item.code || "").toLocaleLowerCase(language) === asset.code.toLocaleLowerCase(language))) { error("assetDuplicate"); return; }
    const existing = assets.find(item => item.id === editingId);
    if (editingId && !existing) { error("assetSaveError"); return; }
    const record = { ...existing, ...asset, id: existing?.id || crypto.randomUUID(), active: get("assetField-active").checked, currency: "EUR", updatedAt: new Date().toISOString() };
    const next = existing ? assets.map(item => item.id === editingId ? record : item) : [record, ...assets];
    try { saveList(STORAGE.fixedAssets, next); }
    catch { error("assetSaveError"); return; }
    assets = next; serialized = JSON.stringify(next);
    dialog.close(); render(); showMessage(copy(cloudWorkspace && !fixedAssetsCloudSupported ? "assetLocalSaved" : "assetSaved"));
  });
  get("fixedAssetsRows").addEventListener("click", event => { const row = event.target.closest("[data-asset-id]"); if (row) openEditor(row.dataset.assetId); });
  get("fixedAssetsRows").addEventListener("keydown", event => { const row = event.target.closest("[data-asset-id]"); if (row && event.target === row && ["Enter", " "].includes(event.key)) { event.preventDefault(); openEditor(row.dataset.assetId); } });
  get("fixedAssetsTableHead").addEventListener("click", event => { const button = event.target.closest("[data-asset-sort]"); if (!button) return; direction = sort === button.dataset.assetSort ? -direction : 1; sort = button.dataset.assetSort; page = 1; render(); });
  get("fixedAssetFilter").addEventListener("click", () => { page = 1; render(); });
  get("fixedAssetClear").addEventListener("click", () => { get("fixedAssetGroupFilter").value = ""; get("fixedAssetSearch").value = ""; get("fixedAssetObjectFilter").value = ""; get("fixedAssetShowInactive").checked = false; page = 1; render(); });
  get("fixedAssetShowInactive").addEventListener("change", () => { page = 1; render(); });
  view.querySelectorAll('.fixed-assets-filterbar input[type="search"]').forEach(input => input.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); page = 1; render(); } }));
  get("fixedAssetsPageSize").addEventListener("change", event => { pageSize = Number(event.target.value); page = 1; render(); });
  const printRoot = document.createElement("div"); printRoot.id = "fixedAssetsPrint"; printRoot.hidden = true; document.body.append(printRoot);
  const stopPrinting = () => { document.body.classList.remove("fixed-assets-printing"); printRoot.hidden = true; printRoot.replaceChildren(); };
  view.querySelectorAll("[data-asset-export]").forEach(button => button.addEventListener("click", () => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    readAssets(); const rows = filtered(); if (!rows.length) return;
    get("fixedAssetMoreMenu").hidden = true; get("fixedAssetMore").setAttribute("aria-expanded", "false");
    const format = button.dataset.assetExport;
    const data = [columns.map(([, label]) => copy(label)), ...rows.map(asset => columns.map(([key]) => asset[key] ?? ""))];
    if (format === "pdf") {
      printRoot.innerHTML = `<h1>${escapeHtml(copy("fixedAssetsList"))}</h1><p>${escapeHtml(currentSeller()?.name || "")} · EUR · ${escapeHtml(formatDate(localDate()))}</p><table><thead><tr>${data[0].map(value => `<th>${escapeHtml(value)}</th>`).join("")}</tr></thead><tbody>${rows.map(asset => `<tr>${columns.map(([key]) => `<td>${escapeHtml(displayValue(asset, key))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      printRoot.hidden = false; document.body.classList.add("fixed-assets-printing"); window.addEventListener("afterprint", stopPrinting, { once: true });
      try { window.print(); } catch { stopPrinting(); }
      return;
    }
    const cell = value => { let text = String(value); if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; };
    const blob = format === "csv" ? new Blob(["\ufeff", data.map(row => row.map(cell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" })
      : new Blob([`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Pohivarad"><Table>${data.map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="String">${escapeHtml(String(value))}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet></Workbook>`], { type: "application/vnd.ms-excel;charset=utf-8" });
    triggerBlobDownload(blob, `pohivarad-${localDate()}.${format}`);
  }));
  document.addEventListener("click", event => { if (!event.target.closest(".fixed-assets-menu-wrap")) { get("fixedAssetMoreMenu").hidden = true; get("fixedAssetHelpPanel").hidden = true; get("fixedAssetMore").setAttribute("aria-expanded", "false"); get("fixedAssetHelp").setAttribute("aria-expanded", "false"); } });
  document.addEventListener("keydown", event => { if (event.key === "Escape") { get("fixedAssetMoreMenu").hidden = true; get("fixedAssetHelpPanel").hidden = true; } });
  view.addEventListener("fixed-assets-open", render);
  get("companyPicker")?.addEventListener("change", () => queueMicrotask(render));
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(render)));
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); render(); };
  render();
})();