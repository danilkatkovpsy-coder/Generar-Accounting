(() => {
  const reportViewId = "fixedAssetsReportView";
  const get = id => document.getElementById(id);
  Object.assign(ruTexts, {
    fixedAssetReportIntro: "Стоимость приобретения, износ и остаточная стоимость основных средств за выбранный период.",
    fixedAssetReportPeriod: "Период", fixedAssetReportAssets: "Основные средства", fixedAssetReportGroups: "Группы основных средств",
    fixedAssetReportAll: "Все", fixedAssetReportSelected: "Выбрано", fixedAssetReportSearch: "Поиск…",
    fixedAssetReportAdd: "Добавить →", fixedAssetReportRemove: "← Убрать", fixedAssetReportGenerate: "Сформировать",
    fixedAssetReportEmpty: "По заданным параметрам основных средств нет.", fixedAssetReportNoData: "Выберите период и нажмите «Сформировать».",
    fixedAssetReportCode: "Код", fixedAssetReportDescription: "Описание", fixedAssetReportCost: "Стоимость приобретения",
    fixedAssetReportPeriodDep: "Износ за период", fixedAssetReportTotalDep: "Износ всего", fixedAssetReportBookValue: "Остаточная стоимость",
    fixedAssetReportResults: "Отчёт", fixedAssetReportHelp: "Суммы рассчитаны по карточкам основных средств и сохранённым начислениям. Продажи, списания, обесценение и улучшения не включены, если они не отражены в начислениях.",
    fixedAssetReportInvalidPeriod: "Проверьте даты отчёта.", fixedAssetReportExportPdf: "PDF", fixedAssetReportExportXls: "XLS", fixedAssetReportExportCsv: "CSV"
  });
  Object.assign(etTexts, {
    fixedAssetReportIntro: "Põhivarade soetusmaksumus, kulum ja jääkmaksumus valitud perioodil.",
    fixedAssetReportPeriod: "Periood", fixedAssetReportAssets: "Põhivarad", fixedAssetReportGroups: "Põhivara grupid",
    fixedAssetReportAll: "Kõik", fixedAssetReportSelected: "Valitud", fixedAssetReportSearch: "Otsi…",
    fixedAssetReportAdd: "Lisa →", fixedAssetReportRemove: "← Eemalda", fixedAssetReportGenerate: "Koosta",
    fixedAssetReportEmpty: "Valitud tingimustele vastavat põhivara pole.", fixedAssetReportNoData: "Valige periood ja vajutage „Koosta”.",
    fixedAssetReportCode: "Kood", fixedAssetReportDescription: "Kirjeldus", fixedAssetReportCost: "Soetusmaksumus",
    fixedAssetReportPeriodDep: "Perioodi kulum", fixedAssetReportTotalDep: "Kulum kokku", fixedAssetReportBookValue: "Jääkmaksumus",
    fixedAssetReportResults: "Aruanne", fixedAssetReportHelp: "Summad arvutatakse põhivarakaartide ja salvestatud amortisatsioonikannete põhjal. Müüke, mahakandmisi, allahindlusi ega parendusi ei arvestata, kui need pole amortisatsioonikannetes.",
    fixedAssetReportInvalidPeriod: "Kontrollige aruande kuupäevi.", fixedAssetReportExportPdf: "PDF", fixedAssetReportExportXls: "XLS", fixedAssetReportExportCsv: "CSV"
  });
  let initializedView = null;

  const setup = view => {
    if (!view || initializedView === view) return;
    initializedView = view;
    const backButton = view.querySelector('button[data-i18n="fixedAssetsBack"]');
    const heading = document.createElement("div");
    heading.className = "view-heading fixed-assets-heading fixed-asset-report-heading";
    heading.innerHTML = `<div><h1 data-i18n="fixedAssetsReport">${translateCopy("Põhivaraaruanne", "fixedAssetsReport")}</h1><p data-i18n="fixedAssetReportIntro">${translateCopy("Põhivarade soetusmaksumus, kulum ja jääkmaksumus valitud perioodil.", "fixedAssetReportIntro")}</p></div><div class="fixed-asset-report-actions"><button type="button" class="primary-button" id="fixedAssetReportGenerate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path><circle cx="12" cy="12" r="9"></circle></svg><span data-i18n="fixedAssetReportGenerate">${translateCopy("Koosta", "fixedAssetReportGenerate")}</span></button><button type="button" class="secondary-button" id="fixedAssetReportHelp" aria-expanded="false" aria-controls="fixedAssetReportHelpText">?</button></div>`;
    const workspace = document.createElement("div");
    workspace.className = "fixed-asset-report-workspace";
    workspace.innerHTML = `<section class="fixed-asset-report-pane fixed-asset-report-period-pane"><h2 data-i18n="fixedAssetReportPeriod">${translateCopy("Periood", "fixedAssetReportPeriod")}</h2><div class="fixed-asset-report-date-fields"><label class="field"><span>Alates</span><input id="fixedAssetReportStart" type="date" required></label><label class="field"><span>Kuni</span><input id="fixedAssetReportEnd" type="date" required></label></div><p class="fixed-asset-report-help" id="fixedAssetReportHelpText" data-i18n="fixedAssetReportHelp" hidden>${translateCopy("Summad arvutatakse põhivarakaartide ja salvestatud amortisatsioonikannete põhjal.", "fixedAssetReportHelp")}</p></section><section class="fixed-asset-report-pane"><h2 data-i18n="fixedAssetReportAssets">${translateCopy("Põhivarad", "fixedAssetReportAssets")}</h2><div class="fixed-asset-report-picker"><div><label for="fixedAssetReportAssetSearch" data-i18n="fixedAssetReportAll">${translateCopy("Kõik", "fixedAssetReportAll")}</label><input id="fixedAssetReportAssetSearch" type="search" placeholder="Otsi…"><select id="fixedAssetReportAssetsAvailable" multiple size="10"></select></div><div class="fixed-asset-report-picker-actions"><button type="button" class="secondary-button" id="fixedAssetReportAssetAdd" aria-label="Lisa valitud põhivarad">→</button><button type="button" class="secondary-button" id="fixedAssetReportAssetRemove" aria-label="Eemalda valitud põhivarad">←</button></div><div><label for="fixedAssetReportAssetsSelected" data-i18n="fixedAssetReportSelected">${translateCopy("Valitud", "fixedAssetReportSelected")}</label><input id="fixedAssetReportAssetsSelectedSearch" type="search" placeholder="Otsi…"><select id="fixedAssetReportAssetsSelected" multiple size="10"></select></div></div></section><section class="fixed-asset-report-pane"><h2 data-i18n="fixedAssetReportGroups">${translateCopy("Põhivara grupid", "fixedAssetReportGroups")}</h2><div class="fixed-asset-report-picker"><div><label for="fixedAssetReportGroupSearch" data-i18n="fixedAssetReportAll">${translateCopy("Kõik", "fixedAssetReportAll")}</label><input id="fixedAssetReportGroupSearch" type="search" placeholder="Otsi…"><select id="fixedAssetReportGroupsAvailable" multiple size="10"></select></div><div class="fixed-asset-report-picker-actions"><button type="button" class="secondary-button" id="fixedAssetReportGroupAdd" aria-label="Lisa valitud grupid">→</button><button type="button" class="secondary-button" id="fixedAssetReportGroupRemove" aria-label="Eemalda valitud grupid">←</button></div><div><label for="fixedAssetReportGroupsSelected" data-i18n="fixedAssetReportSelected">${translateCopy("Valitud", "fixedAssetReportSelected")}</label><input id="fixedAssetReportGroupsSelectedSearch" type="search" placeholder="Otsi…"><select id="fixedAssetReportGroupsSelected" multiple size="10"></select></div></div></section></div><section class="data-panel fixed-asset-report-results" id="fixedAssetReportResults" hidden><div class="fixed-asset-report-results-heading"><h2 data-i18n="fixedAssetReportResults">${translateCopy("Aruanne", "fixedAssetReportResults")}</h2><div class="fixed-assets-export-links"><button type="button" data-fixed-asset-report-export="pdf">PDF</button><button type="button" data-fixed-asset-report-export="xls">XLS</button><button type="button" data-fixed-asset-report-export="csv">CSV</button></div></div><p class="fixed-asset-report-period-label" id="fixedAssetReportPeriodLabel"></p><div class="fixed-assets-table-wrap"><table class="fixed-assets-table fixed-asset-report-table"><thead><tr><th data-i18n="fixedAssetReportCode">${translateCopy("Kood", "fixedAssetReportCode")}</th><th data-i18n="fixedAssetReportDescription">${translateCopy("Kirjeldus", "fixedAssetReportDescription")}</th><th data-i18n="fixedAssetReportCost">${translateCopy("Soetusmaksumus", "fixedAssetReportCost")}</th><th data-i18n="fixedAssetReportPeriodDep">${translateCopy("Perioodi kulum", "fixedAssetReportPeriodDep")}</th><th data-i18n="fixedAssetReportTotalDep">${translateCopy("Kulum kokku", "fixedAssetReportTotalDep")}</th><th data-i18n="fixedAssetReportBookValue">${translateCopy("Jääkmaksumus", "fixedAssetReportBookValue")}</th></tr></thead><tbody id="fixedAssetReportRows"></tbody><tfoot><tr><th colspan="2">${translateCopy("Kokku", "assetDepTotal")}</th><th id="fixedAssetReportCostTotal"></th><th id="fixedAssetReportPeriodTotal"></th><th id="fixedAssetReportDepTotal"></th><th id="fixedAssetReportBookTotal"></th></tr></tfoot></table></div></section><p class="fixed-asset-report-status" id="fixedAssetReportStatus" role="status" hidden></p>`;
    const results = workspace.querySelector("#fixedAssetReportResults");
    const status = workspace.querySelector("#fixedAssetReportStatus");
    workspace.querySelectorAll(".fixed-asset-report-results,.fixed-asset-report-status").forEach(element => element.remove());
    view.replaceChildren(heading, workspace, results, status);
    if (backButton) heading.append(backButton);
    const today = localDate();
    get("fixedAssetReportStart").value = `${today.slice(0, 4)}-${today.slice(5, 7)}-01`;
    get("fixedAssetReportEnd").value = today;

    const selectedAssets = new Set();
    const selectedGroups = new Set();
    let assetSelectionActive = false;
    let groupSelectionActive = false;
    let reportRows = [];
    const assets = () => {
      const value = readStorage(STORAGE.fixedAssets, []);
      return Array.isArray(value) ? value.filter(asset => asset && typeof asset.id === "string") : [];
    };
    const renderList = (id, values, searchId, selected = false) => {
      const search = get(searchId).value.trim().toLocaleLowerCase(language);
      const target = get(id);
      target.replaceChildren(...values.filter(value => !search || value.label.toLocaleLowerCase(language).includes(search)).map(value => new Option(value.label, value.value, false, selected)));
    };
    const renderPickers = () => {
      const allAssets = assets();
      const availableAssetIds = new Set(allAssets.map(asset => asset.id));
      [...selectedAssets].forEach(id => { if (!availableAssetIds.has(id)) selectedAssets.delete(id); });
      if (!selectedAssets.size) assetSelectionActive = false;
      const assetOptions = allAssets.map(asset => ({ value: asset.id, label: `${asset.code || ""}${asset.code ? " - " : ""}${asset.description || ""}` }));
      renderList("fixedAssetReportAssetsAvailable", assetOptions.filter(item => !selectedAssets.has(item.value)), "fixedAssetReportAssetSearch");
      renderList("fixedAssetReportAssetsSelected", assetOptions.filter(item => selectedAssets.has(item.value)), "fixedAssetReportAssetsSelectedSearch", true);
      const groups = [...new Set(allAssets.map(asset => String(asset.group || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, language));
      const availableGroups = new Set(groups);
      [...selectedGroups].forEach(group => { if (!availableGroups.has(group)) selectedGroups.delete(group); });
      if (!selectedGroups.size) groupSelectionActive = false;
      renderList("fixedAssetReportGroupsAvailable", groups.filter(group => !selectedGroups.has(group)).map(group => ({ value: group, label: group })), "fixedAssetReportGroupSearch");
      renderList("fixedAssetReportGroupsSelected", groups.filter(group => selectedGroups.has(group)).map(group => ({ value: group, label: group })), "fixedAssetReportGroupsSelectedSearch", true);
    };
    const connectPicker = (prefix, selected, availableId, selectedId, isAssets) => {
      get(`fixedAssetReport${prefix}Add`).addEventListener("click", () => {
        [...get(availableId).selectedOptions].forEach(option => selected.add(option.value));
        if (isAssets) assetSelectionActive = true; else groupSelectionActive = true;
        renderPickers();
      });
      get(`fixedAssetReport${prefix}Remove`).addEventListener("click", () => {
        [...get(selectedId).selectedOptions].forEach(option => selected.delete(option.value));
        if (isAssets) assetSelectionActive = true; else groupSelectionActive = true;
        renderPickers();
      });
    };
    connectPicker("Asset", selectedAssets, "fixedAssetReportAssetsAvailable", "fixedAssetReportAssetsSelected", true);
    connectPicker("Group", selectedGroups, "fixedAssetReportGroupsAvailable", "fixedAssetReportGroupsSelected", false);
    ["fixedAssetReportAssetSearch", "fixedAssetReportAssetsSelectedSearch", "fixedAssetReportGroupSearch", "fixedAssetReportGroupsSelectedSearch"].forEach(id => get(id).addEventListener("input", renderPickers));
    renderPickers();

    const renderReport = () => {
      renderPickers();
      const start = get("fixedAssetReportStart").value;
      const end = get("fixedAssetReportEnd").value;
      if (!start || !end || start > end) {
        status.textContent = translateCopy("Проверьте даты отчёта.", "fixedAssetReportInvalidPeriod"); status.hidden = false; return;
      }
      const data = assets().filter(asset => (!assetSelectionActive || selectedAssets.has(asset.id)) && (!groupSelectionActive || selectedGroups.has(String(asset.group || ""))) && asset.acquiredDate && asset.acquiredDate <= end);
      reportRows = data.map(asset => {
        const entries = (Array.isArray(asset.depreciationEntries) ? asset.depreciationEntries : []).filter(entry => entry && /^\d{4}-\d{2}-\d{2}$/.test(String(entry.date || "")));
        const cost = Number(asset.cost) || 0;
        const allEntryDepreciation = entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
        const legacyBalance = asset.bookValue == null || asset.bookValue === "" ? cost : Number(asset.bookValue);
        const openingDepreciation = asset.initialDepreciation == null || asset.initialDepreciation === ""
          ? Math.max(0, cost - legacyBalance - allEntryDepreciation)
          : Math.max(0, Number(asset.initialDepreciation) || 0);
        const totalDepreciation = Math.min(cost, openingDepreciation + entries.filter(entry => entry.date <= end).reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0));
        const periodDepreciation = entries.filter(entry => entry.date >= start && entry.date <= end).reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
        return { asset, cost, periodDepreciation, totalDepreciation, bookValue: Math.max(0, cost - totalDepreciation) };
      }).sort((first, second) => String(first.asset.code || first.asset.description).localeCompare(String(second.asset.code || second.asset.description), language, { numeric: true, sensitivity: "base" }));
      get("fixedAssetReportRows").innerHTML = reportRows.map(row => `<tr><td>${escapeHtml(row.asset.code || "—")}</td><td>${escapeHtml(row.asset.description || "—")}</td><td>${money(row.cost)} EUR</td><td>${money(row.periodDepreciation)} EUR</td><td>${money(row.totalDepreciation)} EUR</td><td>${money(row.bookValue)} EUR</td></tr>`).join("") || `<tr><td class="fixed-assets-empty" colspan="6">${escapeHtml(translateCopy("По заданным параметрам основных средств нет.", "fixedAssetReportEmpty"))}</td></tr>`;
      const sum = reportRows.reduce((total, row) => ({ cost: total.cost + row.cost, period: total.period + row.periodDepreciation, depreciation: total.depreciation + row.totalDepreciation, book: total.book + row.bookValue }), { cost: 0, period: 0, depreciation: 0, book: 0 });
      get("fixedAssetReportCostTotal").textContent = `${money(sum.cost)} EUR`;
      get("fixedAssetReportPeriodTotal").textContent = `${money(sum.period)} EUR`;
      get("fixedAssetReportDepTotal").textContent = `${money(sum.depreciation)} EUR`;
      get("fixedAssetReportBookTotal").textContent = `${money(sum.book)} EUR`;
      get("fixedAssetReportPeriodLabel").textContent = `${formatDate(start)} - ${formatDate(end)}`;
      results.hidden = false; status.hidden = true; applyLanguage(language);
    };
    get("fixedAssetReportGenerate").addEventListener("click", () => { if (denyAction("reports")) return; renderReport(); });
    get("fixedAssetReportHelp").addEventListener("click", () => { const help = get("fixedAssetReportHelpText"); help.hidden = !help.hidden; get("fixedAssetReportHelp").setAttribute("aria-expanded", String(!help.hidden)); });
    const exportReport = format => {
      if (!reportRows.length) { status.textContent = translateCopy("По заданным параметрам основных средств нет.", "fixedAssetReportEmpty"); status.hidden = false; return; }
      if (!can("exportReports")) { denyAction("exportReports"); return; }
      const headings = ["fixedAssetReportCode", "fixedAssetReportDescription", "fixedAssetReportCost", "fixedAssetReportPeriodDep", "fixedAssetReportTotalDep", "fixedAssetReportBookValue"].map(key => translateCopy(key, key));
      const values = reportRows.map(row => [row.asset.code || "", row.asset.description || "", row.cost.toFixed(2), row.periodDepreciation.toFixed(2), row.totalDepreciation.toFixed(2), row.bookValue.toFixed(2)]);
      if (format === "csv") {
        const csv = [headings, ...values].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\r\n");
        triggerBlobDownload(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `pohivaraaruanne-${localDate()}.csv`);
      } else if (format === "xls") {
        const sheet = [headings, ...values].map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="String">${escapeHtml(value)}</Data></Cell>`).join("")}</Row>`).join("");
        triggerBlobDownload(new Blob([`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Pohivaraaruanne"><Table>${sheet}</Table></Worksheet></Workbook>`], { type: "application/vnd.ms-excel;charset=utf-8" }), `pohivaraaruanne-${localDate()}.xls`);
      } else {
        const table = `<h1>${escapeHtml(translateCopy("Põhivaraaruanne", "fixedAssetsReport"))}</h1><p>${escapeHtml(get("fixedAssetReportPeriodLabel").textContent)}</p><table><thead><tr>${headings.map(value => `<th>${escapeHtml(value)}</th>`).join("")}</tr></thead><tbody>${values.map(row => `<tr>${row.map(value => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
        const popup = window.open("", "_blank", "width=1100,height=760");
        if (!popup) return;
        popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><style>body{font:12px Arial;padding:24px}table{width:100%;border-collapse:collapse}th,td{padding:7px;border:1px solid #ddd;text-align:left}th{background:#e8eeea}</style></head><body>${table}</body></html>`);
        popup.document.close(); popup.opener = null; popup.focus(); popup.print();
      }
    };
    view.querySelectorAll("[data-fixed-asset-report-export]").forEach(button => button.addEventListener("click", () => exportReport(button.dataset.fixedAssetReportExport)));
    document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(() => { if (!results.hidden) renderReport(); renderPickers(); })));
    view.addEventListener("fixed-assets-open", renderPickers);
    get("companyPicker")?.addEventListener("change", () => queueMicrotask(() => {
      selectedAssets.clear(); selectedGroups.clear(); assetSelectionActive = false; groupSelectionActive = false;
      renderPickers();
      if (!results.hidden) renderReport();
    }));
  };

  document.addEventListener("fixed-assets-open", event => { if (event.target?.id === reportViewId) setup(event.target); }, true);
  const existing = get(reportViewId);
  if (existing) setup(existing);
})();