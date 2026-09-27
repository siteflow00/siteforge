# SiteForge

Plataforma SaaS para encontrar clientes, criar, gerir e vender sites.
Estado atual: **F1–F3** validadas (fundação, UI kit e AppShell) e **F4** (migration do banco) escrita, aguardando aplicação no Supabase. Autenticação chega na F5.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

Scripts: `npm run build` (typecheck + build), `npm run lint`, `npm run typecheck`.

## Estrutura

```
src/
├── app/            router, providers, páginas 404 e de erro
├── config/         navigation.ts (fonte única de sidebar, rotas e títulos)
├── components/
│   ├── ui/         UI kit (Button, Input, Select, Textarea, Card, Badge, Modal,
│   │               Dropdown, Tabs, Toast, Tooltip, Skeleton, Table, Avatar, Field)
│   ├── feedback/   EmptyState, ErrorState, LoadingState, ComingSoon
│   └── layout/     AppShell, Sidebar, Topbar, UserMenu, PageHeader, Logo
├── features/       um diretório por módulo (pages/, e depois api/, hooks/, components/)
└── lib/            cn (classes), env (variáveis de ambiente)
```

## Convenções

- **Tokens de design** ficam em `tailwind.config.ts`. Componentes usam só esses nomes.
- **Navegação** é definida uma vez em `src/config/navigation.ts`. Adicionar um módulo = 1 item lá + 1 página.
- **Módulo novo**: troque o `ComingSoon` da página por a tela real; nenhuma outra peça muda.
- Sem botões falsos: ação que ainda não existe não é renderizada.
- Em desenvolvimento, `/app/ui-kit` mostra todos os componentes.

## Banco de dados (F4)

`supabase/migrations/0001_foundation.sql` cria profiles, workspaces, workspace_members e platform_admins, com RLS, funções auxiliares e o trigger que cria perfil + workspace no cadastro. Depois de aplicar, rode `supabase/verify/0001_foundation_check.sql` para conferir.

## Próximas etapas

F4 banco (Supabase, migrations, RLS) → F5 autenticação → F6 Configurações → F7 Dashboard com dados reais.
