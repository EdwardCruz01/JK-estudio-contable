-- Estudio JK · configuración oficial de Supabase
-- Ejecutar completo en Supabase > SQL Editor > New query.
-- Es idempotente: puede ejecutarse sobre un proyecto vacío o sobre el esquema anterior.
-- No contiene claves. La clave publishable se configura en supabase-config.js.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('admin', 'client');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.document_type as enum ('boleta', 'honorarios');
exception when duplicate_object then null;
end $$;

create table if not exists public.empresas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  razon_social text not null,
  ruc varchar(11) not null unique check (ruc ~ '^[0-9]{11}$'),
  direccion text not null,
  distrito text,
  provincia text,
  departamento text,
  telefono text,
  correo text,
  representante text,
  logo_url text not null default 'sin-logo',
  color_corporativo varchar(7) not null default '#B49141' check (color_corporativo ~ '^#[0-9A-Fa-f]{6}$'),
  estado boolean not null default true,
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  empresa_id uuid references public.empresas(id) on delete set null,
  nombre text not null,
  email text not null unique,
  fecha_nacimiento date,
  rol public.user_role not null default 'client',
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.usuarios add column if not exists empresa_id uuid references public.empresas(id) on delete set null;
alter table public.usuarios add column if not exists fecha_nacimiento date;

