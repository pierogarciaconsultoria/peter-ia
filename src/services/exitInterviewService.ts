
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
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
    return result as ExitInterview;
  }

  // Buscar entrevistas por empresa
  static async getExitInterviews(companyId: string): Promise<ExitInterview[]> {
    const { data, error } = await supabase
      .from('hr_exit_interviews')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ExitInterview[];
  }

  // Buscar entrevista por token (acesso público): função do banco, sem leitura direta da tabela
  static async getExitInterviewByToken(token: string): Promise<ExitInterview | null> {
    const { data, error } = await supabase.rpc('get_exit_interview_by_token', { p_token: token });

    if (error) throw error;
    const rows = (data ?? []) as unknown as ExitInterview[];
    return rows[0] ?? null;
  }

  // Submeter respostas da entrevista: a função valida o token e só grava os campos do formulário
  static async submitExitInterview(token: string, formData: ExitInterviewFormData): Promise<void> {
    const { data, error } = await supabase.rpc('submit_exit_interview', {
      p_token: token,
      p_answers: formData as unknown as Json,
    });

    if (error) throw error;
    if (!data) throw new Error('Link de entrevista inválido ou expirado');
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
