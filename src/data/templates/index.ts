import { industriaTemplate } from "./industria";
import { SegmentKey, SegmentTemplate } from "./types";

export * from "./types";

export const SEGMENTS: { key: SegmentKey; label: string; hasTemplate: boolean }[] = [
  { key: 'industria', label: 'Indústria', hasTemplate: true },
  { key: 'servicos', label: 'Serviços', hasTemplate: false },
  { key: 'comercio', label: 'Comércio', hasTemplate: false },
  { key: 'construcao', label: 'Construção', hasTemplate: false },
  { key: 'saude', label: 'Saúde', hasTemplate: false },
  { key: 'outro', label: 'Outro', hasTemplate: false },
];

const TEMPLATES: Partial<Record<SegmentKey, SegmentTemplate>> = {
  industria: industriaTemplate,
};

/** Template do segmento, ou null quando o segmento ainda depende só da IA. */
export function getSegmentTemplate(segment: SegmentKey | string | null | undefined): SegmentTemplate | null {
  if (!segment) return null;
  return TEMPLATES[segment as SegmentKey] ?? null;
}

/** Valor gravado em companies.company_sector para cada segmento. */
export const SEGMENT_SECTOR_LABEL: Record<SegmentKey, string> = {
  industria: 'Manufatura',
  servicos: 'Serviços',
  comercio: 'Comércio',
  construcao: 'Construção',
  saude: 'Saúde',
  outro: 'Outro',
};
