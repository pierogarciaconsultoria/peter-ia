
import { UseFormReturn } from "react-hook-form";
import { JobPosition } from "../types";

export interface RequestFormValues {
  type: string;
  department: string;
  position_id?: string;
  requestDate?: string;
  targetDate?: string;
  requester_id: string;
  employeeId: string;
  employeeName: string;
  justification?: string;
  currentPosition?: string;
  proposedPosition?: string;
  currentSalary?: string;
  proposedSalary?: string;
  currentSchedule?: {
    start1: string;
    end1: string;
    start2: string;
    end2: string;
  };
  proposedSchedule?: {
    start1: string;
    end1: string;
    start2: string;
    end2: string;
  };
  hireDate?: string;
  gender?: "male" | "female" | "other";
  admissionType?: string;
  terminationType?: string;
  justCause?: boolean;
  noticePeriod?: boolean;
  days?: string;
  hr_observation?: string;
  status?: "pending" | "approved" | "rejected" | "canceled" | "manager_approval";
  rejection_reason?: string;
}

export interface PersonnelRequest {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected" | "canceled" | "manager_approval";
  requester: string;
  requester_id: string;
  employeeName: string;
  employee_id: string;
  justification?: string;
  currentSalary?: string;
  proposedSalary?: string;
  currentPosition?: string;
  proposedPosition?: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  targetDate?: string;
  currentSchedule?: {
    start1: string;
    end1: string;
    start2: string;
    end2: string;
  };
  proposedSchedule?: {
    start1: string;
    end1: string;
    start2: string;
    end2: string;
  };
  hr_observation?: string;
}

export interface FormSectionProps {
  form: UseFormReturn<RequestFormValues>;
}

export interface RequestFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormValues) => void;
  jobPositions: JobPosition[];
}

export interface RequestFormContentProps {
  form: UseFormReturn<RequestFormValues>;
  jobPositions: JobPosition[];
  onSubmit: () => void;
  selectedPosition: JobPosition | null;
}
