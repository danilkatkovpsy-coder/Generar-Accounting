alter table public.invoices
  add column if not exists amount_due numeric(14, 2) not null default 0;

update public.invoices
set amount_due = case
  when payment_status = 'paid' or status = 'paid' then 0
  else total
end
where amount_due = 0
  and total > 0
  and payment_status <> 'paid'
  and status <> 'paid';

alter table public.invoices
  drop constraint if exists invoices_amount_due_check;

alter table public.invoices
  add constraint invoices_amount_due_check
  check (amount_due >= 0 and amount_due <= total);

create or replace function public.sync_invoice_payment_balance()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.amount_due = 0 and new.payment_status <> 'paid' then
      new.amount_due := new.total;
    end if;
  elsif new.total is distinct from old.total
    and new.amount_due is not distinct from old.amount_due then
    if old.payment_status = 'paid' then
      new.amount_due := 0;
    elsif old.amount_due = old.total then
      new.amount_due := new.total;
    else
      new.amount_due := least(old.amount_due, new.total);
    end if;
  elsif new.payment_status is distinct from old.payment_status
    and new.amount_due is not distinct from old.amount_due then
    if new.payment_status = 'paid' then
      new.amount_due := 0;
    else
      new.amount_due := new.total;
    end if;
  end if;

  if new.amount_due = 0 then
    new.payment_status := 'paid';
    new.paid_at := coalesce(new.paid_at, now());
  else
    new.payment_status := 'unpaid';
    new.paid_at := null;
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_sync_payment_balance on public.invoices;

create trigger invoices_sync_payment_balance
before insert or update of total, amount_due, payment_status
on public.invoices
for each row
execute function public.sync_invoice_payment_balance();
