(() => {
  const select = document.getElementById("clientTypeInput");
  const dialog = document.getElementById("clientDialog");
  const field = select?.closest(".field");
  const label = field?.querySelector("label");
  if (!select || !dialog || !field || !label) return;

  label.id = "clientTypeLabel";
  select.hidden = true;
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");
  const currentType = select.value;
  const typeOrder = ["person", "company"];
  const options = [...select.options].sort((first, second) => typeOrder.indexOf(first.value) - typeOrder.indexOf(second.value));
  select.replaceChildren(...options);
  select.value = dialog.open ? currentType : "person";

  const group = document.createElement("div");
  group.className = "client-type-switch";
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-labelledby", label.id);

  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "client-type-option";
    button.dataset.clientType = option.value;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.tabIndex = -1;

    const text = document.createElement("span");
    if (option.dataset.i18n) text.dataset.i18n = option.dataset.i18n;
    text.textContent = option.textContent;
    button.append(text);
    group.append(button);
  }
  select.after(group);

  function syncSelection() {
    for (const button of group.querySelectorAll(".client-type-option")) {
      const selected = button.dataset.clientType === select.value;
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
  }

  function choose(button) {
    if (!button || button.disabled) return;
    select.value = button.dataset.clientType;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    button.focus();
  }

  group.addEventListener("click", event => {
    const button = event.target.closest(".client-type-option");
    if (button) choose(button);
  });

  group.addEventListener("keydown", event => {
    const buttons = [...group.querySelectorAll(".client-type-option")];
    const currentIndex = buttons.indexOf(event.target.closest(".client-type-option"));
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % buttons.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = buttons.length - 1;
    else return;
    event.preventDefault();
    choose(buttons[nextIndex]);
  });

  select.addEventListener("change", syncSelection);
  new MutationObserver(syncSelection).observe(dialog, { attributes: true, attributeFilter: ["open"] });
  select.form?.addEventListener("reset", () => queueMicrotask(syncSelection));
  syncSelection();
})();