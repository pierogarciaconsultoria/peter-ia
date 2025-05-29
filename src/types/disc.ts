
export interface DiscScore {
  d: number;
  i: number;
  s: number;
  c: number;
}

export interface DiscAssessment {
  id: string;
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: string;
  date: string;
  invited_by?: string;
  created_at: string;
}

export interface CreateDiscAssessmentParams {
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: string;
  invited_by?: string | null;
}
