import { ActionPlanMapping } from '@/types/analysis-integration';
import { createStrategicAction, getStrategicActions } from '@/services/strategic-planning/strategicActionService';

/**
 * Cria as ações do plano de 90 dias sugerido pela IA no Plano de Ação (5W2H),
 * com origem "Planejamento Estratégico". Títulos já existentes são ignorados.
 */
export class ActionPlanApplication {
  static async applyActionPlan(actions: ActionPlanMapping[], _companyId: string): Promise<boolean> {
    try {
      if (actions.length === 0) return true;

      const existing = await getStrategicActions().catch(() => []);
      const known = new Set(existing.map(a => a.title.trim().toLowerCase()));

      for (const action of actions) {
        if (known.has(action.title.trim().toLowerCase())) continue;
        await createStrategicAction({
          title: action.title,
          what: action.what,
          why: action.why,
          how: action.how,
          responsible: action.responsible,
          due_date: action.due_date,
          priority: action.priority,
          process_area: action.process_area,
          comments: 'Origem: Análise Inteligente / Plano de 90 dias',
        });
        known.add(action.title.trim().toLowerCase());
      }
      return true;
    } catch (error) {
      console.error('Erro ao aplicar plano de ação:', error);
      return false;
    }
  }
}
