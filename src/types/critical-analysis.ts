
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  category: "input" | "output"; // Categoria do anexo: requisito de entrada ou resultado
}

export interface CriticalAnalysisItem {
  id: string;
  date: Date;
  subject: string;
  status: "planned" | "in-progress" | "completed";
  participants: string[];
  documents: string[];
  
  // Requisitos para entrada da análise crítica
  previousActionsStatus: string;
  externalInternalChanges: string;
  performanceInfo: string;
  resourceSufficiency: string;
  riskActionsEffectiveness: string;
  improvementOpportunities: string;
  
  // Resultados da análise crítica
  improvementResults: string;
  systemChangeNeeds: string;
  resourceNeeds: string;
  
  // Campo geral de resultados (manter para compatibilidade)
  results: string;
  
  // Nova propriedade para anexos
  attachments: Attachment[];
  
  // Conteúdo gerado por IA
  aiGeneratedContent?: string;
}
