
export interface ISORequirement {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  dueDate?: string;
  children?: ISORequirement[];
}

export const isoRequirements: ISORequirement[] = [
  {
    id: '4.1',
    title: 'Contexto da Organização',
    description: 'Compreensão da organização e de seu contexto',
    status: 'completed',
    progress: 100,
    dueDate: '2024-12-31'
  },
  {
    id: '4.2',
    title: 'Partes Interessadas',
    description: 'Compreensão das necessidades e expectativas das partes interessadas',
    status: 'in-progress',
    progress: 75,
    dueDate: '2024-12-31'
  },
  {
    id: '5.1',
    title: 'Liderança e Comprometimento',
    description: 'Liderança e comprometimento da alta direção',
    status: 'in-progress',
    progress: 60,
    dueDate: '2024-12-31'
  },
  {
    id: '6.1',
    title: 'Ações para Riscos e Oportunidades',
    description: 'Ações para abordar riscos e oportunidades',
    status: 'pending',
    progress: 30,
    dueDate: '2024-12-31'
  },
  {
    id: '8.1',
    title: 'Planejamento e Controle Operacional',
    description: 'Planejamento e controle operacional',
    status: 'in-progress',
    progress: 45,
    dueDate: '2024-12-31'
  }
];
