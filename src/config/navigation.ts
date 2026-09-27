import {
  Bot,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  MapPin,
  MessageSquareText,
  Search,
  Settings,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export type NavItemId =
  | 'dashboard'
  | 'encontrar-clientes'
  | 'meus-lugares'
  | 'criar-site'
  | 'vendas'
  | 'agente-de-vendas'
  | 'gerador-de-prompt'
  | 'tutoriais'
  | 'mensagens'
  | 'configuracoes';

export interface NavItem {
  id: NavItemId;
  label: string;
  path: string;
  icon: LucideIcon;
  /** Frase curta usada no cabeçalho da página. */
  summary: string;
  /** O que o módulo vai entregar (mostrado enquanto estiver "Em construção"). */
  planned: string[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

/** Fonte única da navegação: alimenta sidebar, rotas, título do header e páginas "Em construção". */
export const navGroups: NavGroup[] = [
  {
    id: 'plataforma',
    label: 'Plataforma',
    items: [
      {
        id: 'dashboard',
        label: 'Visão geral',
        path: '/app',
        icon: LayoutDashboard,
        summary: 'Resumo da sua operação: receita, vendas e sites criados.',
        planned: [],
      },
      {
        id: 'encontrar-clientes',
        label: 'Encontrar clientes',
        path: '/app/encontrar-clientes',
        icon: Search,
        summary: 'Descubra empresas que ainda precisam de um site.',
        planned: [
          'Buscar empresas por nicho, estado, cidade e bairro',
          'Ver dados públicos e sinais de que a empresa não tem site',
          'Salvar empresas na sua lista com um clique',
        ],
      },
      {
        id: 'meus-lugares',
        label: 'Meus lugares',
        path: '/app/meus-lugares',
        icon: MapPin,
        summary: 'Guarde e organize as empresas que você quer atender.',
        planned: [
          'Cadastrar uma empresa manualmente',
          'Acompanhar o status de cada empresa (nova, contatada, negociando)',
          'Transformar uma empresa em projeto de site',
        ],
      },
      {
        id: 'criar-site',
        label: 'Criar site',
        path: '/app/criar-site',
        icon: Sparkles,
        summary: 'Do briefing ao site publicado, em um só fluxo.',
        planned: [
          'Escolher o nicho e a empresa do projeto',
          'Definir cores, seções e extras do site',
          'Gerar o site, editar e publicar',
        ],
      },
      {
        id: 'vendas',
        label: 'Vendas',
        path: '/app/vendas',
        icon: Wallet,
        summary: 'Registre e acompanhe tudo o que você já vendeu.',
        planned: [
          'Registrar uma venda e o cliente que comprou',
          'Ver o histórico com valores e datas',
          'Alimentar as métricas da Visão geral',
        ],
      },
    ],
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    items: [
      {
        id: 'agente-de-vendas',
        label: 'Agente de vendas',
        path: '/app/agente-de-vendas',
        icon: Bot,
        summary: 'Um assistente para preparar propostas e contornar objeções.',
        planned: [
          'Sugerir abordagens para cada tipo de empresa',
          'Ajudar a montar propostas e responder objeções',
        ],
      },
      {
        id: 'gerador-de-prompt',
        label: 'Gerador de prompt',
        path: '/app/gerador-de-prompt',
        icon: Lightbulb,
        summary: 'Monte instruções claras para gerar o site de um cliente.',
        planned: ['Preencher um briefing guiado', 'Gerar um prompt pronto para copiar'],
      },
      {
        id: 'tutoriais',
        label: 'Tutoriais',
        path: '/app/tutoriais',
        icon: GraduationCap,
        summary: 'Aprenda o processo, do primeiro contato à entrega.',
        planned: ['Guias curtos por etapa do processo', 'Boas práticas de prospecção e venda'],
      },
      {
        id: 'mensagens',
        label: 'Mensagens',
        path: '/app/mensagens',
        icon: MessageSquareText,
        summary: 'Modelos e mensagens de prospecção prontos para editar e copiar.',
        planned: [
          'Biblioteca de modelos de abordagem e follow-up',
          'Mensagens geradas por IA para cada empresa',
          'Editar antes de enviar e copiar com um clique',
        ],
      },
    ],
  },
  {
    id: 'conta',
    label: 'Conta',
    items: [
      {
        id: 'configuracoes',
        label: 'Configurações',
        path: '/app/configuracoes',
        icon: Settings,
        summary: 'Perfil, workspace e preferências da sua conta.',
        planned: ['Editar seus dados de perfil', 'Definir o nome do seu workspace'],
      },
    ],
  },
];

export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);

export function getNavItem(id: NavItemId): NavItem {
  const item = navItems.find((entry) => entry.id === id);
  if (!item) throw new Error(`Item de navegação desconhecido: ${id}`);
  return item;
}

export interface PageMeta {
  title: string;
  group?: string;
}

/** Título e grupo da página atual, usados no header e no título da aba. */
export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  for (const group of navGroups) {
    for (const item of group.items) {
      const isMatch = path === item.path || (item.path !== '/app' && path.startsWith(`${item.path}/`));
      if (isMatch) return { title: item.label, group: group.label };
    }
  }
  if (path === '/app/ui-kit') return { title: 'UI kit', group: 'Desenvolvimento' };
  return { title: 'Página não encontrada' };
}
