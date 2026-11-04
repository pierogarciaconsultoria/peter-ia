import { ActionPlanMapping } from '@/types/analysis-integration';

const PRIORITIES: ActionPlanMapping['priority'][] = ['low', 'medium', 'high', 'critical'];
const AREAS: ActionPlanMapping['process_area'][] = ['manufacturing', 'quality', 'management', 'hr', 'sales', 'supply_chain', 'other'];

const PRIORITY_ALIASES: Record<string, ActionPlanMapping['priority']> = {
  baixa: 'low', media: 'medium', 'média': 'medium', alta: 'high', critica: 'critical', 'crítica': 'critical',
};

function text(value: any): string {
  if (value == null) return '';
  return typeof value === 'string' ? value.trim() : String(value);
}

export class ActionPlanMapper {
  static mapActionPlan(aiSuggestions: any): ActionPlanMapping[] {
    const actionPlan = aiSuggestions?.action_plan || [];
    if (!Array.isArray(actionPlan)) return [];

    return actionPlan
      .map((action: any): ActionPlanMapping | null => {
        const title = text(action?.title || action?.action || (typeof action === 'string' ? action : ''));
        if (!title) return null;

        const priority = ActionPlanMapper.normalizePriority(action?.priority);
        const description = text(action?.description || action?.details || action?.what) || title;

        return {
          title,
          description,
          what: text(action?.what) || description,
          why: text(action?.why || action?.justification) || 'Ação sugerida pela Análise Inteligente',
          how: text(action?.how) || description,
          due_date: ActionPlanMapper.resolveDueDate(action?.due_date, action?.due_in_days, priority),
          priority,
          responsible: text(action?.responsible) || 'A definir',
          process_area: AREAS.includes(action?.process_area) ? action.process_area : 'management',
          status: 'pending',
        };
      })
      .filter((a: ActionPlanMapping | null): a is ActionPlanMapping => a !== null);
  }

  private static normalizePriority(raw: any): ActionPlanMapping['priority'] {
    const value = text(raw).toLowerCase();
    if (PRIORITIES.includes(value as ActionPlanMapping['priority'])) return value as ActionPlanMapping['priority'];
    return PRIORITY_ALIASES[value] || 'medium';
  }

  private static resolveDueDate(dueDate: any, dueInDays: any, priority: string): string {
    if (typeof dueDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dueDate)) return dueDate.slice(0, 10);

    const now = new Date();
    const days = Number(dueInDays);
    if (Number.isFinite(days) && days > 0) {
      now.setDate(now.getDate() + Math.min(365, Math.round(days)));
      return now.toISOString().split('T')[0];
    }

    switch (priority) {
      case 'critical': now.setDate(now.getDate() + 15); break;
      case 'high': now.setMonth(now.getMonth() + 1); break;
      case 'medium': now.setMonth(now.getMonth() + 3); break;
      default: now.setMonth(now.getMonth() + 6);
    }
    return now.toISOString().split('T')[0];
  }
}
