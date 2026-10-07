(() => {
  const trigger = document.querySelector('.nav-button[data-view="expensesView"]');
  if (!trigger || document.getElementById("procurementNavMenu")) return;
  Object.assign(ruTexts, {
    procurementInvoices: "Счета закупок", procurementSuppliers: "Поставщики", procurementEInvoice: "Импорт e-счетов",
    procurementSupplierAdd: "Добавить поставщика", procurementSearch: "Поиск поставщика", procurementName: "Название",
    procurementRegistration: "Регистрационный код", procurementEmail: "Электронная почта", procurementPhone: "Телефон",
    procurementAddress: "Адрес", procurementEdit: "Изменить", procurementEmpty: "Поставщиков пока нет.",
    procurementNoResults: "Поставщиков по заданному поиску нет.", procurementTotal: "Всего", procurementXml: "XML-файл",
    procurementImportUnavailable: "Импорт e-счетов пока не подключён."
  });
  Object.assign(etTexts, {
    procurementInvoices: "Ostuarved", procurementSuppliers: "Hankijad", procurementEInvoice: "E-arve import",
    procurementSupplierAdd: "Lisa hankija", procurementSearch: "Otsi hankijat", procurementName: "Nimi",
    procurementRegistration: "Registrikood", procurementEmail: "E-post", procurementPhone: "Telefon",
    procurementAddress: "Aadress", procurementEdit: "Muuda", procurementEmpty: "Hankijaid pole veel lisatud.",
    procurementNoResults: "Otsingule vastavaid hankijaid pole.", procurementTotal: "Kokku", procurementXml: "XML-fail",
    procurementImportUnavailable: "E-arvete import ei ole veel ühendatud."
  });
  const copy = key => translateCopy(key, key);
  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap procurement-nav-wrap";
  trigger.before(wrapper);
  wrapper.append(trigger);
  trigger.dataset.procurementMenuReady = "true";
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "procurementNavMenu");
  trigger.insertAdjacentHTML("beforeend", '<svg class="payments-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>');
  const menu = document.createElement("div");
  menu.id = "procurementNavMenu";
  menu.className = "payments-nav-menu procurement-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(menu);
  const main = document.querySelector("main");
  const suppliersView = document.createElement("section");
  suppliersView.id = "procurementSuppliersView";
  suppliersView.className = "app-view payments-subview procurement-subview";
  suppliersView.hidden = true;
  suppliersView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="procurementSuppliers">${copy("procurementSuppliers")}</h1></div><button type="button" class="primary-button" id="procurementAddSupplier"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg><span data-i18n="procurementSupplierAdd">${copy("procurementSupplierAdd")}</span></button></div><section class="data-panel"><div class="field procurement-supplier-search"><label for="procurementSupplierSearch" data-i18n="procurementSearch">${copy("procurementSearch")}</label><input id="procurementSupplierSearch" type="search" autocomplete="off"></div><div class="table-wrap"><table class="data-table procurement-suppliers-table"><thead><tr>${["procurementName", "procurementRegistration", "procurementEmail", "procurementPhone", "procurementAddress"].map(key => `<th data-i18n="${key}">${copy(key)}</th>`).join("")}<th></th></tr></thead><tbody id="procurementSupplierRows"></tbody></table></div><p class="procurement-total" id="procurementSupplierTotal"></p></section>`;
  main.insertBefore(suppliersView, document.getElementById("reportsView"));
  const eInvoiceView = document.createElement("section");
  eInvoiceView.id = "procurementEInvoiceView";
  eInvoiceView.className = "app-view payments-subview procurement-subview";
  eInvoiceView.hidden = true;
  eInvoiceView.innerHTML = `<div class="view-heading"><div><h1 data-i18n="procurementEInvoice">${copy("procurementEInvoice")}</h1></div></div><section class="data-panel"><p class="procurement-import-status" role="status" data-i18n="procurementImportUnavailable">${copy("procurementImportUnavailable")}</p><div class="field"><label for="procurementEInvoiceFile" data-i18n="procurementXml">${copy("procurementXml")}</label><input id="procurementEInvoiceFile" type="file" accept=".xml,application/xml,text/xml" disabled></div></section>`;
  main.insertBefore(eInvoiceView, document.getElementById("reportsView"));
  const get = id => document.getElementById(id);
  const renderSuppliers = () => {
    const query = get("procurementSupplierSearch").value.trim().toLocaleLowerCase(language);
    const rows = suppliers.filter(supplier => [supplier.name, supplier.reg, supplier.email, supplier.phone, supplier.address].join(" ").toLocaleLowerCase(language).includes(query))
      .sort((first, second) => String(first.name || "").localeCompare(String(second.name || ""), language, { sensitivity: "base" }));
    get("procurementSupplierRows").innerHTML = rows.map(supplier => `<tr data-procurement-supplier="${escapeHtml(supplier.id)}" tabindex="0" aria-label="${escapeHtml(copy("procurementEdit"))} ${escapeHtml(supplier.name)}"><td>${escapeHtml(supplier.name)}</td><td>${escapeHtml(supplier.reg || "—")}</td><td>${escapeHtml(supplier.email || "—")}</td><td>${escapeHtml(supplier.phone || "—")}</td><td>${escapeHtml(supplier.address || "—")}</td><td><button type="button" class="text-button" data-edit-procurement-supplier="${escapeHtml(supplier.id)}" aria-label="${escapeHtml(copy("procurementEdit"))} ${escapeHtml(supplier.name)}">${escapeHtml(copy("procurementEdit"))}</button></td></tr>`).join("") || `<tr><td colspan="6" class="procurement-empty">${escapeHtml(copy(suppliers.length ? "procurementNoResults" : "procurementEmpty"))}</td></tr>`;
    get("procurementSupplierTotal").textContent = `${copy("procurementTotal")}: ${rows.length}`;
    get("procurementAddSupplier").disabled = !can("expenses");
    applyLanguage(language);
  };
  const baseRenderSupplierPicker = renderSupplierPicker;
  renderSupplierPicker = (...args) => { baseRenderSupplierPicker(...args); renderSuppliers(); };
  const editSupplier = id => {
    if (!can("expenses")) { denyAction("expenses"); return; }
    const supplier = suppliers.find(item => item.id === id);
    if (supplier) openSupplierDialog(supplier);
  };
  get("procurementAddSupplier").addEventListener("click", () => { if (can("expenses")) openSupplierDialog(); else denyAction("expenses"); });
  get("procurementSupplierSearch").addEventListener("input", renderSuppliers);
  get("procurementSupplierRows").addEventListener("click", event => {
    const row = event.target.closest("[data-procurement-supplier]");
    if (row) editSupplier(row.dataset.procurementSupplier);
  });
  get("procurementSupplierRows").addEventListener("keydown", event => {
    const row = event.target.closest("[data-procurement-supplier]");
    if (row && event.target === row && ["Enter", " "].includes(event.key)) { event.preventDefault(); editSupplier(row.dataset.procurementSupplier); }
  });
  const entries = [
    { view: "expensesView", key: "procurementInvoices", icon: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"></path>' },
    { view: suppliersView.id, key: "procurementSuppliers", icon: '<circle cx="9" cy="8" r="3"></circle><path d="M3 21v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5v1"></path>' },
    { view: eInvoiceView.id, key: "procurementEInvoice", icon: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M12 11v7m-3-3 3 3 3-3"></path>' }
  ];
  const setOpen = open => { menu.hidden = !open; wrapper.classList.toggle("is-open", open); trigger.setAttribute("aria-expanded", String(open)); };
  const baseCanOpenView = canOpenView;
  canOpenView = id => [suppliersView.id, eInvoiceView.id].includes(id) ? can("expenses") : baseCanOpenView(id);
  const baseSwitchView = switchView;
  switchView = id => {
    baseSwitchView(id);
    const active = ["expensesView", "supplierInvoiceEditorView", suppliersView.id, eInvoiceView.id].includes(id) && !get(id)?.hidden;
    trigger.setAttribute("aria-current", active ? "page" : "false");
    menu.querySelectorAll("[data-procurement-view]").forEach(item => item.setAttribute("aria-current", active && (item.dataset.procurementView === id || id === "supplierInvoiceEditorView" && item.dataset.procurementView === "expensesView") ? "page" : "false"));
    if (id === suppliersView.id && active) renderSuppliers();
    setOpen(false);
  };
  for (const entry of entries) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "payments-nav-menu-item procurement-nav-menu-item";
    item.setAttribute("role", "menuitem");
    item.dataset.procurementView = entry.view;
    item.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${entry.icon}</svg><span data-i18n="${entry.key}">${copy(entry.key)}</span>`;
    item.addEventListener("click", () => {
      if (!can("expenses")) { setOpen(false); denyAction("expenses"); return; }
      switchView(entry.view);
      const mobileToggle = get("mobileMenuToggle");
      if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    menu.append(item);
  }
  const syncAccess = () => {
    wrapper.hidden = !can("expenses");
    trigger.hidden = wrapper.hidden;
    if (wrapper.hidden) { suppliersView.hidden = true; eInvoiceView.hidden = true; setOpen(false); }
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); syncAccess(); if (!suppliersView.hidden) renderSuppliers(); };
  syncAccess();
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let openBeforePointer = false;
  trigger.addEventListener("pointerdown", () => { openBeforePointer = !menu.hidden; });
  trigger.addEventListener("click", event => { event.preventDefault(); event.stopImmediatePropagation(); setOpen(hoverCapable || event.detail === 0 ? true : !openBeforePointer); }, true);
  if (hoverCapable) {
    wrapper.addEventListener("mouseenter", () => setOpen(true));
    wrapper.addEventListener("mouseleave", () => { if (!wrapper.contains(document.activeElement)) setOpen(false); });
  }
  wrapper.addEventListener("focusin", () => setOpen(true));
  wrapper.addEventListener("focusout", event => { if (!wrapper.contains(event.relatedTarget)) setOpen(false); });
  trigger.addEventListener("keydown", event => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); menu.querySelector("button")?.focus(); } });
  document.addEventListener("click", event => { if (!wrapper.contains(event.target)) setOpen(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") setOpen(false); });
  window.addEventListener("resize", () => setOpen(false));
  get("companyPicker")?.addEventListener("change", () => { get("procurementSupplierSearch").value = ""; if (!suppliersView.hidden) queueMicrotask(renderSuppliers); });
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => { if (!suppliersView.hidden) requestAnimationFrame(renderSuppliers); }));
  renderSuppliers();
})();