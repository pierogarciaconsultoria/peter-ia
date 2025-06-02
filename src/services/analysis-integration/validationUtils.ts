
// Type guard to validate calculation_type
export function isValidCalculationType(value: string): value is "sum" | "average" {
  return value === "sum" || value === "average";
}
