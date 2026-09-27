import { useState, type ReactNode } from 'react';
import { Inbox, Settings, Sparkles } from 'lucide-react';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { PageHeader } from '@/components/layout/page-header';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  Field,
  Input,
  Modal,
  ModalClose,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  useToast,
} from '@/components/ui';

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

/** Galeria do design system. Só existe em desenvolvimento: abra /app/ui-kit. */
export function UiKitPage() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-4">
      <PageHeader description="Galeria dos componentes do SiteForge. Visível apenas em desenvolvimento." />

      <Section title="Botões">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primário</Button>
          <Button variant="dark">Escuro</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Discreto</Button>
          <Button variant="danger">Excluir</Button>
          <Button disabled>Desativado</Button>
          <Button loading={loading} onClick={simulateLoading}>
            {loading ? 'Salvando' : 'Simular carregamento'}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
          <Tooltip content="Com dica ao passar o mouse ou focar">
            <Button variant="secondary" size="icon" aria-label="Configurações">
              <Settings className="h-4 w-4" aria-hidden />
            </Button>
          </Tooltip>
        </div>
      </Section>

      <Section title="Formulários" description="Rótulo, dica e mensagem de erro seguem o mesmo padrão.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="kit-nome" label="Nome da empresa" hint="Como aparece no site." required>
            <Input id="kit-nome" placeholder="Ex.: Padaria Estrela" aria-describedby="kit-nome-hint" />
          </Field>
          <Field id="kit-nicho" label="Nicho">
            <Select id="kit-nicho" defaultValue="">
              <option value="" disabled>
                Selecione um nicho
              </option>
              <option>Restaurante</option>
              <option>Barbearia</option>
              <option>Clínica</option>
            </Select>
          </Field>
          <Field id="kit-email" label="E-mail" error="Informe um e-mail válido.">
            <Input id="kit-email" defaultValue="contato@" invalid aria-describedby="kit-email-error" />
          </Field>
          <Field id="kit-obs" label="Observações">
            <Textarea id="kit-obs" placeholder="Detalhes do projeto" />
          </Field>
        </div>
      </Section>

      <Section title="Badges e avatares">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Neutro</Badge>
          <Badge variant="brand">Destaque</Badge>
          <Badge variant="success" dot>
            Publicado
          </Badge>
          <Badge variant="info" dot>
            Em análise
          </Badge>
          <Badge variant="danger" dot>
            Falhou
          </Badge>
          <Avatar size="sm" />
          <Avatar name="Maria Souza" />
          <Avatar name="João" size="lg" />
        </div>
      </Section>

      <Section title="Abas, menu e modal">
        <Tabs defaultValue="7">
          <TabsList aria-label="Período">
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="7">7 dias</TabsTrigger>
            <TabsTrigger value="30">30 dias</TabsTrigger>
          </TabsList>
          <TabsContent value="hoje">Conteúdo de hoje.</TabsContent>
          <TabsContent value="7">Conteúdo dos últimos 7 dias.</TabsContent>
          <TabsContent value="30">Conteúdo dos últimos 30 dias.</TabsContent>
        </Tabs>
        <div className="mt-4 flex flex-wrap gap-3">
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="secondary">Abrir menu</Button>
            </DropdownTrigger>
            <DropdownContent align="start">
              <DropdownLabel>Ações</DropdownLabel>
              <DropdownItem onSelect={() => toast({ title: 'Duplicado', variant: 'success' })}>Duplicar</DropdownItem>
              <DropdownItem disabled>Arquivar</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onSelect={() => toast({ title: 'Excluído', variant: 'error' })}>Excluir</DropdownItem>
            </DropdownContent>
          </Dropdown>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Abrir modal
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Excluir projeto?"
          description="Esta ação não pode ser desfeita."
          footer={
            <>
              <ModalClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </ModalClose>
              <Button
                variant="danger"
                onClick={() => {
                  setModalOpen(false);
                  toast({ title: 'Projeto excluído', variant: 'success' });
                }}
              >
                Excluir projeto
              </Button>
            </>
          }
        >
          O projeto e todas as versões do site serão removidos.
        </Modal>
      </Section>

      <Section title="Avisos (toast)">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast({ title: 'Alterações salvas', variant: 'success' })}>
            Sucesso
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({ title: 'Não foi possível salvar', description: 'Tente novamente em instantes.', variant: 'error' })
            }
          >
            Erro
          </Button>
          <Button variant="secondary" onClick={() => toast({ title: 'Sincronizando dados', variant: 'info' })}>
            Informação
          </Button>
        </div>
      </Section>

      <Section title="Tabela" description="Dados de exemplo apenas para visualizar o componente.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Exemplo A</TableCell>
              <TableCell>Restaurante</TableCell>
              <TableCell>
                <Badge variant="info" dot>
                  Nova
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Exemplo B</TableCell>
              <TableCell>Barbearia</TableCell>
              <TableCell>
                <Badge variant="success" dot>
                  Fechada
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title="Estados">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-none">
            <EmptyState icon={Inbox} title="Nada por aqui ainda" description="Explique o que aparece aqui e como começar." />
          </Card>
          <Card className="shadow-none">
            <ErrorState onRetry={() => toast({ title: 'Tentando de novo…', variant: 'info' })} />
          </Card>
          <Card className="shadow-none">
            <LoadingState className="min-h-[12rem]" />
          </Card>
          <Card className="space-y-3 p-5 shadow-none">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Skeleton
            </span>
          </Card>
        </div>
      </Section>
    </div>
  );
}
