(() => {
  const copy = key => translateCopy(key, key);
  const exportTable = window.exportTableFile;
  if (typeof exportTable !== "function") return;
  Object.assign(ruTexts, { reportExportEmpty: "Нет строк для экспорта." });
  Object.assign(etTexts, { reportExportEmpty: "Eksporditavaid ridu pole." });

  const addButtons = ({ anchorId, tableSelector, title, filename, period = () => "", prepare = null, scope = "" }) => {
    const anchor = document.getElementById(anchorId);
    if (!anchor || anchor.dataset.extraExportsReady === "true") return;
    anchor.dataset.extraExportsReady = "true";
    const group = document.createElement("span");
    group.className = "report-export-buttons";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "PDF XLS");
    for (const format of ["pdf", "xls"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "secondary-button report-export-format";
      button.dataset.reportExport = format;
      button.textContent = format.toUpperCase();
      button.addEventListener("click", () => {
        if (!can("exportReports")) { denyAction("exportReports"); return; }
        if (prepare) prepare();
        const table = document.querySelector(tableSelector);
        if (!table) return;
        let headers = table.dataset.exportHeaders ? JSON.parse(table.dataset.exportHeaders) : [...table.querySelectorAll("thead th")].map(cell => cell.innerText.trim());
        let rows = [...table.querySelectorAll("tbody tr")]
          .filter(row => !row.querySelector(".empty-row,.fixed-assets-empty"))
          .map(row => [...row.cells].map(cell => cell.innerText.trim()));
        if (anchorId === "exportLedgerCsv" && window.getLedgerPrintOptions?.().printRelated) {
          const entries = window.getLedgerPrintEntries?.() || [];
          if (entries.length) {
            headers = ["ledgerDateColumn", "ledgerDocumentColumn", "ledgerObjectColumn", "ledgerAccountColumn", "ledgerDescriptionColumn", "ledgerDebitColumn", "ledgerCreditColumn", "ledgerBalanceColumn"].map(key => translateCopy(key, key));
            const balances = new Map();
            rows = entries.map(entry => {
              const code = String(entry.accountCode || "");
              const balance = (balances.get(code) || 0) + (Number(entry.debit) || 0) - (Number(entry.credit) || 0);
              balances.set(code, balance);
              return [formatDate(entry.date), entry.documentNumber || "", entry.object || "", `${code} · ${entry.account || code}`, entry.description || "", Number(entry.debit) ? money(entry.debit) : "—", Number(entry.credit) ? money(entry.credit) : "—", `${money(balance)} EUR`];
            });
          }
        }
        if (!rows.length) { showMessage(copy("reportExportEmpty"), true); return; }
        exportTable({ format, filename: `${filename()}-${localDate()}`, title: typeof title === "function" ? title() : title, period: period(), headers, rows });
      });
      group.append(button);
    }
    anchor.after(group);
    const controls = [...group.querySelectorAll("button")];
    const syncAvailability = () => {
      const table = document.querySelector(tableSelector);
      const hasRows = Boolean(table && [...table.querySelectorAll("tbody tr")].some(row => !row.querySelector(".empty-row,.fixed-assets-empty")));
      controls.forEach(button => { button.disabled = !hasRows || !can("exportReports"); });
    };
    const table = document.querySelector(tableSelector);
    if (table) new MutationObserver(syncAvailability).observe(table, { childList: true, subtree: true });
    document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", syncAvailability));
    syncAvailability();
  };

  addButtons({ anchorId: "exportReportButton", tableSelector: "#annualReportPanel .data-table", title: () => document.querySelector("#annualReportPanel h1")?.textContent || copy("annualReportTab"), filename: () => "aastaaruanne", period: () => document.getElementById("reportYear")?.value || "", scope: "#annualReportPanel" });
  addButtons({ anchorId: "exportBalanceCsv", tableSelector: "#balanceResults table", title: () => document.getElementById("balanceResultTitle")?.textContent || copy("balanceReportTab"), filename: () => "bilanss", period: () => document.getElementById("balanceResultPeriod")?.textContent || "", prepare: () => { if (document.getElementById("balanceResults")?.hidden) document.getElementById("createBalanceButton")?.click(); } });
  addButtons({ anchorId: "exportProfitCsvButton", tableSelector: "#profitResults table", title: () => document.getElementById("profitResultTitle")?.textContent || copy("profitLossTitle"), filename: () => "kasumiaruanne", period: () => document.getElementById("profitResultPeriod")?.textContent || "", prepare: () => { if (document.getElementById("profitResults")?.hidden) document.getElementById("createProfitReportButton")?.click(); } });
  addButtons({ anchorId: "exportLedgerCsv", tableSelector: "#ledgerResults table", title: () => document.querySelector("#generalLedgerPanel h2")?.textContent || copy("generalLedgerTitle"), filename: () => "pearaamat", period: () => `${document.getElementById("ledgerStartDate")?.value || ""}-${document.getElementById("ledgerEndDate")?.value || ""}`, prepare: () => { if (document.getElementById("ledgerResults")?.hidden) document.getElementById("createLedgerButton")?.click(); } });
  addButtons({ anchorId: "ledgerJournalExportAnchor", tableSelector: "#ledgerJournalTable", title: () => document.querySelector("#ledgerView h1")?.textContent || copy("ledgerEntriesMenu"), filename: () => "pearaamatu-kanded", period: () => `${document.getElementById("ledgerJournalStart")?.value || ""}-${document.getElementById("ledgerJournalEnd")?.value || ""}` });
  addButtons({ anchorId: "ledgerTurnoverExport", tableSelector: "#ledgerTurnoverView table", title: () => document.querySelector("#ledgerTurnoverView h1")?.textContent || copy("ledgerTurnoverMenu"), filename: () => "kaibeandmik", period: () => `${document.getElementById("ledgerTurnoverStart")?.value || ""}-${document.getElementById("ledgerTurnoverEnd")?.value || ""}`, prepare: () => document.getElementById("ledgerTurnoverGenerate")?.click() });
  addButtons({ anchorId: "cashFlowExport", tableSelector: "#cashFlowPanel table", title: () => document.querySelector("#cashFlowPanel h2")?.textContent || copy("cashFlowTitle"), filename: () => "rahavoog", period: () => `${document.getElementById("cashFlowStart")?.value || ""}-${document.getElementById("cashFlowEnd")?.value || ""}`, prepare: () => document.getElementById("cashFlowGenerate")?.click() });
})();