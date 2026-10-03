export interface SectionOption {
  id: string;
  label: string;
}

export const sectionOptions: SectionOption[] = [
  { id: 'cardapio', label: 'Cardápio ou produtos' },
  { id: 'fotos', label: 'Galeria de fotos' },
  { id: 'localizacao', label: 'Localização e mapa' },
  { id: 'whatsapp', label: 'Botão de WhatsApp' },
  { id: 'contato', label: 'Formulário de contato' },
  { id: 'redes', label: 'Redes sociais' },
  { id: 'depoimentos', label: 'Depoimentos de clientes' },
  { id: 'horario', label: 'Horário de funcionamento' },
];

export function sectionLabel(id: string): string {
  return sectionOptions.find((s) => s.id === id)?.label ?? id;
}