create table if not exists public.archivos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  empresa_id uuid references public.empresas(id) on delete cascade,
  nombre text not null,
  bucket text not null check (bucket in ('documentos', 'logos')),
  storage_path text not null unique,
  mime_type text not null default 'application/pdf',
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  empresa_id uuid not null references public.empresas(id) on delete restrict,
  tipo public.document_type not null,
  titulo text not null,
  periodo text,
  importe numeric(14,2) not null default 0 check (importe >= 0),
  archivo_id uuid references public.archivos(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plantillas_generadas (
  id uuid primary key default gen_random_uuid(),
  documento_id uuid not null unique references public.documentos(id) on delete cascade,
  xml_origen text,
  datos_extraidos jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.honorarios (
  id uuid primary key default gen_random_uuid(),
  documento_id uuid not null unique references public.documentos(id) on delete cascade,
  fecha date not null default current_date,
  saludo text,
  observaciones text,
  conceptos jsonb not null default '[]'::jsonb,
  total numeric(14,2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.actividad (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  empresa_id uuid references public.empresas(id) on delete set null,
  documento_id uuid references public.documentos(id) on delete set null,
  accion text not null,
  descripcion text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.configuracion (
  clave text primary key,
  valor jsonb not null default '{}'::jsonb,
  updated_by uuid references public.usuarios(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.mensajes (
  id uuid primary key default gen_random_uuid(),
  destinatario_id uuid references auth.users(id) on delete cascade,
  destinatario_email text,
  asunto varchar(80) not null,
  cuerpo varchar(280) not null,
  tipo text not null default 'admin' check (tipo in ('admin', 'birthday')),
  remitente text not null default 'JK Studio Contable',
  leido boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists documentos_empresa_fecha_idx on public.documentos (empresa_id, created_at desc);
create index if not exists documentos_usuario_fecha_idx on public.documentos (usuario_id, created_at desc);
create index if not exists actividad_fecha_idx on public.actividad (created_at desc);
create index if not exists archivos_empresa_fecha_idx on public.archivos (empresa_id, created_at desc);
create index if not exists mensajes_destinatario_fecha_idx on public.mensajes (destinatario_id, created_at desc);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.empresas, public.usuarios, public.archivos, public.documentos, public.plantillas_generadas, public.honorarios, public.actividad, public.configuracion, public.mensajes to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists empresas_updated_at on public.empresas;
create trigger empresas_updated_at before update on public.empresas for each row execute function public.set_updated_at();
drop trigger if exists usuarios_updated_at on public.usuarios;
create trigger usuarios_updated_at before update on public.usuarios for each row execute function public.set_updated_at();
drop trigger if exists documentos_updated_at on public.documentos;
create trigger documentos_updated_at before update on public.documentos for each row execute function public.set_updated_at();
drop trigger if exists honorarios_updated_at on public.honorarios;
create trigger honorarios_updated_at before update on public.honorarios for each row execute function public.set_updated_at();
drop trigger if exists configuracion_updated_at on public.configuracion;
create trigger configuracion_updated_at before update on public.configuracion for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.usuarios (id, nombre, email, fecha_nacimiento)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data ->> 'birthDate', '')::date
  )
  on conflict (id) do update set
    nombre = excluded.nombre,
    email = excluded.email,
    fecha_nacimiento = coalesce(excluded.fecha_nacimiento, public.usuarios.fecha_nacimiento);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.current_role()
returns public.user_role language sql security definer stable set search_path = public as $$
  select coalesce((select rol from public.usuarios where id = auth.uid()), 'client'::public.user_role);
$$;

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select public.current_role() = 'admin'::public.user_role;
$$;

create or replace function public.ensure_birthday_message()
returns void language plpgsql security definer set search_path = public as $$
declare
  birth_date date;
begin
  select fecha_nacimiento into birth_date from public.usuarios where id = auth.uid();
  if birth_date is null or to_char(birth_date, 'MM-DD') <> to_char(current_date, 'MM-DD') then return; end if;
  if exists (
    select 1 from public.mensajes
    where destinatario_id = auth.uid() and tipo = 'birthday' and extract(year from created_at) = extract(year from current_date)
  ) then return; end if;
  insert into public.mensajes (destinatario_id, destinatario_email, asunto, cuerpo, tipo, remitente)
  select auth.uid(), email, '¡Feliz cumpleaños!', 'Le deseamos un feliz cumpleaños de parte de JK Studio Contable.', 'birthday', 'JK Studio Contable'
  from public.usuarios where id = auth.uid();
end;
$$;

revoke all on function public.ensure_birthday_message() from public;
grant execute on function public.ensure_birthday_message() to authenticated;

alter table public.empresas enable row level security;
alter table public.usuarios enable row level security;
alter table public.archivos enable row level security;
alter table public.documentos enable row level security;
alter table public.plantillas_generadas enable row level security;
alter table public.honorarios enable row level security;
alter table public.actividad enable row level security;
alter table public.configuracion enable row level security;
alter table public.mensajes enable row level security;

drop policy if exists usuarios_leen_su_perfil on public.usuarios;
create policy usuarios_leen_su_perfil on public.usuarios for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists usuarios_administra_perfiles on public.usuarios;
create policy usuarios_administra_perfiles on public.usuarios for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists empresas_lectura_autorizada on public.empresas;
create policy empresas_lectura_autorizada on public.empresas for select to authenticated using (public.is_admin() or exists (select 1 from public.usuarios u where u.id = auth.uid() and u.empresa_id = empresas.id));
drop policy if exists empresas_solo_admin on public.empresas;
create policy empresas_solo_admin on public.empresas for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists archivos_propios_o_admin on public.archivos;
create policy archivos_propios_o_admin on public.archivos for select to authenticated using (public.is_admin() or usuario_id = auth.uid());
drop policy if exists archivos_administra_admin on public.archivos;
create policy archivos_administra_admin on public.archivos for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists documentos_propios_o_admin on public.documentos;
create policy documentos_propios_o_admin on public.documentos for select to authenticated using (public.is_admin() or usuario_id = auth.uid());
drop policy if exists documentos_administra_admin on public.documentos;
create policy documentos_administra_admin on public.documentos for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists plantillas_administra_admin on public.plantillas_generadas;
create policy plantillas_administra_admin on public.plantillas_generadas for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists honorarios_administra_admin on public.honorarios;
create policy honorarios_administra_admin on public.honorarios for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists actividad_lectura_autorizada on public.actividad;
create policy actividad_lectura_autorizada on public.actividad for select to authenticated using (public.is_admin() or usuario_id = auth.uid());
drop policy if exists actividad_administra_admin on public.actividad;
create policy actividad_administra_admin on public.actividad for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists configuracion_solo_admin on public.configuracion;
create policy configuracion_solo_admin on public.configuracion for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists mensajes_lectura_autorizada on public.mensajes;
create policy mensajes_lectura_autorizada on public.mensajes for select to authenticated using (public.is_admin() or destinatario_id = auth.uid() or destinatario_id is null or lower(destinatario_email) = lower(auth.email()));
drop policy if exists mensajes_administra_admin on public.mensajes;
create policy mensajes_administra_admin on public.mensajes for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('logos', 'logos', false, 5242880, array['image/png', 'image/jpeg']),
  ('documentos', 'documentos', false, 10485760, array['application/pdf', 'application/xml', 'text/xml'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists logos_admin on storage.objects;
create policy logos_admin on storage.objects for all to authenticated using (bucket_id = 'logos' and public.is_admin()) with check (bucket_id = 'logos' and public.is_admin());
drop policy if exists documentos_admin on storage.objects;
create policy documentos_admin on storage.objects for all to authenticated using (bucket_id = 'documentos' and public.is_admin()) with check (bucket_id = 'documentos' and public.is_admin());
drop policy if exists documentos_cliente_lectura on storage.objects;
create policy documentos_cliente_lectura on storage.objects for select to authenticated using (bucket_id = 'documentos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Después de registrar el primer usuario desde la aplicación, conviértelo en administrador:
-- update public.usuarios set rol = 'admin' where lower(email) = lower('TU_CORREO_ADMIN');
