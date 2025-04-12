
export interface Supplier {
  id: string;
  name: string;
  category: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  lastEvaluationDate?: string;
}

export interface Evaluation {
  id: string;
  supplierId: string;
  evaluationDate: string;
  score: number;
  criteria: EvaluationCriteria[];
  comments?: string;
  evaluator: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  score: number;
  weight: number;
  comments?: string;
}

export interface NonConformity {
  id: string;
  supplierId: string;
  date: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'closed';
  actionTaken?: string;
  closedDate?: string;
}
