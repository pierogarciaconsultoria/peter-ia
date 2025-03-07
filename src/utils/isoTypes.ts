
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

// Add this interface to make it compatible with the existing code
export interface TemplateDocument {
  id: string;
  title: string;
  type: 'policy' | 'procedure' | 'work-instruction' | 'form' | 'record' | 'manual';
  description: string;
  requirementIds: string[];
  template?: string;
}
