
/**
 * Generates a random code with a prefix and 6 digits
 * @param prefix The prefix to use for the code (e.g., "RC" for "Reclamação Cliente")
 * @returns A string in the format "PREFIX-XXXXXX" where X is a random digit
 */
export function generateRandomCode(prefix: string): string {
  // Generate a random 6-digit number
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  // Return formatted code
  return `${prefix}-${randomDigits}`;
}
