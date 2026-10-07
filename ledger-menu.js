(() => {
  const nav = document.getElementById("appNav");
  const anchor = nav?.querySelector('[data-payments-menu-ready="true"]')?.closest(".payments-nav-wrap");
  const panel = document.getElementById("generalLedgerPanel");
  const tab = document.getElementById("generalLedgerTab");
  if (!anchor || !panel || !tab || document.getElementById("ledgerNavMenu")) return;

  Object.assign(ruTexts, { navLedger: "Главная книга", ledgerEntriesMenu: "Проводки главной книги", ledgerBookMenu: "Главная книга", ledgerTurnoverMenu: "Оборотная ведомость" });
  Object.assign(etTexts, { navLedger: "Pearaamat", ledgerEntriesMenu: "Pearaamatu kanded", ledgerBookMenu: "Pearaamat", ledgerTurnoverMenu: "Käibeandmik" });
  const copy = key => translateCopy(key, key);
  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap ledger-nav-wrap";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "nav-button";
  trigger.dataset.view = "ledgerView";
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "ledgerNavMenu");
  const bookIcon = '<path d="M12 6.5c-1.5-1.3-3.5-2-6-2H4v15h2c2.5 0 4.5.7 6 2m0-15c1.5-1.3 3.5-2 6-2h2v15h-2c-2.5 0-4.5.7-6 2m0-15v15"></path>';
  trigger.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${bookIcon}</svg><span data-i18n="navLedger">${copy("navLedger")}</span><svg class="payments-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>`;
  const menu = document.createElement("div");
  menu.id = "ledgerNavMenu";
  menu.className = "payments-nav-menu ledger-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(trigger, menu);
  anchor.after(wrapper);
  nav.querySelector('.nav-button[data-view="otherExpensesView"]')?.remove();
  tab.hidden = true;
  tab.tabIndex = -1;
  tab.setAttribute("aria-hidden", "true");
  if (tab.getAttribute("aria-selected") === "true") document.getElementById("annualReportTab").click();

  const ledgerView = document.createElement("section");
  ledgerView.id = "ledgerView";
  ledgerView.className = "app-view payments-subview ledger-subview";
  ledgerView.hidden = true;
  ledgerView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="ledgerBookMenu">${copy("ledgerBookMenu")}</h1></div></div>`;
  ledgerView.querySelector(".view-heading").append(document.getElementById("createLedgerButton"));
  panel.querySelector(":scope > .balance-heading")?.remove();
  panel.removeAttribute("role");
  panel.removeAttribute("aria-labelledby");
  ledgerView.append(panel);
  document.querySelector("main").insertBefore(ledgerView, document.getElementById("reportsView"));

  const turnoverView = document.createElement("section");
  turnoverView.id = "ledgerTurnoverView";
  turnoverView.className = "app-view payments-subview ledger-subview";
  turnoverView.hidden = true;
  turnoverView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="ledgerTurnoverMenu">${copy("ledgerTurnoverMenu")}</h1></div><button type="button" class="primary-button" id="ledgerTurnoverGenerate" data-i18n="ledgerGenerate">${copy("ledgerGenerate")}</button></div><section class="data-panel"><div class="date-range-filter"><div class="field"><label for="ledgerTurnoverStart" data-i18n="ledgerStartDateLabel">${copy("ledgerStartDateLabel")}</label><input id="ledgerTurnoverStart" type="date"></div><div class="field"><label for="ledgerTurnoverEnd" data-i18n="ledgerEndDateLabel">${copy("ledgerEndDateLabel")}</label><input id="ledgerTurnoverEnd" type="date"></div><button type="button" class="secondary-button" id="ledgerTurnoverExport" data-i18n="ledgerExport">${copy("ledgerExport")}</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th data-i18n="ledgerAccountColumn">${copy("ledgerAccountColumn")}</th><th data-i18n="ledgerDebitColumn">${copy("ledgerDebitColumn")}</th><th data-i18n="ledgerCreditColumn">${copy("ledgerCreditColumn")}</th><th data-i18n="ledgerBalanceColumn">${copy("ledgerBalanceColumn")}</th></tr></thead><tbody id="ledgerTurnoverRows"></tbody><tfoot id="ledgerTurnoverTotals"></tfoot></table></div><p class="ledger-disclaimer" data-i18n="ledgerDisclaimer">${copy("ledgerDisclaimer")}</p></section>`;
  document.querySelector("main").insertBefore(turnoverView, document.getElementById("reportsView"));
  const get = id => document.getElementById(id);
  const today = localDate();
  get("ledgerTurnoverStart").value = `${today.slice(0, 4)}-01-01`;
  get("ledgerTurnoverEnd").value = today;
  let turnoverRows = [];
  let ledgerMode = "ledger";
  const calculateTurnover = () => {
    const start = get("ledgerTurnoverStart").value;
    const end = get("ledgerTurnoverEnd").value;
    if (!start || !end || start > end) { showMessage(copy("ledgerInvalidDates"), true); return false; }
    const accounts = new Map();
    for (const entry of createLedgerEntries(start, end)) {
      if (!accounts.has(entry.accountCode)) accounts.set(entry.accountCode, { code: entry.accountCode, label: entry.account, debit: 0, credit: 0 });
      const account = accounts.get(entry.accountCode);
      account.debit += Number(entry.debit) || 0;
      account.credit += Number(entry.credit) || 0;
    }
    turnoverRows = [...accounts.values()].sort((first, second) => first.code.localeCompare(second.code, language, { numeric: true }));
    get("ledgerTurnoverRows").innerHTML = turnoverRows.map(account => `<tr><td>${escapeHtml(account.code)} · ${escapeHtml(account.label || "")}</td><td>${money(account.debit)}</td><td>${money(account.credit)}</td><td>${money(account.debit - account.credit)} EUR</td></tr>`).join("") || `<tr><td colspan="4" class="empty-row">${escapeHtml(copy("ledgerEmpty"))}</td></tr>`;
    const debit = turnoverRows.reduce((sum, account) => sum + account.debit, 0);
    const credit = turnoverRows.reduce((sum, account) => sum + account.credit, 0);
    get("ledgerTurnoverTotals").innerHTML = `<tr><th>${escapeHtml(copy("pageSumTotal"))}</th><td>${money(debit)}</td><td>${money(credit)}</td><td>${money(debit - credit)} EUR</td></tr>`;
    return true;
  };
  get("ledgerTurnoverGenerate").addEventListener("click", () => { if (can("reports")) calculateTurnover(); });
  get("ledgerTurnoverExport").addEventListener("click", () => {
    if (!can("exportReports")) { denyAction("exportReports"); return; }
    if (!calculateTurnover()) return;
    const cell = value => {
      let text = String(value ?? "");
      if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
      return `"${text.replaceAll('"', '""')}"`;
    };
    const data = [[copy("ledgerAccountColumn"), copy("ledgerDebitColumn"), copy("ledgerCreditColumn"), copy("ledgerBalanceColumn")], ...turnoverRows.map(account => [`${account.code} · ${account.label || ""}`, account.debit.toFixed(2), account.credit.toFixed(2), (account.debit - account.credit).toFixed(2)])];
    triggerBlobDownload(new Blob(["\ufeff", data.map(row => row.map(cell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" }), `kaibeandmik-${get("ledgerTurnoverStart").value}-${get("ledgerTurnoverEnd").value}.csv`);
  });

  const setOpen = open => { menu.hidden = !open; wrapper.classList.toggle("is-open", open); trigger.setAttribute("aria-expanded", String(open)); };
  const entries = [{ mode: "entries", key: "ledgerEntriesMenu" }, { mode: "ledger", key: "ledgerBookMenu" }, { mode: "turnover", key: "ledgerTurnoverMenu" }];
  for (const entry of entries) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "payments-nav-menu-item";
    item.setAttribute("role", "menuitem");
    item.dataset.ledgerMode = entry.mode;
    item.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${bookIcon}</svg><span data-i18n="${entry.key}">${copy(entry.key)}</span>`;
    item.addEventListener("click", () => {
      if (!can("reports")) { setOpen(false); denyAction("reports"); return; }
      ledgerMode = entry.mode;
      if (entry.mode === "turnover") { switchView("ledgerTurnoverView"); calculateTurnover(); }
      else {
        const title = ledgerView.querySelector("h1");
        title.dataset.i18n = entry.key;
        title.textContent = copy(entry.key);
        switchView("ledgerView");
        panel.hidden = false;
        if (entry.mode === "entries") generateGeneralLedger();
      }
      const mobileToggle = get("mobileMenuToggle");
      if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    menu.append(item);
  }
  const baseCanOpenView = canOpenView;
  canOpenView = id => ["ledgerView", "ledgerTurnoverView"].includes(id) ? can("reports") : baseCanOpenView(id);
  const baseSwitchView = switchView;
  switchView = id => {
    baseSwitchView(id);
    const active = ["ledgerView", "ledgerTurnoverView"].includes(id) && !get(id).hidden;
    if (id === "ledgerView" && active) panel.hidden = false;
    trigger.setAttribute("aria-current", active ? "page" : "false");
    menu.querySelectorAll("[data-ledger-mode]").forEach(item => item.setAttribute("aria-current", active && item.dataset.ledgerMode === ledgerMode ? "page" : "false"));
    setOpen(false);
  };
  const syncAccess = () => {
    wrapper.hidden = !can("reports");
    trigger.hidden = wrapper.hidden;
    get("ledgerTurnoverExport").disabled = !can("exportReports");
    if (wrapper.hidden) setOpen(false);
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); syncAccess(); };
  syncAccess();
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  trigger.addEventListener("click", event => { event.preventDefault(); event.stopImmediatePropagation(); if (!hoverCapable) setOpen(menu.hidden); }, true);
  if (hoverCapable) {
    wrapper.addEventListener("mouseenter", () => setOpen(true));
    wrapper.addEventListener("mouseleave", () => { if (!wrapper.contains(document.activeElement)) setOpen(false); });
  }
  wrapper.addEventListener("focusin", () => setOpen(true));
  wrapper.addEventListener("focusout", event => { if (!wrapper.contains(event.relatedTarget)) setOpen(false); });
  trigger.addEventListener("keydown", event => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); menu.querySelector("button")?.focus(); } });
  document.addEventListener("click", event => { if (!wrapper.contains(event.target)) setOpen(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") setOpen(false); });
  applyLanguage(language);
})();