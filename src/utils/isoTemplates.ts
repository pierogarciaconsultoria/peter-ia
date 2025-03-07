export interface ISODocument {
  id: string;
  title: string;
  type: 'policy' | 'procedure' | 'work-instruction' | 'form' | 'record' | 'manual';
  description: string;
  requirementIds: string[]; // IDs dos requisitos relacionados
  template?: string; // Conteúdo do modelo ou link para download
}

export interface ISOTask {
  id: string;
  title: string;
  description: string;
  requirementIds: string[]; // IDs dos requisitos relacionados
  status: 'not-started' | 'in-progress' | 'review' | 'completed';
  responsible?: string;
  dueDate?: string;
}

// Documentos padrão necessários para ISO 9001:2015
export const standardDocuments: ISODocument[] = [
  {
    id: 'doc-001',
    title: 'Manual da Qualidade',
    type: 'manual',
    description: 'Documento principal que descreve o Sistema de Gestão da Qualidade da organização, incluindo escopo, política da qualidade e estrutura organizacional.',
    requirementIds: ['4.3', '4.4'],
    template: 'Modelo de Manual da Qualidade conforme ISO 9001:2015'
  },
  {
    id: 'doc-002',
    title: 'Política da Qualidade',
    type: 'policy',
    description: 'Documento que estabelece o compromisso da alta direção com a qualidade e fornece uma estrutura para definir objetivos da qualidade.',
    requirementIds: ['5.2'],
    template: 'Modelo de Política da Qualidade conforme ISO 9001:2015'
  },
  {
    id: 'doc-003',
    title: 'Procedimento de Controle de Documentos e Registros',
    type: 'procedure',
    description: 'Define como os documentos e registros do SGQ são criados, revisados, aprovados, distribuídos e mantidos.',
    requirementIds: ['7.5'],
    template: 'Modelo de Procedimento de Controle de Documentos e Registros'
  },
  {
    id: 'doc-004',
    title: 'Procedimento de Auditoria Interna',
    type: 'procedure',
    description: 'Define como as auditorias internas são planejadas, executadas e relatadas para avaliar a conformidade e eficácia do SGQ.',
    requirementIds: ['9.2'],
    template: 'Modelo de Procedimento de Auditoria Interna'
  },
  {
    id: 'doc-005',
    title: 'Procedimento de Ação Corretiva',
    type: 'procedure',
    description: 'Define como as não conformidades são identificadas, analisadas e tratadas para eliminar suas causas.',
    requirementIds: ['10.2'],
    template: 'Modelo de Procedimento de Ação Corretiva'
  },
  {
    id: 'doc-006',
    title: 'Procedimento de Gestão de Riscos e Oportunidades',
    type: 'procedure',
    description: 'Define como os riscos e oportunidades são identificados, analisados e tratados no contexto do SGQ.',
    requirementIds: ['6.1'],
    template: 'Modelo de Procedimento de Gestão de Riscos e Oportunidades'
  },
  {
    id: 'doc-007',
    title: 'Procedimento de Análise Crítica pela Direção',
    type: 'procedure',
    description: 'Define como a alta direção avalia periodicamente o SGQ para garantir sua adequação, eficácia e alinhamento com a estratégia da organização.',
    requirementIds: ['9.3'],
    template: 'Modelo de Procedimento de Análise Crítica pela Direção'
  },
  {
    id: 'doc-008',
    title: 'Formulário de Não Conformidade e Ação Corretiva',
    type: 'form',
    description: 'Formulário para registro de não conformidades identificadas e ações corretivas implementadas.',
    requirementIds: ['10.2'],
    template: 'Modelo de Formulário de Não Conformidade e Ação Corretiva'
  },
  {
    id: 'doc-009',
    title: 'Matriz de Competências',
    type: 'record',
    description: 'Documento que mapeia as competências necessárias para cada função e registra as qualificações dos colaboradores.',
    requirementIds: ['7.2'],
    template: 'Modelo de Matriz de Competências'
  },
  {
    id: 'doc-010',
    title: 'Procedimento de Compras e Avaliação de Fornecedores',
    type: 'procedure',
    description: 'Define como os fornecedores são selecionados, avaliados e monitorados, e como os produtos/serviços são adquiridos.',
    requirementIds: ['8.4'],
    template: 'Modelo de Procedimento de Compras e Avaliação de Fornecedores'
  },
  {
    id: 'doc-011',
    title: 'Plano de Calibração de Equipamentos',
    type: 'record',
    description: 'Documento que identifica os equipamentos de medição que requerem calibração e define a frequência e os critérios de calibração.',
    requirementIds: ['7.1.5'],
    template: 'Modelo de Plano de Calibração de Equipamentos'
  },
  {
    id: 'doc-012',
    title: 'Formulário de Análise de Contexto e Partes Interessadas',
    type: 'form',
    description: 'Formulário para documentar o contexto da organização e as necessidades e expectativas das partes interessadas.',
    requirementIds: ['4.1', '4.2'],
    template: 'Modelo de Formulário de Análise de Contexto e Partes Interessadas'
  },
  {
    id: 'doc-013',
    title: 'Plano de Objetivos da Qualidade',
    type: 'record',
    description: 'Documento que estabelece os objetivos mensuráveis da qualidade alinhados à política da qualidade.',
    requirementIds: ['6.2'],
    template: 'Modelo de Plano de Objetivos da Qualidade'
  },
  {
    id: 'doc-014',
    title: 'Procedimento de Controle de Produto Não Conforme',
    type: 'procedure',
    description: 'Define como os produtos/serviços não conformes são identificados, segregados e tratados para prevenir seu uso não intencional.',
    requirementIds: ['8.7'],
    template: 'Modelo de Procedimento de Controle de Produto Não Conforme'
  },
  {
    id: 'doc-015',
    title: 'Procedimento de Desenvolvimento de Produtos/Serviços',
    type: 'procedure',
    description: 'Define as etapas para o planejamento, design, desenvolvimento, verificação e validação de novos produtos/serviços.',
    requirementIds: ['8.3'],
    template: 'Modelo de Procedimento de Desenvolvimento de Produtos/Serviços'
  }
];

