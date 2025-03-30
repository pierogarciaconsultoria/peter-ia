
import { JobPosition } from "../types";

export interface PersonnelRequest {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id?: string;
  position_details?: JobPosition;
  requestDate: string;
  status: string;
  requester: string;
  employeeName?: string;
  hireDate?: string;
  currentPosition?: string;
  proposedPosition?: string;
  currentSchedule?: {
    start1?: string;
    end1?: string;
    start2?: string;
    end2?: string;
  };
  proposedSchedule?: {
    start1?: string;
    end1?: string;
    start2?: string;
    end2?: string;
  };
  currentSalary?: string;
  proposedSalary?: string;
  admissionType?: string;
  gender?: "male" | "female";
  terminationType?: string;
  justCause?: boolean;
  noticePeriod?: boolean;
  justification?: string;
  hrFeedback?: string;
  days?: string;
}

export interface RequestFormValues {
  type: string;
  department: string;
  position: string;
  position_id?: string;
  justification: string;
  targetDate: string;
  employeeName?: string;
  hireDate?: string;
  currentPosition?: string;
  proposedPosition?: string;
  currentSchedule?: {
    start1?: string;
    end1?: string;
    start2?: string;
    end2?: string;
  };
  proposedSchedule?: {
    start1?: string;
    end1?: string;
    start2?: string;
    end2?: string;
  };
  currentSalary?: string;
  proposedSalary?: string;
  admissionType?: string;
  gender?: "male" | "female";
  terminationType?: string;
  justCause?: boolean;
  noticePeriod?: boolean;
  days?: string;
}
