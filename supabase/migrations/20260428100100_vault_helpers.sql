-- Wrappers públicos sobre Supabase Vault para que el código del Command Center
-- pueda guardar/leer secrets dinámicos (refresh_tokens de OAuth, etc.)
-- sin exponer el schema vault directamente.
--
-- Solo service_role puede invocarlas; nunca anon ni authenticated.

create or replace function public.urpe_vault_create_secret(
  secret_value text,
  secret_name text,
  secret_description text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  new_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'urpe_vault_create_secret: service_role required';
  end if;

  select vault.create_secret(secret_value, secret_name, secret_description) into new_id;
  return new_id;
end;
$$;

create or replace function public.urpe_vault_read_secret(secret_id uuid)
returns text
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  result text;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'urpe_vault_read_secret: service_role required';
  end if;

  select decrypted_secret into result
    from vault.decrypted_secrets
   where id = secret_id;
  return result;
end;
$$;

create or replace function public.urpe_vault_update_secret(
  secret_id uuid,
  new_value text
)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'urpe_vault_update_secret: service_role required';
  end if;

  perform vault.update_secret(secret_id, new_value);
end;
$$;

revoke execute on function public.urpe_vault_create_secret(text, text, text) from public, anon, authenticated;
revoke execute on function public.urpe_vault_read_secret(uuid) from public, anon, authenticated;
revoke execute on function public.urpe_vault_update_secret(uuid, text) from public, anon, authenticated;

grant execute on function public.urpe_vault_create_secret(text, text, text) to service_role;
grant execute on function public.urpe_vault_read_secret(uuid) to service_role;
grant execute on function public.urpe_vault_update_secret(uuid, text) to service_role;
