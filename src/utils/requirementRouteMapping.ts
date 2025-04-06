
/**
 * Maps ISO 9001:2015 requirements to their corresponding application routes
 */
export const requirementToRouteMap: Record<string, {
  route: string;
  title: string;
  description: string;
}> = {
  "4.1": {
    route: "/organization-context",
    title: "Contexto da Organização",
    description: "Entenda e defina o contexto interno e externo da sua organização"
  },
  "4.2": {
    route: "/organization-context",
    title: "Partes Interessadas",
    description: "Identifique e gerencie as necessidades das partes interessadas"
  },
  "4.3": {
    route: "/strategic-planning",
    title: "Planejamento Estratégico",
    description: "Defina o escopo do seu sistema de gestão da qualidade"
  },
  "4.4": {
    route: "/processo",
    title: "Processos",
    description: "Mapeie e gerencie os processos do seu sistema de gestão"
  },
  "5.1": {
    route: "/critical-analysis",
    title: "Análise Crítica",
    description: "Demonstre liderança e comprometimento da alta direção"
  },
  "5.2": {
    route: "/strategic-planning",
    title: "Política e Objetivos",
    description: "Estabeleça a política da qualidade e objetivos estratégicos"
  },
  "5.3": {
    route: "/human-resources",
    title: "Funções e Responsabilidades",
    description: "Atribua e comunique responsabilidades dentro da organização"
  },
  "6.1": {
    route: "/risk-management",
    title: "Gestão de Riscos",
    description: "Identifique e gerencie riscos e oportunidades"
  },
  "6.2": {
    route: "/performance-indicators",
    title: "Indicadores de Desempenho",
    description: "Estabeleça objetivos da qualidade mensuráveis"
  },
  "6.3": {
    route: "/action-schedule",
    title: "Plano de Ação",
    description: "Planeje e implemente mudanças de forma controlada"
  },
  "7.1": {
    route: "/human-resources",
    title: "Recursos",
    description: "Determine e forneça recursos necessários para o SGQ"
  },
  "7.2": {
    route: "/human-resources",
    title: "Competência",
    description: "Garanta a competência das pessoas que afetam o desempenho"
  },
  "7.5": {
    route: "/documents",
    title: "Informação Documentada",
    description: "Controle documentos e registros do sistema de gestão"
  },
  "8.2": {
    route: "/customer-complaints",
    title: "Reclamações de Clientes",
    description: "Determine e revise requisitos para produtos e serviços"
  },
  "8.4": {
    route: "/supplier-evaluation",
    title: "Avaliação de Fornecedores",
    description: "Controle processos, produtos e serviços providos externamente"
  },
  "8.5": {
    route: "/quality-control",
    title: "Controle de Qualidade",
    description: "Controle a produção e a provisão de serviços"
  },
  "8.7": {
    route: "/non-conforming-products",
    title: "Produtos Não Conformes",
    description: "Controle saídas não conformes para prevenir uso não intencional"
  },
  "9.1": {
    route: "/performance-indicators",
    title: "Indicadores",
    description: "Monitore, meça, analise e avalie o desempenho"
  },
  "9.2": {
    route: "/audit-schedule",
    title: "Auditorias",
    description: "Planeje e execute auditorias internas para avaliar o SGQ"
  },
  "9.3": {
    route: "/critical-analysis",
    title: "Análise Crítica",
    description: "Realize análises críticas periódicas do sistema de gestão"
  },
  "10.2": {
    route: "/non-compliance",
    title: "Não Conformidades",
    description: "Trate não conformidades e implemente ações corretivas"
  },
  "10.3": {
    route: "/action-schedule",
    title: "Melhoria Contínua",
    description: "Implemente ações para melhorar continuamente o SGQ"
  },
};
