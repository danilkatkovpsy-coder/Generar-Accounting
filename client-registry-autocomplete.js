(() => {
  const endpoint = "https://ariregister.rik.ee/est/api/autocomplete";
  let debounceTimer = 0;
  let activeController = null;
  let activeInput = null;
  let requestId = 0;

  const language = () => document.documentElement.lang === "et" ? "et" : "ru";
  const copy = (ru, et) => language() === "et" ? et : ru;

  function getResultsPanel(input) {
    const field = input.closest(".field");
    let panel = field.querySelector(".registry-company-results");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "registry-company-results";
      panel.id = `${input.id}RegistryResults`;
      panel.setAttribute("role", "listbox");
      panel.setAttribute("aria-label", copy("Компании Äriregister", "Äriregistri ettevõtted"));
      panel.setAttribute("aria-live", "polite");
      panel.hidden = true;
      field.classList.add("registry-autocomplete-field");
      field.append(panel);
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-controls", panel.id);
      input.setAttribute("aria-expanded", "false");
    }
    return panel;
  }

  function hideResults(input = activeInput) {
    if (!input) return;
    const panel = input.closest(".field")?.querySelector(".registry-company-results");
    if (panel) panel.hidden = true;
    input.setAttribute("aria-expanded", "false");
    if (activeInput === input) activeInput = null;
  }

  function showMessage(panel, message) {
    const status = document.createElement("p");
    status.className = "registry-company-message";
    status.setAttribute("role", "status");
    status.textContent = message;
    panel.replaceChildren(status);
    panel.hidden = false;
  }

  function fillClientFields(input, company) {
    const address = [company.legal_address, company.zip_code].filter(Boolean).join(", ");
    const values = {
      newClientName: company.name || "",
      newClientReg: company.reg_code ? String(company.reg_code) : "",
      newClientAddress: address,
      newClientEmail: company.email || company.email_address || "",
      newClientPhone: company.phone || company.phone_number || ""
    };

    for (const [id, value] of Object.entries(values)) {
      const field = document.getElementById(id);
      if (field) {
        field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    hideResults(input);
    document.getElementById("newClientAddress")?.focus();
  }

  function renderCompanies(input, panel, companies) {
    if (!companies.length) {
      showMessage(panel, copy("Совпадений не найдено.", "Vasteid ei leitud."));
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const company of companies) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "registry-company-option";
      option.setAttribute("role", "option");

      const name = document.createElement("span");
      name.className = "registry-company-name";
      name.textContent = company.name || "";

      const details = document.createElement("span");
      details.className = "registry-company-meta";
      details.textContent = [
        company.reg_code ? `${copy("Рег. код", "Registrikood")}: ${company.reg_code}` : "",
        [company.legal_address, company.zip_code].filter(Boolean).join(", ")
      ].filter(Boolean).join(" · ");

      const contacts = document.createElement("span");
      contacts.className = "registry-company-contacts";
      contacts.textContent = [
        `${copy("Эл. почта", "E-post")}: ${company.email || company.email_address || copy("не предоставлена автопоиском", "autoteenus ei väljasta")}`,
        `${copy("Телефон", "Telefon")}: ${company.phone || company.phone_number || copy("не предоставлен автопоиском", "autoteenus ei väljasta")}`
      ].join(" · ");

      option.append(name, details, contacts);
      option.addEventListener("click", () => fillClientFields(input, company));
      fragment.append(option);
    }
    panel.replaceChildren(fragment);
    panel.hidden = false;
  }

  async function searchCompanies(input, query, currentRequestId) {
    activeController = new AbortController();
    const panel = getResultsPanel(input);
    showMessage(panel, copy("Ищем в Äriregister…", "Otsin Äriregistrist…"));
    input.setAttribute("aria-expanded", "true");

    try {
      const url = new URL(endpoint);
      url.searchParams.set("q", query);
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: activeController.signal
      });
      if (!response.ok) throw new Error(`Äriregister HTTP ${response.status}`);
      const result = await response.json();
      if (currentRequestId !== requestId || activeInput !== input) return;
      if (result.status !== "OK" || !Array.isArray(result.data)) throw new Error("Unexpected Äriregister response");
      renderCompanies(input, panel, result.data);
    } catch (error) {
      if (error.name === "AbortError" || currentRequestId !== requestId) return;
      console.error("Äriregister autocomplete failed:", error);
      showMessage(panel, copy("Не удалось связаться с Äriregister. Попробуйте ещё раз.", "Äriregistriga ei saanud ühendust. Proovige uuesti."));
    }
  }

  document.addEventListener("input", event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.id !== "newClientName") return;

    const panel = getResultsPanel(input);
    activeInput = input;
    clearTimeout(debounceTimer);
    activeController?.abort();
    const query = input.value.trim();
    const currentRequestId = ++requestId;

    if (document.getElementById("clientTypeInput")?.value !== "company" || query.length < 3) {
      panel.hidden = true;
      input.setAttribute("aria-expanded", "false");
      return;
    }

    debounceTimer = window.setTimeout(() => searchCompanies(input, query, currentRequestId), 300);
  });

  document.addEventListener("keydown", event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.id !== "newClientName") return;
    const panel = input.closest(".field")?.querySelector(".registry-company-results");
    if (!panel || panel.hidden) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      panel.querySelector(".registry-company-option")?.focus();
    } else if (event.key === "Escape") {
      hideResults(input);
    }
  });

  document.addEventListener("pointerdown", event => {
    if (activeInput && !event.target.closest(".registry-autocomplete-field")) hideResults();
  });
})();