// Tarefas padrão para implementação da ISO 9001:2015
export const standardTasks: ISOTask[] = [
  {
    id: 'task-001',
    title: 'Análise de Contexto Organizacional',
    description: 'Identificar e documentar questões internas e externas relevantes para o propósito da organização e que afetam sua capacidade de atingir os resultados pretendidos do SGQ.',
    requirementIds: ['4.1'],
    status: 'not-started'
  },
  {
    id: 'task-002',
    title: 'Identificação das Partes Interessadas',
    description: 'Identificar as partes interessadas relevantes para o SGQ e seus requisitos pertinentes.',
    requirementIds: ['4.2'],
    status: 'not-started'
  },
  {
    id: 'task-003',
    title: 'Definição do Escopo do SGQ',
    description: 'Determinar os limites e a aplicabilidade do SGQ para estabelecer seu escopo, considerando o contexto da organização.',
    requirementIds: ['4.3'],
    status: 'not-started'
  },
  {
    id: 'task-004',
    title: 'Mapeamento de Processos',
    description: 'Identificar, mapear e documentar os processos necessários para o SGQ, suas interações, entradas e saídas.',
    requirementIds: ['4.4'],
    status: 'not-started'
  },
  {
    id: 'task-005',
    title: 'Desenvolvimento da Política da Qualidade',
    description: 'Elaborar a política da qualidade apropriada ao propósito e contexto da organização, que forneça uma estrutura para os objetivos da qualidade.',
    requirementIds: ['5.2'],
    status: 'not-started'
  },
  {
    id: 'task-006',
    title: 'Definição de Papéis e Responsabilidades',
    description: 'Definir e comunicar responsabilidades e autoridades para funções relevantes na organização.',
    requirementIds: ['5.3'],
    status: 'not-started'
  },
  {
    id: 'task-007',
    title: 'Identificação e Avaliação de Riscos e Oportunidades',
    description: 'Identificar riscos e oportunidades relacionados ao contexto, partes interessadas e processos, e planejar ações para abordá-los.',
    requirementIds: ['6.1'],
    status: 'not-started'
  },
  {
    id: 'task-008',
    title: 'Estabelecimento de Objetivos da Qualidade',
    description: 'Definir objetivos da qualidade mensuráveis, consistentes com a política da qualidade, e planejar como alcançá-los.',
    requirementIds: ['6.2'],
    status: 'not-started'
  },
  {
    id: 'task-009',
    title: 'Planejamento de Recursos',
    description: 'Determinar e prover os recursos necessários para estabelecimento, implementação, manutenção e melhoria contínua do SGQ.',
    requirementIds: ['7.1'],
    status: 'not-started'
  },
  {
    id: 'task-010',
    title: 'Desenvolvimento da Matriz de Competências',
    description: 'Determinar as competências necessárias para cada função e assegurar que as pessoas sejam competentes com base em educação, treinamento ou experiência.',
    requirementIds: ['7.2'],
    status: 'not-started'
  },
  {
    id: 'task-011',
    title: 'Implementação do Processo de Conscientização',
    description: 'Assegurar que as pessoas estejam conscientes da política da qualidade, objetivos, sua contribuição para o SGQ e implicações de não conformidades.',
    requirementIds: ['7.3'],
    status: 'not-started'
  },
  {
    id: 'task-012',
    title: 'Estabelecimento de Processos de Comunicação',
    description: 'Determinar as comunicações internas e externas pertinentes ao SGQ, incluindo o que, quando, com quem, como e quem comunica.',
    requirementIds: ['7.4'],
    status: 'not-started'
  },
  {
    id: 'task-013',
    title: 'Implementação de Controle de Documentos e Registros',
    description: 'Desenvolver e implementar processos para criação, atualização e controle de informação documentada requerida pelo SGQ e pela norma.',
    requirementIds: ['7.5'],
    status: 'not-started'
  },
  {
    id: 'task-014',
    title: 'Planejamento e Controle Operacional',
    description: 'Planejar, implementar e controlar os processos necessários para atender aos requisitos para fornecimento de produtos e serviços.',
    requirementIds: ['8.1'],
    status: 'not-started'
  },
  {
    id: 'task-015',
    title: 'Determinação de Requisitos para Produtos e Serviços',
    description: 'Estabelecer processos para comunicação com clientes e determinação de requisitos para produtos e serviços.',
    requirementIds: ['8.2'],
    status: 'not-started'
  },
  {
    id: 'task-016',
    title: 'Implementação do Processo de Design e Desenvolvimento',
    description: 'Estabelecer, implementar e manter um processo de design e desenvolvimento apropriado para assegurar o subsequente fornecimento de produtos e serviços.',
    requirementIds: ['8.3'],
    status: 'not-started'
  },
  {
    id: 'task-017',
    title: 'Controle de Processos, Produtos e Serviços Providos Externamente',
    description: 'Assegurar que processos, produtos e serviços providos externamente estejam conformes com os requisitos e definir controles a serem aplicados.',
    requirementIds: ['8.4'],
    status: 'not-started'
  },
  {
    id: 'task-018',
    title: 'Implementação de Controles de Produção e Fornecimento de Serviço',
    description: 'Implementar a produção e fornecimento de serviço sob condições controladas, incluindo disponibilidade de informações, recursos, atividades de monitoramento, etc.',
    requirementIds: ['8.5'],
    status: 'not-started'
  },
  {
    id: 'task-019',
    title: 'Estabelecimento de Processo de Liberação de Produtos e Serviços',
    description: 'Implementar arranjos planejados para verificar que os requisitos de produtos e serviços tenham sido atendidos antes da liberação.',
    requirementIds: ['8.6'],
    status: 'not-started'
  },
  {
    id: 'task-020',
    title: 'Implementação de Controle de Saídas Não Conformes',
    description: 'Assegurar que saídas não conformes com seus requisitos sejam identificadas e controladas para prevenir seu uso ou entrega não intencional.',
    requirementIds: ['8.7'],
    status: 'not-started'
  },
  {
    id: 'task-021',
    title: 'Implementação de Monitoramento, Medição, Análise e Avaliação',
    description: 'Determinar o que precisa ser monitorado e medido, métodos, quando deve ser realizado e quando os resultados devem ser analisados e avaliados.',
    requirementIds: ['9.1'],
    status: 'not-started'
  },
  {
    id: 'task-022',
    title: 'Implementação do Processo de Auditoria Interna',
    description: 'Conduzir auditorias internas em intervalos planejados para fornecer informações sobre se o SGQ está conforme e eficazmente implementado e mantido.',
    requirementIds: ['9.2'],
    status: 'not-started'
  },
  {
    id: 'task-023',
    title: 'Realização da Análise Crítica pela Direção',
    description: 'Realizar análises críticas do SGQ pela alta direção em intervalos planejados para assegurar sua contínua adequação, suficiência, eficácia e alinhamento com a direção estratégica.',
    requirementIds: ['9.3'],
    status: 'not-started'
  },
  {
    id: 'task-024',
    title: 'Identificação de Oportunidades de Melhoria',
    description: 'Identificar e selecionar oportunidades de melhoria e implementar ações necessárias para atender aos requisitos dos clientes e aumentar a satisfação do cliente.',
    requirementIds: ['10.1'],
    status: 'not-started'
  },
  {
    id: 'task-025',
    title: 'Implementação do Processo de Não Conformidade e Ação Corretiva',
    description: 'Quando ocorrer uma não conformidade, reagir à mesma, avaliar a necessidade de ações para eliminar as causas e implementar as ações necessárias.',
    requirementIds: ['10.2'],
    status: 'not-started'
  },
  {
    id: 'task-026',
    title: 'Promoção da Melhoria Contínua',
    description: 'Melhorar continuamente a adequação, suficiência e eficácia do SGQ, considerando resultados de análises, saídas da análise crítica pela direção e oportunidades identificadas.',
    requirementIds: ['10.3'],
    status: 'not-started'
  }
];

