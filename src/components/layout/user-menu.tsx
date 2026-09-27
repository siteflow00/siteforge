import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import {
  Avatar,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from '@/components/ui';
import { useAuth } from '@/features/auth/auth-context';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/entrar', { replace: true });
  }

  const label = (user?.user_metadata?.full_name as string | undefined) || user?.email || '';

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menu da conta"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <Avatar name={label} />
        </button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownLabel className="truncate">{user?.email ?? 'Minha conta'}</DropdownLabel>
        <DropdownItem asChild>
          <Link to="/app/configuracoes">
            <Settings className="h-4 w-4 text-ink-subtle" aria-hidden />
            Configurações
          </Link>
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={handleSignOut}>
          <LogOut className="h-4 w-4 text-ink-subtle" aria-hidden />
          Sair
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
