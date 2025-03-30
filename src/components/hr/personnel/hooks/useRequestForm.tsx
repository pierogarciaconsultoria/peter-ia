
import { useForm } from "react-hook-form";
import { RequestFormValues } from "../types";
import { useEmployeeData } from "./useEmployeeData";
import { JobPosition } from "../../types";

export function useRequestForm(jobPositions: JobPosition[], onSubmit: (data: RequestFormValues) => void) {
  // Initialize form with default values
  const form = useForm<RequestFormValues>({
    defaultValues: {
      type: "",
      department: "",
      position_id: "",
      justification: "",
      targetDate: "",
      employeeId: "",
      employeeName: "",
      hireDate: "",
      currentPosition: "",
      proposedPosition: "",
      currentSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      proposedSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      currentSalary: "",
      proposedSalary: "",
      days: "",
      gender: undefined,
      admissionType: "",
      terminationType: "",
      justCause: false,
      noticePeriod: false
    }
  });
  
  // Use the employee data hook
  const { selectedEmployeeData } = useEmployeeData(form, jobPositions);
  
  return {
    form,
    selectedEmployeeData,
    handleSubmit: form.handleSubmit(onSubmit)
  };
}
