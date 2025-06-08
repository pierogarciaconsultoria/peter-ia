
export interface ISORequirement {
  id: string;
  number: string;
  title: string;
  description: string;
  route: string;
}

export const requirementToRouteMap: Record<string, ISORequirement> = {
  '4.1': {
    id: '4.1',
    number: '4.1',
    title: 'Contexto da Organização',
    description: 'Compreensão da organização e de seu contexto',
    route: '/organization-context'
  },
  '4.2': {
    id: '4.2',
    number: '4.2',
    title: 'Partes Interessadas',
    description: 'Compreensão das necessidades e expectativas das partes interessadas',
    route: '/organization-context'
  },
  '4.3': {
    id: '4.3',
    number: '4.3',
    title: 'Escopo do SGQ',
    description: 'Determinação do escopo do sistema de gestão da qualidade',
    route: '/strategic-planning'
  },
  '4.4': {
    id: '4.4',
    number: '4.4',
    title: 'Sistema de Gestão da Qualidade',
    description: 'Sistema de gestão da qualidade e seus processos',
    route: '/processo'
  },
  '5.1': {
    id: '5.1',
    number: '5.1',
    title: 'Liderança e Comprometimento',
    description: 'Liderança e comprometimento da alta direção',
    route: '/critical-analysis'
  },
  '5.2': {
    id: '5.2',
    number: '5.2',
    title: 'Política da Qualidade',
    description: 'Estabelecimento da política da qualidade',
    route: '/strategic-planning'
  },
  '5.3': {
    id: '5.3',
    number: '5.3',
    title: 'Papéis e Responsabilidades',
    description: 'Papéis, responsabilidades e autoridades organizacionais',
    route: '/human-resources'
  },
  '6.1': {
    id: '6.1',
    number: '6.1',
    title: 'Ações para Riscos e Oportunidades',
    description: 'Ações para abordar riscos e oportunidades',
    route: '/risk-management'
  },
  '6.2': {
    id: '6.2',
    number: '6.2',
    title: 'Objetivos da Qualidade',
    description: 'Objetivos da qualidade e planejamento para alcançá-los',
    route: '/performance-indicators'
  },
  '6.3': {
    id: '6.3',
    number: '6.3',
    title: 'Planejamento de Mudanças',
    description: 'Planejamento de mudanças',
    route: '/action-schedule'
  },
  '7.1': {
    id: '7.1',
    number: '7.1',
    title: 'Recursos',
    description: 'Provisão de recursos',
    route: '/human-resources'
  },
  '7.2': {
    id: '7.2',
    number: '7.2',
    title: 'Competência',
    description: 'Competência das pessoas',
    route: '/human-resources'
  },
  '7.5': {
    id: '7.5',
    number: '7.5',
    title: 'Informação Documentada',
    description: 'Informação documentada',
    route: '/documents'
  },
  '8.2': {
    id: '8.2',
    number: '8.2',
    title: 'Comunicação com o Cliente',
    description: 'Comunicação com o cliente',
    route: '/customer-complaints'
  },
  '8.4': {
    id: '8.4',
    number: '8.4',
    title: 'Controle de Processos Externos',
    description: 'Controle de processos, produtos e serviços providos externamente',
    route: '/supplier-evaluation'
  },
  '8.5': {
    id: '8.5',
    number: '8.5',
    title: 'Produção e Provisão de Serviços',
    description: 'Produção e provisão de serviços',
    route: '/quality-control'
  },
  '8.7': {
    id: '8.7',
    number: '8.7',
    title: 'Controle de Saídas Não Conformes',
    description: 'Controle de saídas não conformes',
    route: '/non-conforming-products'
  },
  '9.1': {
    id: '9.1',
    number: '9.1',
    title: 'Monitoramento e Medição',
    description: 'Monitoramento, medição, análise e avaliação',
    route: '/performance-indicators'
  },
  '9.2': {
    id: '9.2',
    number: '9.2',
    title: 'Auditoria Interna',
    description: 'Auditoria interna',
    route: '/audit-schedule'
  },
  '9.3': {
    id: '9.3',
    number: '9.3',
    title: 'Análise Crítica pela Direção',
    description: 'Análise crítica pela direção',
    route: '/critical-analysis'
  },
  '10.2': {
    id: '10.2',
    number: '10.2',
    title: 'Não Conformidade e Ação Corretiva',
    description: 'Não conformidade e ação corretiva',
    route: '/non-compliance'
  },
  '10.3': {
    id: '10.3',
    number: '10.3',
    title: 'Melhoria Contínua',
    description: 'Melhoria contínua',
    route: '/action-schedule'
  }
};
