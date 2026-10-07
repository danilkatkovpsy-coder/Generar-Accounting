(() => {
  Object.assign(ruTexts, {
    fixedAssetSettingsPeriod: "Период амортизации по умолчанию", fixedAssetSettingsAuto: "Автоматически начислять износ",
    fixedAssetSettingsAutoNote: "Автоматическое проведение начислений пока не подключено.",
    fixedAssetSettingsImpairment: "Счёт обесценения и списания", fixedAssetSettingsSale: "Счёт продажи основных средств",
    fixedAssetSettingsGroups: "Группы основных средств", fixedAssetSettingsName: "Название",
    fixedAssetSettingsNameEn: "Название на английском", fixedAssetSettingsRate: "Аморт. %",
    fixedAssetSettingsAssetAccount: "Счёт основного средства", fixedAssetSettingsAccumAccount: "Счёт амортизации",
    fixedAssetSettingsExpenseAccount: "Счёт расходов", fixedAssetSettingsAddGroup: "Добавить строку",
    fixedAssetSettingsSave: "Сохранить", fixedAssetSettingsSaved: "Настройки сохранены на этом устройстве.",
    fixedAssetSettingsInvalid: "Проверьте названия групп и процент амортизации.",
    fixedAssetSettingsUsedGroup: "Группу, используемую в карточках, нельзя удалить.",
    fixedAssetSettingsLocal: "Настройки сохраняются локально для этой компании.",
    fixedAssetSettingsRemove: "Удалить группу", fixedAssetSettingsClose: "Закрыть",
    fixedAssetSettingsQuarter: "Квартал", fixedAssetSettingsMonth: "Месяц", fixedAssetSettingsYear: "Год"
  });
  Object.assign(etTexts, {
    fixedAssetSettingsPeriod: "Amortisatsiooniperiood vaikimisi", fixedAssetSettingsAuto: "Amortiseeri automaatselt",
    fixedAssetSettingsAutoNote: "Automaatne kannete koostamine pole veel ühendatud.",
    fixedAssetSettingsImpairment: "Allahindluse ja mahakandmise konto", fixedAssetSettingsSale: "Põhivara müügikonto",
    fixedAssetSettingsGroups: "Põhivara grupid", fixedAssetSettingsName: "Nimi",
    fixedAssetSettingsNameEn: "Nimi inglise keeles", fixedAssetSettingsRate: "Amort. %",
    fixedAssetSettingsAssetAccount: "Põhivarakonto", fixedAssetSettingsAccumAccount: "Amortisatsioonikonto",
    fixedAssetSettingsExpenseAccount: "Kulukonto", fixedAssetSettingsAddGroup: "Lisa uus rida",
    fixedAssetSettingsSave: "Salvesta", fixedAssetSettingsSaved: "Seaded salvestati selles seadmes.",
    fixedAssetSettingsInvalid: "Kontrollige grupi nimesid ja amortisatsioonimäära.",
    fixedAssetSettingsUsedGroup: "Gruppi ei saa kustutada, kui see on põhivarakaartidel kasutusel.",
    fixedAssetSettingsLocal: "Seaded salvestatakse selle ettevõtte jaoks kohalikult.",
    fixedAssetSettingsRemove: "Eemalda grupp", fixedAssetSettingsClose: "Sulge",
    fixedAssetSettingsQuarter: "Kvartal", fixedAssetSettingsMonth: "Kuu", fixedAssetSettingsYear: "Aasta"
  });

  const reportViewId = "fixedAssetsSettingsView";
  const assetStorageKey = () => STORAGE.fixedAssets;
  const settingsStorageKey = () => `${STORAGE.fixedAssets}:settings`;
  const copy = key => translateCopy(key, key);
  const get = id => document.getElementById(id);
  const defaultSettings = () => ({
    depreciationPeriod: "month",
    autoDepreciation: true,
    impairmentAccount: "40815 - Põhivara allahindlus",
    saleAccount: "40912 - Kahjum põhivara mahakandmisest",
    groups: [{ id: "default-fixed-assets", name: "Põhivara", nameEn: "Fixed assets", rate: 20, assetAccount: "10921", depreciationAccount: "10922", expenseAccount: "40811" }]
  });
  const readSettings = () => {
    try {
      const settings = JSON.parse(localStorage.getItem(settingsStorageKey()) || "null");
      return settings && typeof settings === "object" ? { ...defaultSettings(), ...settings, groups: Array.isArray(settings.groups) ? settings.groups : [] } : defaultSettings();
    } catch { return defaultSettings(); }
  };
  window.readFixedAssetSettings = readSettings;
  let dialog;
  let form;
  let editingStorageKey = "";
  let groups = [];

  const initialize = view => {
    if (dialog) {
      if (!dialog.open) {
        editingStorageKey = settingsStorageKey();
        renderForm(readSettings());
        dialog.showModal();
      }
      if (!view.hidden) switchView("fixedAssetsView");
      return;
    }
    const backButton = view.querySelector('button[data-i18n="fixedAssetsBack"]');
    dialog = document.createElement("dialog");
    dialog.id = "fixedAssetSettingsDialog";
    dialog.className = "fixed-asset-dialog fixed-asset-settings-dialog";
    dialog.setAttribute("aria-labelledby", "fixedAssetSettingsTitle");
    dialog.innerHTML = `<form id="fixedAssetSettingsForm"><div class="fixed-asset-dialog-heading"><h2 id="fixedAssetSettingsTitle" data-i18n="fixedAssetsSettings">${copy("fixedAssetsSettings")}</h2><div class="fixed-asset-settings-actions"><button type="submit" class="primary-button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z"></path><path d="M17 21v-8H7v8M7 3v5h8"></path></svg><span data-i18n="fixedAssetSettingsSave">${copy("fixedAssetSettingsSave")}</span></button><button type="button" class="fixed-assets-clear" id="fixedAssetSettingsHelp" title="${copy("assetHelp")}" aria-label="${copy("assetHelp")}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-1 .8-1.5 1.1-1.5 2.7M12 17h.01"></path></svg></button><button type="button" class="fixed-assets-clear" id="fixedAssetSettingsClose" aria-label="${copy("fixedAssetSettingsClose")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button></div></div><p id="fixedAssetSettingsHelpText" class="fixed-asset-settings-note" data-i18n="fixedAssetSettingsAutoNote" hidden>${copy("fixedAssetSettingsAutoNote")}</p><section class="fixed-asset-settings-general"><label><span data-i18n="fixedAssetSettingsPeriod">${copy("fixedAssetSettingsPeriod")}</span><select id="fixedAssetSettingsPeriod"><option value="month" data-i18n="fixedAssetSettingsMonth">${copy("fixedAssetSettingsMonth")}</option><option value="quarter" data-i18n="fixedAssetSettingsQuarter">${copy("fixedAssetSettingsQuarter")}</option><option value="year" data-i18n="fixedAssetSettingsYear">${copy("fixedAssetSettingsYear")}</option></select></label><label class="fixed-asset-settings-toggle"><span data-i18n="fixedAssetSettingsAuto">${copy("fixedAssetSettingsAuto")}</span><input id="fixedAssetSettingsAuto" type="checkbox"><span class="fixed-asset-settings-switch" aria-hidden="true"></span></label><label><span data-i18n="fixedAssetSettingsImpairment">${copy("fixedAssetSettingsImpairment")}</span><input id="fixedAssetSettingsImpairment" type="text" maxlength="160"></label><label><span data-i18n="fixedAssetSettingsSale">${copy("fixedAssetSettingsSale")}</span><input id="fixedAssetSettingsSale" type="text" maxlength="160"></label></section><h3 class="fixed-asset-settings-groups-title" data-i18n="fixedAssetSettingsGroups">${copy("fixedAssetSettingsGroups")}</h3><div class="fixed-assets-table-wrap fixed-asset-settings-table-wrap"><table class="fixed-assets-table fixed-asset-settings-table"><thead><tr><th data-i18n="fixedAssetSettingsName">${copy("fixedAssetSettingsName")}</th><th data-i18n="fixedAssetSettingsNameEn">${copy("fixedAssetSettingsNameEn")}</th><th data-i18n="fixedAssetSettingsRate">${copy("fixedAssetSettingsRate")}</th><th data-i18n="fixedAssetSettingsAssetAccount">${copy("fixedAssetSettingsAssetAccount")}</th><th data-i18n="fixedAssetSettingsAccumAccount">${copy("fixedAssetSettingsAccumAccount")}</th><th data-i18n="fixedAssetSettingsExpenseAccount">${copy("fixedAssetSettingsExpenseAccount")}</th><th></th></tr></thead><tbody id="fixedAssetSettingsGroupRows"></tbody></table></div><div class="fixed-asset-settings-footer"><button type="button" class="secondary-button" id="fixedAssetSettingsAddGroup"><span data-i18n="fixedAssetSettingsAddGroup">${copy("fixedAssetSettingsAddGroup")}</span></button><span class="fixed-asset-settings-local" data-i18n="fixedAssetSettingsLocal">${copy("fixedAssetSettingsLocal")}</span></div><p id="fixedAssetSettingsError" class="fixed-asset-error" role="alert" hidden></p></form>`;
    document.body.append(dialog);
    form = get("fixedAssetSettingsForm");
    const autoNote = document.createElement("p");
    autoNote.className = "fixed-asset-settings-auto-note";
    autoNote.dataset.i18n = "fixedAssetSettingsAutoNote";
    autoNote.textContent = copy("fixedAssetSettingsAutoNote");
    get("fixedAssetSettingsAuto").closest("label").after(autoNote);
    form.addEventListener("submit", saveSettings);
    get("fixedAssetSettingsAddGroup").addEventListener("click", () => { groups.push({ id: crypto.randomUUID(), name: "", nameEn: "", rate: 0, assetAccount: "", depreciationAccount: "", expenseAccount: "" }); renderGroups(); get("fixedAssetSettingsGroupRows").lastElementChild?.querySelector('[data-group-field="name"]')?.focus(); });
    get("fixedAssetSettingsClose").addEventListener("click", () => dialog.close());
    get("fixedAssetSettingsHelp").addEventListener("click", () => { const note = get("fixedAssetSettingsHelpText"); note.hidden = !note.hidden; });
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && dialog.open) dialog.close(); });
    get("companyPicker")?.addEventListener("change", () => { if (dialog.open) dialog.close(); });
    editingStorageKey = settingsStorageKey();
    renderForm(readSettings());
    dialog.showModal();
    if (!view.hidden) switchView("fixedAssetsView");
    applyLanguage(language);
  };

  function renderGroups() {
    const root = get("fixedAssetSettingsGroupRows");
    root.innerHTML = groups.map((group, index) => `<tr data-group-index="${index}"><td><input data-group-field="name" required maxlength="120" value="${escapeHtml(group.name || "")}"></td><td><input data-group-field="nameEn" maxlength="120" value="${escapeHtml(group.nameEn || "")}"></td><td><input data-group-field="rate" type="number" min="0" max="100" step="0.01" value="${escapeHtml(group.rate ?? 0)}"></td><td><input data-group-field="assetAccount" maxlength="160" value="${escapeHtml(group.assetAccount || "")}"></td><td><input data-group-field="depreciationAccount" maxlength="160" value="${escapeHtml(group.depreciationAccount || "")}"></td><td><input data-group-field="expenseAccount" maxlength="160" value="${escapeHtml(group.expenseAccount || "")}"></td><td><button type="button" class="fixed-assets-clear fixed-asset-settings-remove" data-remove-group="${index}" aria-label="${copy("fixedAssetSettingsRemove")}" title="${copy("fixedAssetSettingsRemove")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg></button></td></tr>`).join("");
    root.querySelectorAll("[data-remove-group]").forEach(button => button.addEventListener("click", () => {
      const group = groups[Number(button.dataset.removeGroup)];
      const assets = readStorage(STORAGE.fixedAssets, []);
      if (assets.some(asset => String(asset.group || "").toLocaleLowerCase(language) === String(group?.name || "").toLocaleLowerCase(language))) {
        get("fixedAssetSettingsError").textContent = copy("fixedAssetSettingsUsedGroup");
        get("fixedAssetSettingsError").hidden = false;
        return;
      }
      groups.splice(Number(button.dataset.removeGroup), 1);
      renderGroups();
    }));
  }

  function renderForm(settings) {
    get("fixedAssetSettingsPeriod").value = ["month", "quarter", "year"].includes(settings.depreciationPeriod) ? settings.depreciationPeriod : "month";
    get("fixedAssetSettingsAuto").checked = Boolean(settings.autoDepreciation);
    get("fixedAssetSettingsImpairment").value = settings.impairmentAccount || "";
    get("fixedAssetSettingsSale").value = settings.saleAccount || "";
    groups = settings.groups.map(group => ({ ...group, id: group.id || crypto.randomUUID() }));
    get("fixedAssetSettingsError").hidden = true;
    get("fixedAssetSettingsHelpText").hidden = true;
    renderGroups();
  }

  function saveSettings(event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (editingStorageKey !== settingsStorageKey()) {
      get("fixedAssetSettingsError").textContent = copy("assetWrongCompany");
      get("fixedAssetSettingsError").hidden = false;
      return;
    }
    const nextGroups = [...get("fixedAssetSettingsGroupRows").querySelectorAll("tr")].map(row => {
      const read = field => row.querySelector(`[data-group-field="${field}"]`).value.trim();
      return { id: groups[Number(row.dataset.groupIndex)]?.id || crypto.randomUUID(), name: read("name"), nameEn: read("nameEn"), rate: Number(read("rate")), assetAccount: read("assetAccount"), depreciationAccount: read("depreciationAccount"), expenseAccount: read("expenseAccount") };
    });
    const names = nextGroups.map(group => group.name.toLocaleLowerCase(language));
    if (nextGroups.some(group => !Number.isFinite(group.rate) || group.rate < 0 || group.rate > 100) || new Set(names).size !== names.length) {
      get("fixedAssetSettingsError").textContent = copy("fixedAssetSettingsInvalid");
      get("fixedAssetSettingsError").hidden = false;
      return;
    }
    const settings = { depreciationPeriod: get("fixedAssetSettingsPeriod").value, autoDepreciation: get("fixedAssetSettingsAuto").checked, impairmentAccount: get("fixedAssetSettingsImpairment").value.trim(), saleAccount: get("fixedAssetSettingsSale").value.trim(), groups: nextGroups };
    try { localStorage.setItem(settingsStorageKey(), JSON.stringify(settings)); }
    catch { get("fixedAssetSettingsError").textContent = copy("assetSaveError"); get("fixedAssetSettingsError").hidden = false; return; }
    groups = nextGroups;
    dialog.close();
    get("fixedAssetsView")?.dispatchEvent(new Event("fixed-assets-open"));
    showMessage(copy("fixedAssetSettingsSaved"));
  }

  const initializeIfOpened = event => { if (event.target?.id === reportViewId) initialize(event.target); };
  document.addEventListener("fixed-assets-open", initializeIfOpened, true);
  const existingView = get(reportViewId);
  if (existingView) initialize(existingView);
})();