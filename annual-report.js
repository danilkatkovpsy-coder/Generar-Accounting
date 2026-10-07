(() => {
  const panel = document.getElementById("annualReportPanel");
  if (!panel || document.getElementById("officialAnnualReportForm")) return;
  Object.assign(ruTexts, {
    annualOfficialTitle: "Годовой отчет — официальная структура", annualOfficialType: "Форма", annualOfficialCompany: "Предприятие",
    annualOfficialRegistry: "Регистрационный код", annualOfficialStart: "Начало периода", annualOfficialEnd: "Конец периода",
    annualOfficialCurrent: "Отчетный период", annualOfficialPrior: "Сравнительный период", annualOfficialTaxonomy: "Таксономия",
    annualOfficialDraft: "Сформирован · заблокирован", annualOfficialSave: "Сохранить черновик", annualOfficialCheck: "Проверить XBRL",
    annualOfficialReady: "Техническая проверка XBRL пройдена. Приём отчета проверяет e-äriregister.",
    annualOfficialIncomplete: "Суммы рассчитаны по проводкам и заблокированы. Перед экспортом добавьте примечания и отчет руководства.",
    annualOfficialUnavailable: "Сервис формирования отчетов недоступен.", annualOfficialLocalAccess: "Откройте приложение по адресу http://127.0.0.1:8173/ и запустите локальный сервис отчетов на порту 8765.", annualOfficialLoadError: "Не удалось загрузить официальную структуру.",
    annualOfficialSaved: "Черновик сохранен.", annualOfficialError: "Проверка не пройдена.", annualOfficialDownloads: "Скачать",
    annualOfficialConfirmed: "Данные основных отчетов проверены", annualOfficialNewState: "Данные изменены. Проверка требуется повторно.",
    annualOfficialMappingRequired: "Не назначена строка годового отчета для счетов:", annualOfficialYear: "Отчётный год", annualOfficialGenerate: "Сформировать", annualOfficialWaiting: "Не сформирован", annualOfficialCreated: "Сформирован · заблокирован", annualOfficialUpdated: "Данные изменились, отчёт пересчитан.", annualOfficialExported: "Файл отчёта подготовлен.", annualOfficialAssets: "Активы", annualOfficialRevenue: "Выручка", annualOfficialProfit: "Прибыль / убыток за год", annualOfficialLine: "Статья", annualOfficialNoRows: "Нет строк с суммами за выбранный период."
  });
  Object.assign(etTexts, {
    annualOfficialTitle: "Majandusaasta aruanne — ametlik struktuur", annualOfficialType: "Aruande vorm", annualOfficialCompany: "Ettevõte",
    annualOfficialRegistry: "Registrikood", annualOfficialStart: "Perioodi algus", annualOfficialEnd: "Perioodi lõpp",
    annualOfficialCurrent: "Aruandeperiood", annualOfficialPrior: "Võrdlusperiood", annualOfficialTaxonomy: "Taksonoomia",
    annualOfficialDraft: "Koostatud · lukustatud", annualOfficialSave: "Salvesta mustand", annualOfficialCheck: "Kontrolli XBRL",
    annualOfficialReady: "XBRL tehniline kontroll läbitud. Aruande vastuvõtmist kontrollib e-äriregister.",
    annualOfficialIncomplete: "Summad arvutatakse kannete põhjal ja on lukustatud. Enne eksporti lisage lisad ja tegevusaruanne.",
    annualOfficialUnavailable: "Aruandeteenus pole saadaval.", annualOfficialLocalAccess: "Avage rakendus aadressil http://127.0.0.1:8173/ ja käivitage kohalik aruandeteenus pordil 8765.", annualOfficialLoadError: "Ametlikku struktuuri ei saanud laadida.",
    annualOfficialSaved: "Mustand salvestati.", annualOfficialError: "Kontroll ebaõnnestus.", annualOfficialDownloads: "Laadi alla",
    annualOfficialConfirmed: "Põhiaruannete andmed on kontrollitud", annualOfficialNewState: "Andmed on muutunud. Kontroll on vajalik uuesti.",
    annualOfficialMappingRequired: "Aastaaruande rida on määramata kontodele:", annualOfficialYear: "Aruandeaasta", annualOfficialGenerate: "Koosta", annualOfficialWaiting: "Koostamata", annualOfficialCreated: "Koostatud · lukustatud", annualOfficialUpdated: "Andmed muutusid; aruanne arvutati uuesti.", annualOfficialExported: "Aruande fail on valmis.", annualOfficialAssets: "Varad", annualOfficialRevenue: "Müügitulu", annualOfficialProfit: "Aruandeaasta kasum / kahjum", annualOfficialLine: "Kirje", annualOfficialNoRows: "Valitud perioodil summadega aruanderidu pole."
  });
  const copy = key => translateCopy(key, key);
  const get = id => document.getElementById(id);
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"></path></svg>';
  const workspace = document.createElement("section");
  workspace.className = "annual-official-workspace";
  workspace.innerHTML = `<div class="annual-official-heading"><h2 data-i18n="annualOfficialTitle">${copy("annualOfficialTitle")}</h2><span class="annual-draft-badge" data-i18n="annualOfficialDraft">${copy("annualOfficialDraft")}</span></div><form id="officialAnnualReportForm"><div class="annual-official-settings"><div class="field"><label for="annualOfficialType" data-i18n="annualOfficialType">${copy("annualOfficialType")}</label><select id="annualOfficialType" disabled><option>Väikeettevõtja — OÜ</option></select></div><div class="field"><label for="annualOfficialCompany" data-i18n="annualOfficialCompany">${copy("annualOfficialCompany")}</label><input id="annualOfficialCompany" required maxlength="500"></div><div class="field"><label for="annualOfficialRegistry" data-i18n="annualOfficialRegistry">${copy("annualOfficialRegistry")}</label><input id="annualOfficialRegistry" required pattern="[0-9]{8}" maxlength="8" inputmode="numeric"></div><div class="field"><label for="annualOfficialStart" data-i18n="annualOfficialStart">${copy("annualOfficialStart")}</label><input id="annualOfficialStart" type="date" required></div><div class="field"><label for="annualOfficialEnd" data-i18n="annualOfficialEnd">${copy("annualOfficialEnd")}</label><input id="annualOfficialEnd" type="date" required></div><div class="annual-taxonomy-source"><span data-i18n="annualOfficialTaxonomy">${copy("annualOfficialTaxonomy")}</span><a href="https://xbrl.eesti.ee/" target="_blank" rel="noopener noreferrer">RIK · 2026-01-01</a></div></div><p class="annual-report-warning" data-i18n="annualOfficialIncomplete">${copy("annualOfficialIncomplete")}</p><div id="annualOfficialForms"></div><label class="annual-confirmation"><input id="annualOfficialConfirmed" type="checkbox" required><span data-i18n="annualOfficialConfirmed">${copy("annualOfficialConfirmed")}</span></label><div class="annual-report-actions"><button type="button" class="secondary-button" id="annualOfficialSave" data-i18n="annualOfficialSave">${copy("annualOfficialSave")}</button><button type="submit" class="primary-button" id="annualOfficialCheck" data-i18n="annualOfficialCheck">${copy("annualOfficialCheck")}</button></div><div id="annualOfficialStatus" class="annual-official-status" role="status" aria-live="polite" hidden></div><section class="annual-report-downloads"><h3 data-i18n="annualOfficialDownloads">${copy("annualOfficialDownloads")}</h3><div class="annual-download-controls"><button type="button" class="secondary-button" data-annual-format="pdf">${icon}<span>PDF</span></button><button type="button" class="secondary-button" data-annual-format="xlsx">${icon}<span>Excel (.xlsx)</span></button><button type="button" class="secondary-button" data-annual-format="xbrl">${icon}<span>XBRL</span></button></div></section></form>`;
  panel.prepend(workspace);
  const legacySummary = panel.querySelector(":scope > .data-panel:not(.annual-official-workspace)");
  if (legacySummary) legacySummary.hidden = true;
  workspace.innerHTML = `<div class="annual-official-heading"><h2 data-i18n="annualOfficialTitle">${copy("annualOfficialTitle")}</h2><span class="annual-report-state" id="annualOfficialState" data-i18n="annualOfficialWaiting">${copy("annualOfficialWaiting")}</span></div><div class="annual-report-compose"><label class="field" for="annualOfficialYear"><span data-i18n="annualOfficialYear">${copy("annualOfficialYear")}</span><select id="annualOfficialYear"></select></label><button type="button" class="primary-button" id="annualOfficialGenerate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path><circle cx="12" cy="12" r="9"></circle></svg><span data-i18n="annualOfficialGenerate">${copy("annualOfficialGenerate")}</span></button></div><p class="annual-report-warning" id="annualOfficialWarning" hidden></p><section class="annual-report-document" id="annualOfficialResult" hidden><div class="annual-report-document-meta" id="annualOfficialMeta"></div><div class="annual-report-summary" id="annualOfficialSummary"></div><div id="annualOfficialForms"></div></section><div class="annual-report-actions" id="annualOfficialActions" hidden><button type="button" class="secondary-button" data-annual-format="pdf">PDF</button><button type="button" class="secondary-button" data-annual-format="xbrl">XBRL</button><a class="secondary-button annual-report-register-link" href="https://ariregister.rik.ee/eng/auth/redirect_xbrl" target="_blank" rel="noopener noreferrer">e-Äriregister</a></div><p id="annualOfficialStatus" class="annual-official-status" role="status" aria-live="polite" hidden></p>`;
  const yearPickerField = get("annualOfficialYear").closest(".field");
  const yearPicker = get("annualOfficialYear");
  const yearPickerLabel = yearPickerField.querySelector("span");
  yearPickerLabel.id = "annualOfficialYearLabel";
  yearPicker.hidden = true;
  yearPicker.tabIndex = -1;
  yearPicker.setAttribute("aria-hidden", "true");
  const yearPickerControl = document.createElement("div");
  yearPickerControl.className = "annual-year-picker";
  yearPickerControl.innerHTML = `<button type="button" class="annual-year-toggle" id="annualOfficialYearToggle" aria-haspopup="listbox" aria-expanded="false" aria-controls="annualOfficialYearMenu" aria-labelledby="annualOfficialYearLabel annualOfficialYearDisplay"><span class="annual-year-display" id="annualOfficialYearDisplay"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg></button><div class="annual-year-menu" id="annualOfficialYearMenu" role="listbox" aria-labelledby="annualOfficialYearLabel" tabindex="-1" hidden></div>`;
  yearPickerField.insertBefore(yearPickerControl, yearPicker);
  const status = get("annualOfficialStatus");
  const localhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  const api = String(window.ARVESEMU_ANNUAL_REPORT_API || (localhost && location.port !== "8765" ? "http://127.0.0.1:8765" : "")).replace(/\/$/, "");
  let profile = null;
  let busy = false;
  let generated = false;
  let calculatedFacts = {};
  let reportPayload = null;
  let unmappedAccounts = [];
  let currentCompany = "";
  const context = () => String(cloudWorkspace?.organizationId || activeCompanyId || "guest");
  const selectedYear = () => Number(yearPicker.value) || new Date().getFullYear();
  const periodForYear = year => ({ start: `${year}-01-01`, end: `${year}-12-31` });
  const key = () => `${context()}:${selectedYear()}`;
  const setStatus = (message, error = false) => {
    status.hidden = !message;
    status.textContent = message;
    status.classList.toggle("is-error", error);
  };
  const syncControls = () => {
    get("annualOfficialGenerate").disabled = busy || !profile || unmappedAccounts.length > 0 || !can("reports");
    workspace.querySelectorAll("[data-annual-format]").forEach(button => {
      button.disabled = busy || !generated || !profile || unmappedAccounts.length > 0 || !can("exportReports");
    });
  };
  const readPayload = () => {
    const period = periodForYear(selectedYear());
    const seller = currentSeller() || {};
      return { profile: "small-ou", companyName: String(seller.name || "").trim(), registryCode: String(seller.reg || "").replace(/\D/g, "").slice(0, 8), address: String(seller.address || "").trim(), phone: String(seller.phone || "").trim(), email: String(seller.email || "").trim(), ...period, facts: calculatedFacts };
  };
  const previousYear = value => {
    const [year, month, day] = value.split("-").map(Number);
    const priorDay = Math.min(day, new Date(year - 1, month, 0).getDate());
    return `${year - 1}-${String(month).padStart(2, "0")}-${String(priorDay).padStart(2, "0")}`;
  };
  const formatAmount = value => `${new Intl.NumberFormat(language === "et" ? "et-EE" : "ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value) || 0)} EUR`;
  const renderGeneratedReport = () => {
    const payload = readPayload();
    const currentLabel = `${payload.start} – ${payload.end}`;
    const priorLabel = `${previousYear(payload.start)} – ${previousYear(payload.end)}`;
    get("annualOfficialMeta").innerHTML = `<strong>${escapeHtml(payload.companyName)}</strong><span>${escapeHtml(payload.registryCode)}</span><span>${escapeHtml(currentLabel)}</span>`;
    const summaryConcepts = [
      ["Assets", "annualOfficialAssets"],
      ["Revenue", "annualOfficialRevenue"],
      ["TotalAnnualPeriodProfitLoss", "annualOfficialProfit"]
    ];
    get("annualOfficialSummary").innerHTML = summaryConcepts.map(([name, key]) => {
      const concept = profile.forms.flatMap(entry => entry.rows).find(row => row.name === name);
      const amount = calculatedFacts[concept?.id]?.current || 0;
      return `<article class="annual-report-stat"><span>${escapeHtml(copy(key))}</span><strong>${escapeHtml(formatAmount(amount))}</strong></article>`;
    }).join("");
    get("annualOfficialForms").innerHTML = profile.forms.map(entry => {
      const rows = entry.rows.filter(concept => {
        if (concept.abstract || concept.type === "xbrli:stringItemType") return false;
        const values = calculatedFacts[concept.id] || {};
        return Number(values.current) !== 0 || Number(values.prior) !== 0 || ["Assets", "LiabilitiesAndEquity", "TotalAnnualPeriodProfitLoss"].includes(concept.name);
      });
      const title = entry.title.split("] ").at(-1);
      return `<section class="annual-taxonomy-form"><h3>${escapeHtml(title)}</h3><div class="table-wrap"><table class="data-table annual-official-table"><thead><tr><th>${escapeHtml(translateCopy("Rida", "annualOfficialLine"))}</th><th>${escapeHtml(currentLabel)}</th><th>${escapeHtml(priorLabel)}</th></tr></thead><tbody>${rows.map(concept => {
        const values = calculatedFacts[concept.id] || {};
        const label = concept.labels?.[language === "et" ? "et" : "en"] || concept.label;
        return `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(formatAmount(values.current))}</td><td>${escapeHtml(formatAmount(values.prior))}</td></tr>`;
      }).join("") || `<tr><td colspan="3">${escapeHtml(translateCopy("Andmed puuduvad", "annualOfficialNoRows"))}</td></tr>`}</tbody></table></div></section>`;
    }).join("");
    get("annualOfficialResult").hidden = false;
    get("annualOfficialActions").hidden = false;
    get("annualOfficialState").textContent = copy("annualOfficialCreated");
  };
  const recalculate = () => {
    if (!profile || typeof window.calculateAnnualReportFacts !== "function") return;
    const period = periodForYear(selectedYear());
    const result = window.calculateAnnualReportFacts(profile.forms, {
      current: period,
      prior: { start: previousYear(period.start), end: previousYear(period.end) }
    });
    unmappedAccounts = result.unmappedAccounts || [];
    calculatedFacts = Object.fromEntries(profile.forms.flatMap(entry => entry.rows)
      .filter(concept => !concept.abstract && concept.type !== "xbrli:stringItemType")
      .map(concept => {
        const values = result.facts[concept.name] || {};
        return [concept.id, { current: (Number(values.current) || 0).toFixed(2), prior: (Number(values.prior) || 0).toFixed(2) }];
      }));
    const warning = workspace.querySelector(".annual-report-warning");
    if (unmappedAccounts.length) {
      warning.textContent = `${copy("annualOfficialMappingRequired")} ${unmappedAccounts.map(account => `${account.code} · ${account.label}`).join(", ")}`;
    }
    warning.hidden = !unmappedAccounts.length;
    if (generated) {
      reportPayload = readPayload();
      renderGeneratedReport();
      setStatus(copy("annualOfficialUpdated"));
    }
    syncControls();
  };
  const loadReport = () => {
    setStatus("");
    generated = false;
    reportPayload = null;
    get("annualOfficialResult").hidden = true;
    get("annualOfficialActions").hidden = true;
    get("annualOfficialState").textContent = copy("annualOfficialWaiting");
    recalculate();
  };
  const renderForms = () => {
    const root = get("annualOfficialForms");
    root.replaceChildren();
    loadReport();
  };
  const request = async (path, payload) => {
    let response;
    try {
      response = await fetch(`${api}/api/annual-report/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch {
      const message = location.protocol === "file:" ? copy("annualOfficialLocalAccess") : copy("annualOfficialUnavailable");
      throw new Error(message);
    }
    if (!response.ok) {
      let result;
      try { result = await response.json(); } catch {
        const message = location.protocol === "file:" ? copy("annualOfficialLocalAccess") : copy("annualOfficialUnavailable");
        throw new Error(message);
      }
      throw new Error([...(result.errors || []), ...(result.messages || [])].slice(0, 6).join("\n") || copy("annualOfficialError"));
    }
    return response;
  };
  const currentYear = new Date().getFullYear();
  const yearMenu = get("annualOfficialYearMenu");
  const yearMenuToggle = get("annualOfficialYearToggle");
  const yearDisplay = get("annualOfficialYearDisplay");
  const yearPeriodLabel = year => `01.01.${year} - 31.12.${year}`;
  const closeYearMenu = restoreFocus => {
    yearMenu.hidden = true;
    yearMenuToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) yearMenuToggle.focus();
  };
  const renderYearMenu = () => {
    const selectedYearValue = selectedYear();
    yearDisplay.innerHTML = `<strong>${selectedYearValue}</strong><span>${yearPeriodLabel(selectedYearValue)}</span>`;
    yearMenu.replaceChildren();
    for (let year = currentYear; year >= 2009; year--) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "annual-year-option";
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(year === selectedYearValue));
      row.dataset.year = String(year);
      row.innerHTML = `<strong>${year}</strong><span>${yearPeriodLabel(year)}</span>`;
      row.addEventListener("click", () => {
        yearPicker.value = String(year);
        yearPicker.dispatchEvent(new Event("change", { bubbles: true }));
        closeYearMenu(true);
      });
      yearMenu.append(row);
    }
  };
  for (let year = currentYear; year >= 2009; year--) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearPicker.append(option);
  }
  yearPicker.value = String(currentYear);
  renderYearMenu();
  yearPicker.addEventListener("change", () => { renderYearMenu(); loadReport(); });
  yearMenuToggle.addEventListener("click", () => {
    const open = yearMenu.hidden;
    yearMenu.hidden = !open;
    yearMenuToggle.setAttribute("aria-expanded", String(open));
    if (open) yearMenu.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  });
  yearMenu.addEventListener("keydown", event => {
    const options = [...yearMenu.querySelectorAll("[role=option]")];
    const index = options.indexOf(document.activeElement);
    if (event.key === "Escape") { event.preventDefault(); closeYearMenu(true); }
    else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      options[Math.max(0, Math.min(options.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      options[event.key === "Home" ? 0 : options.length - 1]?.focus();
    }
  });
  document.addEventListener("pointerdown", event => {
    if (!yearPickerControl.contains(event.target) && !yearMenu.hidden) closeYearMenu(false);
  });
  yearPickerControl.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" && yearMenu.hidden) {
      event.preventDefault();
      yearMenu.hidden = false;
      yearMenuToggle.setAttribute("aria-expanded", "true");
      yearMenu.querySelector('[aria-selected="true"]')?.focus();
    }
  });
  get("annualOfficialGenerate").addEventListener("click", () => {
    if (!can("reports") || busy) return;
    recalculate();
    if (unmappedAccounts.length) return;
    generated = true;
    reportPayload = readPayload();
    renderGeneratedReport();
    setStatus("");
    syncControls();
  });
  document.addEventListener("accounting-ledger-updated", () => {
    recalculate();
  });
  workspace.querySelectorAll("[data-annual-format]").forEach(button => button.addEventListener("click", async () => {
    if (!can("exportReports") || busy || !generated || !reportPayload) return;
    const format = button.dataset.annualFormat;
    busy = true; syncControls();
    try {
      const payload = reportPayload;
      const reportKey = key();
      const response = await request("export", { ...payload, format });
      if (reportKey !== key() || !can("exportReports") || JSON.stringify(payload) !== JSON.stringify(readPayload())) {
        setStatus(copy("annualOfficialNewState"));
        return;
      }
      triggerBlobDownload(await response.blob(), `majandusaasta-aruanne-${payload.registryCode}-${payload.end.slice(0, 4)}.${format}`);
      setStatus(copy("annualOfficialExported"));
    } catch (error) { setStatus(error.message, true); }
    finally { busy = false; syncControls(); }
  }));
  const syncCompany = () => {
    if (profile && currentCompany !== context()) { currentCompany = context(); loadReport(); }
    syncControls();
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); syncCompany(); };
  get("companyPicker")?.addEventListener("change", () => queueMicrotask(syncCompany));
  fetch(new URL("./data/annual-report/small-ou-2026.json?v=20261007-1", document.baseURI)).then(response => {
    if (!response.ok) throw new Error("Taxonomy profile unavailable");
    return response.json();
  }).then(data => { profile = data; window.annualReportProfile = data; currentCompany = context(); renderForms(); document.dispatchEvent(new Event("annual-report-profile-ready")); recalculate(); syncControls(); })
    .catch(() => { setStatus(copy("annualOfficialLoadError"), true); syncControls(); });
  syncControls();
  applyLanguage(language);
})();