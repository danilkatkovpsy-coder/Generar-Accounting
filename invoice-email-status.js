(() => {
  if (typeof renderHistory !== "function" || !Array.isArray(invoices)) return;
  const renderHistoryWithDeliveryStatus = renderHistory;
  renderHistory = (...args) => {
    const previousStatuses = invoices.map(invoice => invoice.status);
    try {
      invoices.forEach(invoice => {
        if (invoice.status === "sent" && invoice.emailSent !== true) invoice.status = "draft";
      });
      return renderHistoryWithDeliveryStatus(...args);
    } finally {
      invoices.forEach((invoice, index) => { invoice.status = previousStatuses[index]; });
    }
  };
})();