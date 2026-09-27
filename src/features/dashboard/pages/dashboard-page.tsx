import { BarChart3, CircleDollarSign, Globe, History, Receipt, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/feedback';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { StatCard } from '../components/stat-card';

/**
 * Estrutura da Visão geral. Os valores são zeros reais (ainda não existe nenhuma venda);
 * na etapa F7 passam a vir do banco.
 */
export function DashboardPage() {
  return (
    <>
      <PageHeader description="Resumo da sua operação: receita, vendas e sites criados." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receita" value="R$ 0,00" hint="Nenhuma venda registrada" icon={TrendingUp} />
        <StatCard label="Vendas" value="0" hint="Nenhuma venda no período" icon={Receipt} />
        <StatCard label="Ticket médio" value="R$ 0,00" hint="Calculado sobre vendas pagas" icon={CircleDollarSign} />
        <StatCard label="Sites criados" value="0" hint="Total na sua conta" icon={Globe} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Receita por dia</CardTitle>
              <CardDescription>Evolução da receita ao longo do período.</CardDescription>
            </div>
          </CardHeader>
          <EmptyState
            icon={BarChart3}
            title="Nenhuma venda no período"
            description="Quando você registrar vendas, a receita de cada dia aparece aqui."
          />
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Atividade recente</CardTitle>
              <CardDescription>Últimas ações na sua conta.</CardDescription>
            </div>
          </CardHeader>
          <EmptyState
            icon={History}
            title="Sem atividade ainda"
            description="Empresas salvas, sites criados e vendas registradas aparecem aqui."
          />
        </Card>
      </div>
    </>
  );
}
