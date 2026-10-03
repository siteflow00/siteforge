export interface OutreachInput {
  name: string;
  niche: string | null;
  city: string | null;
}

export function buildOutreachMessage(input: OutreachInput): string {
  const niche = input.niche ? ` de ${input.niche.toLowerCase()}` : '';
  return `Olá! Tudo bem? Vi o trabalho da ${input.name}${niche} e achei muito interessante. Vocês já têm um site? Ajudo negócios como o de vocês a conseguir mais clientes com um site profissional. Posso te mostrar uma ideia rápida?`;
}
