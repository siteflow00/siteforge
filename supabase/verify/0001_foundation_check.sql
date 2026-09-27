-- Rode DEPOIS da migration 0001. Resultado esperado em cada bloco:

-- 1) 4 linhas, todas com rowsecurity = true
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('profiles', 'workspaces', 'workspace_members', 'platform_admins')
order by tablename;

-- 2) 6 policies: platform_admins_select_own, profiles_select, profiles_update_own,
--    workspace_members_select, workspaces_select, workspaces_update
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 3) 1 linha: on_auth_user_created
select tgname
from pg_trigger
where tgname = 'on_auth_user_created';

-- 4) 3 linhas: has_workspace_role, is_platform_admin, is_workspace_member
select proname
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('is_workspace_member', 'has_workspace_role', 'is_platform_admin')
order by proname;
