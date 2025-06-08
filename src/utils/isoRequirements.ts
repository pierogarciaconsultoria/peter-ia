
export type RequirementStatus = 'not-started' | 'in-progress' | 'review' | 'completed';

export interface ISORequirement {
  id: string;
  number: string;
  title: string;
  description: string;
  status: RequirementStatus;
  progress: number;
  dueDate?: string;
  children?: ISORequirement[];
  recommendedActions?: string[];
  evidence?: string[];
}

export const isoRequirements: ISORequirement[] = [
  {
    id: '4.1',
    number: '4.1',
    title: 'Contexto da Organização',
    description: 'Compreensão da organização e de seu contexto',
    status: 'completed',
    progress: 100,
    dueDate: '2024-12-31',
    children: [
      {
        id: '4.1.1',
        number: '4.1.1',
        title: 'Questões internas e externas',
        description: 'Identificação de questões internas e externas relevantes',
        status: 'completed',
        progress: 100,
        recommendedActions: ['Realizar análise SWOT', 'Mapear stakeholders'],
        evidence: ['Relatório de análise', 'Documentação de contexto']
      }
    ]
  },
  {
    id: '4.2',
    number: '4.2',
    title: 'Partes Interessadas',
    description: 'Compreensão das necessidades e expectativas das partes interessadas',
    status: 'in-progress',
    progress: 75,
    dueDate: '2024-12-31',
    children: [
      {
        id: '4.2.1',
        number: '4.2.1',
        title: 'Identificação das partes interessadas',
        description: 'Mapeamento completo das partes interessadas',
        status: 'in-progress',
        progress: 80,
        recommendedActions: ['Atualizar matriz de stakeholders'],
        evidence: ['Matriz de stakeholders', 'Registros de comunicação']
      }
    ]
  },
  {
    id: '5.1',
    number: '5.1',
    title: 'Liderança e Comprometimento',
    description: 'Liderança e comprometimento da alta direção',
    status: 'in-progress',
    progress: 60,
    dueDate: '2024-12-31'
  },
  {
    id: '6.1',
    number: '6.1',
    title: 'Ações para Riscos e Oportunidades',
    description: 'Ações para abordar riscos e oportunidades',
    status: 'not-started',
    progress: 30,
    dueDate: '2024-12-31'
  },
  {
    id: '8.1',
    number: '8.1',
    title: 'Planejamento e Controle Operacional',
    description: 'Planejamento e controle operacional',
    status: 'in-progress',
    progress: 45,
    dueDate: '2024-12-31'
  }
];
