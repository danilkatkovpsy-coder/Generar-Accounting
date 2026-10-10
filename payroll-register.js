(() => {
  const view = document.getElementById("payrollView");
  if (!view || view.dataset.payrollRegisterReady === "true") return;
  view.dataset.payrollRegisterReady = "true";
  Object.assign(ruTexts, {
    payrollYear: "Год", payrollMonth: "Месяц", payrollEmployee: "Сотрудник", payrollPaymentType: "Вид выплаты",
    payrollFrom: "С", payrollTo: "По", payrollFilter: "ФИЛЬТРОВАТЬ", payrollClear: "Очистить фильтры",
    payrollNumber: "№", payrollPosting: "ПРОВОДКА", payrollLaborCost: "РАСХОДЫ НА ТРУД", payrollTaxes: "НАЛОГИ И ВЗНОСЫ",
    payrollNet: "К ВЫПЛАТЕ", payrollFund: "ФОНД ОПЛАТЫ ТРУДА", payrollAbsence: "ОТПУСК / ОТСУТСТВИЕ",
    payrollNoRecords: "Записей о зарплате пока нет.", payrollTotal: "Итого", payrollAdd: "Добавить",
    payrollSave: "Сохранить", payrollUpdate: "Сохранить изменения", payrollCancel: "Закрыть", payrollDate: "Дата выплаты",
    payrollEmployeeLabel: "Сотрудник", payrollTypeLabel: "Вид выплаты", payrollDescriptionLabel: "Описание",
    payrollHours: "Часы", payrollRate: "Ставка", payrollGross: "Брутто",
    payrollSocialTax: "Соц. налог", payrollTaxFree: "Необлагаемый доход", payrollIncomeTax: "Подоходный налог",
    payrollUnemploymentEmployee: "Страхование работника", payrollUnemploymentEmployer: "Страхование работодателя",
    payrollPension: "Пенсия", payrollNetLabel: "Нетто", payrollAccount: "Счёт", payrollObject: "Объект",
    payrollAbsenceLabel: "Отпуск / отсутствие", payrollInfo: "Дополнительная информация", payrollTypeSalary: "Зарплата",
    payrollTypeContract: "Договор", payrollTypeOther: "Другое", payrollEntryAddLine: "Добавить строку",
    payrollRemoveLine: "Удалить строку", payrollSaved: "Запись о зарплате сохранена локально.",
    payrollInvalid: "Проверьте даты и суммы.", payrollLocalNote: "Записи хранятся локально. Налоги и выплаты автоматически не рассчитываются.",
    payrollEntryTitle: "Зарплата №", payrollAll: "Все",
    payrollHelpText: "Вводите суммы вручную. Реестр не формирует расчётные листки и налоговые проводки.",
    payrollRefresh: "Обновить список", payrollMore: "Ещё", payrollHelp: "Справка", payrollExportPdf: "PDF", payrollExportXls: "XLS", payrollExportCsv: "CSV"
  });
  Object.assign(etTexts, {
    payrollYear: "Aasta", payrollMonth: "Kuu", payrollEmployee: "Töötaja", payrollPaymentType: "Väljamakse liik",
    payrollFrom: "Alates", payrollTo: "Kuni", payrollFilter: "FILTREERI", payrollClear: "Tühjenda filtrid",
    payrollNumber: "NR", payrollPosting: "KANNE", payrollLaborCost: "TÖÖJÕUKULU KOKKU", payrollTaxes: "MAKSUD KOKKU",
    payrollNet: "NETO KOKKU", payrollFund: "PALGAFOND KOKKU", payrollAbsence: "PUHKUS / PUUDUMINE",
    payrollNoRecords: "Töötasu kirjeid pole veel.", payrollTotal: "Kokku", payrollAdd: "Lisa uus",
    payrollSave: "Salvesta", payrollUpdate: "Salvesta muudatused", payrollCancel: "Sulge", payrollDate: "Väljamakse kuupäev",
    payrollEmployeeLabel: "Töötaja", payrollTypeLabel: "Väljamakse liik", payrollDescriptionLabel: "Kirjeldus",
    payrollHours: "Tunde", payrollRate: "Tasu", payrollGross: "Bruto",
    payrollSocialTax: "Sots.maks", payrollTaxFree: "Maksuvaba", payrollIncomeTax: "Tulumaks",
    payrollUnemploymentEmployee: "TK (töötaja)", payrollUnemploymentEmployer: "TK (tööandja)",
    payrollPension: "Pens. makse", payrollNetLabel: "Neto", payrollAccount: "Konto", payrollObject: "Objekt",
    payrollAbsenceLabel: "Puhkus / puudumine", payrollInfo: "Lisainfo", payrollTypeSalary: "Töötasu",
    payrollTypeContract: "Leping", payrollTypeOther: "Muu", payrollEntryAddLine: "Lisa rida",
    payrollRemoveLine: "Eemalda rida", payrollSaved: "Töötasu kirje salvestati kohalikult.",
    payrollInvalid: "Kontrollige kuupäevi ja summasid.", payrollLocalNote: "Kirjed salvestatakse kohalikult. Makseid ega makse ei arvutata automaatselt.",
    payrollEntryTitle: "Töötasud nr.", payrollAll: "Kõik",
    payrollHelpText: "Sisestage summad käsitsi. Register ei koosta palgalehti ega maksukandeid.",
    payrollRefresh: "Värskenda nimekirja", payrollMore: "Rohkem", payrollHelp: "Abi", payrollExportPdf: "PDF", payrollExportXls: "XLS", payrollExportCsv: "CSV"
  });
  const get = id => document.getElementById(id);
  const key = () => `${STORAGE.fixedAssets}:payroll`;
  const copy = id => translateCopy(id, id);
  const read = () => { try { const value = JSON.parse(localStorage.getItem(key()) || "[]"); return Array.isArray(value) ? value.filter(item => item && typeof item.id === "string") : []; } catch { return []; } };
  const amount = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const fmt = value => `${money(amount(value))} EUR`;
  const paymentTypeLabel = value => copy(value === "salary" ? "payrollTypeSalary" : value === "contract" ? "payrollTypeContract" : "payrollTypeOther");
  const today = localDate();
  const filters = document.createElement("div");
  view.className = "app-view payments-subview payroll-register-view";
  view.innerHTML = `<div class="view-heading payroll-register-heading"><div><h1 data-i18n="navPayroll">${copy("navPayroll")}</h1><div class="fixed-assets-export-links payroll-export-links"><button type="button" data-payroll-export="pdf">PDF</button><button type="button" data-payroll-export="xls">XLS</button><button type="button" data-payroll-export="csv">CSV</button></div></div><div class="payroll-register-actions"><button type="button" class="primary-button" id="payrollAdd"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg><span data-i18n="payrollAdd">${copy("payrollAdd")}</span></button><div class="fixed-assets-menu-wrap"><button type="button" class="secondary-button" id="payrollMore" aria-expanded="false" aria-controls="payrollMoreMenu"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg><span data-i18n="payrollMore">${copy("payrollMore")}</span></button><div class="fixed-assets-small-menu" id="payrollMoreMenu" role="menu" hidden><button type="button" role="menuitem" id="payrollRefresh" data-i18n="payrollRefresh">${copy("payrollRefresh")}</button></div></div><button type="button" class="secondary-button" id="payrollHelp" aria-expanded="false" aria-controls="payrollHelpPanel"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-1 .8-1.5 1.1-1.5 2.7M12 17h.01"></path></svg><span data-i18n="payrollHelp">${copy("payrollHelp")}</span></button></div></div><section class="data-panel payroll-register-panel"><div class="payroll-filters"><label class="field"><span data-i18n="payrollYear">${copy("payrollYear")}</span><select id="payrollYearFilter"></select></label><label class="field"><span data-i18n="payrollMonth">${copy("payrollMonth")}</span><select id="payrollMonthFilter"></select></label><label class="field"><span data-i18n="payrollEmployee">${copy("payrollEmployee")}</span><select id="payrollEmployeeFilter"></select></label><label class="field"><span data-i18n="payrollPaymentType">${copy("payrollPaymentType")}</span><select id="payrollTypeFilter"></select></label><label class="field"><span data-i18n="payrollFrom">${copy("payrollFrom")}</span><input id="payrollFromDate" type="date"></label><span class="payroll-date-separator">-</span><label class="field"><span data-i18n="payrollTo">${copy("payrollTo")}</span><input id="payrollToDate" type="date"></label><button type="button" class="fixed-assets-clear payroll-clear" id="payrollClear" aria-label="${copy("payrollClear")}" title="${copy("payrollClear")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button><button type="button" class="primary-button" id="payrollFilter" data-i18n="payrollFilter">${copy("payrollFilter")}</button></div><p class="payroll-local-note" data-i18n="payrollLocalNote">${copy("payrollLocalNote")}</p><p class="payroll-help-text" id="payrollHelpPanel" data-i18n="payrollHelpText" hidden>${copy("payrollHelpText")}</p><p class="payroll-status" id="payrollStatus" role="status" hidden></p><div class="fixed-assets-table-wrap"><table class="fixed-assets-table payroll-table"><thead><tr><th><button type="button" class="fixed-assets-sort" data-payroll-sort="number" data-i18n="payrollNumber">${copy("payrollNumber")}<span class="fixed-assets-sort-indicator">↓</span></button></th><th><button type="button" class="fixed-assets-sort" data-payroll-sort="year" data-i18n="payrollYear">${copy("payrollYear")}<span class="fixed-assets-sort-indicator">↕</span></button></th><th><button type="button" class="fixed-assets-sort" data-payroll-sort="month" data-i18n="payrollMonth">${copy("payrollMonth")}<span class="fixed-assets-sort-indicator">↕</span></button></th><th><button type="button" class="fixed-assets-sort" data-payroll-sort="date" data-i18n="payrollPosting">${copy("payrollPosting")}<span class="fixed-assets-sort-indicator">↕</span></button></th><th><button type="button" class="fixed-assets-sort" data-payroll-sort="laborCost" data-i18n="payrollLaborCost">${copy("payrollLaborCost")}<span class="fixed-assets-sort-indicator">↕</span></button></th><th><button type="button" class="fixed-assets-sort" data-payroll-sort="taxes" data-i18n="payrollTaxes">${copy("payrollTaxes")}<span class="fixed-assets-sort-indicator">↕</span></button></th><th><button type="button" class="fixed-assets-sort" data-payroll-sort="net" data-i18n="payrollNet">${copy("payrollNet")}<span class="fixed-assets-sort-indicator">↕</span></button></th><th><button type="button" class="fixed-assets-sort" data-payroll-sort="fund" data-i18n="payrollFund">${copy("payrollFund")}<span class="fixed-assets-sort-indicator">↕</span></button></th><th data-i18n="payrollAbsence">${copy("payrollAbsence")}</th></tr></thead><tbody id="payrollRows"></tbody><tfoot><tr><th colspan="4" data-i18n="payrollTotal">${copy("payrollTotal")}</th><th id="payrollLaborTotal"></th><th id="payrollTaxesTotal"></th><th id="payrollNetTotal"></th><th id="payrollFundTotal"></th><th></th></tr></tfoot></table></div><div class="fixed-assets-footer"><strong id="payrollCount"></strong></div></section>`;
  const payrollHeading = view.querySelector("h1");
  payrollHeading.dataset.i18n = "payrollTitle";
  payrollHeading.textContent = copy("payrollTitle");
  const dialog = document.createElement("dialog");
  dialog.id = "payrollEntryDialog";
  dialog.className = "fixed-asset-dialog payroll-entry-dialog";
  dialog.innerHTML = `<form id="payrollEntryForm"><div class="fixed-asset-dialog-heading"><h2 id="payrollEntryTitle"></h2><button type="button" class="fixed-assets-clear" id="payrollEntryClose" aria-label="${copy("payrollCancel")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button></div><div class="payroll-entry-period" id="payrollEntryPeriod"></div><div class="fixed-assets-table-wrap payroll-entry-table-wrap"><table class="fixed-assets-table payroll-entry-table"><thead><tr><th data-i18n="payrollEmployeeLabel">${copy("payrollEmployeeLabel")}</th><th data-i18n="payrollTypeLabel">${copy("payrollTypeLabel")}</th><th data-i18n="payrollDescriptionLabel">${copy("payrollDescriptionLabel")}</th><th data-i18n="payrollHours">${copy("payrollHours")}</th><th data-i18n="payrollRate">${copy("payrollRate")}</th><th data-i18n="payrollGross">${copy("payrollGross")}</th><th data-i18n="payrollSocialTax">${copy("payrollSocialTax")}</th><th data-i18n="payrollTaxFree">${copy("payrollTaxFree")}</th><th data-i18n="payrollIncomeTax">${copy("payrollIncomeTax")}</th><th data-i18n="payrollUnemploymentEmployee">${copy("payrollUnemploymentEmployee")}</th><th data-i18n="payrollUnemploymentEmployer">${copy("payrollUnemploymentEmployer")}</th><th data-i18n="payrollPension">${copy("payrollPension")}</th><th data-i18n="payrollNetLabel">${copy("payrollNetLabel")}</th><th data-i18n="payrollAccount">${copy("payrollAccount")}</th><th data-i18n="payrollObject">${copy("payrollObject")}</th><th data-i18n="payrollDate">${copy("payrollDate")}</th><th></th></tr></thead><tbody id="payrollEntryRows"></tbody></table></div><div class="payroll-entry-tools"><button type="button" class="secondary-button" id="payrollAddLine" data-i18n="payrollEntryAddLine">${copy("payrollEntryAddLine")}</button><label class="payroll-entry-absence"><span data-i18n="payrollAbsenceLabel">${copy("payrollAbsenceLabel")}</span><input id="payrollEntryAbsence" type="text" maxlength="240"></label><label class="payroll-entry-info"><span data-i18n="payrollInfo">${copy("payrollInfo")}</span><textarea id="payrollEntryInfo" rows="2" maxlength="1000"></textarea></label></div><p class="fixed-asset-error" id="payrollEntryError" role="alert" hidden></p><div class="fixed-asset-dialog-actions"><button type="button" class="secondary-button" id="payrollEntryCancel" data-i18n="payrollCancel">${copy("payrollCancel")}</button><button type="submit" class="primary-button" id="payrollEntrySave" data-i18n="payrollSave">${copy("payrollSave")}</button></div></form>`;
  document.body.append(dialog);
  const getDialog = id => document.getElementById(id);
  const totalsFooter = document.createElement("tfoot");
  totalsFooter.innerHTML = `<tr><th colspan="5"></th><th id="payrollDetailGrossTotal"></th><th id="payrollDetailSocialTotal"></th><th id="payrollDetailTaxFreeTotal"></th><th id="payrollDetailIncomeTaxTotal"></th><th id="payrollDetailUnemploymentEmployeeTotal"></th><th id="payrollDetailUnemploymentEmployerTotal"></th><th id="payrollDetailPensionTotal"></th><th id="payrollDetailNetTotal"></th><th colspan="4"></th></tr>`;
  dialog.querySelector(".payroll-entry-table").append(totalsFooter);
  let editingPeriod = "";
  let editingStorageKey = "";
  let sortKey = "period";
  let sortDirection = -1;
  let filteredPeriods = [];
  const fieldNumber = (row, name) => Number(row.querySelector(`[data-payroll-field="${name}"]`).value || 0);
  const summaryFor = entries => entries.reduce((sum, item) => ({
    laborCost: sum.laborCost + amount(item.gross),
    taxes: sum.taxes + amount(item.socialTax) + amount(item.incomeTax) + amount(item.unemploymentEmployee) + amount(item.unemploymentEmployer) + amount(item.pension),
    net: sum.net + amount(item.net),
    fund: sum.fund + amount(item.gross) + amount(item.socialTax) + amount(item.unemploymentEmployer)
  }), { laborCost: 0, taxes: 0, net: 0, fund: 0 });
  const payrollLabel = value => copy(value === "salary" ? "payrollTypeSalary" : value === "contract" ? "payrollTypeContract" : "payrollTypeOther");
  const periodGroups = entries => {
    const groups = new Map();
    entries.forEach(entry => {
      const period = `${entry.date.slice(0, 7)}`;
      const group = groups.get(period) || { period, date: entry.date, entries: [] };
      group.date = entry.date > group.date ? entry.date : group.date;
      group.entries.push(entry);
      groups.set(period, group);
    });
    return [...groups.values()].map(group => ({ ...group, year: Number(group.period.slice(0, 4)), month: Number(group.period.slice(5, 7)), ...summaryFor(group.entries), absence: [...new Set(group.entries.map(entry => entry.absence).filter(Boolean))].join(", ") }));
  };
  const setOptions = (id, items, selected) => {
    const select = get(id); select.replaceChildren(new Option(copy("payrollAll"), ""), ...items.map(item => new Option(item.label ?? item, item.value ?? item))); select.value = selected;
  };
  const renderFilters = entries => {
    const previous = ["payrollYearFilter", "payrollMonthFilter", "payrollEmployeeFilter", "payrollTypeFilter"].map(id => get(id).value);
    const groups = periodGroups(entries);
    setOptions("payrollYearFilter", [...new Set(groups.map(group => group.year))].sort((a, b) => b - a), previous[0]);
    setOptions("payrollMonthFilter", Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: `${index + 1} · ${new Intl.DateTimeFormat(language === "et" ? "et-EE" : "ru-RU", { month: "long" }).format(new Date(2020, index, 1))}` })), previous[1]);
    setOptions("payrollEmployeeFilter", [...new Set(entries.map(entry => entry.employee).filter(Boolean))].sort((a, b) => a.localeCompare(b, language)), previous[2]);
    setOptions("payrollTypeFilter", [...new Set(entries.map(entry => entry.paymentType).filter(Boolean))].map(value => ({ value, label: payrollLabel(value) })), previous[3]);
  };
  const render = () => {
    const entries = read();
    renderFilters(entries);
    const from = get("payrollFromDate").value, to = get("payrollToDate").value;
    const selectedEntries = entries.filter(entry => (!get("payrollEmployeeFilter").value || entry.employee === get("payrollEmployeeFilter").value)
      && (!get("payrollTypeFilter").value || entry.paymentType === get("payrollTypeFilter").value)
      && (!from || entry.date >= from) && (!to || entry.date <= to));
    let periods = periodGroups(selectedEntries).filter(group => (!get("payrollYearFilter").value || String(group.year) === get("payrollYearFilter").value) && (!get("payrollMonthFilter").value || String(group.month) === get("payrollMonthFilter").value));
    periods.sort((first, second) => sortKey === "period" ? (sortDirection < 0 ? second.period.localeCompare(first.period) : first.period.localeCompare(second.period)) : sortDirection * (sortKey === "date" ? first.date.localeCompare(second.date) : sortKey === "year" ? first.year - second.year : sortKey === "month" ? first.month - second.month : sortKey === "absence" ? first.absence.localeCompare(second.absence, language) : first[sortKey] - second[sortKey]));
    filteredPeriods = periods;
    get("payrollRows").innerHTML = periods.map((group, index) => `<tr data-payroll-period="${escapeHtml(group.period)}" data-payroll-number="${periods.length - index}" tabindex="0" aria-label="${escapeHtml(copy("navPayroll"))} ${group.period}"><td>${periods.length - index}</td><td>${group.year}</td><td>${group.month}</td><td>${escapeHtml(formatDate(group.date))}</td><td>${fmt(group.laborCost)}</td><td>${fmt(group.taxes)}</td><td>${fmt(group.net)}</td><td>${fmt(group.fund)}</td><td>${escapeHtml(group.absence)}</td></tr>`).join("") || `<tr><td class="fixed-assets-empty" colspan="9">${escapeHtml(copy("payrollNoRecords"))}</td></tr>`;
    const total = periods.reduce((sum, group) => ({ laborCost: sum.laborCost + group.laborCost, taxes: sum.taxes + group.taxes, net: sum.net + group.net, fund: sum.fund + group.fund }), { laborCost: 0, taxes: 0, net: 0, fund: 0 });
    get("payrollLaborTotal").textContent = fmt(total.laborCost); get("payrollTaxesTotal").textContent = fmt(total.taxes); get("payrollNetTotal").textContent = fmt(total.net); get("payrollFundTotal").textContent = fmt(total.fund);
    get("payrollCount").textContent = `${copy("payrollTotal")}: ${periods.length}`;
    view.querySelectorAll("[data-payroll-sort]").forEach(button => { const active = button.dataset.payrollSort === (sortKey === "period" ? "number" : sortKey); button.querySelector(".fixed-assets-sort-indicator").textContent = active ? sortDirection > 0 ? "↑" : "↓" : "↕"; button.closest("th").setAttribute("aria-sort", active ? sortDirection > 0 ? "ascending" : "descending" : "none"); });
    applyLanguage(language);
  };
  const lineMarkup = entry => `<tr data-payroll-id="${escapeHtml(entry.id || "")}"><td><input data-payroll-field="employee" type="text" maxlength="160" value="${escapeHtml(entry.employee || "")}"></td><td><select data-payroll-field="paymentType"><option value="salary" ${entry.paymentType === "salary" ? "selected" : ""}>${copy("payrollTypeSalary")}</option><option value="contract" ${entry.paymentType === "contract" ? "selected" : ""}>${copy("payrollTypeContract")}</option><option value="other" ${entry.paymentType === "other" ? "selected" : ""}>${copy("payrollTypeOther")}</option></select></td><td><input data-payroll-field="description" type="text" maxlength="180" value="${escapeHtml(entry.description || "")}"></td><td><input data-payroll-field="hours" type="number" min="0" step="0.01" value="${escapeHtml(entry.hours ?? "")}"></td><td><input data-payroll-field="rate" type="number" min="0" step="0.01" value="${escapeHtml(entry.rate ?? "")}"></td><td><input data-payroll-field="gross" type="number" min="0" step="0.01" required value="${amount(entry.gross)}"></td><td><input data-payroll-field="socialTax" type="number" min="0" step="0.01" value="${amount(entry.socialTax)}"></td><td><input data-payroll-field="taxFree" type="number" min="0" step="0.01" value="${amount(entry.taxFree)}"></td><td><input data-payroll-field="incomeTax" type="number" min="0" step="0.01" value="${amount(entry.incomeTax)}"></td><td><input data-payroll-field="unemploymentEmployee" type="number" min="0" step="0.01" value="${amount(entry.unemploymentEmployee)}"></td><td><input data-payroll-field="unemploymentEmployer" type="number" min="0" step="0.01" value="${amount(entry.unemploymentEmployer)}"></td><td><input data-payroll-field="pension" type="number" min="0" step="0.01" value="${amount(entry.pension)}"></td><td><input data-payroll-field="net" type="number" min="0" step="0.01" required value="${amount(entry.net)}"></td><td><input data-payroll-field="account" type="text" maxlength="100" value="${escapeHtml(entry.account || "")}"></td><td><input data-payroll-field="object" type="text" maxlength="160" value="${escapeHtml(entry.object || "")}"></td><td><input data-payroll-field="date" type="date" required value="${escapeHtml(entry.date || localDate())}"></td><td><button type="button" class="fixed-assets-clear payroll-line-remove" data-payroll-remove-line aria-label="${copy("payrollRemoveLine")}" title="${copy("payrollRemoveLine")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button></td></tr>`;
  const openPeriod = (period, number) => {
    const monthEntries = read().filter(entry => entry.date?.slice(0, 7) === period);
    editingPeriod = period; editingStorageKey = key();
    getDialog("payrollEntryTitle").textContent = `${copy("payrollEntryTitle")} ${number}`;
    getDialog("payrollEntryPeriod").textContent = `${copy("payrollMonth")} ${period.replace("-", " - ")}`;
    getDialog("payrollEntryAbsence").value = [...new Set(monthEntries.map(entry => entry.absence).filter(Boolean))].join(", ");
    getDialog("payrollEntryInfo").value = monthEntries.find(entry => entry.info)?.info || "";
    getDialog("payrollEntryRows").innerHTML = monthEntries.map(lineMarkup).join("");
    updateDetailTotals();
    getDialog("payrollEntryError").hidden = true;
    getDialog("payrollEntrySave").dataset.i18n = "payrollUpdate"; getDialog("payrollEntrySave").textContent = copy("payrollUpdate");
    dialog.showModal(); applyLanguage(language);
  };
  const addLine = entry => { getDialog("payrollEntryRows").insertAdjacentHTML("beforeend", lineMarkup(entry || { date: `${editingPeriod || today.slice(0, 7)}-${today.slice(8, 10)}`, paymentType: "salary" })); updateDetailTotals(); };
  const openNew = () => {
    editingPeriod = ""; editingStorageKey = key(); getDialog("payrollEntryTitle").textContent = copy("payrollAdd");
    getDialog("payrollEntryPeriod").textContent = `${copy("payrollMonth")} ${today.slice(0, 7).replace("-", " - ")}`;
    getDialog("payrollEntryAbsence").value = ""; getDialog("payrollEntryInfo").value = ""; getDialog("payrollEntryRows").replaceChildren();
    getDialog("payrollEntryError").hidden = true; getDialog("payrollEntrySave").dataset.i18n = "payrollSave"; getDialog("payrollEntrySave").textContent = copy("payrollSave");
    addLine(); dialog.showModal(); applyLanguage(language);
  };
  const exportRows = format => {
    if (!filteredPeriods.length) return;
    const headers = ["payrollNumber", "payrollYear", "payrollMonth", "payrollPosting", "payrollLaborCost", "payrollTaxes", "payrollNet", "payrollFund", "payrollAbsence"].map(copy);
    const values = filteredPeriods.map((group, index) => [filteredPeriods.length - index, group.year, group.month, formatDate(group.date), group.laborCost.toFixed(2), group.taxes.toFixed(2), group.net.toFixed(2), group.fund.toFixed(2), group.absence]);
    if (format === "csv") {
      const csv = [headers, ...values].map(row => row.map(value => { let text = String(value ?? ""); if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; }).join(";")).join("\r\n");
      triggerBlobDownload(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `tootasud-${localDate()}.csv`);
    } else if (format === "xls") {
      const sheet = [headers, ...values].map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="String">${escapeHtml(value)}</Data></Cell>`).join("")}</Row>`).join("");
      triggerBlobDownload(new Blob([`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Tootasud"><Table>${sheet}</Table></Worksheet></Workbook>`], { type: "application/vnd.ms-excel;charset=utf-8" }), `tootasud-${localDate()}.xls`);
    } else {
      void window.downloadTablePdf({ filename: `tootasud-${localDate()}.pdf`, title: copy("payrollTitle"), headers, rows: values });
    }
  };
  const updateDetailTotals = () => {
    const sum = field => [...getDialog("payrollEntryRows").querySelectorAll(`[data-payroll-field="${field}"]`)].reduce((total, input) => total + amount(input.value), 0);
    const totals = { Gross: "gross", Social: "socialTax", TaxFree: "taxFree", IncomeTax: "incomeTax", UnemploymentEmployee: "unemploymentEmployee", UnemploymentEmployer: "unemploymentEmployer", Pension: "pension", Net: "net" };
    Object.entries(totals).forEach(([suffix, field]) => { const cell = getDialog(`payrollDetail${suffix}Total`); if (cell) cell.textContent = field === "gross" || field === "net" || field.includes("Tax") || field.includes("employment") || field === "pension" ? fmt(sum(field)) : fmt(sum(field)); });
  };
  get("payrollEntryRows").addEventListener("input", updateDetailTotals);
  const closeMenu = () => { get("payrollMoreMenu").hidden = true; get("payrollMore").setAttribute("aria-expanded", "false"); };
  get("payrollAdd").addEventListener("click", openNew);
  get("payrollMore").addEventListener("click", () => { const menu = get("payrollMoreMenu"); menu.hidden = !menu.hidden; get("payrollMore").setAttribute("aria-expanded", String(!menu.hidden)); });
  get("payrollRefresh").addEventListener("click", () => { closeMenu(); render(); });
  get("payrollHelp").addEventListener("click", () => { const help = get("payrollHelpPanel"); help.hidden = !help.hidden; get("payrollHelp").setAttribute("aria-expanded", String(!help.hidden)); });
  document.addEventListener("click", event => { if (!event.target.closest(".payroll-register-actions .fixed-assets-menu-wrap")) closeMenu(); });
  get("payrollFilter").addEventListener("click", render);
  get("payrollClear").addEventListener("click", () => { ["payrollYearFilter", "payrollMonthFilter", "payrollEmployeeFilter", "payrollTypeFilter", "payrollFromDate", "payrollToDate"].forEach(id => { get(id).value = ""; }); render(); });
  view.querySelectorAll("[data-payroll-sort]").forEach(button => button.addEventListener("click", () => { const next = button.dataset.payrollSort === "number" ? "period" : button.dataset.payrollSort; sortDirection = sortKey === next ? -sortDirection : next === "period" ? -1 : 1; sortKey = next; render(); }));
  view.querySelectorAll("[data-payroll-export]").forEach(button => button.addEventListener("click", () => { if (!can("exportReports")) { denyAction("exportReports"); return; } exportRows(button.dataset.payrollExport); }));
  get("payrollRows").addEventListener("click", event => { const row = event.target.closest("tr[data-payroll-period]"); if (row) openPeriod(row.dataset.payrollPeriod, row.dataset.payrollNumber); });
  get("payrollRows").addEventListener("keydown", event => { const row = event.target.closest("tr[data-payroll-period]"); if (row && ["Enter", " "].includes(event.key)) { event.preventDefault(); openPeriod(row.dataset.payrollPeriod, row.dataset.payrollNumber); } });
  get("payrollAddLine").addEventListener("click", () => addLine());
  get("payrollEntryRows").addEventListener("click", event => { const button = event.target.closest("[data-payroll-remove-line]"); if (button) button.closest("tr").remove(); });
  get("payrollEntryForm").addEventListener("submit", event => {
    event.preventDefault(); const form = getDialog("payrollEntryForm"); if (!form.reportValidity()) return;
    if (editingStorageKey !== key()) { getDialog("payrollEntryError").textContent = translateCopy("Компания изменилась. Откройте запись заново.", "assetWrongCompany"); getDialog("payrollEntryError").hidden = false; return; }
    const rows = [...getDialog("payrollEntryRows").querySelectorAll("tr")];
    if (!rows.length) { getDialog("payrollEntryError").textContent = copy("payrollInvalid"); getDialog("payrollEntryError").hidden = false; return; }
    const absence = getDialog("payrollEntryAbsence").value.trim(), info = getDialog("payrollEntryInfo").value.trim();
    const nextRows = rows.map(row => {
      const read = name => row.querySelector(`[data-payroll-field="${name}"]`).value.trim();
      const date = read("date");
      return { id: row.dataset.payrollId || crypto.randomUUID(), date, year: Number(date.slice(0, 4)), month: Number(date.slice(5, 7)), employee: read("employee"), paymentType: read("paymentType"), description: read("description"), hours: read("hours") === "" ? null : Number(read("hours")), rate: read("rate") === "" ? null : Number(read("rate")), gross: Number(read("gross")), socialTax: Number(read("socialTax")), taxFree: Number(read("taxFree")), incomeTax: Number(read("incomeTax")), unemploymentEmployee: Number(read("unemploymentEmployee")), unemploymentEmployer: Number(read("unemploymentEmployer")), pension: Number(read("pension")), net: Number(read("net")), account: read("account"), object: read("object"), absence, info, updatedAt: new Date().toISOString() };
    });
    const numeric = nextRows.flatMap(row => [row.gross, row.socialTax, row.taxFree, row.incomeTax, row.unemploymentEmployee, row.unemploymentEmployer, row.pension, row.net, row.hours, row.rate].filter(value => value !== null));
    if (nextRows.some(row => !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) || numeric.some(value => !Number.isFinite(value) || value < 0)) { getDialog("payrollEntryError").textContent = copy("payrollInvalid"); getDialog("payrollEntryError").hidden = false; return; }
    const current = read(); const next = editingPeriod ? [...current.filter(item => item.date?.slice(0, 7) !== editingPeriod), ...nextRows] : [...current, ...nextRows];
    try { localStorage.setItem(key(), JSON.stringify(next)); } catch { getDialog("payrollEntryError").textContent = translateCopy("Не удалось сохранить запись.", "assetSaveError"); getDialog("payrollEntryError").hidden = false; return; }
    dialog.close(); render(); showMessage(copy("payrollSaved"));
  });
  ["payrollEntryClose", "payrollEntryCancel"].forEach(id => getDialog(id).addEventListener("click", () => dialog.close()));
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  get("companyPicker")?.addEventListener("change", () => queueMicrotask(render));
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(render)));
  view.addEventListener("fixed-assets-open", render);
  view.addEventListener("payroll-open", render);
  render();
})();