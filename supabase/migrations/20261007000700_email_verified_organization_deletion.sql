drop function if exists public.delete_organization(uuid);
drop function if exists public.delete_organization_after_email_code(uuid, uuid, text);

create table if not exists public.organization_deletion_codes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  attempts integer not null default 0 check (attempts between 0 and 5),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);

create index if not exists organization_deletion_codes_request_idx
  on public.organization_deletion_codes (organization_id, user_id, created_at desc);

alter table public.organization_deletion_codes enable row level security;
revoke all on table public.organization_deletion_codes from public, anon, authenticated;
grant all on table public.organization_deletion_codes to service_role;

create or replace function public.confirm_email_verified_organization_deletion(
  target_organization_id uuid,
  requesting_user_id uuid,
  confirmation_code_hash text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  code_record public.organization_deletion_codes%rowtype;
  remaining_organizations integer;
begin
  if requesting_user_id is null or confirmation_code_hash is null then
    return 'forbidden';
  end if;

  perform member.organization_id
  from public.organization_members as member
  where member.user_id = requesting_user_id
  order by member.organization_id
  for update;

  if not exists (
    select 1
    from public.organization_members as member
    where member.organization_id = target_organization_id
      and member.user_id = requesting_user_id
      and member.role in ('owner', 'administrator')
  ) then
    return 'forbidden';
  end if;

  select code.*
  into code_record
  from public.organization_deletion_codes as code
  where code.organization_id = target_organization_id
    and code.user_id = requesting_user_id
    and code.used_at is null
    and code.expires_at > now()
    and code.attempts < 5
  order by code.created_at desc
  limit 1
  for update;

  if not found then
    return 'invalid_code';
  end if;

  if code_record.code_hash <> confirmation_code_hash then
    update public.organization_deletion_codes
    set attempts = attempts + 1,
        used_at = case when attempts + 1 >= 5 then now() else used_at end
    where id = code_record.id;
    return 'invalid_code';
  end if;

  select count(*)
  into remaining_organizations
  from public.organization_members as member
  where member.user_id = requesting_user_id;

  if remaining_organizations <= 1 then
    return 'last_organization';
  end if;

  update public.organization_deletion_codes
  set used_at = now()
  where id = code_record.id;

  delete from public.organizations
  where id = target_organization_id;

  if not found then
    return 'not_found';
  end if;

  return 'deleted';
end;
$$;

revoke all on function public.confirm_email_verified_organization_deletion(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.confirm_email_verified_organization_deletion(uuid, uuid, text) to service_role;

notify pgrst, 'reload schema';
