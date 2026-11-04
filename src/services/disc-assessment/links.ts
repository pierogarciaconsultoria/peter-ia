
import { supabase } from "@/integrations/supabase/client";

/**
 * Validates a DISC assessment link by its token
 * @param token The token to validate
 * @returns True if the link is valid, false otherwise
 */
export interface DiscLinkPublic {
  name: string;
  email: string;
  expires_at: string;
  entity_type: string;
}

/**
 * Valida um link de avaliação DISC pelo token.
 * Usa uma função do banco: o anon não lê a tabela de links.
 * @returns Dados do convite, ou null se o link for inválido, usado ou expirado
 */
export const validateAssessmentLink = async (token: string): Promise<DiscLinkPublic | null> => {
  try {
    const { data, error } = await supabase.rpc("get_disc_link_by_token", { p_token: token });

    if (error) {
      console.error("Error validating assessment link:", error);
      return null;
    }
    const rows = (data ?? []) as DiscLinkPublic[];
    return rows[0] ?? null;
  } catch (error) {
    console.error("Error in validateAssessmentLink:", error);
    return null;
  }
};

/**
 * Grava o resultado da avaliação DISC na empresa do convite e consome o link.
 * @returns id da avaliação criada
 */
export const submitDiscAssessment = async (
  token: string,
  scores: Record<string, number>,
  primaryType: string
): Promise<string> => {
  const { data, error } = await supabase.rpc("submit_disc_assessment", {
    p_token: token,
    p_scores: scores,
    p_primary_type: primaryType,
  });

  if (error) throw error;
  return data as string;
};

/**
 * Marca um link como usado (uso interno, por usuário logado).
 */
export const markAssessmentLinkAsUsed = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("disc_evaluation_links")
      .update({ is_used: true })
      .eq("token", token);

    if (error) {
      console.error("Error marking assessment link as used:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in markAssessmentLinkAsUsed:", error);
    return false;
  }
};

/**
 * Generates an external assessment link
 * @param name The name of the recipient
 * @param email The email of the recipient
 * @returns The generated link
 */
export async function generateAssessmentLink(name: string, email: string): Promise<string> {
  // Generate a unique token
  const token = crypto.randomUUID();
  
  // In a real implementation, would save to the database
  // For now, simulate a link with the token
  const baseUrl = window.location.origin;
  return `${baseUrl}/disc-assessment/${token}`;
}
