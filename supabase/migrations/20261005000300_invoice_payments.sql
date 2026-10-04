create table if not exists public.invoice_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  invoice_id uuid not null,
  amount numeric(14, 2) not null check (amount > 0),
  payment_method text not null check (payment_method in ('cash', 'transfer')),
  paid_at timestamptz not null default now(),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  foreign key (invoice_id, organization_id)
    references public.invoices (id, organization_id)
    on delete cascade
);

create index if not exists invoice_payments_invoice_date_idx
  on public.invoice_payments (organization_id, invoice_id, paid_at desc);

alter table public.invoice_payments enable row level security;

drop policy if exists "Organization members can read invoice payments" on public.invoice_payments;
create policy "Organization members can read invoice payments"
  on public.invoice_payments for select to authenticated
  using ((select public.is_organization_member(organization_id)));

drop policy if exists "Authorized roles can record invoice payments" on public.invoice_payments;
create policy "Authorized roles can record invoice payments"
  on public.invoice_payments for insert to authenticated
  with check ((select public.has_organization_role(organization_id, array['owner', 'accountant', 'administrator'])));

grant select, insert on public.invoice_payments to authenticated;

create or replace function public.record_invoice_payment(
  p_organization_id uuid,
  p_invoice_id uuid,
  p_amount numeric,
  p_payment_method text,
  p_paid_at timestamptz default now()
)
returns numeric
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_amount_due numeric(14, 2);
  new_amount_due numeric(14, 2);
begin
  if (select auth.uid()) is null
    or not public.has_organization_role(p_organization_id, array['owner', 'accountant', 'administrator']) then
    raise exception 'Organization access denied' using errcode = '42501';
  end if;

  if p_amount is null or p_amount <= 0
    or p_payment_method is null or p_payment_method not in ('cash', 'transfer') then
    raise exception 'Payment details are invalid' using errcode = '22023';
  end if;

  select amount_due
    into current_amount_due
    from public.invoices
    where id = p_invoice_id
      and organization_id = p_organization_id
    for update;

  if not found then
    raise exception 'Invoice not found' using errcode = '22023';
  end if;

  if p_amount > current_amount_due then
    raise exception 'Payment exceeds the outstanding amount' using errcode = '22023';
  end if;

  new_amount_due := round(current_amount_due - p_amount, 2);

  insert into public.invoice_payments (
    organization_id, invoice_id, amount, payment_method, paid_at
  ) values (
    p_organization_id, p_invoice_id, round(p_amount, 2), p_payment_method,
    coalesce(p_paid_at, now())
  );

  update public.invoices
    set amount_due = new_amount_due,
        paid_at = case when new_amount_due = 0 then coalesce(p_paid_at, now()) else null end,
        updated_at = now()
    where id = p_invoice_id
      and organization_id = p_organization_id;

  return new_amount_due;
end;
$$;

revoke all on function public.record_invoice_payment(uuid, uuid, numeric, text, timestamptz) from public;
grant execute on function public.record_invoice_payment(uuid, uuid, numeric, text, timestamptz) to authenticated;

notify pgrst, 'reload schema';
