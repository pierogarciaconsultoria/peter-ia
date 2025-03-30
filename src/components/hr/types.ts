// JobPosition type
export interface JobPosition {
  id: string;
  title: string;
  description?: string;
  code?: string;
  department?: string;
  revision?: string;
  is_supervisor?: boolean;
  status?: string;
  requirements?: string;
  responsibilities?: string;
  required_procedures?: string[];
}
