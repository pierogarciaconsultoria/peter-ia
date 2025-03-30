
import { useForm } from "react-hook-form";
import { RequestFormValues } from "../types";
import { useEmployeeData } from "./useEmployeeData";
import { JobPosition } from "../../types";
import { useState, useEffect } from "react";
import { useDepartments } from "@/hooks/useDepartments";

export function useRequestForm(jobPositions: JobPosition[], onSubmit: (data: RequestFormValues) => void) {
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);
  const { departments } = useDepartments();

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
  
  // Watch for position_id changes to update department and responsible
  useEffect(() => {
    const positionId = form.watch("position_id");
    if (positionId) {
      const foundPosition = jobPositions.find(pos => pos.id === positionId);
      setSelectedPosition(foundPosition || null);
      
      if (foundPosition?.department) {
        // Update department field
        form.setValue("department", foundPosition.department);
        
        // Find department head info if available
        const departmentInfo = departments.find(dept => 
          dept.name.toLowerCase() === foundPosition.department?.toLowerCase()
        );
        
        if (departmentInfo?.responsible_name) {
          console.log("Found department head:", departmentInfo.responsible_name);
        }
      }
    }
  }, [form.watch("position_id"), jobPositions, departments]);
  
  return {
    form,
    selectedEmployeeData,
    selectedPosition,
    handleSubmit: form.handleSubmit(onSubmit)
  };
}
