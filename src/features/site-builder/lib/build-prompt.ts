import { sectionLabel } from './sections';

export interface PromptInput {
  placeName: string;
  city: string | null;
  phone: string | null;
  niche: string;
  sections: string[];
  notes: string;
}

export function buildPrompt(input: PromptInput): string {
  const lines: string[] = [];

  lines.push(
    `Crie um site para a empresa "${input.placeName}"${input.niche ? `, do ramo de ${input.niche}` : ''}${
      input.city ? ` em ${input.city}` : ''
    }.`,
  );

  if (input.sections.length > 0) {
    lines.push('');
    lines.push('O site deve ter as seguintes seções:');
    lines.push(...input.sections.map((id) => `- ${sectionLabel(id)}`));
  }

  if (input.notes.trim()) {
    lines.push('');
    lines.push(`Informações adicionais: ${input.notes.trim()}`);
  }

  if (input.phone) {
    lines.push('');
    lines.push(`Contato para exibir no site: ${input.phone}`);
  }

  return lines.join('\n');
}
