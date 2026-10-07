(() => {
  const topbar = document.querySelector(".topbar");
  const nav = document.getElementById("appNav");
  const accountTools = topbar?.querySelector(".account-tools");
  const accountStack = accountTools?.querySelector(".account-stack");
  const languageSwitch = nav?.querySelector(".nav-utilities .language-switch");
  const navUtilities = languageSwitch?.parentElement;
  const logoutButton = document.getElementById("logoutButton");
  if (!topbar || !nav || !accountTools || !accountStack || !languageSwitch || !logoutButton || topbar.dataset.workspaceHeaderReady) return;
  topbar.dataset.workspaceHeaderReady = "true";
  document.getElementById("profilePicker").tabIndex = -1;

  Object.assign(ruTexts, {
    headerSearchHint:"Поиск счетов, клиентов и платежей", headerSearch:"Поиск по сайту", headerSearchEmpty:"Ничего не найдено.",
    headerSearchInvoices:"Счета", headerSearchQuotes:"Предложения", headerSearchOrders:"Заказы", headerSearchClients:"Клиенты",
    headerSearchArticles:"Артикли", headerSearchBank:"Банковские платежи", headerSearchCash:"Кассовые платежи",
    headerSearchSuppliers:"Счета поставщиков", headerSearchExpenses:"Расходы", headerNotifications:"Уведомления",
    headerNotificationsEmpty:"Новых уведомлений нет.", headerViewAll:"Обновить", headerOverdueInvoices:"Просроченные счета",
    headerUnallocatedBank:"Неразнесенные банковские платежи", headerAccountingErrors:"Ошибки в бухгалтерских данных",
    headerTaxDeadlines:"Приближающиеся налоговые сроки", headerUserActivity:"Действия пользователей",
    headerSettings:"Настройки", headerCompanySettings:"Настройки компании", headerDays:"дн.", headerToday:"сегодня"
  });
  Object.assign(etTexts, {
    headerSearchHint:"Otsi arveid, kliente ja makseid", headerSearch:"Otsi kogu saidilt", headerSearchEmpty:"Tulemusi ei leitud.",
    headerSearchInvoices:"Müügiarved", headerSearchQuotes:"Hinnapakkumised", headerSearchOrders:"Tellimused", headerSearchClients:"Kliendid",
    headerSearchArticles:"Artiklid", headerSearchBank:"Pangamaksed", headerSearchCash:"Kassamaksed",
    headerSearchSuppliers:"Hankija arved", headerSearchExpenses:"Kulud", headerNotifications:"Teavitused",
    headerNotificationsEmpty:"Uusi teavitusi pole.", headerViewAll:"Värskenda", headerOverdueInvoices:"Üle tähtaja arved",
    headerUnallocatedBank:"Seostamata pangamaksed", headerAccountingErrors:"Raamatupidamise andmevead",
    headerTaxDeadlines:"Lähenevad maksutähtajad", headerUserActivity:"Kasutajate tegevus",
    headerSettings:"Seaded", headerCompanySettings:"Ettevõtte seaded", headerDays:"p", headerToday:"täna"
  });
  const copy = (fallback, key) => translateCopy(fallback, key);
  let organizationMemberCount = members.length;
  const toolbar = document.createElement("div");
  toolbar.className = "header-workspace-actions";
  accountTools.append(toolbar);

  const notificationWrap = document.createElement("div");
  notificationWrap.className = "header-notifications-wrap";
  const notificationButton = document.createElement("button");
  notificationButton.type = "button";
  notificationButton.className = "header-icon-button header-notifications-trigger";
  notificationButton.setAttribute("aria-label", copy("Уведомления", "headerNotifications"));
  notificationButton.setAttribute("aria-expanded", "false");
  notificationButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"></path></svg><span class="header-notification-badge" hidden></span>';
  const notificationMenu = document.createElement("section");
  notificationMenu.className = "header-popover header-notifications-menu";
  notificationMenu.hidden = true;
  notificationMenu.innerHTML = `<div class="header-popover-heading"><h2 data-i18n="headerNotifications">${copy("Teavitused", "headerNotifications")}</h2><button type="button" class="text-button header-notification-refresh" data-i18n="headerViewAll">${copy("Värskenda", "headerViewAll")}</button></div><div class="header-notification-list"></div>`;
  notificationWrap.append(notificationButton, notificationMenu);
  toolbar.append(notificationWrap);

  const languageOptions = [{code:"et",label:"Eesti (ET)"},{code:"ru",label:"Русский (RU)"}];
  const langButtons = [...languageSwitch.querySelectorAll("[data-language]")];
  const languageTrigger = document.createElement("button");
  languageTrigger.type = "button";
  languageTrigger.className = "header-language-trigger";
  languageTrigger.setAttribute("aria-haspopup", "menu");
  languageTrigger.setAttribute("aria-expanded", "false");
  languageTrigger.setAttribute("aria-controls", "headerLanguageMenu");
  const languageMenu = document.createElement("div");
  languageMenu.id = "headerLanguageMenu";
  languageMenu.className = "header-language-menu";
  languageMenu.setAttribute("role", "menu");
  languageMenu.hidden = true;
  for (const option of languageOptions) {
    const button = langButtons.find(item => item.dataset.language === option.code);
    if (!button) continue;
    button.className = "header-language-option";
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-label", option.label);
    button.title = option.label;
    button.innerHTML = `<span class="header-language-flag header-language-flag-${option.code}" aria-hidden="true"></span><span>${option.label}</span>`;
    languageMenu.append(button);
  }
  languageSwitch.className = "header-language-dropdown";
  languageSwitch.replaceChildren(languageTrigger, languageMenu);
  const setLanguageOpen = open => {
    languageMenu.hidden = !open;
    languageTrigger.setAttribute("aria-expanded", String(open));
  };
  languageTrigger.addEventListener("click", () => setLanguageOpen(languageMenu.hidden));
  languageTrigger.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setLanguageOpen(true);
      langButtons.find(button => button.dataset.language === language)?.focus();
    }
  });
  languageMenu.addEventListener("click", event => {
    if (!event.target.closest("[data-language]")) return;
    setLanguageOpen(false);
    languageTrigger.focus();
  });
  languageSwitch.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setLanguageOpen(false);
      languageTrigger.focus();
    }
  });
  const syncLanguage = () => {
    const selected = languageOptions.find(option => option.code === language) || languageOptions[0];
    languageTrigger.setAttribute("aria-label", selected.label);
    languageTrigger.title = selected.label;
    languageTrigger.innerHTML = `<span class="header-language-flag header-language-flag-${selected.code}" aria-hidden="true"></span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 6 5 5 5-5"></path></svg>`;
    langButtons.forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
      button.setAttribute("aria-checked", String(button.dataset.language === language));
    });
    if (settingsTrigger) {
      settingsTrigger.setAttribute("aria-label", copy("Настройки", "headerSettings"));
      settingsTrigger.title = copy("Настройки", "headerSettings");
    }
  };
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => requestAnimationFrame(syncLanguage)));

  const settingsWrap = nav.querySelector(".settings-nav-wrap");
  const settingsTrigger = settingsWrap?.querySelector(":scope > .nav-button");
  if (settingsWrap && settingsTrigger) {
    settingsTrigger.querySelector('[data-i18n="navSettings"]')?.remove();
    settingsTrigger.innerHTML = '<svg class="nav-icon header-settings-gear" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 1.72l-.12.86a2 2 0 0 1-.99 1.45l-.19.11a2 2 0 0 1-1.75.17l-.8-.32a2 2 0 0 0-2.49.85l-.22.38a2 2 0 0 0 .49 2.57l.67.54a2 2 0 0 1 .76 1.62v.22a2 2 0 0 1-.76 1.63l-.67.54a2 2 0 0 0-.49 2.57l.22.38a2 2 0 0 0 2.49.85l.8-.32a2 2 0 0 1 1.75.17l.19.11a2 2 0 0 1 .99 1.45l.12.86a2 2 0 0 0 2 1.72h.44a2 2 0 0 0 2-1.72l.12-.86a2 2 0 0 1 .99-1.45l.19-.11a2 2 0 0 1 1.75-.17l.8.32a2 2 0 0 0 2.49-.85l.22-.39a2 2 0 0 0-.49-2.57l-.67-.54a2 2 0 0 1-.76-1.62v-.22a2 2 0 0 1 .76-1.63l.67-.54a2 2 0 0 0 .49-2.57l-.22-.38a2 2 0 0 0-2.49-.85l-.8.32a2 2 0 0 1-1.75-.17l-.19-.11a2 2 0 0 1-.99-1.45l-.12-.86A2 2 0 0 0 12.22 2Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    settingsTrigger.setAttribute("aria-label", copy("Настройки", "headerSettings"));
    settingsTrigger.title = copy("Настройки", "headerSettings");
    settingsTrigger.classList.add("header-gear-button");
    navUtilities.insertBefore(settingsWrap, logoutButton);
  }
  syncLanguage();

  const setNotificationsOpen = open => { notificationMenu.hidden = !open; notificationButton.setAttribute("aria-expanded", String(open)); if (open) renderNotifications(); };
  const closeOverlays = except => {
    if (except !== notificationWrap) setNotificationsOpen(false);
    if (except !== languageSwitch) setLanguageOpen(false);
  };
  const daysUntil = date => Math.ceil((new Date(`${date}T12:00:00`) - new Date(`${localDate()}T12:00:00`)) / 86400000);
  const makeNotifications = () => {
    const notifications = [];
    const overdue = invoices.filter(invoice => invoiceIsOverdue(invoice));
    if (overdue.length) notifications.push({ key: "headerOverdueInvoices", icon: "⚠️", count: overdue.length, detail: `${overdue.length} · ${money(overdue.reduce((sum, invoice) => sum + invoiceOutstandingAmount(invoice), 0))} EUR`, action: () => switchView("salesView") });
    const unallocated = purchases.filter(item => item.paymentMethod === "bank" && !item.relatedInvoiceId && item.paymentOrigin !== "supplier-invoice-settlement");
    if (unallocated.length) notifications.push({ key: "headerUnallocatedBank", icon: "💰", count: unallocated.length, detail: `${unallocated.length} · ${money(unallocated.reduce((sum, item) => sum + Math.abs(Number(item.amount) || 0), 0))} EUR`, action: () => switchView("purchasesView") });
    const issues = [
      ...invoices.filter(item => !item.number || !item.date || !item.client?.name || !Number.isFinite(Number(item.total))).map(item => item.number || item.client?.name || "—"),
      ...supplierInvoices.filter(item => !item.supplierName || !item.invoiceNumber || !item.date || !Number.isFinite(Number(item.amount))).map(item => item.invoiceNumber || item.supplierName || "—"),
      ...purchases.filter(item => !item.date || !(item.supplier || item.counterparty) || !Number.isFinite(Number(item.amount))).map(item => item.supplier || item.counterparty || "—")
    ];
    if (issues.length) notifications.push({ key: "headerAccountingErrors", icon: "🧾", count: issues.length, detail: issues.slice(0, 3).join(" · "), action: () => showMessage(copy("Найдены неполные бухгалтерские записи.", "headerAccountingErrors"), true) });
    if (currentSeller()?.vatRegistered) {
      const today = new Date(`${localDate()}T12:00:00`);
      let deadline = new Date(today.getFullYear(), today.getMonth(), 20);
      if (today > deadline) deadline = new Date(today.getFullYear(), today.getMonth() + 1, 20);
      const due = `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, "0")}-${String(deadline.getDate()).padStart(2, "0")}`;
      const days = daysUntil(due);
      if (days >= 0 && days <= 14) notifications.push({ key: "headerTaxDeadlines", icon: "📅", count: 1, detail: `${formatDate(due)} · ${days ? `${days} ${copy("дн.", "headerDays")}` : copy("сегодня", "headerToday")}`, action: () => document.querySelector('#taxesNavMenu [data-target="taxesKmdView"]')?.click() });
    }
    if (organizationMemberCount > 1) {
      const cutoff = Date.now() - 7 * 86400000, actor = currentInvoiceActorEmail();
      const actions = [
        ...invoices.filter(item => Date.parse(item.updatedAt || item.createdAt || "") >= cutoff && (item.updatedByEmail || item.createdByEmail) && (item.updatedByEmail || item.createdByEmail) !== actor).map(item => item.client?.name || item.number),
        ...purchases.filter(item => Date.parse(item.enteredAt || item.createdAt || "") >= cutoff && item.enteredBy && item.enteredBy !== actor).map(item => item.supplier || "—"),
        ...supplierInvoices.filter(item => Date.parse(item.updatedAt || item.createdAt || "") >= cutoff && (item.updatedBy || item.enteredBy) && (item.updatedBy || item.enteredBy) !== actor).map(item => item.supplierName || item.invoiceNumber || "—"),
        ...expenses.filter(item => Date.parse(item.updatedAt || item.createdAt || "") >= cutoff && (item.updatedBy || item.enteredBy) && (item.updatedBy || item.enteredBy) !== actor).map(item => item.name || "—")
      ];
      if (actions.length) notifications.push({ key: "headerUserActivity", icon: "👤", count: actions.length, detail: actions.slice(0, 3).join(" · "), action: () => switchView("settingsView") });
    }
    return notifications;
  };
  const notificationList = notificationMenu.querySelector(".header-notification-list");
  function renderNotifications() {
    const items = makeNotifications(), total = items.reduce((sum, item) => sum + item.count, 0), badge = notificationButton.querySelector(".header-notification-badge");
    badge.hidden = total === 0; badge.textContent = total > 99 ? "99+" : String(total);
    notificationList.innerHTML = items.map(item => `<button type="button" class="header-notification-item" data-notification-key="${item.key}"><span class="header-notification-icon" aria-hidden="true">${item.icon}</span><span class="header-notification-copy"><strong>${copy(item.key, item.key)}</strong><small>${escapeHtml(item.detail)}</small></span><span class="header-notification-count">${item.count}</span></button>`).join("") || `<p class="header-notifications-empty">${copy("Uusi teavitusi pole.", "headerNotificationsEmpty")}</p>`;
    notificationList.querySelectorAll("[data-notification-key]").forEach(button => button.addEventListener("click", () => { const item = items.find(entry => entry.key === button.dataset.notificationKey); setNotificationsOpen(false); item?.action(); }));
    applyLanguage(language);
  }
  const refreshOrganizationMemberCount = async () => {
    if (!cloudWorkspace) { organizationMemberCount = members.length; return; }
    try {
      const { count, error } = await cloudWorkspace.supabase.from("organization_members").select("user_id", { count: "exact", head: true }).eq("organization_id", cloudWorkspace.organizationId);
      if (!error && Number.isFinite(count)) organizationMemberCount = count;
      renderNotifications();
    } catch (error) { console.error("Unable to count organization members for notifications:", error); }
  };
  notificationButton.addEventListener("click", () => { closeOverlays(notificationWrap); setNotificationsOpen(notificationMenu.hidden); });
  notificationMenu.querySelector(".header-notification-refresh").addEventListener("click", renderNotifications);

  document.addEventListener("click",event=>{if(!notificationWrap.contains(event.target))setNotificationsOpen(false);if(!languageSwitch.contains(event.target))setLanguageOpen(false)});
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeOverlays(null)});
  window.addEventListener("resize",()=>closeOverlays(null));
  syncLanguage();
  refreshOrganizationMemberCount();
})();
