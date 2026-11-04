import { Action5W2H } from "@/types/actions";
import { createAction, getAllActions } from "@/services/actionService";

export type StrategicPillar =
  | { type: 'identity'; label: 'Missão' | 'Visão' | 'Valores'; text: string }
  | { type: 'swot'; label: string; text: string }
  | { type: 'bsc'; label: string; text: string; objectiveId?: string }
  | { type: 'kr'; label: string; text: string; keyResultId: string };

export const STRATEGIC_ACTION_SOURCE = 'strategic_planning' as const;

/** Ações do plano de ação cuja origem é o Planejamento Estratégico. */
export async function getStrategicActions(): Promise<Action5W2H[]> {
  const all = await getAllActions();
  return all.filter(a => a.source === STRATEGIC_ACTION_SOURCE);
}

/** Pré-preenchimento 5W2H a partir de um pilar do planejamento. */
export function buildActionDraft(pillar: StrategicPillar): Partial<Action5W2H> {
  const whyPrefix =
    pillar.type === 'identity'
      ? `Desdobramento da ${pillar.label} da organização`
      : pillar.type === 'swot'
        ? `Resposta estratégica ao item SWOT (${pillar.label})`
        : pillar.type === 'kr'
          ? `Iniciativa do resultado-chave (${pillar.label})`
          : `Objetivo (${pillar.label})`;

  const due = new Date();
  due.setMonth(due.getMonth() + 3);

  return {
    source: STRATEGIC_ACTION_SOURCE,
    title: pillar.type === 'bsc' || pillar.type === 'kr' ? pillar.text : '',
    what: pillar.type === 'bsc' ? `Executar o objetivo: ${pillar.text}` : pillar.type === 'kr' ? `Avançar o resultado-chave: ${pillar.text}` : '',
    key_result_id: pillar.type === 'kr' ? pillar.keyResultId : null,
    why: `${whyPrefix}: ${pillar.text}`,
    where: '',
    how: '',
    status: 'planned',
    priority: 'medium',
    process_area: 'management',
    due_date: due.toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    comments: `Origem: Planejamento Estratégico / ${pillar.label}`,
  };
}

export interface StrategicActionInput {
  title: string;
  what: string;
  why: string;
  how: string;
  where?: string;
  responsible?: string;
  due_date: string;
  priority?: Action5W2H['priority'];
  process_area?: Action5W2H['process_area'];
  comments?: string;
  key_result_id?: string | null;
}

/** Cria uma ação real no plano de ação com origem no Planejamento Estratégico. */
export async function createStrategicAction(input: StrategicActionInput): Promise<Action5W2H> {
  return createAction({
    title: input.title,
    what: input.what,
    why: input.why,
    how: input.how,
    where: input.where || 'Organização',
    responsible: input.responsible || 'A definir',
    how_much: 0,
    currency: 'BRL',
    due_date: input.due_date,
    start_date: new Date().toISOString().split('T')[0],
    status: 'planned',
    priority: input.priority || 'medium',
    process_area: input.process_area || 'management',
    source: STRATEGIC_ACTION_SOURCE,
    comments: input.comments || 'Origem: Planejamento Estratégico',
    key_result_id: input.key_result_id ?? null,
  });
}
