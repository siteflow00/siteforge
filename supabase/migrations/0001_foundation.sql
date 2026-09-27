-- SiteForge · F4 · Fundação do banco de dados
-- Rode no SQL Editor do Supabase. É seguro rodar de novo (idempotente).
--
-- Modelo: todo dado de negócio pertence a um workspace (workspace_id), nunca direto a um usuário.
-- Hoje cada conta tem 1 workspace; o modelo já aceita vários usuários e workspaces no futuro.

-- ============================================================
-- 1. Tipos
-- ============================================================
do $$
begin
  create type public.workspace_role as enum ('owner', 'admin', 'member');
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 2. Tabelas
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text check (char_length(full_name) <= 120),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 80),
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id  uuid not null references public.workspaces (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  role          public.workspace_role not null default 'member',
  created_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists workspace_members_user_id_idx
  on public.workspace_members (user_id);

-- Administradores da plataforma (dono do SiteForge). Só o SQL Editor escreve aqui.
create table if not exists public.platform_admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 3. Funções auxiliares (usadas pelas policies de RLS)
--    security definer + search_path vazio: leem as tabelas sem recursão de RLS.
-- ============================================================
create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members m
    where m.workspace_id = _workspace_id
      and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.has_workspace_role(_workspace_id uuid, _roles public.workspace_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members m
    where m.workspace_id = _workspace_id
      and m.user_id = (select auth.uid())
      and m.role = any (_roles)
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_admins a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public, anon;
revoke all on function public.has_workspace_role(uuid, public.workspace_role[]) from public, anon;
revoke all on function public.is_platform_admin() from public, anon;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.has_workspace_role(uuid, public.workspace_role[]) to authenticated;
grant execute on function public.is_platform_admin() to authenticated;

-- ============================================================
-- 4. Triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists workspaces_set_updated_at on public.workspaces;
create trigger workspaces_set_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

-- Ao criar uma conta: cria perfil, workspace e vínculo de "owner".
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_label        text;
  v_workspace_id uuid;
begin
  v_label := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), '')
  );

  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.workspaces (name, created_by)
  values (
    case when v_label is null then 'Meu workspace' else left('Workspace de ' || v_label, 80) end,
    new.id
  )
  returning id into v_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace_id, new.id, 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. Privilégios de tabela (segunda camada além da RLS)
--    anon não acessa nada; usuário logado só lê e edita colunas específicas.
-- ============================================================
revoke all on table public.profiles, public.workspaces, public.workspace_members, public.platform_admins from anon;
revoke all on table public.profiles, public.workspaces, public.workspace_members, public.platform_admins from authenticated;

grant select on table public.profiles, public.workspaces, public.workspace_members, public.platform_admins to authenticated;
grant update (full_name, avatar_url) on table public.profiles to authenticated;
grant update (name) on table public.workspaces to authenticated;

-- ============================================================
-- 6. Row Level Security
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.platform_admins   enable row level security;

-- profiles: cada um vê e edita o próprio; admin da plataforma só lê.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_platform_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- workspaces: membros leem; owner/admin do workspace editam o nome.
drop policy if exists "workspaces_select" on public.workspaces;
create policy "workspaces_select" on public.workspaces
  for select to authenticated
  using (public.is_workspace_member(id) or public.is_platform_admin());

drop policy if exists "workspaces_update" on public.workspaces;
create policy "workspaces_update" on public.workspaces
  for update to authenticated
  using (public.has_workspace_role(id, array['owner', 'admin']::public.workspace_role[]))
  with check (public.has_workspace_role(id, array['owner', 'admin']::public.workspace_role[]));

-- workspace_members: leitura apenas. Convidar/remover membros virá com o recurso de times.
drop policy if exists "workspace_members_select" on public.workspace_members;
create policy "workspace_members_select" on public.workspace_members
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_workspace_member(workspace_id)
    or public.is_platform_admin()
  );

-- platform_admins: cada usuário só consegue ver a própria linha (para o app saber se é admin).
drop policy if exists "platform_admins_select_own" on public.platform_admins;
create policy "platform_admins_select_own" on public.platform_admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Sem policies de INSERT/DELETE em nenhuma tabela: o app não cria nem apaga estas linhas.
-- Perfil, workspace e vínculo nascem só pelo trigger; admins só pelo SQL Editor:
--
--   insert into public.platform_admins (user_id)
--   select id from auth.users where email = 'SEU-EMAIL@exemplo.com';
