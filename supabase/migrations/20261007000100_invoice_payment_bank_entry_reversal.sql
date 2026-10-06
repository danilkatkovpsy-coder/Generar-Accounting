create or replace function public.record_invoice_payment_with_id(
  p_organization_id uuid,
  p_invoice_id uuid,
  p_payment_id uuid,
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

  if p_payment_id is null or p_amount is null or p_amount <= 0
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
    id, organization_id, invoice_id, amount, payment_method, paid_at
  ) values (
    p_payment_id, p_organization_id, p_invoice_id, round(p_amount, 2), p_payment_method,
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

create or replace function public.delete_invoice_payment_by_id(
  p_organization_id uuid,
  p_payment_id uuid
)
returns numeric
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_invoice_id uuid;
  payment_amount numeric(14, 2);
  current_amount_due numeric(14, 2);
  invoice_total numeric(14, 2);
  new_amount_due numeric(14, 2);
begin
  if (select auth.uid()) is null
    or not public.has_organization_role(p_organization_id, array['owner', 'accountant', 'administrator']) then
    raise exception 'Organization access denied' using errcode = '42501';
  end if;

  if p_payment_id is null then
    raise exception 'Payment ID is required' using errcode = '22023';
  end if;

  select invoice_id, amount
    into payment_invoice_id, payment_amount
    from public.invoice_payments
    where id = p_payment_id
      and organization_id = p_organization_id;

  if not found then
    raise exception 'Payment not found' using errcode = '22023';
  end if;

  select amount_due, total
    into current_amount_due, invoice_total
    from public.invoices
    where id = payment_invoice_id
      and organization_id = p_organization_id
    for update;

  if not found then
    raise exception 'Invoice not found' using errcode = '22023';
  end if;

  delete from public.invoice_payments
    where id = p_payment_id
      and organization_id = p_organization_id;

  new_amount_due := least(invoice_total, round(current_amount_due + payment_amount, 2));

  update public.invoices
    set amount_due = new_amount_due,
        paid_at = case when new_amount_due = 0 then paid_at else null end,
        updated_at = now()
    where id = payment_invoice_id
      and organization_id = p_organization_id;

  return new_amount_due;
end;
$$;

revoke all on function public.record_invoice_payment_with_id(uuid, uuid, uuid, numeric, text, timestamptz) from public;
revoke all on function public.delete_invoice_payment_by_id(uuid, uuid) from public;
grant execute on function public.record_invoice_payment_with_id(uuid, uuid, uuid, numeric, text, timestamptz) to authenticated;
grant execute on function public.delete_invoice_payment_by_id(uuid, uuid) to authenticated;

notify pgrst, 'reload schema';