// Função auxiliar para buscar documentos e tarefas por requisito
export const getDocumentsForRequirement = (requirementId: string): ISODocument[] => {
  return standardDocuments.filter(doc => 
    doc.requirementIds.includes(requirementId)
  );
};

export const getTasksForRequirement = (requirementId: string): ISOTask[] => {
  return standardTasks.filter(task => 
    task.requirementIds.includes(requirementId)
  );
};

// Function to get template content based on requirement number
export const getTemplateContentForRequirement = (requirementNumber: string): string => {
  const fields = getFieldsForRequirement(requirementNumber);
  
  // Generate a basic template with the fields
  let template = `FORMULÁRIO: ${getRequirementTitle(requirementNumber)}
ISO 9001:2015 - Requisito ${requirementNumber}

INFORMAÇÕES GERAIS:
-------------------
Data de elaboração: ____/____/________
Elaborado por: ______________________________
Revisão: __________
Aprovado por: ______________________________

CAMPOS DO FORMULÁRIO:
--------------------
`;

  // Add fields to the template
  fields.forEach((field, index) => {
    template += `
${index + 1}. ${field}
_______________________________________________________________
_______________________________________________________________
`;
  });

  // Add footer
  template += `
NOTAS ADICIONAIS:
----------------
_______________________________________________________________
_______________________________________________________________

Assinatura Responsável: ______________________________

Data: ____/____/________
`;

  return template;
}

