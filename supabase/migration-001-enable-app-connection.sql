-- Estudio JK · migración para el esquema que ya se ejecutó anteriormente.
-- Ejecuta este archivo UNA VEZ en Supabase > SQL Editor.
-- No elimina empresas ni documentos existentes.

alter table public.usuarios
  add column if not exists empresa_id uuid references public.empresas(id) on delete set null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.usuarios (id, nombre, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update set nombre = excluded.nombre, email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.current_role()
returns public.user_role language sql security definer stable set search_path = public as $$
  select coalesce((select rol from public.usuarios where id = auth.uid()), 'client'::public.user_role);
$$;

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select public.current_role() = 'admin'::public.user_role;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('logos', 'logos', false, 5242880, array['image/png', 'image/jpeg']),
  ('documentos', 'documentos', false, 10485760, array['application/pdf', 'application/xml', 'text/xml'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "empresas_authenticated_read" on public.empresas;
drop policy if exists "empresas_admin_write" on public.empresas;
drop policy if exists "empresas_lectura_autorizada" on public.empresas;
drop policy if exists "empresas_solo_admin" on public.empresas;
create policy "empresas_lectura_autorizada" on public.empresas for select to authenticated using (public.is_admin() or exists (select 1 from public.usuarios u where u.id = auth.uid() and u.empresa_id = empresas.id));
create policy "empresas_solo_admin" on public.empresas for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "logos_admin" on storage.objects;
drop policy if exists "documentos_admin" on storage.objects;
drop policy if exists "documentos_cliente_lectura" on storage.objects;
create policy "logos_admin" on storage.objects for all to authenticated using (bucket_id = 'logos' and public.is_admin()) with check (bucket_id = 'logos' and public.is_admin());
create policy "documentos_admin" on storage.objects for all to authenticated using (bucket_id = 'documentos' and public.is_admin()) with check (bucket_id = 'documentos' and public.is_admin());
create policy "documentos_cliente_lectura" on storage.objects for select to authenticated using (bucket_id = 'documentos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Después de registrarte con tu correo administrador, asígnale el rol una vez:
-- update public.usuarios set rol = 'admin' where email = 'tu-correo@dominio.com';
