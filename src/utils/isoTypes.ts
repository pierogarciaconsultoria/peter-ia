export interface ISODocument {
  id: string;
  title: string;
  document_type: string;
  description?: string;
  content?: string;
  associated_requirement: string;
  status?: string;
  created_at: string;
  updated_at: string;
  document_code?: string;
  process?: string;
  standard_item?: string;
  revision?: string;
  approval_date?: string;
  responsible?: string;
  distribution_location?: string;
  storage_location?: string;
  protection?: string;
  recovery_method?: string;
  retention_time?: string;
  archiving_time?: string;
  disposal_method?: string;
  internal_external?: string;
}

export interface DocumentRevision {
  id: string;
  document_id: string;
  version: string;
  content: string;
  changes?: string;
  approved_by?: string;
  revision_date: string;
}

export interface ISORecord {
  id: string;
  document_id?: string;
  title: string;
  record_type: string;
  data?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateDocument {
  id: string;
  title: string;
  type: 'policy' | 'procedure' | 'work-instruction' | 'form' | 'record' | 'manual';
  description: string;
  requirementIds: string[];
  template?: string;
}

export interface RequirementDeadline {
  requirementId: string;
  targetDate: string;
  responsiblePerson: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'review' | 'completed' | 'overdue';
}
