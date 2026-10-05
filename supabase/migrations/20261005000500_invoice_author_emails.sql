alter table public.invoices
  add column if not exists created_by_email text,
  add column if not exists updated_by_email text;

update public.invoices as invoice
set created_by_email = coalesce(invoice.created_by_email, author.email),
    updated_by_email = invoice.updated_by_email
from auth.users as author
where author.id = invoice.created_by
  and invoice.created_by_email is null;

create or replace function public.capture_invoice_actor_emails()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_email text;
begin
  select nullif(btrim(email), '')
    into actor_email
    from auth.users
    where id = (select auth.uid());

  if tg_op = 'INSERT' then
    new.created_by_email := coalesce(actor_email, new.created_by_email);
    new.updated_by_email := coalesce(actor_email, new.updated_by_email, new.created_by_email);
  else
    new.created_by_email := old.created_by_email;
    new.updated_by_email := coalesce(actor_email, old.updated_by_email);
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_capture_actor_emails on public.invoices;
create trigger invoices_capture_actor_emails
before insert or update on public.invoices
for each row execute function public.capture_invoice_actor_emails();
