
import { mockRisks } from "../RisksList";

export interface RiskPoint {
  id: string;
  prob: number;
  impact: number;
  label: string;
  title: string;
  level: string;
  process: string;
  status: string;
}

/**
 * Converts risk data from the mockRisks array to matrix coordinates
 */
export const mapRisksToMatrixPoints = (): RiskPoint[] => {
  return mockRisks.map(risk => {
    // Convert text values to numeric coordinates for the matrix
    let probValue;
    switch(risk.probability.toLowerCase()) {
      case 'alta': probValue = 2; break;
      case 'média': probValue = 1; break;
      default: probValue = 0; // Baixa
    }
    
    let impactValue;
    switch(risk.impact.toLowerCase()) {
      case 'alto': impactValue = 0; break;
      case 'médio': impactValue = 1; break;
      default: impactValue = 2; // Baixo
    }
    
    // Find label (R1, R2, etc.) based on ID
    const labelNum = parseInt(risk.id);
    const label = labelNum ? `R${labelNum}` : `R${risk.id}`;
    
    return {
      id: risk.id,
      prob: probValue,
      impact: impactValue,
      label: label,
      title: risk.title,
      level: risk.level,
      process: risk.process,
      status: risk.status
    };
  });
};
