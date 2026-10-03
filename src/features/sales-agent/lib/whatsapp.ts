export function normalizeBrazilianPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('55') && digits.length >= 12 && digits.length <= 13) {
    return digits;
  }

  const local = digits.startsWith('0') ? digits.slice(1) : digits;

  if (local.length === 10 || local.length === 11) {
    return `55${local}`;
  }

  return null;
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const normalized = normalizeBrazilianPhone(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
