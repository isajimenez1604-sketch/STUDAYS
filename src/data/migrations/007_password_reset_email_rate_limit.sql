-- Limita solicitudes de recuperación por correo y bloquea 15 minutos
-- después del quinto código solicitado. Ejecutar una vez en Supabase SQL Editor.
begin;

create table if not exists public.password_reset_email_limits (
  email_key         text primary key check (email_key ~ '^[0-9a-f]{64}$'),
  request_count     integer not null check (request_count between 1 and 5),
  blocked_until     timestamptz,
  updated_at        timestamptz not null default now()
);

create index if not exists password_reset_email_limits_updated_idx
  on public.password_reset_email_limits (updated_at);

alter table public.password_reset_email_limits enable row level security;

create or replace function public.consume_password_reset_email_attempt(
  p_email_key text
)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_inserted integer;
  v_request_count integer;
  v_blocked_until timestamptz;
begin
  if p_email_key !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid password reset email key';
  end if;

  delete from public.password_reset_email_limits
  where updated_at < v_now - interval '24 hours';

  insert into public.password_reset_email_limits (
    email_key,
    request_count,
    updated_at
  )
  values (p_email_key, 1, v_now)
  on conflict (email_key) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 1 then
    return query select true, 0;
    return;
  end if;

  select limits.request_count, limits.blocked_until
    into v_request_count, v_blocked_until
  from public.password_reset_email_limits as limits
  where limits.email_key = p_email_key
  for update;

  if v_blocked_until is not null then
    if v_blocked_until > v_now then
      return query
      select false, greatest(
        1,
        ceil(extract(epoch from (v_blocked_until - v_now)))::integer
      );
      return;
    end if;

    update public.password_reset_email_limits
    set request_count = 1,
        blocked_until = null,
        updated_at = v_now
    where email_key = p_email_key;

    return query select true, 0;
    return;
  end if;

  update public.password_reset_email_limits
  set request_count = v_request_count + 1,
      blocked_until = case
        when v_request_count + 1 = 5 then v_now + interval '15 minutes'
        else null
      end,
      updated_at = v_now
  where email_key = p_email_key;

  return query select true, 0;
end;
$$;

revoke all on function public.consume_password_reset_email_attempt(text)
  from public, anon, authenticated;
grant execute on function public.consume_password_reset_email_attempt(text)
  to service_role;

commit;
