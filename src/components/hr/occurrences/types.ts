
export type OccurrenceType = 
  | 'verbal_warning'
  | 'written_warning'
  | 'suspension'
  | 'termination'
  | 'observation';

export type TreatmentType = 
  | 'warning'
  | 'suspension'
  | 'termination'
  | 'no_action';

export interface OccurrenceFormValues {
  employeeId: string;
  occurrenceDate: string;
  registrationDate: string;
  type: OccurrenceType;
  description: string;
  attachment?: File;
  treatment: TreatmentType;
  treatmentDeadline: string;
  responsible: string;
}
