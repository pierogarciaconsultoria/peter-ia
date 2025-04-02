
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

// Interface para representar um link de avaliação
export interface AssessmentLink {
  id: string;
  name: string;
  email: string;
  token: string;
  created_at: Date;
  expires_at: Date;
  used: boolean;
}

/**
 * Gera um link único para avaliação DISC externa
 */
export async function generateAssessmentLink(name: string, email: string): Promise<string> {
  // Gera um token único
  const token = uuidv4();
  
  // Na implementação real, salvaria no banco de dados
  // Por enquanto, simula um link com o token
  const baseUrl = window.location.origin;
  return `${baseUrl}/disc-assessment/${token}`;
  
  // Na implementação completa com banco de dados:
  /*
  try {
    const { data, error } = await supabase
      .from('disc_assessment_links')
      .insert([
        {
          name,
          email,
          token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
          used: false
        }
      ])
      .select();

    if (error) throw error;
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/disc-assessment/${token}`;
  } catch (error) {
    console.error("Erro ao gerar link de avaliação:", error);
    throw error;
  }
  */
}

/**
 * Verifica se um token de avaliação é válido
 */
export async function validateAssessmentToken(token: string): Promise<AssessmentLink | null> {
  // Na implementação real, verificaria o token no banco de dados
  // Por enquanto, simula sucesso para qualquer token
  return {
    id: "1",
    name: "Usuário Externo",
    email: "usuario@exemplo.com",
    token,
    created_at: new Date(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    used: false
  };
  
  // Na implementação completa:
  /*
  try {
    const { data, error } = await supabase
      .from('disc_assessment_links')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) return null;
    
    // Verifica se o link expirou ou já foi usado
    const now = new Date();
    if (new Date(data.expires_at) < now || data.used) {
      return null;
    }
    
    return data as AssessmentLink;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return null;
  }
  */
}

/**
 * Marca um token de avaliação como usado
 */
export async function markAssessmentTokenAsUsed(token: string): Promise<boolean> {
  // Na implementação real, marcaria o token como usado no banco de dados
  return true;
  
  // Na implementação completa:
  /*
  try {
    const { data, error } = await supabase
      .from('disc_assessment_links')
      .update({ used: true })
      .eq('token', token);

    if (error) return false;
    return true;
  } catch (error) {
    console.error("Erro ao marcar token como usado:", error);
    return false;
  }
  */
}
