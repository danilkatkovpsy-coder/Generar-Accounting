alter table public.invoice_items
  add column if not exists unit text not null default 'tk',
  add column if not exists account_code text,
  add column if not exists object_name text,
  add column if not exists is_text_line boolean not null default false;