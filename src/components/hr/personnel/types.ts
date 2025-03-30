
import { JobPosition } from "../types";

export interface PersonnelRequest {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id?: string;
  requestDate: string;
  status: string;
  requester: string;
}

export interface RequestFormValues {
  type: string;
  department: string;
  position: string;
  position_id?: string;
  justification: string;
  targetDate: string;
}
