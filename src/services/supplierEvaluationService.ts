
// Mock service for supplier evaluations - replace with actual implementation when supplier_evaluations table exists
export interface SupplierEvaluation {
  id: string;
  supplier_name: string;
  evaluation_date: string;
  evaluator: string;
  category: string;
  quality_score?: number;
  delivery_score?: number;
  price_score?: number;
  support_score?: number;
  total_score?: number;
  status: 'active' | 'inactive';
  comments?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for demonstration
const mockEvaluations: SupplierEvaluation[] = [
  {
    id: '1',
    supplier_name: 'Fornecedor ABC Ltda',
    evaluation_date: '2024-01-15',
    evaluator: 'João Silva',
    category: 'Matéria Prima',
    quality_score: 8,
    delivery_score: 9,
    price_score: 7,
    support_score: 8,
    total_score: 8,
    status: 'active',
    comments: 'Fornecedor confiável com boa qualidade',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    supplier_name: 'Tech Solutions Inc',
    evaluation_date: '2024-01-20',
    evaluator: 'Maria Santos',
    category: 'Serviços',
    quality_score: 9,
    delivery_score: 8,
    price_score: 6,
    support_score: 9,
    total_score: 8,
    status: 'active',
    comments: 'Excelente suporte técnico',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-20T09:00:00Z'
  }
];

export async function getSupplierEvaluations(): Promise<SupplierEvaluation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEvaluations;
}

export async function getSupplierEvaluationById(id: string): Promise<SupplierEvaluation> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const evaluation = mockEvaluations.find(e => e.id === id);
  if (!evaluation) {
    throw new Error('Supplier evaluation not found');
  }
  
  return evaluation;
}

export async function createSupplierEvaluation(evaluation: Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>): Promise<SupplierEvaluation> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newEvaluation: SupplierEvaluation = {
    ...evaluation,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockEvaluations.push(newEvaluation);
  return newEvaluation;
}

export async function updateSupplierEvaluation(id: string, evaluation: Partial<Omit<SupplierEvaluation, 'id' | 'created_at' | 'updated_at'>>): Promise<SupplierEvaluation> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockEvaluations.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Supplier evaluation not found');
  }
  
  mockEvaluations[index] = {
    ...mockEvaluations[index],
    ...evaluation,
    updated_at: new Date().toISOString()
  };
  
  return mockEvaluations[index];
}

export async function deleteSupplierEvaluation(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockEvaluations.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Supplier evaluation not found');
  }
  
  mockEvaluations.splice(index, 1);
}
