
import { StrategicPlanningMapping } from '@/types/analysis-integration';

export class StrategicPlanningMapper {
  static mapStrategicPlanning(aiSuggestions: any): StrategicPlanningMapping {
    const strategic = aiSuggestions.strategic_planning || {};
    
    return {
      mission: strategic.mission || '',
      vision: strategic.vision || '',
      values: strategic.values || [],
      swot_items: []
    };
  }
}
