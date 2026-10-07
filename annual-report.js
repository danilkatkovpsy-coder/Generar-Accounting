(() => {
  const panel = document.getElementById("annualReportPanel");
  if (!panel || document.getElementById("officialAnnualReportForm")) return;
  Object.assign(ruTexts, {
    annualOfficialTitle: "Годовой отчет — официальная структура", annualOfficialType: "Форма", annualOfficialCompany: "Предприятие",
    annualOfficialRegistry: "Регистрационный код", annualOfficialStart: "Начало периода", annualOfficialEnd: "Конец периода",
    annualOfficialCurrent: "Отчетный период", annualOfficialPrior: "Сравнительный период", annualOfficialTaxonomy: "Таксономия",
    annualOfficialDraft: "Черновик", annualOfficialSave: "Сохранить черновик", annualOfficialCheck: "Проверить XBRL",
    annualOfficialReady: "Техническая проверка XBRL пройдена. Приём отчета проверяет e-äriregister.",
    annualOfficialIncomplete: "Примечания и отчет руководства не добавлены. Отчет пока является черновиком.",
    annualOfficialUnavailable: "Сервис формирования отчетов недоступен.", annualOfficialLoadError: "Не удалось загрузить официальную структуру.",
    annualOfficialSaved: "Черновик сохранен.", annualOfficialError: "Проверка не пройдена.", annualOfficialDownloads: "Скачать",
    annualOfficialConfirmed: "Данные основных отчетов проверены", annualOfficialNewState: "Данные изменены. Проверка требуется повторно."
  });
  Object.assign(etTexts, {
    annualOfficialTitle: "Majandusaasta aruanne — ametlik struktuur", annualOfficialType: "Aruande vorm", annualOfficialCompany: "Ettevõte",
    annualOfficialRegistry: "Registrikood", annualOfficialStart: "Perioodi algus", annualOfficialEnd: "Perioodi lõpp",
    annualOfficialCurrent: "Aruandeperiood", annualOfficialPrior: "Võrdlusperiood", annualOfficialTaxonomy: "Taksonoomia",
    annualOfficialDraft: "Mustand", annualOfficialSave: "Salvesta mustand", annualOfficialCheck: "Kontrolli XBRL",
    annualOfficialReady: "XBRL tehniline kontroll läbitud. Aruande vastuvõtmist kontrollib e-äriregister.",
    annualOfficialIncomplete: "Lisad ja tegevusaruanne on lisamata. Aruanne on praegu mustand.",
    annualOfficialUnavailable: "Aruandeteenus pole saadaval.", annualOfficialLoadError: "Ametlikku struktuuri ei saanud laadida.",
    annualOfficialSaved: "Mustand salvestati.", annualOfficialError: "Kontroll ebaõnnestus.", annualOfficialDownloads: "Laadi alla",
    annualOfficialConfirmed: "Põhiaruannete andmed on kontrollitud", annualOfficialNewState: "Andmed on muutunud. Kontroll on vajalik uuesti."
  });
  const copy = key => translateCopy(key, key);
  const get = id => document.getElementById(id);
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"></path></svg>';
  const workspace = document.createElement("section");
  workspace.className = "annual-official-workspace";
  workspace.innerHTML = `<div class="annual-official-heading"><h2 data-i18n="annualOfficialTitle">${copy("annualOfficialTitle")}</h2><span class="annual-draft-badge" data-i18n="annualOfficialDraft">${copy("annualOfficialDraft")}</span></div><form id="officialAnnualReportForm"><div class="annual-official-settings"><div class="field"><label for="annualOfficialType" data-i18n="annualOfficialType">${copy("annualOfficialType")}</label><select id="annualOfficialType" disabled><option>Väikeettevõtja — OÜ</option></select></div><div class="field"><label for="annualOfficialCompany" data-i18n="annualOfficialCompany">${copy("annualOfficialCompany")}</label><input id="annualOfficialCompany" required maxlength="500"></div><div class="field"><label for="annualOfficialRegistry" data-i18n="annualOfficialRegistry">${copy("annualOfficialRegistry")}</label><input id="annualOfficialRegistry" required pattern="[0-9]{8}" maxlength="8" inputmode="numeric"></div><div class="field"><label for="annualOfficialStart" data-i18n="annualOfficialStart">${copy("annualOfficialStart")}</label><input id="annualOfficialStart" type="date" required></div><div class="field"><label for="annualOfficialEnd" data-i18n="annualOfficialEnd">${copy("annualOfficialEnd")}</label><input id="annualOfficialEnd" type="date" required></div><div class="annual-taxonomy-source"><span data-i18n="annualOfficialTaxonomy">${copy("annualOfficialTaxonomy")}</span><a href="https://xbrl.eesti.ee/" target="_blank" rel="noopener noreferrer">RIK · 2026-01-01</a></div></div><p class="annual-report-warning" data-i18n="annualOfficialIncomplete">${copy("annualOfficialIncomplete")}</p><div id="annualOfficialForms"></div><label class="annual-confirmation"><input id="annualOfficialConfirmed" type="checkbox" required><span data-i18n="annualOfficialConfirmed">${copy("annualOfficialConfirmed")}</span></label><div class="annual-report-actions"><button type="button" class="secondary-button" id="annualOfficialSave" data-i18n="annualOfficialSave">${copy("annualOfficialSave")}</button><button type="submit" class="primary-button" id="annualOfficialCheck" data-i18n="annualOfficialCheck">${copy("annualOfficialCheck")}</button></div><div id="annualOfficialStatus" class="annual-official-status" role="status" aria-live="polite" hidden></div><section class="annual-report-downloads"><h3 data-i18n="annualOfficialDownloads">${copy("annualOfficialDownloads")}</h3><div class="annual-download-controls"><button type="button" class="secondary-button" data-annual-format="pdf">${icon}<span>PDF</span></button><button type="button" class="secondary-button" data-annual-format="xlsx">${icon}<span>Excel (.xlsx)</span></button><button type="button" class="secondary-button" data-annual-format="xbrl">${icon}<span>XBRL</span></button></div></section></form>`;
  panel.append(workspace);
  const form = get("officialAnnualReportForm");
  const start = get("annualOfficialStart");
  const end = get("annualOfficialEnd");
  const company = get("annualOfficialCompany");
  const registry = get("annualOfficialRegistry");
  const status = get("annualOfficialStatus");
  const localhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  const api = String(window.ARVESEMU_ANNUAL_REPORT_API || (localhost && location.port !== "8765" ? "http://127.0.0.1:8765" : "")).replace(/\/$/, "");
  let profile = null;
  let busy = false;
  let verified = false;
  let currentCompany = "";
  const context = () => String(cloudWorkspace?.organizationId || activeCompanyId || "guest");
  const key = () => `arvesemu-official-annual:${context()}:${start.value}:${end.value}`;
  const setStatus = (message, error = false) => {
    status.hidden = !message;
    status.textContent = message;
    status.classList.toggle("is-error", error);
  };
  const syncControls = () => {
    get("annualOfficialCheck").disabled = busy || !profile || !can("reports");
    get("annualOfficialSave").disabled = busy || !profile || !can("reports");
    workspace.querySelectorAll("[data-annual-format]").forEach(button => {
      button.disabled = busy || !profile || !can("exportReports") || button.dataset.annualFormat === "xbrl" && !verified;
    });
  };
  const readPayload = () => {
    const facts = {};
    workspace.querySelectorAll("input[data-annual-concept]").forEach(input => {
      if (!facts[input.dataset.annualConcept]) facts[input.dataset.annualConcept] = {};
      facts[input.dataset.annualConcept][input.dataset.annualPeriod] = input.value;
    });
    return { profile: "small-ou", companyName: company.value.trim(), registryCode: registry.value.trim(), start: start.value, end: end.value, facts };
  };
  const loadDraft = () => {
    setStatus("");
    company.value = currentSeller()?.name || "";
    registry.value = String(currentSeller()?.reg || "").replace(/\s/g, "");
    workspace.querySelectorAll("input[data-annual-concept]").forEach(input => { input.value = ""; });
    get("annualOfficialConfirmed").checked = false;
    try {
      const draft = JSON.parse(localStorage.getItem(key()) || "null");
      if (draft) {
        company.value = draft.companyName || company.value;
        registry.value = draft.registryCode || registry.value;
        workspace.querySelectorAll("input[data-annual-concept]").forEach(input => {
          input.value = draft.facts?.[input.dataset.annualConcept]?.[input.dataset.annualPeriod] ?? "";
        });
      }
    } catch { setStatus(copy("annualOfficialError"), true); }
    verified = false;
    syncControls();
  };
  const renderForms = () => {
    const root = get("annualOfficialForms");
    root.replaceChildren();
    const requiredNames = new Set(["Assets", "LiabilitiesAndEquity", "TotalAnnualPeriodProfitLoss"]);
    for (const entry of profile.forms) {
      const section = document.createElement("section");
      section.className = "annual-taxonomy-form";
      const heading = document.createElement("h3");
      heading.textContent = entry.title;
      const wrap = document.createElement("div");
      wrap.className = "table-wrap";
      const table = document.createElement("table");
      table.className = "data-table annual-official-table";
      table.innerHTML = `<thead><tr><th>${escapeHtml(entry.title)}</th><th data-i18n="annualOfficialCurrent">${copy("annualOfficialCurrent")}</th><th data-i18n="annualOfficialPrior">${copy("annualOfficialPrior")}</th></tr></thead><tbody>${entry.rows.map(concept => `<tr class="${concept.abstract ? "annual-taxonomy-group" : ""}"><td style="padding-left:${Math.min(concept.depth, 4) * 10 + 10}px" title="${escapeHtml(concept.name)}">${escapeHtml(concept.label)}</td>${concept.abstract ? '<td></td><td></td>' : ["current", "prior"].map(period => `<td><input type="number" step="0.01" data-annual-concept="${escapeHtml(concept.id)}" data-annual-period="${period}" aria-label="${escapeHtml(concept.label)} ${period === "current" ? copy("annualOfficialCurrent") : copy("annualOfficialPrior")}" ${requiredNames.has(concept.name) ? "required" : ""}></td>`).join("")}</tr>`).join("")}</tbody>`;
      wrap.append(table);
      section.append(heading, wrap);
      root.append(section);
    }
    loadDraft();
    applyLanguage(language);
  };
  const request = async (path, payload) => {
    let response;
    try {
      response = await fetch(`${api}/api/annual-report/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch { throw new Error(copy("annualOfficialUnavailable")); }
    if (!response.ok) {
      let result;
      try { result = await response.json(); } catch { throw new Error(copy("annualOfficialUnavailable")); }
      throw new Error([...(result.errors || []), ...(result.messages || [])].slice(0, 6).join("\n") || copy("annualOfficialError"));
    }
    return response;
  };
  form.addEventListener("input", () => {
    verified = false;
    setStatus(copy("annualOfficialNewState"));
    syncControls();
  });
  for (const input of [start, end]) input.addEventListener("change", loadDraft);
  get("annualOfficialSave").addEventListener("click", () => {
    if (!can("reports")) return;
    try { localStorage.setItem(key(), JSON.stringify(readPayload())); setStatus(copy("annualOfficialSaved")); }
    catch { setStatus(copy("annualOfficialError"), true); }
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!can("reports") || busy) return;
    const payload = readPayload();
    const reportKey = key();
    busy = true; verified = false; syncControls();
    try {
      const result = await (await request("check", payload)).json();
      if (reportKey !== key() || JSON.stringify(payload) !== JSON.stringify(readPayload())) {
        setStatus(copy("annualOfficialNewState"));
        return;
      }
      verified = result.valid === true;
      setStatus(verified ? copy("annualOfficialReady") : [...(result.errors || []), ...(result.messages || [])].slice(0, 6).join("\n") || copy("annualOfficialError"), !verified);
    } catch (error) { setStatus(error.message, true); }
    finally { busy = false; syncControls(); }
  });
  workspace.querySelectorAll("[data-annual-format]").forEach(button => button.addEventListener("click", async () => {
    if (!can("exportReports") || busy || !form.reportValidity()) return;
    const format = button.dataset.annualFormat;
    if (format === "xbrl" && !verified) return;
    busy = true; syncControls();
    try {
      const payload = readPayload();
      const reportKey = key();
      const response = await request("export", { ...payload, format });
      if (reportKey !== key() || !can("exportReports") || JSON.stringify(payload) !== JSON.stringify(readPayload())) {
        setStatus(copy("annualOfficialNewState"));
        return;
      }
      triggerBlobDownload(await response.blob(), `majandusaasta-aruanne-${payload.registryCode}-${payload.end.slice(0, 4)}.${format}`);
    } catch (error) { setStatus(error.message, true); }
    finally { busy = false; syncControls(); }
  }));
  const year = get("reportYear")?.value || new Date().getFullYear();
  start.value = `${year}-01-01`; end.value = `${year}-12-31`;
  get("reportYear")?.addEventListener("change", () => { start.value = `${get("reportYear").value}-01-01`; end.value = `${get("reportYear").value}-12-31`; loadDraft(); });
  const syncCompany = () => {
    if (profile && currentCompany !== context()) { currentCompany = context(); loadDraft(); }
    syncControls();
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); syncCompany(); };
  get("companyPicker")?.addEventListener("change", () => queueMicrotask(syncCompany));
  fetch(new URL("./data/annual-report/small-ou-2026.json?v=20261007-1", document.baseURI)).then(response => {
    if (!response.ok) throw new Error("Taxonomy profile unavailable");
    return response.json();
  }).then(data => { profile = data; currentCompany = context(); renderForms(); syncControls(); })
    .catch(() => { setStatus(copy("annualOfficialLoadError"), true); syncControls(); });
  syncControls();
  applyLanguage(language);
})();