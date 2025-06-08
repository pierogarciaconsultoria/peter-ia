
// Mock service for satisfaction surveys - replace with actual implementation when customer_satisfaction_surveys table exists
export interface SatisfactionSurvey {
  id: string;
  title: string;
  customer_name: string;
  survey_date: string;
  status: 'draft' | 'sent' | 'completed';
  rating?: number;
  comments?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for demonstration
const mockSurveys: SatisfactionSurvey[] = [
  {
    id: '1',
    title: 'Pesquisa de Satisfação - Cliente A',
    customer_name: 'Empresa ABC Ltda',
    survey_date: '2024-01-15',
    status: 'completed',
    rating: 8,
    comments: 'Serviço de boa qualidade, entrega pontual',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T16:00:00Z'
  },
  {
    id: '2',
    title: 'Pesquisa de Satisfação - Cliente B',
    customer_name: 'Tech Solutions Inc',
    survey_date: '2024-01-20',
    status: 'sent',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-20T09:00:00Z'
  }
];

export async function getSatisfactionSurveys(): Promise<SatisfactionSurvey[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSurveys;
}

export async function getSatisfactionSurveyById(id: string): Promise<SatisfactionSurvey> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const survey = mockSurveys.find(s => s.id === id);
  if (!survey) {
    throw new Error('Satisfaction survey not found');
  }
  
  return survey;
}

export async function createSatisfactionSurvey(survey: Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>): Promise<SatisfactionSurvey> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newSurvey: SatisfactionSurvey = {
    ...survey,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockSurveys.push(newSurvey);
  return newSurvey;
}

export async function updateSatisfactionSurvey(id: string, survey: Partial<Omit<SatisfactionSurvey, 'id' | 'created_at' | 'updated_at'>>): Promise<SatisfactionSurvey> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockSurveys.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Satisfaction survey not found');
  }
  
  mockSurveys[index] = {
    ...mockSurveys[index],
    ...survey,
    updated_at: new Date().toISOString()
  };
  
  return mockSurveys[index];
}

export async function deleteSatisfactionSurvey(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockSurveys.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Satisfaction survey not found');
  }
  
  mockSurveys.splice(index, 1);
}
