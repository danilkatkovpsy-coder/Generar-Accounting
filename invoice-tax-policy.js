(() => {
  const rows = document.getElementById("itemRows");
  const nonVatInput = document.getElementById("sellerNotVatRegistered");
  const invoiceEditor = document.getElementById("invoiceEditorView");
  if (!rows || !nonVatInput || !invoiceEditor) return;

  const applyPolicy = row => {
    const select = row.querySelector(".item-tax-rate");
    if (!select) return;
    let currentValue = select.value;
    const isNewInvoice = !document.getElementById("invoiceModeIndicator");
    const isBlankLine = !row.querySelector(".item-description")?.value.trim() && !row.querySelector(".item-price")?.value.trim();
    if (isNewInvoice && isBlankLine) currentValue = nonVatInput.checked ? "0" : "24";
    const rates = ["0", "9", "13", "24"];
    if (currentValue && !rates.includes(currentValue)) rates.push(currentValue);
    select.replaceChildren(...rates.map(rate => {
      const option = document.createElement("option");
      option.value = rate;
      option.textContent = `${rate}%`;
      return option;
    }));
    select.value = currentValue || (nonVatInput.checked ? "0" : "24");
    const invoiceIsEditable = invoiceEditor.classList.contains("is-invoice-editing") && !invoiceEditor.classList.contains("is-invoice-locked");
    select.disabled = nonVatInput.checked || !invoiceIsEditable;
  };
  const applyRows = () => rows.querySelectorAll(".item-row").forEach(applyPolicy);

  applyRows();
  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(".item-row")) applyPolicy(node);
        node.querySelectorAll(".item-row").forEach(applyPolicy);
      }
    }
  }).observe(rows, { childList: true, subtree: true });
  new MutationObserver(applyRows).observe(invoiceEditor, { attributes: true, attributeFilter: ["class"] });
  nonVatInput.addEventListener("change", applyRows);
})();