// Helper function to get requirement title
const getRequirementTitle = (requirementNumber: string): string => {
  switch(requirementNumber) {
    case "4.1": return "Contexto da Organização";
    case "4.2": return "Partes Interessadas";
    case "4.3": return "Escopo do SGQ";
    case "4.4": return "Sistema de Gestão da Qualidade";
    case "5.1": return "Liderança e Comprometimento";
    case "5.2": return "Política da Qualidade";
    case "5.3": return "Papéis e Responsabilidades";
    case "6.1": return "Riscos e Oportunidades";
    case "6.2": return "Objetivos da Qualidade";
    case "6.3": return "Planejamento de Mudanças";
    case "7.1": return "Recursos";
    case "7.2": return "Competência";
    case "7.3": return "Conscientização";
    case "7.4": return "Comunicação";
    case "7.5": return "Informação Documentada";
    case "8.1": return "Planejamento e Controle Operacional";
    case "8.2": return "Requisitos para Produtos e Serviços";
    case "8.3": return "Design e Desenvolvimento";
    case "8.4": return "Controle de Processos Externos";
    case "8.5": return "Produção e Fornecimento de Serviço";
    case "8.6": return "Liberação de Produtos e Serviços";
    case "8.7": return "Controle de Saídas Não Conformes";
    case "9.1": return "Monitoramento e Medição";
    case "9.2": return "Auditoria Interna";
    case "9.3": return "Análise Crítica pela Direção";
    case "10.1": return "Melhoria";
    case "10.2": return "Não Conformidade e Ação Corretiva";
    case "10.3": return "Melhoria Contínua";
    default: return "Requisito ISO 9001";
  }
}
