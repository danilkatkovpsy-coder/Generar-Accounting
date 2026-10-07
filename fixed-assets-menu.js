(() => {
  const anchor = document.querySelector('.nav-button[data-view="otherExpensesView"]');
  if (!anchor || document.getElementById("fixedAssetsNavMenu")) return;

  Object.assign(ruTexts, {
    navFixedAssets: "Основные средства", fixedAssetsList: "Основные средства",
    fixedAssetsDepreciation: "Амортизация", fixedAssetsReport: "Отчет по основным средствам",
    fixedAssetsSettings: "Настройки основных средств", fixedAssetsBack: "Назад"
  });
  Object.assign(etTexts, {
    navFixedAssets: "Põhivarad", fixedAssetsList: "Põhivarad",
    fixedAssetsDepreciation: "Amortiseerimised", fixedAssetsReport: "Põhivaraaruanne",
    fixedAssetsSettings: "Põhivara seaded", fixedAssetsBack: "Tagasi"
  });

  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap fixed-assets-nav-wrap";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "nav-button";
  trigger.dataset.view = "fixedAssetsView";
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "fixedAssetsNavMenu");
  trigger.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 9h1m4 0h1m-6 3h1m4 0h1"></path></svg><span data-i18n="navFixedAssets">${translateCopy("Põhivarad", "navFixedAssets")}</span><svg class="payments-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>`;
  const menu = document.createElement("div");
  menu.id = "fixedAssetsNavMenu";
  menu.className = "payments-nav-menu fixed-assets-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(trigger, menu);
  anchor.after(wrapper);

  const entries = [
    { target: "fixedAssetsView", key: "fixedAssetsList", permission: "expenses", icon: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"></path>' },
    { target: "fixedAssetsDepreciationView", key: "fixedAssetsDepreciation", permission: "expenses", icon: '<path d="M4 5v14h16M8 8l5 5 6-3M15 10h4v4"></path>' },
    { target: "fixedAssetsReportView", key: "fixedAssetsReport", permission: "reports", icon: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"></path>' },
    { target: "fixedAssetsSettingsView", key: "fixedAssetsSettings", permission: "companySettings", icon: '<path d="M4 7h16M4 17h16"></path><circle cx="9" cy="7" r="3"></circle><circle cx="15" cy="17" r="3"></circle>' }
  ];
  let previousView = "otherExpensesView";
  const setOpen = open => {
    menu.hidden = !open;
    wrapper.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
  };
  const baseCanOpenView = canOpenView;
  canOpenView = id => {
    const entry = entries.find(item => item.target === id);
    return entry ? can(entry.permission) : baseCanOpenView(id);
  };
  const baseSwitchView = switchView;
  switchView = id => {
    baseSwitchView(id);
    const active = entries.some(entry => entry.target === id) && !document.getElementById(id)?.hidden;
    trigger.setAttribute("aria-current", active ? "page" : "false");
    menu.querySelectorAll("[data-target]").forEach(item => item.setAttribute("aria-current", item.dataset.target === id ? "page" : "false"));
    setOpen(false);
  };
  const openView = entry => {
    if (!can(entry.permission)) { setOpen(false); denyAction(entry.permission); return; }
    const current = [...document.querySelectorAll(".app-view")].find(view => !view.hidden);
    if (current && !entries.some(item => item.target === current.id)) previousView = current.id;
    if (!document.getElementById(entry.target)) {
      const view = document.createElement("section");
      view.id = entry.target;
      view.className = "app-view payments-subview fixed-assets-subview";
      view.hidden = true;
      view.innerHTML = `<div class="view-heading"><div><h1 data-i18n="${entry.key}">${translateCopy(entry.key, entry.key)}</h1></div><button type="button" class="secondary-button" data-i18n="fixedAssetsBack">${translateCopy("Tagasi", "fixedAssetsBack")}</button></div>`;
      view.querySelector("button").addEventListener("click", () => switchView(previousView));
      document.querySelector("main").insertBefore(view, document.getElementById("reportsView"));
    }
    switchView(entry.target);
    document.getElementById(entry.target).dispatchEvent(new Event("fixed-assets-open"));
    const mobileToggle = document.getElementById("mobileMenuToggle");
    if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
    applyLanguage(language);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  for (const entry of entries) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "payments-nav-menu-item";
    if (entry.target === "fixedAssetsSettingsView") item.classList.add("fixed-assets-settings-item");
    item.setAttribute("role", "menuitem");
    item.dataset.target = entry.target;
    item.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${entry.icon}</svg><span data-i18n="${entry.key}">${translateCopy(entry.key, entry.key)}</span>`;
    item.addEventListener("click", () => openView(entry));
    menu.append(item);
  }
  const syncAccess = () => {
    wrapper.hidden = !entries.some(entry => can(entry.permission));
    trigger.hidden = wrapper.hidden;
    entries.forEach(entry => { menu.querySelector(`[data-target="${entry.target}"]`).hidden = !can(entry.permission); });
    if (wrapper.hidden) setOpen(false);
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); syncAccess(); };
  syncAccess();

  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  trigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!hoverCapable) setOpen(menu.hidden);
  }, true);
  if (hoverCapable) {
    wrapper.addEventListener("mouseenter", () => setOpen(true));
    wrapper.addEventListener("mouseleave", () => { if (!wrapper.contains(document.activeElement)) setOpen(false); });
  }
  wrapper.addEventListener("focusin", () => setOpen(true));
  wrapper.addEventListener("focusout", event => { if (!wrapper.contains(event.relatedTarget)) setOpen(false); });
  trigger.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); menu.querySelector("button:not([hidden])")?.focus(); }
  });
  document.addEventListener("click", event => { if (!wrapper.contains(event.target)) setOpen(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") setOpen(false); });
  window.addEventListener("resize", () => setOpen(false));
  applyLanguage(language);
})();