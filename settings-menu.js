(() => {
  const trigger = document.querySelector('.nav-button[data-view="settingsView"]');
  if (!trigger || trigger.dataset.settingsMenuReady === "true") return;
  trigger.dataset.settingsMenuReady = "true";

  const menuOrder = ["companyDetailsPanel", "invoiceStylePanel", "invoiceNumberSettingsPanel", "accountPlanPanel", "accountSettingsPanel"];
  const tabs = [...document.querySelectorAll("#settingsView .settings-tab")].filter(tab => !tab.hidden).sort((first, second) => menuOrder.indexOf(first.dataset.settingsTarget) - menuOrder.indexOf(second.dataset.settingsTarget));
  const contactsButton = document.querySelector('.nav-button[data-view="contactsView"]');
  if (!tabs.length && !contactsButton) return;

  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap settings-nav-wrap";
  trigger.before(wrapper);
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
  menu.id = "settingsNavMenu";
  menu.className = "payments-nav-menu settings-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(menu);

  const iconPaths = {
    companyDetailsPanel: '<path d="M3 21h18M5 21V5l7-3 7 3v16M9 8h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"></path>',
    invoiceStylePanel: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"></path>',
    invoiceNumberSettingsPanel: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"></path>',
    accountSettingsPanel: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21v-2a8 8 0 0 1 16 0v2z"></path>',
    accountPlanPanel: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"></path>',
    contactsView: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 9h3m-3 4h3m-3 4h3"></path>'
  };
  const iconFor = target => `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[target] || iconPaths.accountPlanPanel}</svg>`;
  const entries = tabs.map(tab => {
    const target = tab.dataset.settingsTarget;
    const key = tab.dataset.i18n || "";
    const item = document.createElement("button");
    item.type = "button";
    item.className = "payments-nav-menu-item settings-nav-menu-item";
    item.setAttribute("role", "menuitem");
    item.dataset.settingsTarget = target;
    item.innerHTML = `${iconFor(target)}<span${key ? ` data-i18n="${key}"` : ""}>${tab.textContent.trim()}</span>`;
    item.addEventListener("click", () => {
      if (!can("companySettings")) { closeMenu(); denyAction("companySettings"); return; }
      closeMenu();
      switchView("settingsView");
      switchSettingsPanel(target);
      const mobileToggle = document.getElementById("mobileMenuToggle");
      if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
    });
    menu.append(item);
    return { tab, item };
  });
  let contactsMenuItem = null;
  if (contactsButton) {
    contactsMenuItem = document.createElement("button");
    contactsMenuItem.type = "button";
    contactsMenuItem.className = "payments-nav-menu-item settings-nav-menu-item";
    contactsMenuItem.dataset.target = "contactsView";
    contactsMenuItem.setAttribute("role", "menuitem");
    contactsMenuItem.innerHTML = `${iconFor("contactsView")}<span data-i18n="navContacts">${contactsButton.textContent.trim()}</span>`;
    contactsMenuItem.addEventListener("click", () => {
      if (!can("overview")) { closeMenu(); denyAction("overview"); return; }
      closeMenu();
      switchView("contactsView");
      contactsMenuItem.setAttribute("aria-current", "page");
      const mobileToggle = document.getElementById("mobileMenuToggle");
      if (mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
    });
    menu.append(contactsMenuItem);
    contactsButton.remove();
  }
  const syncActive = () => {
    entries.forEach(({ tab, item }) => item.setAttribute("aria-current", String(tab.getAttribute("aria-pressed") === "true")));
    if (contactsMenuItem) contactsMenuItem.setAttribute("aria-current", String(!document.getElementById("contactsView")?.hidden));
  };
  const openMenu = () => { syncActive(); menu.hidden = false; wrapper.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true"); };
  const closeMenu = () => { menu.hidden = true; wrapper.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false"); };
  const syncAccess = () => {
    const settingsAllowed = can("companySettings") || can("manageUsers");
    const contactsAllowed = can("overview");
    trigger.hidden = !(settingsAllowed || contactsAllowed);
    wrapper.hidden = trigger.hidden;
    if (contactsMenuItem) contactsMenuItem.hidden = !contactsAllowed;
    if (wrapper.hidden) closeMenu();
  };
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => { baseApplyRoleAccess(...args); syncAccess(); };
  syncAccess();
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
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(syncActive)));
  document.querySelectorAll(".settings-tab").forEach(button => button.addEventListener("click", () => requestAnimationFrame(syncActive)));
  applyLanguage(language);
})();
