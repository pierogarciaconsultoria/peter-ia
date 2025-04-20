
import { PersonnelRequest, RequestStatus } from "../types";

export const updateRequestStatus = (
  requests: PersonnelRequest[],
  id: string,
  updates: Partial<PersonnelRequest>
): PersonnelRequest[] => {
  return requests.map(req => {
    if (req.id === id) {
      return {
        ...req,
        ...updates
      };
    }
    return req;
  });
};

export const createStatusUpdate = (
  status: RequestStatus,
  extras: Partial<PersonnelRequest> = {}
): Partial<PersonnelRequest> => {
  const baseUpdate = { status };
  
  if (status === "approved") {
    return {
      ...baseUpdate,
      approved_by: "Gestor",
      approval_date: new Date().toISOString().split('T')[0],
      ...extras
    };
  }
  
  return { ...baseUpdate, ...extras };
};
