-- Estudio JK · esquema inicial para Supabase
create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'client');
create type public.document_type as enum ('boleta', 'honorarios');

create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null unique,
  rol public.user_role not null default 'client',
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  logo_url text not null,
  representante text,
  color_corporativo varchar(7) not null default '#B49141',
  estado boolean not null default true,
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.archivos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  empresa_id uuid references public.empresas(id) on delete cascade,
  nombre text not null,
  bucket text not null default 'documentos',
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  empresa_id uuid not null references public.empresas(id) on delete restrict,
  tipo public.document_type not null,
  titulo text not null,
  periodo text,
  importe numeric(14,2) not null default 0,
  archivo_id uuid references public.archivos(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plantillas_generadas (
  id uuid primary key default gen_random_uuid(),
  documento_id uuid not null references public.documentos(id) on delete cascade,
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
  total numeric(14,2) not null default 0,
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

create table public.logs (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  nivel text not null default 'info',
  evento text not null,
  detalle jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.configuracion (
  clave text primary key,
  valor jsonb not null default '{}'::jsonb,
  updated_by uuid references public.usuarios(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index empresas_estado_idx on public.empresas(estado);
create index documentos_empresa_idx on public.documentos(empresa_id, created_at desc);
create index documentos_tipo_idx on public.documentos(tipo);
create index actividad_fecha_idx on public.actividad(created_at desc);
create index archivos_empresa_idx on public.archivos(empresa_id, created_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger usuarios_updated_at before update on public.usuarios for each row execute function public.set_updated_at();
create trigger empresas_updated_at before update on public.empresas for each row execute function public.set_updated_at();
create trigger documentos_updated_at before update on public.documentos for each row execute function public.set_updated_at();
create trigger honorarios_updated_at before update on public.honorarios for each row execute function public.set_updated_at();
create trigger configuracion_updated_at before update on public.configuracion for each row execute function public.set_updated_at();

create or replace function public.current_role() returns public.user_role language sql security definer stable set search_path = public as $$
  select coalesce((select rol from public.usuarios where id = auth.uid()), 'client'::public.user_role);
$$;

alter table public.usuarios enable row level security;
alter table public.empresas enable row level security;
alter table public.archivos enable row level security;
alter table public.documentos enable row level security;
alter table public.plantillas_generadas enable row level security;
alter table public.honorarios enable row level security;
alter table public.actividad enable row level security;
alter table public.logs enable row level security;
alter table public.configuracion enable row level security;

create policy usuarios_self_or_admin on public.usuarios for select using (id = auth.uid() or public.current_role() = 'admin');
create policy usuarios_admin_write on public.usuarios for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
create policy empresas_authenticated_read on public.empresas for select to authenticated using (true);
create policy empresas_admin_write on public.empresas for all to authenticated using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
create policy archivos_authenticated on public.archivos for all to authenticated using (public.current_role() = 'admin' or usuario_id = auth.uid()) with check (public.current_role() = 'admin' or usuario_id = auth.uid());
create policy documentos_authenticated on public.documentos for all to authenticated using (public.current_role() = 'admin' or usuario_id = auth.uid()) with check (public.current_role() = 'admin' or usuario_id = auth.uid());
create policy plantillas_authenticated on public.plantillas_generadas for all to authenticated using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
create policy honorarios_authenticated on public.honorarios for all to authenticated using (exists (select 1 from public.documentos d where d.id = documento_id and (d.usuario_id = auth.uid() or public.current_role() = 'admin'))) with check (exists (select 1 from public.documentos d where d.id = documento_id and (d.usuario_id = auth.uid() or public.current_role() = 'admin')));
create policy actividad_admin_read on public.actividad for select to authenticated using (public.current_role() = 'admin' or usuario_id = auth.uid());
create policy actividad_authenticated_insert on public.actividad for insert to authenticated with check (usuario_id = auth.uid() or public.current_role() = 'admin');
create policy logs_admin_only on public.logs for all to authenticated using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
create policy configuracion_admin_only on public.configuracion for all to authenticated using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

-- Storage: crea el bucket privado 'documentos' desde el panel de Supabase
-- y aplica políticas sobre storage.objects según public.current_role().

