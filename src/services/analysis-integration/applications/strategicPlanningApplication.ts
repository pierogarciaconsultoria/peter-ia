
import { StrategicPlanningMapping } from '@/types/analysis-integration';
import { updateStrategicIdentity } from '@/services/strategic-planning/strategicIdentityService';
import { createSwotItem } from '@/services/strategic-planning/swotService';

export class StrategicPlanningApplication {
  static async applyStrategicPlanning(mapping: StrategicPlanningMapping, companyId: string): Promise<boolean> {
    try {
      // Aplicar identidade estratégica
      await updateStrategicIdentity({
        mission: mapping.mission,
        vision: mapping.vision,
        values: mapping.values
      });

      // Aplicar itens SWOT se houver
      for (const swotItem of mapping.swot_items) {
        await createSwotItem(swotItem);
      }

      return true;
    } catch (error) {
      console.error('Erro ao aplicar planejamento estratégico:', error);
      return false;
    }
  }
}
