alter table public.organization_accounting_data
  drop constraint if exists organization_accounting_data_data_key_check;

alter table public.organization_accounting_data
  add constraint organization_accounting_data_data_key_check
  check (data_key in (
    'purchases', 'expenses', 'suppliers', 'supplierInvoices', 'quotes', 'salesOrders', 'articles',
    'background', 'logo', 'color', 'theme', 'designTokens',
    'invoiceNumberStart', 'paymentTermsDays', 'invoiceLateFee', 'emailTemplate',
    'sellerWebsite', 'permissions', 'fixedAssets', 'manualJournalEntries',
    'accountPlanEntries', 'ledgerOpeningBalances'
  ));

notify pgrst, 'reload schema';
