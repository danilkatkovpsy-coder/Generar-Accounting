drop function if exists public.confirm_email_verified_organization_deletion(uuid, uuid, text);
drop function if exists public.delete_organization_after_email_code(uuid, uuid, text);
drop function if exists public.delete_organization(uuid);
drop table if exists public.organization_deletion_codes;

create function public.delete_organization_after_reauthentication(target_organization_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  requesting_user_id uuid := (select auth.uid());
  authenticated_at bigint;
  remaining_organizations integer;
begin
  if requesting_user_id is null then
    return 'unauthenticated';
  end if;

  begin
    authenticated_at := nullif((select auth.jwt() ->> 'auth_time'), '')::bigint;
  exception when others then
    authenticated_at := null;
  end;

  if authenticated_at is null
    or authenticated_at > extract(epoch from now())::bigint + 60
    or authenticated_at < extract(epoch from now() - interval '5 minutes')::bigint then
    return 'reauthentication_required';
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

  select count(*)
  into remaining_organizations
  from public.organization_members as member
  where member.user_id = requesting_user_id;

  if remaining_organizations <= 1 then
    return 'last_organization';
  end if;

  delete from public.organizations
  where id = target_organization_id;

  if not found then
    return 'not_found';
  end if;

  return 'deleted';
end;
$$;

revoke all on function public.delete_organization_after_reauthentication(uuid) from public, anon;
grant execute on function public.delete_organization_after_reauthentication(uuid) to authenticated;

notify pgrst, 'reload schema';
