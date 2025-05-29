
import { DiscScore } from "@/types/disc";

/**
 * Determine the primary DISC type based on scores
 * @param scores The DISC scores
 * @returns The primary DISC type
 */
export function determinePrimaryType(scores: DiscScore): string {
  const { d, i, s, c } = scores;
  const maxScore = Math.max(d, i, s, c);
  
  if (maxScore === d) return 'D';
  if (maxScore === i) return 'I';
  if (maxScore === s) return 'S';
  return 'C';
}

/**
 * Get a description of the DISC profile based on the primary type
 */
export function getDiscProfileDescription(primaryType: string): string {
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
  const { d, i, s, c } = scores;
  const total = d + i + s + c;
  
  if (total === 0) return 0;
  
  // Calculate how evenly distributed the scores are
  const idealPerType = total / 4;
  const deviations = [
    Math.abs(d - idealPerType),
    Math.abs(i - idealPerType),
    Math.abs(s - idealPerType),
    Math.abs(c - idealPerType)
  ];
  
  const totalDeviation = deviations.reduce((sum, val) => sum + val, 0);
  const maxPossibleDeviation = total * 0.75; // Theoretical maximum deviation
  
  // Convert to a 0-100 scale where 100 is perfectly balanced
  const balanceScore = 100 - (totalDeviation / maxPossibleDeviation) * 100;
  
  return Math.round(balanceScore);
}
