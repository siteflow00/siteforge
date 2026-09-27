import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { navItems, type NavItemId } from '@/config/navigation';
import { ProtectedRoute } from '@/features/auth/protected-route';
import {
  CheckEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
} from '@/features/auth/pages';
import { NotFoundPage } from './not-found-page';
import { RouteError } from './route-error';

// Cada módulo é carregado sob demanda (o AppShell mostra o LoadingState enquanto isso).
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
);
const LeadsPage = lazy(() => import('@/features/leads/pages/leads-page').then((m) => ({ default: m.LeadsPage })));
const PlacesPage = lazy(() => import('@/features/places/pages/places-page').then((m) => ({ default: m.PlacesPage })));
const SiteBuilderPage = lazy(() =>
  import('@/features/site-builder/pages/site-builder-page').then((m) => ({ default: m.SiteBuilderPage })),
);
const SalesPage = lazy(() => import('@/features/sales/pages/sales-page').then((m) => ({ default: m.SalesPage })));
const SalesAgentPage = lazy(() =>
  import('@/features/sales-agent/pages/sales-agent-page').then((m) => ({ default: m.SalesAgentPage })),
);
const PromptGeneratorPage = lazy(() =>
  import('@/features/prompt-generator/pages/prompt-generator-page').then((m) => ({
    default: m.PromptGeneratorPage,
  })),
);
const TutorialsPage = lazy(() =>
  import('@/features/tutorials/pages/tutorials-page').then((m) => ({ default: m.TutorialsPage })),
);
const MessagesPage = lazy(() =>
  import('@/features/messages/pages/messages-page').then((m) => ({ default: m.MessagesPage })),
);
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/settings-page').then((m) => ({ default: m.SettingsPage })),
);

const pages: Record<NavItemId, LazyExoticComponent<ComponentType>> = {
  dashboard: DashboardPage,
  'encontrar-clientes': LeadsPage,
  'meus-lugares': PlacesPage,
  'criar-site': SiteBuilderPage,
  vendas: SalesPage,
  'agente-de-vendas': SalesAgentPage,
  'gerador-de-prompt': PromptGeneratorPage,
  tutoriais: TutorialsPage,
  mensagens: MessagesPage,
  configuracoes: SettingsPage,
};

// Rotas geradas a partir da configuração de navegação: sidebar e rotas nunca ficam dessincronizadas.
const pageRoutes: RouteObject[] = navItems.map((item): RouteObject => {
  const Page = pages[item.id];
  return item.path === '/app'
    ? { index: true, element: <Page /> }
    : { path: item.path.replace('/app/', ''), element: <Page /> };
});

// Galeria do design system: existe somente em desenvolvimento e não aparece na navegação.
if (import.meta.env.DEV) {
  const UiKitPage = lazy(() =>
    import('@/features/ui-kit/ui-kit-page').then((m) => ({ default: m.UiKitPage })),
  );
  pageRoutes.push({ path: 'ui-kit', element: <UiKitPage /> });
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },

  // Páginas públicas de autenticação (fora do AppShell).
  { path: '/entrar', element: <SignInPage />, errorElement: <RouteError standalone /> },
  { path: '/cadastrar', element: <SignUpPage />, errorElement: <RouteError standalone /> },
  { path: '/confirme-seu-email', element: <CheckEmailPage />, errorElement: <RouteError standalone /> },
  { path: '/esqueci-senha', element: <ForgotPasswordPage />, errorElement: <RouteError standalone /> },
  { path: '/redefinir-senha', element: <ResetPasswordPage />, errorElement: <RouteError standalone /> },

  {
    path: '/app',
    element: <ProtectedRoute />,
    errorElement: <RouteError standalone />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            // Rota sem caminho: erros de página aparecem dentro do shell, mantendo a navegação.
            errorElement: <RouteError />,
            children: [...pageRoutes, { path: '*', element: <NotFoundPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage standalone /> },
]);
