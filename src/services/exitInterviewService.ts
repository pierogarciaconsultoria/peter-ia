
import { supabase } from "@/integrations/supabase/client";
import { ExitInterview, CreateExitInterviewData, ExitInterviewFormData } from "@/types/exitInterviews";

export class ExitInterviewService {
  // Criar nova entrevista de desligamento
  static async createExitInterview(data: CreateExitInterviewData): Promise<ExitInterview> {
    const { data: result, error } = await supabase
      .from('hr_exit_interviews')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Buscar entrevistas por empresa
  static async getExitInterviews(companyId: string): Promise<ExitInterview[]> {
    const { data, error } = await supabase
      .from('hr_exit_interviews')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Buscar entrevista por token (acesso público)
  static async getExitInterviewByToken(token: string): Promise<ExitInterview | null> {
    const { data, error } = await supabase
      .from('hr_exit_interviews')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Submeter respostas da entrevista
  static async submitExitInterview(token: string, formData: ExitInterviewFormData): Promise<void> {
    const { error } = await supabase
      .from('hr_exit_interviews')
      .update({
        ...formData,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('token', token);

    if (error) throw error;
  }

  // Atualizar status para "enviado"
  static async markAsSent(id: string, whatsappMessageId?: string): Promise<void> {
    const { error } = await supabase
      .from('hr_exit_interviews')
      .update({
        status: 'sent',
        whatsapp_sent_at: new Date().toISOString(),
        whatsapp_message_id: whatsappMessageId
      })
      .eq('id', id);

    if (error) throw error;
  }

  // Deletar entrevista
  static async deleteExitInterview(id: string): Promise<void> {
    const { error } = await supabase
      .from('hr_exit_interviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Gerar link da entrevista
  static generateInterviewLink(token: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/exit-interview/${token}`;
  }
}
