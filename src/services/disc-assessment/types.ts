
/**
 * Types for DISC assessment functionality
 */
export type DiscType = 'D' | 'I' | 'S' | 'C';

export interface DiscScore {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DiscAssessment {
  id: string;
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: DiscType;
  invited_by?: string | null;
  date: string;
}

export interface CreateDiscAssessmentParams {
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: DiscType;
  invited_by?: string;
}

export interface AssessmentLink {
  id: string;
  name: string;
  email: string;
  token: string;
  created_at: Date;
  expires_at: Date;
  used: boolean;
}

/**
 * Interface for local assessment storage
 */
export interface LocalStorageAssessments {
  discAssessments: DiscAssessment[];
}
