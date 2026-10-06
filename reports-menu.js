(() => {
  const trigger = document.querySelector('.nav-button[data-view="reportsView"]:not(.taxes-nav-button)');
  if (!trigger || trigger.dataset.reportsMenuReady === "true") return;
  trigger.dataset.reportsMenuReady = "true";

  const tabs = [...document.querySelectorAll("#reportsView [role=tab]")].filter(tab => !tab.hidden);
  if (!tabs.length) return;
  document.querySelector('.app-nav .nav-button[data-view="overviewView"]')?.remove();

  ruTexts.navPayroll = "Зарплата";
  etTexts.navPayroll = "Palk";
  ruTexts.payrollDescription = "Реестр начислений и выплат сотрудникам.";
  etTexts.payrollDescription = "Töötajate palgaarvestus ja väljamaksed.";
  ruTexts.payrollEmpty = "Записей о зарплате пока нет.";
  etTexts.payrollEmpty = "Palgakirjeid pole veel lisatud.";
  const payrollButton = document.createElement("button");
  payrollButton.type = "button";
  payrollButton.className = "nav-button payroll-nav-button";
  payrollButton.dataset.view = "payrollView";
  payrollButton.dataset.i18n = "navPayroll";
  payrollButton.textContent = translateCopy("Palk", "navPayroll");
  trigger.before(payrollButton);
  const payrollView = document.createElement("section");
  payrollView.id = "payrollView";
  payrollView.className = "app-view payments-subview";
  payrollView.hidden = true;
  const payrollHeading = document.createElement("div");
  payrollHeading.className = "view-heading";
  const payrollHeadingContent = document.createElement("div");
  const payrollTitle = document.createElement("h1");
  payrollTitle.dataset.i18n = "navPayroll";
  payrollTitle.textContent = translateCopy("Зарплата", "navPayroll");
  const payrollDescription = document.createElement("p");
  payrollDescription.dataset.i18n = "payrollDescription";
  payrollDescription.textContent = translateCopy("Реестр начислений и выплат сотрудникам.", "payrollDescription");
  payrollHeadingContent.append(payrollTitle, payrollDescription);
  const payrollBack = document.createElement("button");
  payrollBack.type = "button";
  payrollBack.className = "secondary-button";
  payrollBack.dataset.i18n = "paymentBack";
  payrollBack.textContent = translateCopy("Tagasi maksete juurde", "paymentBack");
  payrollBack.addEventListener("click", () => switchView("purchasesView"));
  payrollHeading.append(payrollHeadingContent, payrollBack);
  payrollView.append(payrollHeading);
  const payrollPanel = document.createElement("section");
  payrollPanel.className = "data-panel payroll-empty-panel";
  payrollPanel.innerHTML = `<p class="payments-empty" data-i18n="payrollEmpty">${translateCopy("Записей о зарплате пока нет.", "payrollEmpty")}</p>`;
  payrollView.append(payrollPanel);
  document.querySelector("main").insertBefore(payrollView, document.getElementById("reportsView"));
  const baseCanOpenView = canOpenView;
  canOpenView = id => id === "payrollView" ? can("payments") : baseCanOpenView(id);
  const baseApplyRoleAccess = applyRoleAccess;
  applyRoleAccess = (...args) => {
    baseApplyRoleAccess(...args);
    payrollButton.hidden = !can("payments");
  };
  payrollButton.hidden = !can("payments");
  payrollButton.addEventListener("click", () => switchView("payrollView"));

  const wrapper = document.createElement("div");
  wrapper.className = "payments-nav-wrap reports-nav-wrap";
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
  menu.id = "reportsNavMenu";
  menu.className = "payments-nav-menu reports-nav-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  wrapper.append(menu);

  const iconPaths = {
    annualReportTab: '<rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M16 2v4M8 2v4M3 9h18M7 13h3m4 0h3M7 17h3m4 0h3"></path>',
    balanceReportTab: '<path d="M12 3v18M5 6h14M4 21h16M7 6l-4 8h8L7 6zm10 0-4 8h8l-4-8z"></path>',
    profitLossTab: '<path d="M4 19V5M4 19h17M8 16v-3m4 3V8m4 8v-5m4 5V4"></path>',
    generalLedgerTab: '<path d="M12 6.5c-1.5-1.3-3.5-2-6-2H4v15h2c2.5 0 4.5.7 6 2m0-15c1.5-1.3 3.5-2 6-2h2v15h-2c-2.5 0-4.5.7-6 2m0-15v15"></path>'
  };
  const items = tabs.map(tab => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "payments-nav-menu-item reports-nav-menu-item";
    item.setAttribute("role", "menuitem");
    item.dataset.reportTab = tab.id;
    const label = document.createElement("span");
    label.dataset.i18n = tab.dataset.i18n || "";
    label.textContent = tab.textContent.trim();
    item.innerHTML = `<svg class="payments-nav-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[tab.id] || iconPaths.annualReportTab}</svg>`;
    item.append(label);
    item.addEventListener("click", () => {
      closeMenu();
      switchView("reportsView");
      tab.click();
    });
    menu.append(item);
    return { tab, item };
  });
  const syncActive = () => items.forEach(({ tab, item }) => item.setAttribute("aria-current", String(tab.getAttribute("aria-selected") === "true")));
  const openMenu = () => { syncActive(); menu.hidden = false; wrapper.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true"); };
  const closeMenu = () => { menu.hidden = true; wrapper.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false"); };
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
  tabs.forEach(tab => tab.addEventListener("click", () => requestAnimationFrame(syncActive)));
  const closeOtherMenus = activeWrapper => document.querySelectorAll(".payments-nav-wrap.is-open").forEach(other => {
    if (other === activeWrapper) return;
    other.classList.remove("is-open");
    const otherMenu = other.querySelector(".payments-nav-menu");
    const otherTrigger = other.querySelector(":scope > .nav-button");
    if (otherMenu) otherMenu.hidden = true;
    otherTrigger?.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll(".payments-nav-wrap").forEach(navMenu => {
    navMenu.addEventListener("pointerenter", () => closeOtherMenus(navMenu));
    navMenu.addEventListener("focusin", () => closeOtherMenus(navMenu));
  });
  applyLanguage(language);
})();
