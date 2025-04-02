
export interface PersonnelRequest {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id?: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected" | "canceled" | "manager_approval";
  requester: string;
  requester_id: string;
  manager_id?: string;
  approved_by?: string;
  approval_date?: string;
  hr_observation?: string;
  rejection_reason?: string;
  employeeName?: string;
  currentSalary?: string;
  proposedSalary?: string;
  justification?: string;
}

export interface RequestFormValues {
  type: string;
  department: string;
  requester_id: string;
  employeeId: string;
  employeeName: string;
  position_id: string;
  justification: string;
  targetDate: string;
  requestDate: string;
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
  hr_observation?: string;
  status?: "pending" | "approved" | "rejected" | "canceled" | "manager_approval";
  rejection_reason?: string;
}
