-- Estudio JK · esquema inicial para un proyecto nuevo de Supabase
-- Ejecútalo una sola vez en: Supabase > SQL Editor > New query.
-- Después de crear el primer usuario administrador en Authentication, asígnale
-- el rol con: update public.usuarios set rol = 'admin' where email = 'tu-correo@dominio.com';

create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'client');
create type public.document_type as enum ('boleta', 'honorarios');

create table public.empresas (
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
  logo_url text not null,
  color_corporativo varchar(7) not null default '#B49141' check (color_corporativo ~ '^#[0-9A-Fa-f]{6}$'),
  estado boolean not null default true,
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  empresa_id uuid references public.empresas(id) on delete set null,
  nombre text not null,
  email text not null unique,
  rol public.user_role not null default 'client',
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.archivos (
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

create table public.documentos (
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

create table public.plantillas_generadas (
  id uuid primary key default gen_random_uuid(),
  documento_id uuid not null unique references public.documentos(id) on delete cascade,
  xml_origen text,
  datos_extraidos jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.honorarios (
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

create table public.actividad (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  empresa_id uuid references public.empresas(id) on delete set null,
  documento_id uuid references public.documentos(id) on delete set null,
  accion text not null,
  descripcion text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.configuracion (
  clave text primary key,
  valor jsonb not null default '{}'::jsonb,
  updated_by uuid references public.usuarios(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index documentos_empresa_fecha_idx on public.documentos (empresa_id, created_at desc);
create index documentos_usuario_fecha_idx on public.documentos (usuario_id, created_at desc);
create index actividad_fecha_idx on public.actividad (created_at desc);
create index archivos_empresa_fecha_idx on public.archivos (empresa_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger empresas_updated_at before update on public.empresas for each row execute function public.set_updated_at();
create trigger usuarios_updated_at before update on public.usuarios for each row execute function public.set_updated_at();
create trigger documentos_updated_at before update on public.documentos for each row execute function public.set_updated_at();
create trigger honorarios_updated_at before update on public.honorarios for each row execute function public.set_updated_at();
create trigger configuracion_updated_at before update on public.configuracion for each row execute function public.set_updated_at();

-- Crea el perfil público automáticamente cuando un usuario se registra con Supabase Auth.
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

alter table public.empresas enable row level security;
alter table public.usuarios enable row level security;
alter table public.archivos enable row level security;
alter table public.documentos enable row level security;
alter table public.plantillas_generadas enable row level security;
alter table public.honorarios enable row level security;
alter table public.actividad enable row level security;
alter table public.configuracion enable row level security;

create policy "usuarios_leen_su_perfil" on public.usuarios for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "usuarios_administra_perfiles" on public.usuarios for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "empresas_lectura_autorizada" on public.empresas for select to authenticated using (public.is_admin() or exists (select 1 from public.usuarios u where u.id = auth.uid() and u.empresa_id = empresas.id));
create policy "empresas_solo_admin" on public.empresas for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "archivos_propios_o_admin" on public.archivos for select to authenticated using (public.is_admin() or usuario_id = auth.uid());
create policy "archivos_administra_admin" on public.archivos for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "documentos_propios_o_admin" on public.documentos for select to authenticated using (public.is_admin() or usuario_id = auth.uid());
create policy "documentos_administra_admin" on public.documentos for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "plantillas_administra_admin" on public.plantillas_generadas for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "honorarios_administra_admin" on public.honorarios for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "actividad_lectura_autorizada" on public.actividad for select to authenticated using (public.is_admin() or usuario_id = auth.uid());
create policy "actividad_administra_admin" on public.actividad for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "configuracion_solo_admin" on public.configuracion for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Buckets privados. Usa rutas: logos/{empresa_id}/logo.png y documentos/{usuario_id}/{documento_id}.pdf.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('logos', 'logos', false, 5242880, array['image/png', 'image/jpeg']),
  ('documentos', 'documentos', false, 10485760, array['application/pdf', 'application/xml', 'text/xml'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "logos_admin" on storage.objects for all to authenticated using (bucket_id = 'logos' and public.is_admin()) with check (bucket_id = 'logos' and public.is_admin());
create policy "documentos_admin" on storage.objects for all to authenticated using (bucket_id = 'documentos' and public.is_admin()) with check (bucket_id = 'documentos' and public.is_admin());
create policy "documentos_cliente_lectura" on storage.objects for select to authenticated using (bucket_id = 'documentos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Convención de la aplicación:
-- empresas.color       -> empresas.color_corporativo
-- empresas.logoData    -> URL privada o firmada de Storage en empresas.logo_url
-- documentos.payload   -> datos reconstruibles para permitir re-descargas
