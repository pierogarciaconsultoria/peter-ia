
import { DiscScore, DiscType } from "./types";

/**
 * Determine the primary DISC type based on scores
 * @param scores The DISC scores
 * @returns The primary DISC type
 */
export function determinePrimaryType(scores: DiscScore): DiscType {
  const { D, I, S, C } = scores;
  const maxScore = Math.max(D, I, S, C);
  
  if (maxScore === D) return 'D';
  if (maxScore === I) return 'I';
  if (maxScore === S) return 'S';
  return 'C';
}

/**
 * Get a description of the DISC profile based on the primary type
 */
export function getDiscProfileDescription(primaryType: DiscType): string {
  switch (primaryType) {
    case 'D':
      return 'Dominante, direto, decisivo, orientado a resultados';
    case 'I':
      return 'Influente, inspirador, interativo, entusiasta';
    case 'S':
      return 'Estável, solidário, compreensivo, colaborativo';
    case 'C':
      return 'Consciente, cauteloso, calculista, preciso';
    default:
      return 'Perfil DISC não determinado';
  }
}

/**
 * Calculate the DISC profile balance score (0-100)
 * Higher scores indicate a more balanced profile
 */
export function calculateProfileBalance(scores: DiscScore): number {
  const { D, I, S, C } = scores;
  const total = D + I + S + C;
  
  if (total === 0) return 0;
  
  // Calculate how evenly distributed the scores are
  const idealPerType = total / 4;
  const deviations = [
    Math.abs(D - idealPerType),
    Math.abs(I - idealPerType),
    Math.abs(S - idealPerType),
    Math.abs(C - idealPerType)
  ];
  
  const totalDeviation = deviations.reduce((sum, val) => sum + val, 0);
  const maxPossibleDeviation = total * 0.75; // Theoretical maximum deviation
  
  // Convert to a 0-100 scale where 100 is perfectly balanced
  const balanceScore = 100 - (totalDeviation / maxPossibleDeviation) * 100;
  
  return Math.round(balanceScore);
}
