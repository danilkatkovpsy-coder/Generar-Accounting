alter table public.invoices
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid')),
  add column if not exists paid_at timestamptz;

update public.invoices
set payment_status = 'paid',
    paid_at = coalesce(paid_at, updated_at)
where status = 'paid';

alter table public.invoices
  drop constraint if exists invoices_payment_status_paid_at_check;

alter table public.invoices
  add constraint invoices_payment_status_paid_at_check
  check (
    (payment_status = 'paid' and paid_at is not null)
    or (payment_status = 'unpaid' and paid_at is null)
  );

create index if not exists invoices_organization_payment_status_date_idx
  on public.invoices (organization_id, payment_status, issue_date desc);
