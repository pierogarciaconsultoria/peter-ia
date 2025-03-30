
export interface PersonnelRequest {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id?: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  requester: string;
  employeeName?: string;
  currentSalary?: string;
  proposedSalary?: string;
  justification?: string;
}

export interface RequestFormValues {
  type: string;
  department: string;
  employeeId: string;
  employeeName: string;
  position_id: string;
  justification: string;
  targetDate: string;
  hireDate: string;
  currentPosition: string;
  proposedPosition: string;
  currentSchedule: {
    start1: string;
    end1: string;
    start2: string;
    end2: string;
  };
  proposedSchedule: {
    start1: string;
    end1: string;
    start2: string;
    end2: string;
  };
  currentSalary: string;
  proposedSalary: string;
  days: string;
  gender?: "male" | "female";
  admissionType: string;
  terminationType: string;
  justCause: boolean;
  noticePeriod: boolean;
}
