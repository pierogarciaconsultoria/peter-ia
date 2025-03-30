
import { supabase } from "@/integrations/supabase/client";

// Tipo para documentos do colaborador
export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: string;
  documentUrl?: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  requiredFiles: string[];
  externalAccessToken: string;
  sentAt?: Date;
  submittedAt?: Date;
}

// Função para gerar token de acesso para link externo
export const generateExternalAccessToken = async (employeeId: string): Promise<string> => {
  // Em produção, usaríamos um algoritmo mais robusto
  const token = Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15) + 
    Date.now().toString(36);
  
  // Em um cenário real, salvaríamos este token no banco de dados
  console.log(`Token gerado para funcionário ${employeeId}: ${token}`);
  
  return token;
};

// Função para enviar link para o colaborador
export const sendDocumentRequestLink = async (
  employeeId: string, 
  name: string,
  contactType: 'email' | 'whatsapp', 
  contactValue: string
): Promise<boolean> => {
  try {
    const token = await generateExternalAccessToken(employeeId);
    
    // Link para o formulário externo
    const documentLink = `${window.location.origin}/document-upload/${token}`;
    
    // Em um ambiente real, utilizaríamos uma API para enviar e-mail ou mensagem WhatsApp
    // Aqui, vamos simular o envio
    if (contactType === 'email') {
      console.log(`E-mail enviado para ${name} (${contactValue})`);
      console.log(`Assunto: Solicitação de documentos para admissão`);
      console.log(`Corpo: Olá ${name}, por favor envie seus documentos através do link: ${documentLink}`);
    } else {
      console.log(`WhatsApp enviado para ${name} (${contactValue})`);
      console.log(`Mensagem: Olá ${name}, por favor envie seus documentos através do link: ${documentLink}`);
    }
    
    // Salvaria um registro desta solicitação no banco
    console.log(`Solicitação de documentos registrada para: ${employeeId}`);
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar solicitação de documentos:", error);
    return false;
  }
};

// Função para verificar status do envio de documentos
export const checkDocumentRequestStatus = async (employeeId: string): Promise<{
  sent: boolean,
  sentAt?: Date,
  contactType?: 'email' | 'whatsapp',
  contactValue?: string
}> => {
  // Em um cenário real, buscaríamos estas informações do banco de dados
  // Aqui, retornamos dados simulados
  return {
    sent: true,
    sentAt: new Date(),
    contactType: 'email',
    contactValue: 'funcionario@empresa.com'
  };
};
