
import { ActionPlanMapping } from '@/types/analysis-integration';

export class ActionPlanMapper {
  static mapActionPlan(aiSuggestions: any): ActionPlanMapping[] {
    const actionPlan = aiSuggestions.action_plan || [];
    
    return actionPlan.map((action: any) => ({
      title: action.title || action.action || action,
      description: action.description || action.details || `Ação: ${action.title || action}`,
      due_date: action.due_date || this.getDefaultDueDate(action.priority),
      priority: action.priority || 'medium',
      responsible: action.responsible || 'A definir',
      status: 'pending' as const
    }));
  }

  private static getDefaultDueDate(priority: string): string {
    const now = new Date();
    switch (priority) {
      case 'high':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'medium':
        now.setMonth(now.getMonth() + 3);
        break;
      default:
        now.setMonth(now.getMonth() + 6);
    }
    return now.toISOString().split('T')[0];
  }
}
