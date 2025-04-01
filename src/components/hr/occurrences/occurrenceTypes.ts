
import { Occurrence } from "@/services/occurrenceService";

export interface OccurrenceFormValues {
  employee_id: string;
  type: 'warning' | 'disciplinary' | 'observation';
  title: string;
  description: string;
  date: Date;
  reported_by: string;
}

export type OccurrenceFormSubmitHandler = (values: OccurrenceFormValues) => Promise<void>;
