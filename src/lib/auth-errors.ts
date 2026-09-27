/** Traduz as mensagens mais comuns de auth do Supabase. As demais aparecem como vieram. */
export function translateAuthError(message: string): string {
  const known: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.',
    'User already registered': 'Já existe uma conta com este e-mail.',
    'Password should be at least 6 characters': 'A senha precisa ter pelo menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'Informe um e-mail válido.',
    'For security purposes, you can only request this after 20 seconds.':
      'Por segurança, aguarde alguns segundos antes de tentar de novo.',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde um pouco antes de tentar de novo.',
    'New password should be different from the old password.': 'A nova senha precisa ser diferente da atual.',
  };
  return known[message] ?? message;
}
