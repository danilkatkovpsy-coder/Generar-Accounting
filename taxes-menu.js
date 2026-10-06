(() => {
  const anchor = document.querySelector('.nav-button[data-view="otherExpensesView"]');
  if (!anchor || anchor.dataset.taxesMenuReady === "true") return;
  anchor.dataset.taxesMenuReady = "true";

  Object.assign(ruTexts, {
    navTaxes: "Налоги",
    taxesKmdTitle: "Декларация оборота (KMD)",
    taxesTsdTitle: "TSD",
    taxesKmdDescription: "Käibedeklaratsioon",
    taxesTsdDescription: "Tulu- ja sotsiaalmaksu deklaratsioon",
    taxesBack: "Назад"
  });
  Object.assign(etTexts, {
    navTaxes: "Maksud",
    taxesKmdTitle: "KMD Käibedeklaratsioon",
    taxesTsdTitle: "TSD",
    taxesKmdDescription: "Käibedeklaratsioon",
    taxesTsdDescription: "Tulu- ja sotsiaalmaksu deklaratsioon",
    taxesBack: "Tagasi"
  });

  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap taxes-nav-wrap";
  anchor.after(wrapper);
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "nav-button taxes-nav-button";
  trigger.dataset.view = "reportsView";
  trigger.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h5"></path></svg><span class="nav-label" data-i18n="navTaxes">${translateCopy("Налоги", "navTaxes")}</span>`;
  wrapper.append(trigger);
  const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chevron.setAttribute("viewBox", "0 0 24 24");
  chevron.setAttribute("aria-hidden", "true");
  chevron.classList.add("payments-nav-chevron");
  chevron.innerHTML = '<path d="m7 10 5 5 5-5"></path>';
  trigger.append(chevron);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");

  const menu = document.createElement("div");
  menu.id = "taxesNavMenu";
  menu.className = "payments-nav-menu taxes-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(menu);

  const entries = [
    { target: "taxesKmdView", key: "taxesKmdTitle", descriptionKey: "taxesKmdDescription", icon: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"></path>' },
    { target: "taxesTsdView", key: "taxesTsdTitle", descriptionKey: "taxesTsdDescription", icon: '<path d="M12 3v18M4 7h8a4 4 0 0 1 0 8H4M20 17h-8"></path>' }
  ];
  const views = new Map();
  let previousView = "reportsView";
  const createView = entry => {
    const view = document.createElement("section");
    view.id = entry.target;
    view.className = "app-view payments-subview taxes-subview";
    view.hidden = true;
    const heading = document.createElement("div");
    heading.className = "view-heading";
    const titleGroup = document.createElement("div");
    const title = document.createElement("h1");
    title.dataset.i18n = entry.key;
    title.textContent = translateCopy(entry.key, entry.key);
    const description = document.createElement("p");
    description.dataset.i18n = entry.descriptionKey;
    description.textContent = translateCopy(entry.descriptionKey, entry.descriptionKey);
    titleGroup.append(title, description);
    const back = document.createElement("button");
    back.type = "button";
    back.className = "secondary-button";
    back.dataset.i18n = "taxesBack";
    back.textContent = translateCopy("Назад", "taxesBack");
    back.addEventListener("click", () => switchView(previousView));
    heading.append(titleGroup, back);
    view.append(heading);
    document.querySelector("main").insertBefore(view, document.getElementById("reportsView"));
    views.set(entry.target, view);
    return view;
  };
  const closeMenu = () => {
    menu.hidden = true;
    wrapper.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    menu.hidden = false;
    wrapper.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };
  const openView = entry => {
    if (!can("reports")) { closeMenu(); denyAction("reports"); return; }
    previousView = [...document.querySelectorAll(".app-view")].find(view => !view.hidden && !view.id.startsWith("taxes"))?.id || "reportsView";
    closeMenu();
    document.querySelectorAll(".app-view").forEach(view => { view.hidden = view.id !== entry.target; });
    document.querySelectorAll(".nav-button").forEach(button => button.setAttribute("aria-current", button === trigger ? "page" : "false"));
    const view = views.get(entry.target) || createView(entry);
    view.hidden = false;
    const mobileToggle = document.getElementById("mobileMenuToggle");
    if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  for (const entry of entries) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "payments-nav-menu-item taxes-nav-menu-item";
    item.setAttribute("role", "menuitem");
    item.dataset.target = entry.target;
    item.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${entry.icon}</svg><span data-i18n="${entry.key}">${translateCopy(entry.key, entry.key)}</span>`;
    item.addEventListener("click", () => openView(entry));
    menu.append(item);
  }

  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  trigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (hoverCapable) return;
    if (menu.hidden) openMenu(); else closeMenu();
  }, true);
  if (hoverCapable) {
    wrapper.addEventListener("mouseenter", openMenu);
    wrapper.addEventListener("mouseleave", () => { if (!wrapper.contains(document.activeElement)) closeMenu(); });
  }
  wrapper.addEventListener("focusin", openMenu);
  wrapper.addEventListener("focusout", event => { if (!wrapper.contains(event.relatedTarget)) closeMenu(); });
  trigger.addEventListener("keydown", event => { if (event.key === "ArrowDown") { event.preventDefault(); openMenu(); } });
  document.addEventListener("click", event => { if (!wrapper.contains(event.target)) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  applyLanguage(language);
  const originalSwitchView = switchView;
  switchView = id => {
    originalSwitchView(id);
    trigger.setAttribute("aria-current", "false");
  };
})();
